import {COLORS, CreateTrip, Loader2} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {setLastBike} from "@redux/reducers/auth";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setBooking} from "@redux/reducers/markerDetails";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching, setProcessType} from "@redux/reducers/trip";
import {instanceApi} from "@services/axiosInterceptor";
import {POST_TRIP_BEGIN} from "@services/endPoint";
import {stepTripBegin} from "@styles/TripStyles";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, ViewProps} from "react-native";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripBeginStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const {lat, lng, bike_name} = useAppSelector(state => state.trip);
    const {t} = useTranslation();
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
        dispatch(fetching(true));
        dispatch(setProcessType("TRIP_UNLOCK"));
        try {
            // We create a trip before unlocking the bike
            // Trip status will be "open"
            await instanceApi.post(POST_TRIP_BEGIN,
                {
                    bike_name: bike_name,
                    lat: lat,
                    lng: lng,
                });
            // Store trip data in redux
            dispatch(setBooking(null));
            dispatch(setLastBike(bike_name));
            onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
        } catch (error: any) {
            const message = error && error.message ? error.message : error;
            dispatch(errorOccured(error));
            dispatch(setSnackbar({message: message, type: "danger"}));
            // Cancel trip and close locker
            onStateChange(TRIP_STEPS.TRIP_STEP_ERROR_BEGIN_FAILED);
        } finally {
            dispatch(fetching(false));
        }
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_BEGIN));
        action();
    }, []);

    return (
        <ScrollView contentContainerStyle={stepTripBegin.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepTripBegin.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.opening_trip.title")}
            </Animated.Text>
            <Animated.Text style={[stepTripBegin.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.opening_trip.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepTripBegin.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={CreateTrip}
            />
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={stepTripBegin.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepTripBegin = memo(TripBeginStep);
