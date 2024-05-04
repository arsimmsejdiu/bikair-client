import {COLORS, ImgWarning, Loader2} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching, resetTrip} from "@redux/reducers/trip";
import {removeValue} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {PUT_TRIP_CANCEL} from "@services/endPoint";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, ViewProps} from "react-native";

import {useAppDispatch, useBluetooth} from "../hooks";
import {stepTripCancelStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    cause?: string
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripCancelStep: React.FC<Props> = (
    {
        cause,
        onStateChange
    }): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {disconnect, updateBleInfo} = useBluetooth();
    const viewAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;
    const translationAnim = useRef(new Animated.Value(0)).current;

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

    const action = async () => {
        let timeout: NodeJS.Timeout;
        try {
            await instanceApi.put(PUT_TRIP_CANCEL, {cause: cause});
        } catch (error: any) {
            if (error.status !== 404) {
                const message = error && error.message ? error.message : error;
                dispatch(errorOccured(error));
                dispatch(setSnackbar({message: message, type: "danger"}));
            }
        } finally {
            timeout = setTimeout(() => {
                onStateChange(null);
            }, 5000);
            dispatch(fetching(false));
            dispatch(resetTrip());
            // Disconnect lock
            await disconnect();
            updateBleInfo({
                lockName: null,
                bikeId: null
            });
            await removeValue("@lockKeys");
            // Clear Asyncstorage
            await removeValue("@clientSecret");
        }

        return () => {
            if (typeof timeout !== "undefined" && timeout !== null) {
                clearTimeout(timeout);
            }
        };
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_CANCEL));
        action();
    }, []);

    return (
        <ScrollView contentContainerStyle={stepTripCancelStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepTripCancelStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_cancel.title")}
            </Animated.Text>
            <Animated.Text style={[stepTripCancelStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_cancel.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepTripCancelStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={ImgWarning}
            />
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={stepTripCancelStyles.loader}
                    resizeMode={"cover"}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepTripCancel = memo(TripCancelStep);
