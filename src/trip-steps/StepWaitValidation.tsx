import {COLORS, ImgSuccess} from "@assets/index";
import {SubmitButton} from "@components/Buttons";
import {useAppDispatch} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {onTripStepEvent, userClickOkWaitValidationEvent} from "@redux/reducers/events";
import {removeValue} from "@services/asyncStorage";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, ScrollView, StatusBar, View, ViewProps} from "react-native";
import {stepWaitValidationStyles} from "@styles/TripStyles";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
    tripEnd: boolean
}

const WaitValidationStep: React.FC<Props> = ({onStateChange, tripEnd}): React.ReactElement | null => {
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

    const handleSubmit = () => {
        dispatch(userClickOkWaitValidationEvent());
        if (tripEnd) {
            onStateChange(TRIP_STEPS.TRIP_STEP_REVIEW);
        } else {
            onStateChange(null);
        }
    };

    const action = async () => {
        await removeValue("@deviceID");
        await removeValue("@clientSecret");
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_WAIT_VALIDATION));
        action();
    }, []);

    return (
        <ScrollView contentContainerStyle={stepWaitValidationStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepWaitValidationStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_wait_validation.title")}
            </Animated.Text>
            <Animated.Text style={[stepWaitValidationStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation
            }]}>
                {t("trip_process.trip_wait_validation.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepWaitValidationStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={ImgSuccess}
            />
            <View style={stepWaitValidationStyles.submitContainer}>
                <SubmitButton
                    value={"Ok"}
                    onClick={handleSubmit}
                    actionLabel={"INFO_WAIT_VALIDATION_OK"}
                />
            </View>
        </ScrollView>
    );
};

export const StepWaitValidation = memo(WaitValidationStep);
