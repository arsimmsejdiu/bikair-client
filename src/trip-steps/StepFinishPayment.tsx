import {COLORS, ImgError} from "@assets/index";
import {SubmitButton} from "@components/Buttons";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {TRIP_STEP_MODAL} from "@models/enums";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {askW3DSecure, errorOccured, onTripStepEvent, userClickConfirmPaymentEvent} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching, setRedirectUrl} from "@redux/reducers/trip";
import {storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_PAYMENT_RETRIEVE} from "@services/endPoint";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, View, ViewProps} from "react-native";
import {stepFinishPaymentStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const FinishPaymentStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const isFetching = useAppSelector(state => state.trip.isFetching);
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

    const confirmPayment = async () => {
        try {
            dispatch(fetching(true));
            const {data} = await instanceApi.get(GET_PAYMENT_RETRIEVE);

            // Set client secret to validate payment if 3D secure
            await storeData("@clientSecret", data.client_secret);

            // 3D secure required redirect to stripe.hook
            dispatch(setRedirectUrl(data.redirectUrl));
            if (data.status === "requires_action") {
                dispatch(askW3DSecure());
                onStateChange(TRIP_STEPS.TRIP_STEP_W3D_SECURE);
            } else {
                onStateChange(null);
            }
        } catch (error: any) {
            const message = error && error.message ? error.message : error;
            dispatch(errorOccured(error));
            dispatch(setSnackbar({type: "danger", message: message}));
        } finally {
            dispatch(fetching(false));
        }
    };

    const handleSubmit = async () => {
        dispatch(userClickConfirmPaymentEvent());
        await confirmPayment();
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_FINISH_PAYMENT));
    }, []);

    return (
        <ScrollView contentContainerStyle={stepFinishPaymentStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepFinishPaymentStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_finish_payment.title")}
            </Animated.Text>
            <Animated.Text style={[stepFinishPaymentStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_finish_payment.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepFinishPaymentStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={ImgError}
            />
            <View style={stepFinishPaymentStyles.submitContainer}>
                <SubmitButton
                    disabled={isFetching || false}
                    inProgress={isFetching || false}
                    value={t("trip_process." + TRIP_STEP_MODAL.TRIP_FINISH_PAYMENT + ".button")}
                    onClick={handleSubmit}
                    actionLabel={"FINISH_PAYMENT_OK"}
                />
            </View>
        </ScrollView>
    );
};

export const StepFinishPayment = memo(FinishPaymentStep);
