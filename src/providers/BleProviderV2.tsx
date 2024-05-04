import BleContext from "@contexts/BleContext";
import {useAppSelector} from "@hooks/index";
import BleInfo from "@models/data/BleInfo";
import {LockStatus} from "@models/types";
import crashlytics from "@react-native-firebase/crashlytics";
import {loadData, removeValue, storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import { PUT_LOCK_STATE} from "@services/endPoint";
import {timestampDifference} from "@utils/helpers";
import {BLE_STATE_TIMEOUT, BLE_TIMEOUT, DEVICE_ID} from "@utils/trip";
import React, {useEffect, useState} from "react";
import {BleManager, Device, State, Subscription} from "react-native-ble-plx";

import LockInfos from "./Lockinfos";
import {getLockStatusFlag} from "@bikairproject/ble-decoder";

export default function BleProviderV2({children}: { children: React.ReactNode; }) {
    const [bleManager, setBleManager] = useState<BleManager | null>(null);
    const [bleDevice, setBleDevice] = useState<Device | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [monitoring, setMonitoring] = useState<Subscription | null>(null);

    const [bleOn, setBleOn] = useState(false);
    const [lockStatus, setLockStatus] = useState<LockStatus[] | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [lastStateUpdate, setLastStateUpdate] = useState<number>(0);

    const [lockName, setLockName] = useState<string | null>(null);
    const [bikeId, setBikeId] = useState<number | null>(null);
    const [isWriting, setIsWriting] = useState<boolean>(false);

    const functionalities = useAppSelector(state => state.auth.functionalities?.functionalities);

    useEffect(() => {
        crashlytics().log("New Ble Manager");
        setBleManager(new BleManager());
        loadData(DEVICE_ID).then((id) => setDeviceId(id ?? null));
        return () => {
            console.log("[|] Maybe we can destroy some bluetooth thing here [|]");
        };
    }, []);

    const handleBleManagerState = (state: State) => {
        if (state === State.PoweredOn) {
            console.log("bleManager switched to poweredOn");
            setBleOn(true);
        } else {
            console.log("bleManager switched to ", state);
            setBleOn(false);
        }
    };

    useEffect(() => {
        let bleStateSubscription: Subscription | null = null;
        if (bleManager !== null) {
            bleStateSubscription = bleManager.onStateChange(handleBleManagerState, true);
        }

        return () => {
            if (bleStateSubscription !== null) {
                bleStateSubscription.remove();
            }
        };
    }, [bleManager]);

    useEffect(() => {
        if (bleDevice === null) {
            if (monitoring) {
                monitoring.remove();
                setMonitoring(null);
            }
        } else {
            setDefaultMonitoring();
        }

        return () => {
            if (monitoring) {
                monitoring.remove();
                setMonitoring(null);
            }
        };
    }, [bleDevice]);

    const updateBleInfo = (infos: BleInfo) => {
        if (infos.lockName !== lockName || infos.bikeId !== bikeId) {
            disconnect();
        }
        if (typeof infos.lockName !== "undefined") {
            setLockName(infos.lockName);
        }
        if (typeof infos.bikeId !== "undefined") {
            setBikeId(infos.bikeId);
        }
    };

    const disconnect = async () => {
        try {
            if (monitoring) {
                monitoring.remove();
            }
            setBleDevice(null);
            setLockStatus(null);
            if (bleManager) {
                bleManager.stopDeviceScan();
                if (deviceId) {
                    await bleManager.cancelDeviceConnection(deviceId);
                }
            }
            setDeviceId(null);
        } catch (err) {
            console.log("--[ERROR]--disconnected", err);
        } finally {
            await removeValue(DEVICE_ID);
        }
    };

    const waitPoweredOnState = async (): Promise<boolean> => {
        if (!bleManager) {
            return false;
        }
        const currentState = await bleManager.state();
        if (currentState === State.PoweredOn) {
            return true;
        }
        if (currentState === State.Unknown || currentState === State.Resetting) {
            return new Promise<boolean>((resolve) => {
                const stateSubscription = bleManager.onStateChange(newState => {
                    if (newState === State.PoweredOn) {
                        resolve(true);
                        stateSubscription.remove();
                    }
                });
                const timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    stateSubscription.remove();
                    resolve(false);
                }, BLE_STATE_TIMEOUT);
            });
        }
        return false;
    };

    const isDeviceConnected = async (bleManager: any) => {
        try {
            if (deviceId) {
                const connected = await bleManager.isDeviceConnected(deviceId);
                const isDeviceSet = typeof bleDevice !== "undefined" && bleDevice !== null;
                const isSameId = bleDevice?.id === deviceId;
                if (connected && isDeviceSet && isSameId) {
                    return bleDevice;
                } else if (connected) {
                    await bleManager.cancelDeviceConnection(deviceId);
                }
                const connectedDevice = await bleManager.connectToDevice(deviceId, {
                    autoConnect: false,
                    refreshGatt: "OnConnected",
                });
                const device = await connectedDevice.discoverAllServicesAndCharacteristics();
                return device;
            }
        } catch (error) {
            console.log("[isDeviceConnected]", error);
            return null;
        }
    };

    //2. Scan devices to find our target and connect to it
    const scanAndConnect = async (bleManager: any): Promise<Device> => {
        const promise = new Promise<Device>((resolve, reject) => {
            const timeout = setTimeout(() => {
                bleManager.stopDeviceScan();
                clearTimeout(timeout);
                reject("TIMEOUT");
            }, BLE_TIMEOUT);

            bleManager.startDeviceScan(null, null,
                (error: any, device: any) => {
                    try {
                        if (error || device === null) {
                            clearTimeout(timeout);
                            disconnect().then(() => {
                                console.log("[scanAndConnect] - destroy connection");
                                bleManager.destroy();
                                setBleManager(new BleManager());
                                reject(null);
                            });
                            return;
                        }

                        if (device.name === lockName) {
                            console.log("-[INFO]------device.id-----", device.id);
                            console.log("-[INFO]------device.name---", device.name);
                            bleManager.stopDeviceScan();
                            clearTimeout(timeout);
                            device.connect({
                                autoConnect: false,
                                refreshGatt: "OnConnected",
                            }).then((connectedDevice: any) => {
                                connectedDevice.discoverAllServicesAndCharacteristics().then((device: any)  => {
                                    resolve(device);
                                }).catch(() => {
                                    reject(null);
                                });
                            }).catch(()  => {
                                reject(null);
                            });
                        }
                    } catch (error) {
                        reject(null);
                    }
                });
        });
        const result = await promise;
        return result;
    };

    const connect = async () => {
        if (!bleManager) {
            throw new Error("Missing bluetooth manager instance !");
        }
        if (!lockName || !bikeId) {
            throw new Error("Missing bike info for bluetooth !");
        }
        if (connecting) {
            console.log("A connection process is already running");
            return;
        }
        const poweredOn = await waitPoweredOnState();
        if (!poweredOn || !bleManager) {
            throw new Error("Bluetooth is off");
        }

        setConnecting(true);
        try {
            let device = await isDeviceConnected(bleManager);
            if(!device){
                device = await scanAndConnect(bleManager);
            }

            setBleDevice(device);
            setDeviceId(device.id);
            await storeData(DEVICE_ID, device.id);

        } catch (error) {
            await disconnect();
            throw error;
        } finally {
            setConnecting(false);
        }
    };

    const sleep = async (ms: number) => {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    };

    const getStateCharacteristics = async () => {
        try {
            if (!bleDevice) {
                throw new Error("Not connected to device.");
            }
            const lockInfos = new LockInfos(bikeId);
            await lockInfos.setLockInfo();
            console.log("[readCharacteristicForService]");
            if (lockInfos.serviceUUID && lockInfos.stateUUID) {
                console.log("[readCharacteristicForService]-00001");
                return await bleDevice.readCharacteristicForService(lockInfos.serviceUUID, lockInfos.stateUUID);
            } else {
                console.log(`Missing one of theses : serviceUUID[${lockInfos.serviceUUID}], stateUUID[${lockInfos.stateUUID}]`);
                throw new Error("Can't get State Characteristic for device.");
            }
        } catch (error) {
            console.log(JSON.stringify(error));
            console.log("[Error while fetching characteristics]", error);
            throw error;
        }
    };

    const write = async () => {
        try {
            setIsWriting(true);
            if (!bleDevice) {
                throw new Error("Not connected to device.");
            }
            console.log("==========checkingLockInfo============");
            const lockInfos = new LockInfos(bikeId);
            await lockInfos.setLockInfo();
            const lockKeysString = await loadData("@lockKeys");
            const lockKeys = JSON.parse(lockKeysString ?? "{}");

            const _eKey = lockKeys.eKey;
            const _passKey = lockKeys.passKey;

            const eKey = _eKey;
            const passKey = _passKey[0];

            await storeData("@lockKeys", JSON.stringify({
                eKey: _eKey,
                passKey: _passKey.slice(1),
            }));

            if (eKey && passKey && lockInfos.serviceUUID && lockInfos.characteristicUUID) {
                console.log("==========writeToDevice============");
                for (let i = 0; i < eKey.length; i++) {
                    await bleDevice.writeCharacteristicWithResponseForService(
                        lockInfos.serviceUUID,
                        lockInfos.characteristicUUID,
                        eKey[i],
                    );
                }
                await bleDevice.writeCharacteristicWithResponseForService(
                    lockInfos.serviceUUID,
                    lockInfos.characteristicUUID,
                    passKey,
                );
                console.log("============writeDone==============");
            } else {
                throw new Error("Could not write to device due to missing keys or UUID");
            }
        } catch (error) {
            console.log("---[ERROR]--------------", error);
            throw error;
        } finally {
            setIsWriting(false);
        }
    };

    const open = async () => {
        if (lockStatus !== null && !isWriting && lockStatus.length > 0 && lockStatus[0] === "closed") {
            await write();
        } else {
            if (lockStatus === null) {
                throw new Error("Can't perform open action while not connected to device");
            }
        }
    };

    const close = async () => {
        if (lockStatus !== null && !isWriting && lockStatus.length === 1 && lockStatus[0] === "open") {
            await write();
        } else {
            if (lockStatus === null) {
                throw new Error("Can't perform close action while not connected to device");
            }
        }
    };

    const updateLockState = (status: any) => {
        instanceApi.put(PUT_LOCK_STATE, {
            state: status ? JSON.stringify(status) : "Unknown",
            bikeId: bikeId,
        });
    };

    const setDefaultMonitoring = async () => {
        if (bleManager) {
            let characteristics;
            try {
                characteristics = await getStateCharacteristics();
            } catch (error) {
                setLockStatus(["error"]);
                return;
            }
            if (characteristics) {
                const newMonitor = characteristics.monitor(async (error, characteristic) => {
                    if (error) {
                        console.log("--[ERROR]--------characteristic-monitor-----------", error);
                        console.log("--[ERROR]--------characteristic-----------", characteristic);
                        setLockStatus(["error"]);
                        return;
                    }
                    if (characteristic) {
                        const status = getLockStatusFlag(characteristic.value);
                        console.log("--[LOCK-STATE]-------------------", status);
                        setLockStatus(status);
                        const now = Date.now();
                        const isToFast = timestampDifference(lastStateUpdate, now);
                        setLastStateUpdate(now);
                        
                        updateLockState(status);

                        if (status.length > 0 && status[0] === "closed") {
                            if (isToFast) {
                                // If notification is too short (1.5s) send an alert to admin
                                console.log("--- LOCK TOO FAST ---");
                                if ((functionalities ?? []).includes("POST_LOCK_ALERT_END")) {
                                    await storeData("@lockDefault", "POST_LOCK_ALERT_END");
                                } else {
                                    console.log("check bug lock is not active");
                                }
                            } else {
                                console.log("Lock closing wasn't too fast");
                            }
                        }
                        if (status.length > 0 && status[0] === "open") {
                            console.log("--- ANNULATION DU DEFAULT DE CADENAS ---");
                            await removeValue("@lockDefault");
                        }
                    }
                });
                try {
                    if (monitoring) {
                        monitoring.remove();
                    }
                    setMonitoring(newMonitor);
                    const status = getLockStatusFlag(characteristics.value);
                    console.log("--[LOCK-STATE]-------------------", status);
                    setLockStatus(status);
                } catch (error) {
                    console.log(error);
                    setLockStatus(["error"]);
                    return;
                }
            } else {
                console.log("No characteristics found for setDefaultMonitoring");
                setLockStatus(["error"]);
                return;
            }
        }
    };

    const value = {
        bleOn,
        lockStatus,
        updateBleInfo,
        disconnect,
        connect,
        open,
        close,
    };

    return <BleContext.Provider value={value}>{children}</BleContext.Provider>;
}
