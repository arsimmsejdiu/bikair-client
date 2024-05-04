import {COLORS, GifLockBike, Loader2} from "@assets/index";
import {FadeInView, FadeInViewSteps} from "@components/Animations/FadeInView";
import {ImageAtom} from "@components/Atom";
import {useAppDispatch, useAppSelector, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {useFocusEffect} from "@react-navigation/native";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setNAttemptConnect} from "@redux/reducers/lock";
import {setSnackbar} from "@redux/reducers/snackbar";
import {storeData} from "@services/asyncStorage";
import {tripStepClosingLockStyles} from "@styles/TripStyles";
import {BLE_TIMEOUT} from "@utils/trip";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, ViewProps} from "react-native";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripCloseLockStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {lockStatus} = useBluetooth();
    const processType = useAppSelector(state => state.trip.processType);
    const lat = useAppSelector(state => state.trip.lat);
    const lng = useAppSelector(state => state.trip.lng);
    const timeEnd = useAppSelector(state => state.trip.timeEnd);
    const viewAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;
    const translationAnim = useRef(new Animated.Value(0)).current;
    const [translateKey, setTranslateKey] = useState("trip_close");

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
                duration: 800,
                delay: 80,
                useNativeDriver: true,
            }),
            Animated.timing(imageAnim, {
                toValue: 1,
                duration: 900,
                delay: 130,
                useNativeDriver: true,
            }),
            Animated.timing(translationAnim, {
                toValue: 1,
                duration: 1000,
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
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    });

    useFocusEffect(
        useCallback(() => {
            console.log("TripCloseLockStep, on status change : ", lockStatus);
            if (lockStatus) {
                if (lockStatus[0] === "error") {
                    console.log("TripCloseLockStep, lock has error status");
                    dispatch(errorOccured("Lock error state on TripCloseLockStep", "BLE ERROR CLOSE LOCK"));
                    dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
                    onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT);
                }
                if (lockStatus.length > 0 && lockStatus[0] === "closed") {
                    console.log("TripCloseLockStep, lock is closed");
                    dispatch(setNAttemptConnect(0));
                    const tripString = JSON.stringify({
                        time_end: timeEnd,
                        lat: lat,
                        lng: lng,
                    });
                    switch (processType) {
                        case "TRIP_LOCK":
                            storeData("@unpaidTrip", tripString).then(() => {
                                onStateChange(TRIP_STEPS.TRIP_STEP_CHECK_LOCK_DEFAULT);
                            });
                            break;
                        case "PAUSE_LOCK":
                            onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
                            break;
                        default:
                            onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
                            break;
                    }
                }
                if (lockStatus.length === 1 && lockStatus[0] === "open") {
                    console.log("TripCloseLockStep, lock is back open and safety on");
                    onStateChange(TRIP_STEPS.TRIP_STEP_RETRY_CLOSING);
                }
            }
        }, [lockStatus])
    );

    useFocusEffect(
        useCallback(() => {
            switch (processType) {
                case "TRIP_LOCK":
                    setTranslateKey("trip_close");
                    break;
                case "PAUSE_LOCK":
                    setTranslateKey("pause_close");
                    break;
            }
        }, [processType])
    );

    useEffect(() => {
        console.log("TripCloseLockStep, useEffect");
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_CLOSE_LOCK));
        const timeout = setTimeout(() => {
            if (typeof timeout !== "undefined" && timeout !== null) {
                clearTimeout(timeout);
            }
            onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT);
        }, BLE_TIMEOUT);

        return () => {
            if (typeof timeout !== "undefined" && timeout !== null) {
                clearTimeout(timeout);
            }
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={tripStepClosingLockStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[tripStepClosingLockStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation,
            }]}>
                {t(`trip_process.lock_closing.${translateKey}.title`)}
            </Animated.Text>
            <Animated.Text style={[tripStepClosingLockStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t(`trip_process.lock_closing.${translateKey}.description`)}
            </Animated.Text>
            <FadeInView>
                <Animated.Image
                    style={[tripStepClosingLockStyles.image, {
                        transform: [{translateX: imageAnimation}],
                        opacity: translationAnimation
                    }]}
                    resizeMode="contain"
                    source={GifLockBike}
                />
            </FadeInView>
            <FadeInViewSteps>
                <ImageAtom
                    source={Loader2}
                    style={tripStepClosingLockStyles.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepTripCloseLock = memo(TripCloseLockStep);
