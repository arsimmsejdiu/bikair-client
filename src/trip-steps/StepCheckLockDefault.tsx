import {COLORS, GifLock, Loader2} from "@assets/index";
import {FadeInView, FadeInViewSteps} from "@components/Animations/FadeInView";
import {useAppDispatch} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {errorOccured, onTripStepEvent} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching} from "@redux/reducers/trip";
import {sendAlertUnlockedBike} from "@services/alertServices";
import {loadData, removeValue} from "@services/asyncStorage";
import {checkLockDefaultStyle} from "@styles/TripStyles";
import React, {memo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Image, ScrollView, StatusBar, Text, ViewProps} from "react-native";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const CheckLockDefaultStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();

    const action = async () => {
        dispatch(fetching(true));
        try {
            const lockDefault = await loadData("@lockDefault");
            if (lockDefault) {
                console.log("--- SEND ALERT monitor ---");
                await sendAlertUnlockedBike(lockDefault);
                await removeValue("@lockDefault");
                onStateChange(TRIP_STEPS.TRIP_STEP_VERIFY_LOCK_CLOSED);
                return;
            }
            onStateChange(TRIP_STEPS.TRIP_STEP_END);
        } catch (error: any) {
            const message = error && error.message ? error.message : error;
            dispatch(errorOccured(error));
            dispatch(setSnackbar({type: "danger", message: message}));
            // Cancel trip and close locker
            onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
        } finally {
            dispatch(fetching(false));
        }
    };


    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_CHECK_LOCK_DEFAULT));
        action().finally(() => console.log(""));
    }, []);

    return (
        <ScrollView contentContainerStyle={checkLockDefaultStyle.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Text style={checkLockDefaultStyle.title}>
                {t("trip_process.lock_closing.title")}
            </Text>
            <Text style={checkLockDefaultStyle.subTitle}>
                {t("trip_process.lock_closing.description")}
            </Text>
            <FadeInView>
                <Image
                    style={checkLockDefaultStyle.image}
                    resizeMode="contain"
                    source={GifLock}
                />
            </FadeInView>
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={checkLockDefaultStyle.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepCheckLockDefault = memo(CheckLockDefaultStep);
