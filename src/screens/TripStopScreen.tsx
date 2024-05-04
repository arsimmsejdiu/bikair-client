import {COLORS, FeatherIcon, PauseTime} from "@assets/index";
import {FadeInView} from "@components/Animations/FadeInView";
import {ImageAtom, LineDivider,TextAtom} from "@components/Atom";
import GoBackCross from "@components/GoBackCross";
import {useAppDispatch, useAppSelector, useBluetooth, useFocusedInterval} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {userEndTripClickEvent, userPauseClickEvent} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {setTripState, setUserPosition} from "@redux/reducers/trip";
import {instanceApi} from "@services/axiosInterceptor";
import {INTERVAL_TIMEOUT} from "@services/constants";
import {POST_CITY_CHECK_ZONES} from "@services/endPoint";
import {getUserLocation} from "@services/positionServices";
import {HomeStackScreenProps} from "@stacks/types";
import {tripStopStyles} from "@styles/TripStyles";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {ActivityIndicator, BackHandler, ScrollView, StatusBar, TouchableOpacity, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface Props extends ViewProps, HomeStackScreenProps<"TripStop"> {
}

const TripStopScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();
    const [checkingZone, setCheckingZone] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();
    const rentalTime = useAppSelector(state => state?.auth?.me?.rental_end_time);
    const [translateKey, setTranslateKey] = useState<string>("default");
    const {lockStatus} = useBluetooth();
    const insets = useSafeAreaInsets();

    const isInsideZone = async () => {
        setCheckingZone(true);
        // Get user currentLocation
        const coords = await getUserLocation();
        if (coords) {
            dispatch(setUserPosition({lat: coords.latitude, lng: coords.longitude}));
            // Ensure you end the trip inside an authorize geofence zone
            const body = {lat: coords.latitude, lng: coords.longitude};
            try {
                await instanceApi.post(POST_CITY_CHECK_ZONES, body);
                navigation.navigate("Home", {
                    screen: "TripEnd"
                });
            } catch (error) {
                console.log("Error while checking parking zone");
                dispatch(setSnackbar({type: "danger", message: t("trip_process.trip_end_check.error_zone")}));
            } finally {
                setCheckingZone(false);
            }
        } else {
            setCheckingZone(false);
            throw new Error("Can't get user position");
        }
    };

    const handlePauseTripClick = async () => {
        dispatch(userPauseClickEvent());
        navigation.navigate("Home", {
            screen: "TripPause"
        });
    };

    const handleEndTripClick = async () => {
        dispatch(userEndTripClickEvent());
        await isInsideZone();
    };


    useFocusEffect(
        useCallback(() => {
            let newTranslateKey = "default";
            if (rentalTime) {
                newTranslateKey = Date.now() < Number(rentalTime) ? "rental" : "default";
            }
            setTranslateKey(newTranslateKey);
        }, [rentalTime])
    );

    useFocusedInterval(() => {
        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_ONGOING));
        navigation.navigate("Map");
    }, INTERVAL_TIMEOUT);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "TripStopScreen").then(r => console.log(r));
    }, []));

    const handleBackAction = () => {
        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_ONGOING));
        navigation.navigate("Map");

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

    function renderButtons() {
        return (
            <View style={tripStopStyles.frame}>
                <GoBackCross onClick={() => navigation.goBack()}/>
                <ScrollView>
                    <View style={{
                        ...tripStopStyles.container,
                        paddingTop: tripStopStyles.container.paddingHorizontal + insets.top,
                        paddingBottom: tripStopStyles.container.paddingHorizontal + insets.bottom
                    }}>
                        <FadeInView>
                            <ImageAtom
                                style={tripStopStyles.image}
                                resizeMode="contain"
                                source={PauseTime}
                            />
                        </FadeInView>
                        <View style={{width: "100%"}}>
                            <TextAtom style={tripStopStyles.message}>
                                {t(`trip_process.trip_stop.${translateKey}.pause_text`)}
                            </TextAtom>
                            <TouchableOpacity
                                style={[tripStopStyles.buttonWrapper, tripStopStyles.buttonYellow]}
                                onPress={handlePauseTripClick}
                            >
                                <TextAtom style={tripStopStyles.textBtn}>
                                    {t(`trip_process.trip_stop.${translateKey}.${lockStatus?.includes("closed") ? "pause_end" : "pause_button"}`)}
                                </TextAtom>
                                <FeatherIcon
                                    name={"pause"}
                                    size={25}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                            <LineDivider lineStyle={{
                                backgroundColor: COLORS.gray3,
                                marginTop: 20
                            }}
                            />
                            <TextAtom style={tripStopStyles.message}>
                                {t(`trip_process.trip_stop.${translateKey}.end_text`)}
                            </TextAtom>
                            <TouchableOpacity
                                style={[tripStopStyles.buttonWrapper, tripStopStyles.buttonLightBlue]}
                                onPress={handleEndTripClick}
                                disabled={checkingZone}>
                                {
                                    checkingZone ?
                                        <ActivityIndicator
                                            size="small"
                                            color={COLORS.white}/>
                                        :
                                        <>
                                            <TextAtom style={tripStopStyles.textBtn}>
                                                {t(`trip_process.trip_stop.${translateKey}.end_button`)}
                                            </TextAtom>
                                            <FeatherIcon
                                                name={"lock"}
                                                size={25}
                                                color={COLORS.white}
                                            />
                                        </>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return <View
        style={tripStopStyles.wrapper}>
        <StatusBar backgroundColor={COLORS.white}/>
        {renderButtons()}
    </View>;
};

export default TripStopScreen;
