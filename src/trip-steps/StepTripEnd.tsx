import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {askW3DSecure, errorOccured, onTripStepEvent, photoSendEvent} from "@redux/reducers/events";
import {fetching, resetTrip, setRedirectUrl} from "@redux/reducers/trip";
import {loadData, removeValue, storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {PUT_TRIP_END} from "@services/endPoint";
import {saveEndPhoto} from "@services/storeService";
import {stepTripEndStyles} from "@styles/TripStyles";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, ViewProps} from "react-native";

import {COLORS, Loader2, PaymentProcess} from "../assets";
import {useAppDispatch, useAppSelector, useBluetooth} from "../hooks";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripEndStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const tripLat = useAppSelector(state => state.trip.lat);
    const tripLng = useAppSelector(state => state.trip.lng);
    const tripTimeEnd = useAppSelector(state => state.trip.timeEnd);
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
        let unpaidTripString = await loadData("@unpaidTrip");
        let lat, lng, timeEnd, unPaidTrip;
        let offline = false;
        if (!unpaidTripString) {
            lat = tripLat;
            lng = tripLng;
            timeEnd = tripTimeEnd;
            unpaidTripString = JSON.stringify({
                time_end: timeEnd,
                lat: lat,
                lng: lng,
            });
        } else {
            unPaidTrip = JSON.parse(unpaidTripString);
            lat = unPaidTrip.lat;
            lng = unPaidTrip.lng;
            timeEnd = unPaidTrip.time_end;
            offline = true;
        }

        saveEndPhoto()
            .then(() => {
                console.log("attempted to save photo");
                dispatch(photoSendEvent());
            })
            .catch(error => {
                dispatch(errorOccured(error, "SAVE PHOTO"));
            });

        await storeData("@unpaidTrip", unpaidTripString);
        // Disconnect lock
        await disconnect();
        updateBleInfo({
            lockName: null,
            bikeId: null
        });

        try {
            const tripEndInput = {
                lat: lat,
                lng: lng,
                time_end: timeEnd,
                offline: offline
            };
            const {data} = await instanceApi.put(PUT_TRIP_END, tripEndInput);

            await removeValue("@unpaidTrip");
            await removeValue("@startParams");

            dispatch(resetTrip());
            await removeValue("@lockKeys");

            // If 3D auth not required
            if (data.status === "succeeded") {
                onStateChange(TRIP_STEPS.TRIP_STEP_PAID);
            } else {
                // Set client secret to validate payment if 3D secure
                await storeData("@clientSecret", data.client_secret);

                // 3D secure required redirect to stripe.hook
                dispatch(setRedirectUrl(data.redirectUrl));
                dispatch(askW3DSecure());
                onStateChange(TRIP_STEPS.TRIP_STEP_W3D_SECURE);
            }
        } catch (error: any) {
            const msg = error.message ? error.message : error;
            console.log("error : ", msg);
            // In case of network error retry calling the function
            dispatch(errorOccured(error, "END TRIP"));
            if (error.message === "Network Error" && attempt < 3) {
                await endTrip(attempt + 1);
            } else if (error.message === "Network Error") {
                onStateChange(TRIP_STEPS.TRIP_STEP_END_ERROR);
            } else if (error.status === 402) {
                await removeValue("@unpaidTrip");
                await removeValue("@startParams");
                onStateChange(TRIP_STEPS.TRIP_STEP_PAYMENT_ERROR);
            } else if (error.status === 404) {
                await removeValue("@unpaidTrip");
                await removeValue("@startParams");
                onStateChange(null);
            } else {
                onStateChange(TRIP_STEPS.TRIP_STEP_END_ERROR);
            }
        } finally {
            dispatch(fetching(false));
        }
    };

    const action = async () => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_END));
        await endTrip();
    };

    useEffect(() => {
        action().then(() => console.log(""));
    }, []);

    return (
        <ScrollView contentContainerStyle={stepTripEndStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepTripEndStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_paying.title")}
            </Animated.Text>
            <Animated.Text style={[stepTripEndStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_paying.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepTripEndStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={PaymentProcess}
            />
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={stepTripEndStyles.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepTripEnd = memo(TripEndStep);
