import BleContext from "@contexts/BleContext";
import {useAppSelector} from "@hooks/index";
import BleInfo from "@models/data/BleInfo";
import {Ekey} from "@models/dto/Ekey";
import {LockStatus} from "@models/types";
import crashlytics from "@react-native-firebase/crashlytics";
import {loadData, removeValue, storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_KEYSAFE_OTP_BY_ID, PUT_LOCK_STATE} from "@services/endPoint";
import {timestampDifference} from "@utils/helpers";
import {BLE_STATE_TIMEOUT, BLE_TIMEOUT, DEVICE_ID} from "@utils/trip";
import React, {useEffect, useMemo, useState} from "react";
import {BleManager, Device, State, Subscription} from "react-native-ble-plx";

import {getLockStatusFlag} from "@bikairproject/ble-decoder";

export default function BleProvider({children}: { children: React.ReactNode; }) {
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
    const [serviceUUID, setServiceUUID] = useState<string | null>(null);
    const [characteristicUUID, setCharacteristicUUID] = useState<string | null>(null);
    const [stateUUID, setStateUUID] = useState<string | null>(null);
    const [isWriting, setIsWriting] = useState<boolean>(false);

    const functionalities = useAppSelector(state => state.auth.functionalities?.functionalities);

    useEffect(() => {
        console.log("--- NEW BLE MANAGER ---");
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
        console.log("change in BleDevice");
        if (bleDevice === null) {
            console.log("BleDevice is null");
            if (monitoring) {
                monitoring.remove();
                setMonitoring(null);
            }
        } else {
            console.log("BleDevice is not null");
            setDefaultMonitoring();
        }

        return () => {
            if (monitoring) {
                monitoring.remove();
                setMonitoring(null);
            }
        };
    }, [bleDevice]);

    const setNewServiceUUID = async (serviceUUID: string | null) => {
        if (!serviceUUID) {
            await removeValue("@serviceUUID");
            setServiceUUID(null);
        } else {
            await storeData("@serviceUUID", serviceUUID);
            setServiceUUID(serviceUUID);
        }
    };

    const getServiceUUID = async () => {
        if (!serviceUUID) {
            const localStorageServiceUUID = await loadData("@serviceUUID");
            const newServiceUUID = localStorageServiceUUID ?? null;
            await setServiceUUID(newServiceUUID);
            return newServiceUUID;
        }
        return serviceUUID;
    };

    const setNewCharacteristicUUID = async (characteristicUUID: string | null) => {
        if (!characteristicUUID) {
            await removeValue("@characteristicUUID");
            setCharacteristicUUID(null);
        } else {
            await storeData("@characteristicUUID", characteristicUUID);
            setCharacteristicUUID(characteristicUUID);
        }
    };

    const getCharacteristicUUID = async () => {
        if (!characteristicUUID) {
            const localStorageCharacteristicUUID = await loadData("@characteristicUUID");
            const newCharacteristicUUID = localStorageCharacteristicUUID ?? null;
            await setCharacteristicUUID(newCharacteristicUUID);
            return newCharacteristicUUID;
        }
        return characteristicUUID;
    };

    const setNewStateUUID = async (stateUUID: string | null) => {
        if (!stateUUID) {
            await removeValue("@stateUUID");
            setStateUUID(null);
        } else {
            await storeData("@stateUUID", stateUUID);
            setStateUUID(stateUUID);
        }
    };

    const getStateUUID = async () => {
        if (!stateUUID) {
            const localStorageStateUUID = await loadData("@stateUUID");
            const newStateUUID = localStorageStateUUID ?? null;
            await setNewStateUUID(newStateUUID);
            return newStateUUID;
        }
        return stateUUID;
    };

    const setLockInfo = async () => {
        const lockKeysString = await loadData("@lockKeys");
        const lockKeys = !lockKeysString ? {passKey: []} : JSON.parse(lockKeysString);
        const serviceUUID = await getServiceUUID();
        const characteristicUUID = await getCharacteristicUUID();
        const stateUUID = await getStateUUID();

        const missingLockKey = !lockKeys || typeof lockKeys.passKey[0] === "undefined" || typeof lockKeys.eKey === "undefined";
        const missingUUID = !serviceUUID || !characteristicUUID || !stateUUID;
        if ((missingLockKey || missingUUID) && bikeId) {
            const otpResponse = await instanceApi.get<Ekey>(GET_KEYSAFE_OTP_BY_ID(bikeId));
            const data = otpResponse.data;

            await setNewServiceUUID(data.serviceUUID);
            await setNewCharacteristicUUID(data.characteristicUUID);
            await setNewStateUUID(data.stateUUID);

            const eKey = data.eKey;
            const passKey = data.passKey;

            await storeData("@lockKeys", JSON.stringify({
                eKey: eKey,
                passKey: passKey,
            }));
        }
    };

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
        console.log("-- BLE DISCONNECT --");
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
        console.log("--- CHECK BLE STATE ---");
        if (!bleManager) {
            console.log("BleManager not set");
            return false;
        }
        const currentState = await bleManager.state();
        console.log("currentState = ", currentState);
        if (currentState === State.PoweredOn) {
            console.log("Already Powered On.");
            return true;
        }
        if (currentState === State.Unknown || currentState === State.Resetting) {
            console.log("Waiting for powerOn");
            return new Promise<boolean>((resolve) => {
                console.log("listening to state change...");
                const stateSubscription = bleManager.onStateChange(newState => {
                    console.log("New State = ", newState);
                    if (newState === State.PoweredOn) {
                        resolve(true);
                        stateSubscription.remove();
                    }
                });
                console.log("init timeout");
                const timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    stateSubscription.remove();
                    console.log("Timed out. Return false");
                    resolve(false);
                }, BLE_STATE_TIMEOUT);
            });
        }
        console.log("Return false. State is ", currentState);
        return false;
    };

    //2. Scan devices to find our target and connect to it
    const scanAndConnect = async (): Promise<Device> => {
        const poweredOn = await waitPoweredOnState();
        if (!poweredOn || !bleManager) {
            throw new Error("Bluetooth is off");
        }

        try {
            if (deviceId) {
                console.log("Trying to direct connect to device with id ", deviceId);
                const connected = await bleManager.isDeviceConnected(deviceId);
                console.log("connected: ", connected);
                const isDeviceSet = typeof bleDevice !== "undefined" && bleDevice !== null;
                console.log("isDeviceSet: ", isDeviceSet);
                console.log("device not undefined: ", typeof bleDevice !== "undefined");
                console.log("device not null: ", bleDevice !== null);
                const isSameId = bleDevice?.id === deviceId;
                console.log("isSameId: ", isSameId);
                if (connected && isDeviceSet && isSameId) {
                    console.log("Already connected with the good device.");
                    return bleDevice;
                } else if (connected) {
                    console.log("We must disconnect to current connected device before trying to reconnect.");
                    await bleManager.cancelDeviceConnection(deviceId);
                }
                console.log("Connecting to device.");
                const connectedDevice = await bleManager.connectToDevice(deviceId, {
                    autoConnect: false,
                    refreshGatt: "OnConnected",
                });
                console.log("Connected to device. Reading characteristics...");
                const device = await connectedDevice.discoverAllServicesAndCharacteristics();
                console.log("Done.");
                return device;
            }
        } catch (error) {
            console.log("Error while trying to connect to device with device id ", deviceId);
            console.log(error);
            console.log("Proceeding with scan and connect.");
        }

        console.log("Start Scan and connect.");
        return new Promise<Device>((resolve, reject) => {
            const timeout = setTimeout(() => {
                bleManager.stopDeviceScan();
                clearTimeout(timeout);
                reject("TIMEOUT");
            }, BLE_TIMEOUT);

            console.log("...Start device scan...");
            console.log(`Looking for ${lockName}`);
            bleManager.startDeviceScan(null, null,
                (error, device) => {
                    try {
                        if (error || device === null) {
                            // Handle error (scanning will be stopped automatically)
                            console.log("Error while scanning devices");
                            console.log(error);
                            clearTimeout(timeout);
                            disconnect().then(() => {
                                bleManager.destroy();
                                console.log("--- NEW BLE MANAGER ---");
                                setBleManager(new BleManager());
                                reject(error);
                            });
                            return;
                        }

                        console.log("-[INFO]------device.id-----", device.id);
                        console.log("-[INFO]------device.name---", device.name);
                        console.log("-[INFO]------lockName------", lockName);

                        // Check if it is a device you are looking for based on advertisement data
                        // or other criteria.
                        if (device.name === lockName) {
                            // Stop scanning as it's not necessary since we are scanning for one device.
                            console.log("-[INFO]------device.id-----", device.id);
                            console.log("-[INFO]------device.name---", device.name);
                            bleManager.stopDeviceScan();
                            clearTimeout(timeout);

                            // Store device id
                            device.connect({
                                autoConnect: false,
                                refreshGatt: "OnConnected",
                            }).then(connectedDevice => {
                                console.log("Connected to device. Reading characteristics...");
                                connectedDevice.discoverAllServicesAndCharacteristics().then(device => {
                                    console.log("Done.");
                                    resolve(device);
                                }).catch(error => {
                                    console.log("Error while discoverAllServicesAndCharacteristics");
                                    console.log(error);
                                    reject(error);
                                });
                            }).catch(error => {
                                console.log("Error while connecting to device");
                                console.log(error);
                                reject(error);
                            });
                        }
                    } catch (error) {
                        console.log(JSON.stringify(error));
                        reject(error);
                    }
                });
        });
    };

    const connect = async () => {
        if (!bleManager) {
            throw new Error("Missing bluetooth manager instance !");
        }
        if (!lockName || !bikeId) {
            throw new Error("Missing bike info for bluetooth !");
        }
        if (connecting) {
            console.log("A connection process is alredy running");
            return;
        }
        setConnecting(true);
        try {
            const device = await scanAndConnect();
            setBleDevice(device);
            setDeviceId(device.id);
            await storeData(DEVICE_ID, device.id);
        } catch (error) {
            console.log("Error in provider.connect : ", error);
            await disconnect();
            throw error;
        } finally {
            setConnecting(false);
        }
    };

    const getStateCharacteristics = async () => {
        try {
            if (!bleDevice) {
                throw new Error("Not connected to device.");
            }
            await setLockInfo();
            const serviceUUID = await getServiceUUID();
            const stateUUID = await getStateUUID();

            if (serviceUUID && stateUUID) {
                return await bleDevice.readCharacteristicForService(serviceUUID, stateUUID);
            } else {
                console.log(`Missing one of theses : serviceUUID[${serviceUUID}], stateUUID[${stateUUID}]`);
                throw new Error("Can't get State Characteristic for device.");
            }
        } catch (error) {
            console.log("Error while fetching characteristics");
            console.log(error);
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
            await setLockInfo();
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

            const serviceUUID = await getServiceUUID();
            const characteristicUUID = await getCharacteristicUUID();

            if (eKey && passKey && serviceUUID && characteristicUUID) {
                console.log("==========writeToDevice============");
                for (let i = 0; i < eKey.length; i++) {
                    await bleDevice.writeCharacteristicWithResponseForService(
                        serviceUUID,
                        characteristicUUID,
                        eKey[i],
                    );
                }
                await bleDevice.writeCharacteristicWithResponseForService(
                    serviceUUID,
                    characteristicUUID,
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
            console.log("Someting is preventing write action on open: ");
            console.log("lockStatus = ", lockStatus);
            console.log("isWriting = ", isWriting);
            if (lockStatus === null) {
                throw new Error("Can't perform open action while not connected to device");
            }
        }
    };

    const close = async () => {
        if (lockStatus !== null && !isWriting && lockStatus.length === 1 && lockStatus[0] === "open") {
            await write();
        } else {
            console.log("Someting is preventing write action on close: ");
            console.log("lockStatus = ", lockStatus);
            console.log("isWriting = ", isWriting);
            if (lockStatus === null) {
                throw new Error("Can't perform close action while not connected to device");
            }
        }
    };

    const setDefaultMonitoring = async () => {
        if (bleManager) {
            let characteristics;
            try {
                characteristics = await getStateCharacteristics();
            } catch (error) {
                console.log("Error while getting characteristics for setDefaultMonitoring");
                setLockStatus(["error"]);
                return;
            }
            if (characteristics) {
                console.log("Create new monitoring");
                const newMonitor = characteristics.monitor(async (error, characteristic) => {
                    if (error) {
                        console.log("--[ERROR]--------characteristic-monitor-----------", error);
                        console.log("--[ERROR]--------characteristic-----------", characteristic);
                        // We need to handle error
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
                        try {
                            instanceApi.put(PUT_LOCK_STATE, {
                                state: status ? JSON.stringify(status) : "Unknown",
                                bikeId: bikeId,
                            }).then(() => console.log("Lock updated"));
                        } catch (error) {
                            console.log("Error while sending lock state to backend.");
                        }
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

    const value = useMemo(
        () => ({
            bleOn,
            lockStatus,
            updateBleInfo,
            disconnect,
            connect,
            open,
            close,
        }),
        [bleOn, lockStatus, updateBleInfo, disconnect, connect, open, close]
    );

    return <BleContext.Provider value={value}>{children}</BleContext.Provider>;
}
