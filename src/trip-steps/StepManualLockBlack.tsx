import {COLORS} from "@assets/index";
import GoBackCross from "@components/GoBackCross";
import TextButton from "@components/Molecule/TextButton";
import {useAppDispatch} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {
    onTripStepEvent,
    userClickBackInManualLockEvent,
    userClickBlackLockTutorialEvent,
    userClickManualLockSupportEvent,
} from "@redux/reducers/events";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, Text, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import CrispChat from "../native-modules/CrispChat";
import {stepManualLockBlackStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const ManualLockBlackStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const {t} = useTranslation();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const viewAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
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

    const textAnimation = textAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0],
    });

    const translationAnimation = translationAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    });

    const handleOpenSupport = () => {
        dispatch(userClickManualLockSupportEvent());
        CrispChat.openChat();
    };

    const handleTutorial = () => {
        dispatch(userClickBlackLockTutorialEvent());
        onStateChange(TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_BLACK_TUTORIAL);
    };

    const handleBackAction = () => {
        dispatch(userClickBackInManualLockEvent());
        onStateChange(TRIP_STEPS.TRIP_STEP_MANUAL_LOCK);
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_BLACK));
    }, []);

    return (
        <View style={{...stepManualLockBlackStyles.container}}>
            <ScrollView>
                <GoBackCross onClick={handleBackAction}/>
                <View style={{marginTop: 30 + insets.top, marginBottom: 30 + insets.bottom}}>
                    <StatusBar backgroundColor={COLORS.white}/>
                    <Animated.Text style={[stepManualLockBlackStyles.title, {
                        transform: [{translateX: viewAnimation}],
                        opacity: translationAnimation,
                    }]}>
                        {t("trip_process.manual_lock_black.title")}
                    </Animated.Text>

                    <Animated.Text style={[stepManualLockBlackStyles.subTitle, {
                        transform: [{translateX: textAnimation}],
                        opacity: translationAnimation,
                    }]}>
                        {t("trip_process.manual_lock_black.disclaimerLock")}
                    </Animated.Text>
                    <View style={[stepManualLockBlackStyles.textWrapper]}>
                        <Animated.Text style={[stepManualLockBlackStyles.subTitleContainer, {
                            transform: [{translateX: textAnimation}],
                            opacity: translationAnimation,
                        }]}>
                            <Text
                                style={stepManualLockBlackStyles.subTitle}>- {t("trip_process.manual_lock_black.line_1")}{"\n\n"}</Text>
                            <Text
                                style={stepManualLockBlackStyles.subTitle}>- {t("trip_process.manual_lock_black.line_2")}{"\n\n"}</Text>
                            <Text
                                style={stepManualLockBlackStyles.subTitle}>- {t("trip_process.manual_lock_black.line_3")}{"\n\n"}</Text>
                            <Text
                                style={stepManualLockBlackStyles.subTitle}>- {t("trip_process.manual_lock_black.line_4")}{"\n\n"}</Text>
                            <Text
                                style={stepManualLockBlackStyles.subTitle}>- {t("trip_process.manual_lock_black.line_5")}</Text>
                        </Animated.Text>
                    </View>
                    <TextButton
                        buttonContainerStyle={stepManualLockBlackStyles.buttonContainerStyle}
                        label={t("trip_process.manual_lock_black.support") ?? "Contacter le support"}
                        actionLabel={"MANUAL_LOCK_BLACK_SUPPORT"}
                        onPress={handleOpenSupport}
                    />
                    <TextButton
                        buttonContainerStyle={stepManualLockBlackStyles.buttonContainerStyle1}
                        label={t("trip_process.manual_lock_black.tutorial") ?? "Instructions"}
                        actionLabel={"MANUAL_LOCK_BLACK_INSTRUCTION"}
                        onPress={handleTutorial}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export const StepManualLockBlack = memo(ManualLockBlackStep);
