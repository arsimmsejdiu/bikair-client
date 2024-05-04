import {COLORS, Loader2, Unpaid} from "@assets/index";
import {FadeInViewSteps} from "@components/Animations/FadeInView";
import {useAppDispatch, useAppSelector, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import CrispChat, {CrispSessionEventColors} from "@native-modules/CrispChat";
import {askForTripUnpaid, currentTripDetected, errorOccured, onTripStepEvent,} from "@redux/reducers/events";
import {setNAttemptConnect} from "@redux/reducers/lock";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching, setProcessType, setTripReduction, setUserPosition} from "@redux/reducers/trip";
import {loadData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_BIKE_AVAILABILITY_BY_BIKE_NAME, GET_TRIP_CURRENT, GET_TRIP_UNPAID} from "@services/endPoint";
import {getUserLocation} from "@services/positionServices";
import {getTripReduction} from "@services/tripService";
import {stepBeginCheckStyles} from "@styles/TripStyles";
import React, {memo, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Image, ScrollView, StatusBar, ViewProps} from "react-native";

import {GetTripUnpaidOutput, TRIP_STATUS} from "@bikairproject/shared";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const BeginCheckStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const dispatch = useAppDispatch();
    const bikeName = useAppSelector(state => state.trip.bike_name);
    const {t} = useTranslation();
    const {updateBleInfo, bleOn} = useBluetooth();
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

    const checkBluetooth = () => {
        if (!bleOn) {
            throw new Error(t("alert.bluetooth.close") ?? "Il y a eu une erreur.");
        }
    };

    const checkUnpaidTrip = async () => {
        const unpaidTrip = await loadData("@unpaidTrip");
        if (unpaidTrip) {
            CrispChat.pushSessionEvent("PAY_OLD_TRIP", CrispSessionEventColors.ORANGE);
            onStateChange(TRIP_STEPS.TRIP_STEP_END);
            return false;
        }
        const unpaidTripApi = await instanceApi.get<GetTripUnpaidOutput>(GET_TRIP_UNPAID);
        if (unpaidTripApi.data && unpaidTripApi.data.uuid) {
            console.log(unpaidTripApi.data);
            if (unpaidTripApi.data.status === TRIP_STATUS.WAIT_VALIDATION) {
                onStateChange(TRIP_STEPS.TRIP_STEP_WAIT_VALIDATION);
                return false;
            } else {
                CrispChat.pushSessionEvent("PAY_OLD_TRIP", CrispSessionEventColors.ORANGE);
                onStateChange(TRIP_STEPS.TRIP_STEP_FINISH_PAYMENT);
                return false;
            }
        }
        return true;
    };

    const checkingCurrentTrip = async () => {
        const currentTrip = await instanceApi.get(GET_TRIP_CURRENT);

        if (currentTrip.data && currentTrip.data.uuid) {
            await updateBleInfo({
                lockName: currentTrip.data.lock_name,
                bikeId: currentTrip.data.bike_id
            });
            const tripReduction = await getTripReduction();
            dispatch(setTripReduction(tripReduction));
            onStateChange(TRIP_STEPS.TRIP_STEP_ONGOING);
            return false;
        }
        return true;
    };

    const checkingCurrentBike = async () => {
        //Verify bike is available
        const {data} = await instanceApi.get(GET_BIKE_AVAILABILITY_BY_BIKE_NAME(bikeName ?? "0"));

        // 3. Set redux lock state
        await updateBleInfo({
            lockName: data.lock_name,
            bikeId: data.id
        });
    };

    const action = async () => {
        dispatch(setNAttemptConnect(0));
        dispatch(setProcessType("TRIP_UNLOCK"));
        dispatch(fetching(true));
        try {
            checkBluetooth();

            const noUnpaidTrip = await checkUnpaidTrip();
            if (!noUnpaidTrip) {
                dispatch(askForTripUnpaid());
                return;
            }

            const noCurrentTrip = await checkingCurrentTrip();
            if (!noCurrentTrip) {
                dispatch(currentTripDetected());
                return;
            }

            const coords = await getUserLocation();
            if (coords) {
                dispatch(setUserPosition({lat: coords.latitude, lng: coords.longitude}));
            } else {
                throw "Can't get user position";
            }

            await checkingCurrentBike();

            onStateChange(TRIP_STEPS.TRIP_STEP_CHECK_DEPOSIT);
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
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_BEGIN_CHECK));
        action();
    }, []);

    return (
        <ScrollView contentContainerStyle={stepBeginCheckStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Animated.Text style={[stepBeginCheckStyles.title, {
                transform: [{translateX: viewAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.check_current_trip.title")}
            </Animated.Text>
            <Animated.Text style={[stepBeginCheckStyles.subTitle, {
                transform: [{translateX: textAnimation}],
                opacity: translationAnimation,
            }]}>
                {t("trip_process.check_current_trip.description")}
            </Animated.Text>
            <Animated.Image
                style={[stepBeginCheckStyles.image, {
                    transform: [{translateX: imageAnimation}],
                    opacity: translationAnimation
                }]}
                resizeMode="contain"
                source={Unpaid}
            />
            <FadeInViewSteps>
                <Image
                    source={Loader2}
                    style={stepBeginCheckStyles.loader}
                />
            </FadeInViewSteps>
        </ScrollView>
    );
};

export const StepBeginCheck = memo(BeginCheckStep);
