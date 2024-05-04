import TimeMeter from "@components/TimeMeter";
import BluetoothErrorModal from "@containers/BluetoothErrorModal";
import {useAppDispatch, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {useFocusEffect} from "@react-navigation/native";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setLockFetching} from "@redux/reducers/lock";
import {setSnackbar} from "@redux/reducers/snackbar";
import {instanceApi} from "@services/axiosInterceptor";
import {PUT_TRIP_PAUSE} from "@services/endPoint";
import {getUserLocation} from "@services/positionServices";
import { sleep } from "@utils/helpers";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ViewProps} from "react-native";

type Props = ViewProps

const OngoingTrip: React.FC<Props> = (): React.ReactElement | null => {
    const {bleOn, lockStatus, connect, disconnect} = useBluetooth();

    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const [pause, setPause] = useState(false);
    const [showError, setShowError] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_ONGOING));
        setFirstLoad(true);
        connectToLock().then(() => console.log("initDone"));
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (lockStatus) {
                if (lockStatus[0] === "error") {
                    if(!firstLoad){
                        dispatch(errorOccured("Lock error state on ONGOING_TRIP", "BLE CONNECTION ONGOING TRIP"));
                        dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
                        setShowError(true);
                        disconnect().then(r => console.log(r));
                    }
                    setFirstLoad(false);
                }
                if (lockStatus.length === 1 && lockStatus[0] === "open") {
                    setPause(false);
                } else if (lockStatus.length > 0 && lockStatus[0] === "closed") {
                    console.log("OngoingTrip, lock closed");
                    setPause(true);
                    sendTripPauseMail().then(r => console.log(r));
                }
            }
        }, [lockStatus])
    );

    const handleBluetoothErrorClose = () => {
        setShowError(false);
    };

    const sendTripPauseMail = async () => {
        try {
            await sleep(5000);
            const coords = await getUserLocation();
            if (coords) {
                await instanceApi.put(PUT_TRIP_PAUSE, {
                    lat: coords.latitude,
                    lng: coords.longitude,
                });
            } else {
                dispatch(setSnackbar({type: "danger", message: "Can't get user position"}));
            }
        } catch (err: any) {
            dispatch(setSnackbar({type: "danger", message: err.message}));
        }
    };

    const connectToLock = async () => {
        dispatch(setLockFetching(true));
        try {
            if (!bleOn) {
                dispatch(errorOccured("Can't connect to lock. Ble is OFF"));
                setShowError(true);
                return;
            }
            await sleep(4000);
            await connect();
        } catch (error: any) {
            dispatch(errorOccured(error, "BLE CONNECTION ONGOING TRIP"));
            setShowError(true);
        } finally {
            dispatch(setLockFetching(false));
        }
    };

    return (
        <>
            <TimeMeter pause={pause}/>
            <BluetoothErrorModal
                visible={showError}
                onClose={handleBluetoothErrorClose}
            />
        </>
    );
};

export default OngoingTrip;
