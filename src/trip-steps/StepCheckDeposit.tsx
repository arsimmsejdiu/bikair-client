import {COLORS, Loader2, PaymentProcess} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {useAppDispatch} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {askW3DSecure, errorOccured, onTripStepEvent,} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching, setRedirectUrl} from "@redux/reducers/trip";
import {storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_TRIP_DEPOSIT} from "@services/endPoint";
import {stepCheckDeposit} from "@styles/TripStyles";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, ViewProps} from "react-native";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const CheckDepositStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
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

    const checkDeposit = async () => {
        const {data} = await instanceApi.get(GET_TRIP_DEPOSIT);

        // If 3D auth not required
        if (data.status === "requires_action") {
            // Store clientSecret to verify after 3Dsecure (if needed)
            await storeData("@clientSecret", data.client_secret);

            // Store deposit id to update the status after 3D secure
            if (data.depositId) {
                await storeData("@depositTripId", data.depositId.toString());
            }

            // 3D secure required redirect to stripe.hook
            dispatch(setRedirectUrl(data.redirectUrl));
        }
        return data.status;
    };

    const action = async () => {
        try {
            const status = await checkDeposit();

            if (status === "requires_action") {
                dispatch(askW3DSecure());
                onStateChange(TRIP_STEPS.TRIP_STEP_W3D_SECURE);
            } else if(status === "insufficient_funds") {
                dispatch(setSnackbar({type: "danger", message: "payment.error_3Dsecure_deposit"}));
            } else if(status === "Expired") {
                dispatch(setSnackbar({type: "danger", message: "payment.error_3Dsecure_payment"}));
            } else {
                onStateChange(TRIP_STEPS.TRIP_STEP_BEGIN);
            }
        } catch (err: any) {
            const msg = err && err.message ? err.message : err;
            dispatch(errorOccured(err));
            dispatch(setSnackbar({type: "danger", message: msg}));
            onStateChange(null);
        } finally {
            dispatch(fetching(false));
        }
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_CHECK_DEPOSIT));
        action();
    }, []);

    return (
        <ScrollView contentContainerStyle={stepCheckDeposit.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepCheckDeposit.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.check_deposit.title")}
            </Animated.Text>
            <Animated.Text style={[stepCheckDeposit.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.check_deposit.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepCheckDeposit.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={PaymentProcess}
            />
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={stepCheckDeposit.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepCheckDeposit = memo(CheckDepositStep);
