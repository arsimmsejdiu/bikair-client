import {COLORS, FeatherIcon, Master, Visa} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import {SubmitButton} from "@components/Buttons";
import GoBackCross from "@components/GoBackCross";
import TripPrice from "@containers/TripPrice";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import useFocusedInterval from "@hooks/useFocusedInterval";
import {UserFunctions} from "@models/enums";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {errorOccured, userPaymentClickEvent} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {fetching, setTripState} from "@redux/reducers/trip";
import {store} from "@redux/store";
import {loadData, removeValue} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {PUT_TRIP_START} from "@services/endPoint";
import {HomeStackScreenProps} from "@stacks/types";
import {tripEndStyles} from "@styles/TripStyles";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {BackHandler, ScrollView, View, ViewProps} from "react-native";

const INTERVAL_TIMEOUT = 50000;

interface Props extends ViewProps, HomeStackScreenProps<"TripEnd"> {
}

const TripEndScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const trip = useAppSelector(state => state.trip);
    const card = useAppSelector(state => state.paymentMethod.card);
    const rentalTime = useAppSelector(state => state?.auth?.me?.rental_end_time);
    const userFunctions = useAppSelector(state => state.auth.functionalities);

    const [isStartOk, setIsStartOk] = useState(false);
    const [isStartFetching, setIsStartFetching] = useState(false);
    const [translateKey, setTranslateKey] = useState<string>("default");
    const last4 = card?.last_4;

    useFocusEffect(
        useCallback(() => {
            let newTranslateKey = "default";
            if (rentalTime) {
                newTranslateKey = Date.now() < Number(rentalTime) ? "rental" : "default";
            }
            setTranslateKey(newTranslateKey);
        }, [rentalTime])
    );

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "TripEndScreen").then(r => console.log(r));
    }, []));

    const handleBackAction = () => {
        navigation.navigate("TripStop");
    };

    const handleCloseTrip = async () => {
        dispatch(userPaymentClickEvent());
        dispatch(fetching(true));
        try {
            const userScore = store.getState().auth.me?.score ?? 1;
            const isActive = (userFunctions?.functionalities ?? []).includes(UserFunctions.END_PHOTO);

            if (userScore <= 0.5 && isActive) {
                navigation.navigate("Photo");
            } else {
                dispatch(setTripState(TRIP_STEPS.TRIP_STEP_END_CHECK));
                navigation.navigate("TripSteps");
            }
        } catch (error: any) {
            dispatch(setSnackbar({type: "danger", message: t(error.message)}));
        } finally {
            dispatch(fetching(false));
        }
    };

    const resendStartRequest = async () => {
        if (!isStartFetching) {
            setIsStartFetching(true);
            try {
                const result = await loadData("@startParams");
                if (typeof result !== "undefined" && result !== null) {
                    try {
                        const startParams = JSON.parse(result);
                        console.log("retry sending start request : ", startParams);
                        await instanceApi.put(PUT_TRIP_START, {
                            time_start: startParams.timeStart,
                            lat: startParams.lat,
                            lng: startParams.lng,
                        });
                        removeValue("@startParams");
                        setIsStartOk(true);
                    } catch (error: any) {
                        if (error.status === 404) {
                            removeValue("@startParams");
                            setIsStartOk(true);
                        } else {
                            const message = error && error.message ? error.message : error;
                            dispatch(errorOccured(error));
                            dispatch(setSnackbar({message: message, type: "danger"}));
                        }
                    }
                } else {
                    setIsStartOk(true);
                }
            } finally {
                setIsStartFetching(false);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                handleBackAction();
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", backAction);
            };
        }, []),
    );

    useFocusedInterval(() => {
        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_ONGOING));
        navigation.navigate("Map");
    }, INTERVAL_TIMEOUT);

    useFocusEffect(
        useCallback(() => {
            resendStartRequest();
        }, [])
    );

    return (
        <View style={tripEndStyles.frame}>
            <GoBackCross onClick={() => navigation.goBack()}/>
            <ScrollView>
                <View style={tripEndStyles.container}>
                    <View style={[tripEndStyles.textWrapper, tripEndStyles.iconWrapper, {marginTop: 60}]}>
                        <FeatherIcon name="lock" color={COLORS.yellow} size={30}/>
                        <TextAtom style={tripEndStyles.text}>
                            {t(`trip_process.end_trip.${translateKey}.disclaimerLock`)}
                        </TextAtom>
                    </View>
                    <View style={[tripEndStyles.textWrapper, tripEndStyles.iconWrapper]}>
                        <FeatherIcon name="map-pin" color={COLORS.yellow} size={30}/>
                        <TextAtom style={tripEndStyles.text}>
                            <TextAtom style={{fontWeight: "bold"}}>
                                {t(`trip_process.end_trip.${translateKey}.disclaimerPark.line_1`)}{"\n"}
                            </TextAtom>
                            <TextAtom style={{fontWeight: "bold"}}>
                                {t(`trip_process.end_trip.${translateKey}.disclaimerPark.line_2`)}{"\n"}
                            </TextAtom>
                            {t(`trip_process.end_trip.${translateKey}.disclaimerPark.line_3`)}{"\n"}
                            {t(`trip_process.end_trip.${translateKey}.disclaimerPark.line_4`)}{"\n"}
                            {t(`trip_process.end_trip.${translateKey}.disclaimerPark.line_5`)}
                        </TextAtom>
                    </View>
                    <TripPrice/>
                    <View style={[tripEndStyles.textWrapper, tripEndStyles.cbWrapper, {padding: 0, paddingLeft: 30}]}>
                        <ImageAtom
                            style={{height: 40, width: 40}}
                            source={card?.brand === "Visa" ? Visa : Master}
                        />
                        <TextAtom style={tripEndStyles.text}>
                            xxxx-xxxx-xxxx-{last4}
                        </TextAtom>
                    </View>

                    <View style={tripEndStyles.buttonContainer}>
                        <SubmitButton
                            inProgress={trip.isFetching}
                            disabled={trip.isFetching || isStartFetching || !isStartOk}
                            onClick={() => handleCloseTrip()}
                            value={t(`trip_process.end_trip.${translateKey}.pay`)}
                            actionLabel={"START_END_TRIP"}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default TripEndScreen;
