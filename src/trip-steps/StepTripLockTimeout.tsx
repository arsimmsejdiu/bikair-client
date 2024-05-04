import {COLORS, ImgLockClose} from "@assets/index";
import BleSettingsButton from "@components/BleSettingsButton";
import {CancelButton, SubmitButton} from "@components/Buttons";
import {useAppDispatch, useAppSelector, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {useFocusEffect} from "@react-navigation/native";
import {
    onTripStepEvent,
    userClickCancelTripEvent,
    userClickManualLockEvent,
    userClickRetryLockConnectionEvent,
} from "@redux/reducers/events";
import {addNAttemptConnect} from "@redux/reducers/lock";
import {INTERVAL_TIMEOUT} from "@services/constants";
import {BLE_RETRY} from "@utils/trip";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, View, ViewProps} from "react-native";

import useFocusedInterval from "../hooks/useFocusedInterval";
import {stepTripLockTimeOutStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripLockTimeoutStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const {t} = useTranslation();
    const {disconnect, updateBleInfo} = useBluetooth();

    const dispatch = useAppDispatch();
    const nAttemptConnect = useAppSelector(state => state.lock.nAttemptConnect);
    const processType = useAppSelector(state => state.trip.processType);
    const userFunctions = useAppSelector(state => state.auth.functionalities);
    const stopRetry = nAttemptConnect > BLE_RETRY;
    const manualLockFunctionality = userFunctions?.functionalities ? userFunctions.functionalities.includes("MANUAL_LOCK") : true;
    const manualLockEnabled = manualLockFunctionality && nAttemptConnect >= 1;

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

    const handleRetry = async () => {
        dispatch(userClickRetryLockConnectionEvent());
        switch (processType) {
            case "TRIP_UNLOCK":
                if (stopRetry) {
                    return;
                }
                dispatch(addNAttemptConnect());
                onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
                break;
            case "TRIP_LOCK":
                dispatch(addNAttemptConnect());
                onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
                break;
            default:
                onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
                break;
        }
    };

    const handleCancelTrip = () => {
        if (processType === "TRIP_UNLOCK") {
            dispatch(userClickCancelTripEvent());
            updateBleInfo({
                lockName: null,
                bikeId: null
            });
            onStateChange(TRIP_STEPS.TRIP_STEP_ERROR_LOCK_CONNECTION_CANCEL);
        } else {
            onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
        }
    };

    const handleManualLock = () => {
        if (processType === "TRIP_LOCK" && manualLockEnabled) {
            dispatch(userClickManualLockEvent());
            onStateChange(TRIP_STEPS.TRIP_STEP_MANUAL_LOCK);
        }
    };

    const renderRetryButton = () => {
        if (stopRetry) {
            return null;
        } else {
            const closing = processType === "TRIP_LOCK";
            const width = !closing || manualLockEnabled ? "49%" : "100%";
            return (
                <View style={{width: width}}>
                    <SubmitButton
                        style={stepTripLockTimeOutStyles.button}
                        value={closing ? t("wording.end") : t("wording.start")}
                        onClick={handleRetry}
                        actionLabel={"RETRY_LOCK_PROCESS"}
                    />
                </View>
            );
        }
    };

    const renderCancelButton = () => {
        if (processType === "TRIP_LOCK") {
            return null;
        } else {
            const width = stopRetry ? "100%" : "49%";
            return (
                <View style={{width: width}}>
                    <CancelButton
                        style={stepTripLockTimeOutStyles.button}
                        value={t("wording.cancel")}
                        onClick={handleCancelTrip}
                        actionLabel={"CANCEL_TRIP"}
                    />
                </View>
            );
        }
    };

    const renderManualLockButton = () => {
        if (processType === "TRIP_LOCK" && manualLockEnabled) {
            return (
                <View style={{width: "49%"}}>
                    <CancelButton
                        style={stepTripLockTimeOutStyles.button}
                        value={t("wording.manual_lock")}
                        onClick={handleManualLock}
                        actionLabel={"MANUAL_LOCK"}
                    />
                </View>
            );
        } else {
            return null;
        }
    };

    const renderBleSettingButton = () => {
        if (stopRetry) {
            return null;
        } else {
            return (
                <View style={{width: "100%", marginBottom: 10}}>
                    <BleSettingsButton style={stepTripLockTimeOutStyles.bleButton}/>
                </View>
            );
        }
    };

    const action = async () => {
        await disconnect();
    };

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

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT));
        action();
    }, []);

    useFocusedInterval(() => {
        if (processType === "TRIP_LOCK") {
            onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
        }
    }, INTERVAL_TIMEOUT);

    return (
        <ScrollView contentContainerStyle={stepTripLockTimeOutStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <View>
                <Animated.Text style={[stepTripLockTimeOutStyles.title, {
                    transform: [{translateX: viewAnimation}],
                    opacity: translationAnimation
                }]}>
                    {t(`trip_process.lock_timeout.${translateKey}.title`)}
                </Animated.Text>
                <Animated.Text style={[stepTripLockTimeOutStyles.subTitle, {
                    transform: [{translateX: textAnimation}],
                    opacity: translationAnimation
                }]}>
                    {t(`trip_process.lock_timeout.${translateKey}.description`)}
                </Animated.Text>
            </View>

            <Animated.Image
                style={[stepTripLockTimeOutStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={ImgLockClose}
            />

            <View style={stepTripLockTimeOutStyles.submitContainer}>
                {renderBleSettingButton()}
            </View>
            <View style={stepTripLockTimeOutStyles.submitContainer}>
                {renderManualLockButton()}
                {renderCancelButton()}
                {renderRetryButton()}
            </View>
        </ScrollView>
    );
};

export const StepTripLockTimeout = memo(TripLockTimeoutStep);
