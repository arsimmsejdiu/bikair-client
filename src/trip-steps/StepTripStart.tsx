import {COLORS, CreateTrip, Loader2} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching, setTimeStart, setTripReduction} from "@redux/reducers/trip";
import {removeValue, storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {PUT_TRIP_START} from "@services/endPoint";
import {getTripReduction} from "@services/tripService";
import {stepTripStart} from "@styles/TripStyles";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, ViewProps} from "react-native";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripStartStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {lat, lng} = useAppSelector(state => state.trip);
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

        const timeStart = new Date().getTime();
        const startParamsString = JSON.stringify({
            time_start: timeStart,
            lat: lat,
            lng: lng,
        });
        await storeData("@startParams", startParamsString);
        try {
            await instanceApi.put(PUT_TRIP_START, {
                time_start: timeStart,
                lat: lat,
                lng: lng,
            });
            await removeValue("@startParams");
            const tripReduction = await getTripReduction();
            dispatch(setTripReduction(tripReduction));
        } catch (error: any) {
            const message = error && error.message ? error.message : error;
            dispatch(errorOccured(error));
            dispatch(setSnackbar({message: message, type: "danger"}));
            dispatch(setTripReduction(null));
        } finally {
            dispatch(setTimeStart(timeStart));
            onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_OPEN);
            dispatch(fetching(false));
        }
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_START));
        action();
    }, []);

    return (
        <ScrollView contentContainerStyle={stepTripStart.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepTripStart.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.creating_trip.title")}
            </Animated.Text>
            <Animated.Text style={[stepTripStart.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.creating_trip.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepTripStart.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={CreateTrip}
            />
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={stepTripStart.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepTripStart = memo(TripStartStep);
