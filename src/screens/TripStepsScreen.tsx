import {COLORS} from "@assets/index";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {setTripState} from "@redux/reducers/trip";
import {StepBeginCheck} from "@trip-steps/StepBeginCheck";
import {StepCheckDeposit} from "@trip-steps/StepCheckDeposit";
import {StepCheckLockDefault} from "@trip-steps/StepCheckLockDefault";
import {StepEndCheck} from "@trip-steps/StepEndCheck";
import {StepFinishPayment} from "@trip-steps/StepFinishPayment";
import {StepManualLock} from "@trip-steps/StepManualLock";
import {StepManualLockBlack} from "@trip-steps/StepManualLockBlack";
import {StepManualLockBlackTutorial} from "@trip-steps/StepManualLockBlackTutorial";
import {StepManualLockPhoto} from "@trip-steps/StepManualLockPhoto";
import {StepManualLockWhite} from "@trip-steps/StepManualLockWhite";
import {StepTripBegin} from "@trip-steps/StepTripBegin";
import {StepTripCancel} from "@trip-steps/StepTripCancel";
import {StepTripCloseLock} from "@trip-steps/StepTripCloseLock";
import {StepTripClosing} from "@trip-steps/StepTripClosing";
import {StepTripEnd} from "@trip-steps/StepTripEnd";
import {StepTripEndValidate} from "@trip-steps/StepTripEndValidate";
import {StepTripLockConnect} from "@trip-steps/StepTripLockConnect";
import {StepTripLockOpen} from "@trip-steps/StepTripLockOpen";
import {StepTripLockTimeout} from "@trip-steps/StepTripLockTimeout";
import {StepTripPaid} from "@trip-steps/StepTripPaid";
import {StepTripPaymentError} from "@trip-steps/StepTripPaymentError";
import {StepTripRetryClosing} from "@trip-steps/StepTripRetryClosing";
import {StepTripReview} from "@trip-steps/StepTripReview";
import {StepTripStart} from "@trip-steps/StepTripStart";
import {StepTripUnlock} from "@trip-steps/StepTripUnlock";
import {StepVerifyLockClosed} from "@trip-steps/StepVerifyLockClosed";
import {StepWaitValidation} from "@trip-steps/StepWaitValidation";
import React, {useCallback, useEffect} from "react";
import {BackHandler, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {StepTripEndError} from "@trip-steps/StepTripEndError";

/**
 * 1. Check lock connection
 * 2. Closing trip
 * 3. Open comment box
 * 3. Return map
 *
 */
interface Props extends ViewProps {
    navigation: any
    route: any
}

const TripStepsScreen: React.FC<Props> = ({navigation, route}): React.ReactElement | null => {

    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const tripState = useAppSelector(state => state.trip.tripState);
    const redirectUrl = useAppSelector(state => state.trip.redirectUrl);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "TripStepsScreen").then(r => console.log(r));
    }, []));

    const handleChangeState = (state: TRIP_STEPS | null) => {
        dispatch(setTripState(state));
    };

    const renderModalStep = () => {
        switch (tripState) {
            case TRIP_STEPS.TRIP_STEP_BEGIN_CHECK:
                return <StepBeginCheck
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_CHECK_DEPOSIT:
                return <StepCheckDeposit
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_BEGIN:
                return <StepTripBegin
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_UNLOCK:
                return <StepTripUnlock
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_START:
                return <StepTripStart
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_LOCK_OPEN:
                return <StepTripLockOpen
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_END_CHECK:
                return <StepEndCheck
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_LOCK_CONNECT:
                return <StepTripLockConnect
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_CLOSING:
                return <StepTripClosing
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_CLOSE_LOCK:
                return <StepTripCloseLock
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_RETRY_CLOSING:
                return <StepTripRetryClosing
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_CHECK_LOCK_DEFAULT:
                return <StepCheckLockDefault
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_VERIFY_LOCK_CLOSED:
                return <StepVerifyLockClosed
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_END:
                return <StepTripEnd
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_MANUAL_LOCK:
                return <StepManualLock
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_WHITE:
                return <StepManualLockWhite
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_BLACK:
                return <StepManualLockBlack
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_BLACK_TUTORIAL:
                return <StepManualLockBlackTutorial
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_PHOTO:
                return <StepManualLockPhoto
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_END_VALIDATE:
                return <StepTripEndValidate
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_PAID:
                return <StepTripPaid
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_WAIT_VALIDATION_END:
                return <StepWaitValidation
                    onStateChange={handleChangeState}
                    tripEnd={true}
                />;
            case TRIP_STEPS.TRIP_STEP_WAIT_VALIDATION:
                return <StepWaitValidation
                    onStateChange={handleChangeState}
                    tripEnd={false}
                />;
            case TRIP_STEPS.TRIP_STEP_PAYMENT_ERROR:
                return <StepTripPaymentError
                    onStateChange={handleChangeState}
                    navigation={navigation}
                    route={route}
                />;
            case TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT:
                return <StepTripLockTimeout
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_CANCEL:
                return <StepTripCancel
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_ERROR_DEPOSIT_UNCAPTURED:
                return <StepTripCancel
                    cause={"DEPOSIT_UNCAPTURED"}
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_ERROR_UNLOCK_FAILED:
                return <StepTripCancel
                    cause={"UNLOCK_FAILED"}
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_ERROR_LOCK_CONNECTION_CANCEL:
                return <StepTripCancel
                    cause={"LOCK_CONNECTION_CANCEL"}
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_ERROR_BEGIN_FAILED:
                return <StepTripCancel
                    cause={"BEGIN_FAILED"}
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_ERROR_START_FAILED:
                return <StepTripCancel
                    cause={"START_FAILED"}
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_FINISH_PAYMENT:
                return <StepFinishPayment
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_REVIEW:
                return <StepTripReview
                    navigation={navigation}
                    onStateChange={handleChangeState}
                />;
            case TRIP_STEPS.TRIP_STEP_END_ERROR:
                return <StepTripEndError onStateChange={handleChangeState}/>
            default:
                return null;
        }
    };

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", backAction);
            };
        }, []),
    );

    useEffect(() => {
        switch (tripState) {
            case TRIP_STEPS.TRIP_STEP_W3D_SECURE:
                // Ensure you close the modal before redirecting to webview 3D secure
                // Redirect to Stripe 3D secure page
                navigation.navigate("W3DSecure", {
                    uri: redirectUrl,
                });
                break;
            case null:
            case TRIP_STEPS.TRIP_STEP_ONGOING:
                // Ensure you close the modal before redirecting to webview 3D secure
                // Redirect to Stripe 3D secure page
                navigation.navigate("Map");
                break;
            default:
                break;
        }
    }, [tripState]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
                paddingTop: insets.top
            }}
        >
            {renderModalStep()}
        </View>
    );
};

export default TripStepsScreen;
