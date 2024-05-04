import {COLORS, End, Loader2} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {useAppDispatch, useAppSelector, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {useFocusEffect} from "@react-navigation/native";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching} from "@redux/reducers/trip";
import {WRITE_TIMEOUT} from "@utils/trip";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, ViewProps} from "react-native";
import {stepTripClosingStyles} from "@styles/TripStyles";


interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripClosingStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {lockStatus, close} = useBluetooth();
    const processType = useAppSelector(state => state.trip.processType);
    const viewAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;
    const translationAnim = useRef(new Animated.Value(0)).current;
    const [translateKey, setTranslateKey] = useState("trip_close");
    const [timoutFunction, setTimeoutFunction] = useState<NodeJS.Timeout | null>(null);

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
            console.log("TripClosingStep, on status change : ", lockStatus);
            if (lockStatus) {
                if (lockStatus[0] === "error") {
                    if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                        clearTimeout(timoutFunction);
                    }
                    dispatch(errorOccured("Lock error state on TripClosingStep", "TRIP_STEP_CLOSING"));
                    // Cancel trip and close locker
                    dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
                    onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT);
                    return;
                }
                if (lockStatus.length > 1 && lockStatus[0] === "open" && lockStatus[1] === "child-safety") {
                    if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                        clearTimeout(timoutFunction);
                    }
                    console.log("TripClosingStep, lock is available for closing");
                    onStateChange(TRIP_STEPS.TRIP_STEP_CLOSE_LOCK);
                    return;
                }
                if (lockStatus.length === 1 && lockStatus[0] === "open") {
                    if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                        clearTimeout(timoutFunction);
                    }
                    console.log("TripClosingStep, lock is open, sending write instructions");
                    closeAction();
                    return;
                }
                if (lockStatus.length > 0 && lockStatus[0] === "closed") {
                    if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                        clearTimeout(timoutFunction);
                    }
                    console.log("TripClosingStep, lock is already closed");
                    switch (processType) {
                        case "TRIP_LOCK":
                            onStateChange(TRIP_STEPS.TRIP_STEP_CHECK_LOCK_DEFAULT);
                            break;
                        case "PAUSE_LOCK":
                            onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
                            break;
                        default:
                            onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
                            break;
                    }
                }
            } else {
                if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                    clearTimeout(timoutFunction);
                }
                console.log("TripClosingStep, status is null, going back to connect");
                onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
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

    const closeAction = async () => {
        try {
            await close();
            setTimeoutFunction(setTimeout(() => {
                if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                    clearTimeout(timoutFunction);
                }
                onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT);
            }, WRITE_TIMEOUT));
        } catch (error: any) {
            const message = error && error.message ? error.message : error;
            dispatch(errorOccured(error, "TRIP_STEP_CLOSING"));
            dispatch(setSnackbar({message: message, type: "danger"}));
            // Cancel trip and close locker
            onStateChange(TRIP_STEPS.TRIP_STEP_RETRY_CLOSING);
        }
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_CLOSING));
        console.log("TripClosingStep, useEffect");
        dispatch(fetching(true));

        return () => {
            dispatch(fetching(false));
            if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                clearTimeout(timoutFunction);
            }
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={stepTripClosingStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepTripClosingStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation,
            }]}>
                {t(`trip_process.trip_closing.${translateKey}.title`)}
            </Animated.Text>
            <Animated.Text style={[stepTripClosingStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t(`trip_process.trip_closing.${translateKey}.description`)}
            </Animated.Text>
            <Animated.Image
                style={[stepTripClosingStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={End}
            />
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={stepTripClosingStyles.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepTripClosing = memo(TripClosingStep);
