import {COLORS, ImgError} from "@assets/index";
import {SecondaryButton, SubmitButton} from "@components/Buttons";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import useFocusedInterval from "@hooks/useFocusedInterval";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {onTripStepEvent, userClickRetryLockClosingEvent} from "@redux/reducers/events";
import {INTERVAL_TIMEOUT} from "@services/constants";
import {HomeNavigationProps} from "@stacks/types";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, View, ViewProps} from "react-native";

import CrispChat from "../native-modules/CrispChat";
import {stepTripRetryClosingStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const StepTripCloseLock: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const {t} = useTranslation();

    const dispatch = useAppDispatch();
    const navigation = useNavigation<HomeNavigationProps>();
    const processType = useAppSelector(state => state.trip.processType);

    const viewAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const imageAnim = useRef(new Animated.Value(0)).current;
    const translationAnim = useRef(new Animated.Value(0)).current;
    const [translateKey, setTranslateKey] = useState("trip_close");


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
                delay: 30,
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

    const handleClickContact = () => {
        onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
        navigation.navigate("Map");
        CrispChat.openChat();
    };

    const handleSubmit = () => {
        dispatch(userClickRetryLockClosingEvent());
        onStateChange(TRIP_STEPS.TRIP_STEP_LOCK_CONNECT);
    };

    useFocusedInterval(() => {
        onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
    }, INTERVAL_TIMEOUT);

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_RETRY_CLOSING));
    }, []);

    useFocusEffect(
        useCallback(() => {
            switch (processType) {
                case "TRIP_LOCK":
                    setTranslateKey("trip_close");
                    break;
                case "PAUSE_LOCK":
                    setTranslateKey("pause_close");
                    break;
            }
        }, [processType])
    );

    return (
        <ScrollView contentContainerStyle={stepTripRetryClosingStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepTripRetryClosingStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation
            }]}>
                {t(`trip_process.lock_timeout.${translateKey}.title`)}
            </Animated.Text>
            <Animated.Text style={[stepTripRetryClosingStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation,
            }]}>
                {t(`trip_process.lock_timeout.${translateKey}.description`)}
            </Animated.Text>
            <Animated.Image
                style={[stepTripRetryClosingStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation,
                }]}
                resizeMode="contain"
                source={ImgError}
            />
            <View style={stepTripRetryClosingStyles.submitContainer}>
                <SubmitButton
                    value={t("wording.retry").toUpperCase()}
                    onClick={handleSubmit}
                    actionLabel={"RETRY_CLOSE_LOCK"}
                />
            </View>
            <View style={stepTripRetryClosingStyles.submitContainer}>
                <SecondaryButton
                    value="CONTACT"
                    onClick={handleClickContact}
                    actionLabel={"SUPPORT_BUTTON"}
                />
            </View>
        </ScrollView>
    );
};

export const StepTripRetryClosing = React.memo(StepTripCloseLock);
