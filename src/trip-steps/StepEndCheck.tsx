import {COLORS, EndTrip, Loader2} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {ImageAtom} from "@components/Atom";
import {useAppDispatch, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setNAttemptConnect} from "@redux/reducers/lock";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching, setProcessType, setTripState} from "@redux/reducers/trip";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_TRIP_CURRENT} from "@services/endPoint";
import {endCheckStyle} from "@styles/TripStyles";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, ViewProps} from "react-native";

import {GetTripCurrentOutput} from "@bikairproject/shared";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const EndCheckStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {bleOn, updateBleInfo} = useBluetooth();
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

    const checkBluetooth = () => {
        if (!bleOn) {
            throw new Error(t("alert.bluetooth.close") ?? "Il y a eu une erreur.");
        }
    };

    const checkCurrentTrip = async () => {
        const {data} = await instanceApi.get<GetTripCurrentOutput>(GET_TRIP_CURRENT);
        if (data?.time_start) {
            updateBleInfo({
                lockName: data.lock_name ?? null,
                bikeId: data.bike_id ?? null
            });
        }
    };

    const action = async () => {
        dispatch(setNAttemptConnect(0));
        dispatch(fetching(true));
        dispatch(setProcessType("TRIP_LOCK"));
        try {
            checkBluetooth();
            await checkCurrentTrip();

            dispatch(setTripState(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT));
        } catch (error: any) {
            console.log("Error while checking trip end");
            const message = error && error.message ? error.message : error;
            console.log("Message = ", message);
            dispatch(errorOccured(error));
            dispatch(setSnackbar({type: "danger", message: message}));
            onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
        } finally {
            dispatch(fetching(false));
        }
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_END_CHECK));
        action().finally(() => console.log(""));
    }, []);

    return (
        <ScrollView contentContainerStyle={endCheckStyle.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[endCheckStyle.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.trip_end_check.title")}
            </Animated.Text>
            <Animated.Text style={[endCheckStyle.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_end_check.description")}
            </Animated.Text>
            <Animated.Image
                style={[endCheckStyle.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={EndTrip}
            />
            <FadeInViewSteps>
                <ImageAtom
                    source={Loader2}
                    style={endCheckStyle.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepEndCheck = memo(EndCheckStep);
