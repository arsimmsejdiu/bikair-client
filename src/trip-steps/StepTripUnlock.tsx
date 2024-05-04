import {COLORS, Loader2, LockProgress} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {useAppDispatch, useAppSelector, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {useFocusEffect} from "@react-navigation/native";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setNAttemptConnect} from "@redux/reducers/lock";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching} from "@redux/reducers/trip";
import {store} from "@redux/store";
import {removeValue, storeData} from "@services/asyncStorage";
import {stepTripUnlock} from "@styles/TripStyles";
import {WRITE_TIMEOUT} from "@utils/trip";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, ViewProps} from "react-native";
import {ImageAtom} from "@components/Atom";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripUnlockStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {lat, lng} = useAppSelector(state => state.trip);
    const processType = useAppSelector(state => state.trip.processType);
    const {open, lockStatus} = useBluetooth();
    const viewAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;
    const translationAnim = useRef(new Animated.Value(0)).current;
    const [translateKey, setTranslateKey] = useState("trip_open");
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

    const proceed = () => {
        switch (processType) {
            case "TRIP_UNLOCK":
                onStateChange(TRIP_STEPS.TRIP_STEP_START);
                break;
            case "PAUSE_UNLOCK":
                onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
                break;
            default:
                onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
                break;
        }
    };

    useFocusEffect(
        useCallback(() => {
            console.log("TripUnlockStep, on status change : ", lockStatus);
            if (lockStatus) {
                if (lockStatus[0] === "error") {
                    if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                        clearTimeout(timoutFunction);
                    }
                    dispatch(errorOccured("Lock error state on trip unlock", "TRIP_STEP_UNLOCK"));
                    removeValue("@startParams");
                    dispatch(setSnackbar({type: "danger", message: t("bluetooth_error.lock_error")}));
                    onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT);
                }
                if (lockStatus.length === 1 && lockStatus[0] === "open") {
                    if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                        clearTimeout(timoutFunction);
                    }
                    console.log("TripUnlockStep lock open");
                    dispatch(setNAttemptConnect(0));
                    proceed();
                }
                if (lockStatus.length > 0 && lockStatus[0] === "closed") {
                    if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                        clearTimeout(timoutFunction);
                    }
                    console.log("TripUnlockStep lock closed");
                    unlockAction();
                }
            } else {
                if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                    clearTimeout(timoutFunction);
                }
                console.log("TripUnlockStep, status is null, going back to connect");
                onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
            }
        }, [lockStatus])
    );

    useFocusEffect(
        useCallback(() => {
            switch (processType) {
                case "TRIP_UNLOCK":
                    setTranslateKey("trip_open");
                    break;
                case "PAUSE_UNLOCK":
                    setTranslateKey("pause_open");
                    break;
                case "PAUSE_LOCK":
                    setTranslateKey("pause_close");
                    break;
            }
        }, [processType])
    );

    const unlockAction = async () => {
        try {
            // Start process bluetooth connection
            if ((store.getState().auth.functionalities?.functionalities ?? []).includes("POST_LOCK_ALERT_START")) {
                await storeData("@lockDefault", "POST_LOCK_ALERT_START");
            }
            if (processType === "TRIP_UNLOCK") {
                const timeStart = new Date().getTime();
                const startParamsString = JSON.stringify({
                    time_start: timeStart,
                    lat: lat,
                    lng: lng,
                });
                await storeData("@startParams", startParamsString);
            }
            await open();
            setTimeoutFunction(setTimeout(() => {
                if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                    clearTimeout(timoutFunction);
                }
                proceed();
            }, WRITE_TIMEOUT));
        } catch (error: any) {
            console.log(JSON.stringify(error));
            const message = error && error.message ? error.message : error;
            dispatch(errorOccured(error));
            console.log("Error while opening lock : ", message);
            await removeValue("@startParams");
            proceed();
        }
    };

    useEffect(() => {
        console.log("TripUnlockStep, useEffect");
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_UNLOCK));
        dispatch(fetching(true));

        return () => {
            dispatch(fetching(false));
            if (typeof timoutFunction !== "undefined" && timoutFunction !== null) {
                clearTimeout(timoutFunction);
            }
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={stepTripUnlock.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepTripUnlock.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation,
            }]}>
                {t(`trip_process.lock_opening.${translateKey}.title`)}
            </Animated.Text>
            <Animated.Text style={[stepTripUnlock.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation,
            }]}>
                {t(`trip_process.lock_opening.${translateKey}.description`)}
            </Animated.Text>
            <Animated.Image
                style={[stepTripUnlock.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={LockProgress}
            />
            <FadeInViewSteps>
                <ImageAtom
                    source={Loader2}
                    style={stepTripUnlock.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepTripUnlock = memo(TripUnlockStep);
