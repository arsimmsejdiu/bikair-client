import {BASE, COLORS, FONTS, SIZES} from "@assets/index";
import TextButton from "@components/Molecule/TextButton";
import {useAppDispatch} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {
    onTripStepEvent,
    userClickTripEndErrorConfirmEvent,
    userClickTripEndErrorSupportEvent,
} from "@redux/reducers/events";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, StyleSheet, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import CrispChat from "../native-modules/CrispChat";
import {stepTripEndErrorStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const TripEndErrorStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
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
        dispatch(userClickTripEndErrorSupportEvent());
        CrispChat.openChat();
    };

    const handleConfirm = () => {
        dispatch(userClickTripEndErrorConfirmEvent());
        onStateChange(null);
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_END_ERROR));
    }, []);

    return (
        <View style={{
            ...stepTripEndErrorStyles.container,
        }}>
            <ScrollView>
                <View style={{marginTop: 30 + insets.top, marginBottom: 30 + insets.bottom}}>
                    <StatusBar backgroundColor={COLORS.white}/>
                    <Animated.Text style={[stepTripEndErrorStyles.title, {
                        transform: [{translateX: viewAnimation}],
                        opacity: translationAnimation
                    }]}>
                        {t("trip_process.trip_end_error.title")}
                    </Animated.Text>
                    <Animated.Text style={[stepTripEndErrorStyles.subTitle, {
                        transform: [{translateX: textAnimation}],
                        opacity: translationAnimation
                    }]}>
                        {t("trip_process.trip_end_error.description")}
                    </Animated.Text>
                    <TextButton
                        buttonContainerStyle={stepTripEndErrorStyles.buttonContainerStyle1}
                        label={t("trip_process.manual_lock_black.support") ?? "Contacter le support"}
                        actionLabel={"MANUAL_LOCK_BLACK_SUPPORT"}
                        onPress={handleOpenSupport}
                    />
                    <TextButton
                        buttonContainerStyle={stepTripEndErrorStyles.buttonContainerStyle}
                        label={t("trip_process.manual_lock_black.tutorial") ?? "Compris"}
                        actionLabel={"MANUAL_LOCK_BLACK_INSTRUCTION"}
                        onPress={handleConfirm}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export const StepTripEndError = memo(TripEndErrorStep);
