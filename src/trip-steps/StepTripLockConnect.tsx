import {COLORS, Loader2, LockProgress} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {useFocusEffect} from "@react-navigation/native";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching} from "@redux/reducers/trip";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, ViewProps} from "react-native";

import {useAppDispatch, useAppSelector, useBluetooth} from "../hooks";
import {stepTripLockConnectStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripLockConnectStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const processType = useAppSelector(state => state.trip.processType);
    const {t} = useTranslation();
    const {connect, lockStatus} = useBluetooth();
    const viewAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;
    const translationAnim = useRef(new Animated.Value(0)).current;
    const [translateKey, setTranslateKey] = useState("trip_open");

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
            console.log("lockStatus: ", lockStatus);
            console.log("processType: ", processType);
            if (lockStatus === null) {
                connectToLock();
            } else {
                if (lockStatus[0] === "error") {
                    console.log("lock return error status in TRIP_STEP_LOCK_CONNECT.");
                    dispatch(errorOccured("Lock error status in TRIP_STEP_LOCK_CONNECT"));
                    dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
                    onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT);
                } else {
                    switch (processType) {
                        case "TRIP_LOCK":
                        case "PAUSE_LOCK":
                            onStateChange(TRIP_STEPS.TRIP_STEP_CLOSING);
                            break;
                        case "TRIP_UNLOCK":
                        case "PAUSE_UNLOCK":
                            onStateChange(TRIP_STEPS.TRIP_STEP_UNLOCK);
                            break;
                    }
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
                case "TRIP_UNLOCK":
                    setTranslateKey("trip_open");
                    break;
                case "PAUSE_UNLOCK":
                    setTranslateKey("pause_open");
                    break;
            }
        }, [processType])
    );

    const connectToLock = async () => {
        dispatch(fetching(true));
        try {
            await connect();
        } catch (error: any) {
            console.log("Error while TRIP_STEP_LOCK_CONNECT : ", JSON.stringify(error));
            const message = error && error.message ? error.message : error;
            dispatch(errorOccured(error));
            console.log("Error while connecting to lock : ", message);
            onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT);
        } finally {
            dispatch(fetching(false));
        }
    };

    useEffect(() => {
        console.log("Use effect, TripLockConnectStep");
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT));
    }, []);

    return (
        <ScrollView contentContainerStyle={stepTripLockConnectStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[stepTripLockConnectStyles.title, {
                    transform: [{translateX: viewAnimation}],
                    opacity: translationAnimation,
                }]}>
                {t(`trip_process.lock_connecting.${translateKey}.title`)}
            </Animated.Text>
            <Animated.Text style={[stepTripLockConnectStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t(`trip_process.lock_connecting.${translateKey}.description`)}
            </Animated.Text>
            <Animated.Image
                style={[stepTripLockConnectStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={LockProgress}
            />
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={stepTripLockConnectStyles.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepTripLockConnect = memo(TripLockConnectStep);
