import {COLORS, Loader2, PaymentProcess} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {useAppDispatch, useAppSelector, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {errorOccured, onTripStepEvent, photoSendEvent} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching, resetTrip} from "@redux/reducers/trip";
import {removeValue} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {PUT_TRIP_END} from "@services/endPoint";
import {saveEndPhoto} from "@services/storeService";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, ViewProps} from "react-native";
import {stepTripEndValidateStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripEndValidateStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const lat = useAppSelector(state => state.trip.lat);
    const lng = useAppSelector(state => state.trip.lng);
    const timeEnd = useAppSelector(state => state.trip.timeEnd);
    const {t} = useTranslation();
    const {updateBleInfo, disconnect} = useBluetooth();
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

    const endTrip = async (attempt = 1) => {
        dispatch(fetching(true));

        try {
            console.log("Send photo");
            saveEndPhoto()
                .then(() => {
                    console.log("attempted to save photo");
                    dispatch(photoSendEvent());
                })
                .catch(error => {
                    dispatch(errorOccured(error, "SAVE PHOTO"));
                });

            console.log("Disconnect lock");
            // Disconnect lock
            await disconnect();
            updateBleInfo({
                lockName: null,
                bikeId: null
            });
        } catch (error) {
            console.log("Error while pre process en trip");
            console.log(error);
        }

        try {
            const tripEndInput = {
                lat: lat,
                lng: lng,
                time_end: timeEnd,
                offline: false,
                validation: true,
            };
            await instanceApi.put(PUT_TRIP_END, tripEndInput);

            await removeValue("@unpaidTrip");
            await removeValue("@startParams");

            dispatch(resetTrip());
            await removeValue("@lockKeys");

            // If 3D auth not required
            onStateChange(TRIP_STEPS.TRIP_STEP_WAIT_VALIDATION_END);
        } catch (error: any) {
            const msg = error.message ? error.message : error;
            // In case of network error retry calling the function
            dispatch(errorOccured(error, "END TRIP VALIDATE"));
            if (error.message === "Network Error" && attempt < 3) {
                await endTrip(attempt + 1);
            } else if (error.message === "Network Error") {
                dispatch(setSnackbar({message: msg, type: "danger"}));
                onStateChange(null);
            } else if (error.status === 404) {
                await removeValue("@unpaidTrip");
                await removeValue("@startParams");
                onStateChange(null);
            } else {
                dispatch(setSnackbar({message: msg, type: "danger"}));
                onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
            }
        } finally {
            dispatch(fetching(false));
        }
    };

    const action = async () => {
        await endTrip();
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_END));
        action().then(r => console.log(r));
    }, []);

    return (
        <ScrollView contentContainerStyle={stepTripEndValidateStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepTripEndValidateStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_paying_validation.title")}
            </Animated.Text>
            <Animated.Text style={[stepTripEndValidateStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_paying_validation.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepTripEndValidateStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={PaymentProcess}
            />
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={stepTripEndValidateStyles.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepTripEndValidate = memo(TripEndValidateStep);
