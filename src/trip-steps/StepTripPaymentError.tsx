import {COLORS, PaymentError, SIZES} from "@assets/index";
import {SubmitButton} from "@components/Buttons";
import TextButton from "@components/Molecule/TextButton";
import {useAppDispatch, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {onTripStepEvent, userClickTripPaymentErrorEvent} from "@redux/reducers/events";
import {PaymentStackScreenProps} from "@stacks/types";
import {paymentScreenStyles} from "@styles/PaymentScreenStyles";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, StyleSheet, View, ViewProps} from "react-native";
import {stepTripPaymentErrorStyles} from "@styles/TripStyles";

interface Props extends ViewProps, PaymentStackScreenProps<"PaymentInfo"> {
    onStateChange: (state: TRIP_STEPS | null) => void,
    navigation: any
}

const TripPaymentErrorStep: React.FC<Props> = ({onStateChange, navigation}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const {disconnect} = useBluetooth();
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

    const handleSubmit = async () => {
        dispatch(userClickTripPaymentErrorEvent());
        await disconnect();
        onStateChange(null);
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_PAYMENT_ERROR));
    }, []);

    return (
        <ScrollView contentContainerStyle={stepTripPaymentErrorStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepTripPaymentErrorStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_payment_error.title")}
            </Animated.Text>
            <Animated.Text style={[stepTripPaymentErrorStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_payment_error.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepTripPaymentErrorStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={PaymentError}
            />
            <View style={stepTripPaymentErrorStyles.submitContainer}>
                <SubmitButton
                    value={"Ok"}
                    onClick={handleSubmit}
                    actionLabel={"PAYMENT_ERROR_OK"}
                />
            </View>

            <TextButton
                buttonContainerStyle={paymentScreenStyles.buttonContainerStyle}
                onPress={() => navigation.navigate("Payment", {
                    screen: "PaymentInfo"
                })}
                actionLabel={"CHECKOUT_VALIDATION"}
                label={t("trip_process.trip_payment_error.add_card") ?? "Change my credit card"}
            />
        </ScrollView>
    );
};

export const StepTripPaymentError = memo(TripPaymentErrorStep);
