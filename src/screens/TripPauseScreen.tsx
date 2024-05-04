import {PauseTime} from "@assets/index";
import {ImageAtom, ScrollViewAtom, TextAtom} from "@components/Atom";
import {SecondaryButton} from "@components/Buttons";
import GoBackCross from "@components/GoBackCross";
import {useAppDispatch, useAppSelector, useBluetooth, useFocusedInterval} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {errorOccured, userPauseClickEvent, userUnpauseClickEvent} from "@redux/reducers/events";
import {setLockFetching} from "@redux/reducers/lock";
import {setSnackbar} from "@redux/reducers/snackbar";
import {setProcessType, setTripState} from "@redux/reducers/trip";
import {instanceApi} from "@services/axiosInterceptor";
import {INTERVAL_TIMEOUT} from "@services/constants";
import {PUT_TRIP_PAUSE} from "@services/endPoint";
import {getUserLocation} from "@services/positionServices";
import {HomeStackScreenProps} from "@stacks/types";
import {tripPause} from "@styles/TripStyles";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {BackHandler, View, ViewProps} from "react-native";

interface Props extends ViewProps, HomeStackScreenProps<"TripPause"> {
}

const TripPauseScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const rentalTime = useAppSelector(state => state?.auth?.me?.rental_end_time);
    const loading = useAppSelector(state => state.lock.fetching);

    const {t} = useTranslation();
    const [pause, setPause] = useState<boolean | null>(null);
    const [translateKey, setTranslateKey] = useState<string>("default");
    const {bleOn, connect, lockStatus} = useBluetooth();
    const dispatch = useAppDispatch();

    useFocusEffect(
        useCallback(() => {
            if (lockStatus) {
                if (lockStatus[0] === "error") {
                    setPause(null);
                    dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
                    dispatch(setLockFetching(false));
                } else if (lockStatus.length === 1 && lockStatus[0] === "open") {
                    setPause(false);
                } else if (lockStatus.length === 1 && lockStatus[0] === "closed") {
                    setPause(true);
                } else {
                    setPause(null);
                }
            } else {
                setPause(null);
                connectToLock().then(() => console.log(""));
            }
        }, [lockStatus])
    );

    useFocusEffect(
        useCallback(() => {
            let newTranslateKey = "default";
            if (rentalTime) {
                newTranslateKey = Date.now() < Number(rentalTime) ? "rental" : "default";
            }
            setTranslateKey(newTranslateKey);
        }, [rentalTime])
    );

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "TripPauseScreen").then(() => console.log(""));
    }, []));

    const sendTripPauseMail = async () => {
        try {
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

    const handleOpenPause = async () => {
        if (pause === true) {
            dispatch(userUnpauseClickEvent());
            dispatch(setProcessType("PAUSE_UNLOCK"));
            sendTripPauseMail().then(() => console.log(""));
            dispatch(setTripState(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT));
            navigation.navigate("Home", {
                screen: "TripSteps"
            });
        } else if (pause === false) {
            dispatch(userPauseClickEvent());
            dispatch(setProcessType("PAUSE_LOCK"));
            sendTripPauseMail().then(() => console.log(""));
            dispatch(setTripState(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT));
            navigation.navigate("Home", {
                screen: "TripSteps"
            });
        } else {
            connectToLock().then(() => console.log(""));
        }
    };

    const connectToLock = async () => {
        dispatch(setLockFetching(true));
        try {
            if (!bleOn) {
                dispatch(errorOccured("Can't connect to lock. Ble is OFF"));
                dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
                return;
            }
            await connect();
        } catch (error: any) {
            dispatch(errorOccured(error, "BLE CONNECTION PAUSE TRIP"));
            dispatch(setProcessType("PAUSE_LOCK"));
            dispatch(setTripState(TRIP_STEPS.TRIP_STEP_ONGOING));
            dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
        } finally {
            dispatch(setLockFetching(false));
        }
    };

    useFocusedInterval(() => {
        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_ONGOING));
        navigation.navigate("Map");
    }, INTERVAL_TIMEOUT);

    const handleBackAction = () => {
        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_ONGOING));
        navigation.navigate("Home", {
            screen: "TripStop"
        });
    };

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                handleBackAction();
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", backAction);
            };
        }, []),
    );

    return (
        <View style={tripPause.frame}>
            <GoBackCross onClick={() => navigation.goBack()}/>
            <ScrollViewAtom>
                <View style={tripPause.container}>
                    <ImageAtom
                        style={tripPause.image}
                        resizeMode="contain"
                        source={PauseTime}
                    />
                    <TextAtom style={tripPause.title}>
                        {t(`trip_process.trip_pause.${translateKey}.title`)}{"\n"}
                    </TextAtom>
                    <View style={tripPause.descContainer}>
                        <TextAtom style={tripPause.paragraph}>
                            {t(`trip_process.trip_pause.${translateKey}.new_line_1`)}{"\n"}{"\n"}
                            {t(`trip_process.trip_pause.${translateKey}.new_line_2`)}{"\n"}{"\n"}
                            {t(`trip_process.trip_pause.${translateKey}.new_line_3`)}
                        </TextAtom>
                    </View>
                    <View style={tripPause.buttonContainer}>
                        <SecondaryButton
                            icon="lock"
                            inProgress={loading}
                            value={t(`trip.pause.${pause ? "unlock" : "lock"}`)}
                            onClick={handleOpenPause}
                            actionLabel={"PAUSE_BUTTON"}
                        />
                    </View>
                </View>
            </ScrollViewAtom>
        </View>
    );
};

export default TripPauseScreen;
