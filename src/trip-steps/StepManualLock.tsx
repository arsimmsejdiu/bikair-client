import {COLORS, ImgLockBlack, ImgLockWhite, SIZES} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import GoBackCross from "@components/GoBackCross";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {
    onTripStepEvent,
    userClickBackInManualLockEvent,
    userClickBlackLockEvent,
    userClickWhiteLockEvent,
} from "@redux/reducers/events";
import {setProcessType} from "@redux/reducers/trip";
import {INTERVAL_TIMEOUT} from "@services/constants";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, ViewProps} from "react-native";

import {useAppDispatch} from "../hooks";
import useFocusedInterval from "../hooks/useFocusedInterval";
import {stepManualLockStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const ManualLockStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
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

    const translationAnimation = translationAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    });

    const handleWhiteLockClick = () => {
        dispatch(userClickWhiteLockEvent());
        onStateChange(TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_WHITE);
    };

    const handleBlackLockClick = () => {
        dispatch(userClickBlackLockEvent());
        onStateChange(TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_BLACK);
    };

    const handleBackAction = () => {
        dispatch(userClickBackInManualLockEvent());
        dispatch(setProcessType("TRIP_LOCK"));
        onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT);
    };

    useFocusedInterval(() => {
        onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
    }, INTERVAL_TIMEOUT);

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_MANUAL_LOCK));
    }, []);

    return (
        <ScrollView contentContainerStyle={stepManualLockStyles.container}>
            <GoBackCross onClick={handleBackAction}/>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepManualLockStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.manual_lock.title")}
            </Animated.Text>

            <View style={stepManualLockStyles.imageContainer}>
                <TouchableOpacity onPress={handleBlackLockClick} style={stepManualLockStyles.locks}>
                    <FadeInViewSteps>
                        <Image
                            style={[stepManualLockStyles.image]}
                            resizeMode="contain"
                            source={ImgLockBlack}
                        />
                    </FadeInViewSteps>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleWhiteLockClick} style={stepManualLockStyles.locks}>
                    <FadeInViewSteps>
                        <Image
                            style={[stepManualLockStyles.image]}
                            resizeMode="contain"
                            source={ImgLockWhite}
                        />
                    </FadeInViewSteps>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export const StepManualLock = memo(ManualLockStep);
