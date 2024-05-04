import {COLORS, WarningImg} from "@assets/index";
import PrimaryButton from "@components/PrimaryButton";
import {useAppDispatch, useFocusedInterval} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {onTripStepEvent, userLockStateYesClickEvent} from "@redux/reducers/events";
import {setProcessType} from "@redux/reducers/trip";
import {INTERVAL_TIMEOUT} from "@services/constants";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, View, ViewProps} from "react-native";
import {stepVerifyLockClosedStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const VerifyLockClosedStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {

    const dispatch = useAppDispatch();
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

    const handleConfirm = () => {
        dispatch(userLockStateYesClickEvent());
        dispatch(setProcessType("TRIP_LOCK"));
        onStateChange(TRIP_STEPS.TRIP_STEP_END);
    };

    useFocusedInterval(() => {
        onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
    }, INTERVAL_TIMEOUT);

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_VERIFY_LOCK_CLOSED));
    }, []);

    return (
        <ScrollView contentContainerStyle={stepVerifyLockClosedStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepVerifyLockClosedStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.verify_lock_closed.title")}
            </Animated.Text>
            <Animated.Text style={[stepVerifyLockClosedStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.verify_lock_closed.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepVerifyLockClosedStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={WarningImg}
            />
            <View style={stepVerifyLockClosedStyles.submitContainer}>
                <PrimaryButton
                    value={t("wording.confirm")}
                    style={{
                        width: "99%"
                    }}
                    onClick={handleConfirm}
                    border='square'
                    variant="contained_lightBlue"
                />
            </View>
        </ScrollView>
    );
};

export const StepVerifyLockClosed = memo(VerifyLockClosedStep);
