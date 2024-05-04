import {PauseTime} from "@assets/index";
import {SecondaryButton} from "@components/Buttons";
import GoBackCross from "@components/GoBackCross";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {useFocusEffect} from "@react-navigation/native";
import {errorOccured, userPauseClickEvent, userUnpauseClickEvent} from "@redux/reducers/events";
import {setLockFetching} from "@redux/reducers/lock";
import {setSnackbar} from "@redux/reducers/snackbar";
import {setProcessType} from "@redux/reducers/trip";
import {instanceApi} from "@services/axiosInterceptor";
import {PUT_TRIP_PAUSE} from "@services/endPoint";
import {getUserLocation} from "@services/positionServices";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, BackHandler, ScrollView, Text, View, ViewProps} from "react-native";

import {useAppDispatch, useAppSelector, useBluetooth} from "../hooks";
import {stepTripPauseStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void,
    navigation: any
}

const TripPauseStep: React.FC<Props> = ({onStateChange, navigation}): React.ReactElement => {
    const rentalTime = useAppSelector(state => state?.auth?.me?.rental_end_time);
    const loading = useAppSelector(state => state.lock.fetching);

    const {t} = useTranslation();
    const viewAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;
    const translationAnim = useRef(new Animated.Value(0)).current;
    const [pause, setPause] = useState<boolean | null>(null);
    const [translateKey, setTranslateKey] = useState<string>("default");
    const {bleOn, connect, lockStatus} = useBluetooth();
    const dispatch = useAppDispatch();

    useEffect(() => {
        Animated.stagger(150, [
            Animated.timing(viewAnim, {
                toValue: 1,
                duration: 700,
                delay: 30,
                useNativeDriver: true,
            }),
            Animated.timing(textAnim, {
                toValue: 1,
                duration: 900,
                delay: 80,
                useNativeDriver: true,
            }),
            Animated.timing(imageAnim, {
                toValue: 1,
                duration: 1100,
                delay: 130,
                useNativeDriver: true,
            }),
            Animated.timing(translationAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const viewAnimation = viewAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const imageAnimation = imageAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const textAnimation = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const translationAnimation = translationAnim.interpolate({
        inputRange: [0.3, 1],
        outputRange: [0, 1],
    });

    useFocusEffect(
        useCallback(() => {
            if (lockStatus) {
                if (lockStatus[0] === "error") {
                    dispatch(errorOccured("Lock error state on trip pause", "BLE CONNECTION PAUSE TRIP"));
                    dispatch(setProcessType("PAUSE_LOCK"));
                    dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
                    onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
                } else if (lockStatus.length === 1 && lockStatus[0] === "open") {
                    setPause(false);
                } else if (lockStatus.length === 1 && lockStatus[0] === "closed") {
                    setPause(true);
                } else {
                    setPause(null);
                }
            } else {
                setPause(null);
                connectToLock();
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
        if (pause) {
            dispatch(userUnpauseClickEvent());
            dispatch(setProcessType("PAUSE_UNLOCK"));
        } else {
            dispatch(userPauseClickEvent());
            dispatch(setProcessType("PAUSE_LOCK"));
        }
        sendTripPauseMail();
        await onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
    };

    const handleBackAction = () => {
        onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
    };

    const connectToLock = async () => {
        dispatch(setLockFetching(true));
        try {
            if (!bleOn) {
                dispatch(errorOccured("Can't connect to lock. Ble is OFF"));
                return;
            }
            await connect();
        } catch (error: any) {
            dispatch(errorOccured(error, "BLE CONNECTION PAUSE TRIP"));
            dispatch(setProcessType("PAUSE_LOCK"));
            dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
            onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
        } finally {
            dispatch(setLockFetching(false));
        }
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
        <ScrollView>
            <GoBackCross onClick={() => navigation.goBack()}/>
            <View style={stepTripPauseStyles.container}>
                <Animated.Image
                    style={[stepTripPauseStyles.image, {
                        transform: [{translateX: viewAnimation}],
                        opacity: translationAnimation,
                    }]}
                    resizeMode="contain"
                    source={PauseTime}
                />
                <Animated.Text style={[stepTripPauseStyles.title, {
                    transform: [{translateX: textAnimation}],
                    opacity: translationAnimation
                }]}>
                    {t(`trip_process.trip_pause.${translateKey}.title`)}{"\n"}
                </Animated.Text>
                <Animated.View style={[stepTripPauseStyles.descContainer, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}>
                    <Text style={stepTripPauseStyles.paragraph}>
                        {t(`trip_process.trip_pause.${translateKey}.new_line_1`)}{"\n"}{"\n"}
                        {t(`trip_process.trip_pause.${translateKey}.new_line_2`)}{"\n"}{"\n"}
                        {t(`trip_process.trip_pause.${translateKey}.new_line_3`)}
                    </Text>
                </Animated.View>
                <View style={stepTripPauseStyles.buttonContainer}>
                    <SecondaryButton
                        icon="lock"
                        inProgress={loading || pause === null}
                        inProgressText={t("trip_process.trip_pause.loading") ?? undefined}
                        value={t(`trip_process.trip_pause.${pause ? "unlock" : "lock"}`)}
                        onClick={handleOpenPause}
                        actionLabel={pause ? "OPEN_PAUSE" : "CLOSE_PAUSE"}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export const StepTripPause = memo(TripPauseStep);

