import {Close, COLORS, SIZES} from "@assets/index";
import {ImageAtom, ScrollViewAtom, TextAtom} from "@components/Atom";
import TextButton from "@components/Molecule/TextButton";
import SplashScreen from "@containers/SplashScreen";
import {useAppDispatch, useAppSelector, useBluetooth} from "@hooks/index";
import { PROCESS } from "@models/enums/process";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {firebase} from "@react-native-firebase/analytics";
import {useFocusEffect} from "@react-navigation/native";
import { setName, setTags } from "@redux/reducers/bike";
import { setProcess } from "@redux/reducers/process";
import { setSnackbar } from "@redux/reducers/snackbar";
import {setBikeName, setTimeStart, setTripReduction, setTripState} from "@redux/reducers/trip";
import {loadData, storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import { getBikeStatus } from "@services/bikeService";
import {GET_TRIP_CURRENT} from "@services/endPoint";
import {getTripReduction} from "@services/tripService";
import {HomeStackScreenProps} from "@stacks/types";
import {rgpdScreenStyles} from "@styles/AcceptCookiesStyle";
import React, {memo, useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {StatusBar, TouchableOpacity, View, ViewProps} from "react-native";
import {Settings} from "react-native-fbsdk-next";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {GetTripCurrentOutput} from "@bikairproject/shared";

type Props = ViewProps & HomeStackScreenProps<"Cookies">

const RGPDScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const {updateBleInfo} = useBluetooth();

    const [showRGPDScreen, setShowRGPDScreen] = useState(false);
    const dispatch = useAppDispatch();
    const tripState = useAppSelector(state => state.trip.tripState);

    const handleBackAction = () => navigation.navigate("Map");

    const updateBikeAndState = async (data: any) => {
        dispatch(setTimeStart(data.time_start));
        updateBleInfo({
            lockName: data.lock_name ?? null,
            bikeId: data.bike_id ?? null
        });
        dispatch(setName(data.bike_name));
        dispatch(setBikeName(data.bike_name));
        const bikeStatus: any = await getBikeStatus(data?.bike_name);
        dispatch(setTags(bikeStatus.tags));
        const tripReduction = await getTripReduction();
        dispatch(setTripReduction(tripReduction));
        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_ONGOING));
    };

    const checkCurrentTrip = async () => {
        dispatch(setProcess(PROCESS.FETCH_CURRENT_TRIP));
        const unpaidTripString = await loadData("@unpaidTrip");
        if (typeof unpaidTripString !== "undefined" && unpaidTripString !== null) {
            dispatch(setTripState(TRIP_STEPS.TRIP_STEP_END));
            dispatch(setProcess(null));
            return "UNPAID_TRIP";
        }else{
            try {
                const {data} = await instanceApi.get<GetTripCurrentOutput>(GET_TRIP_CURRENT);
                if (data?.time_start && data?.bike_name) {
                    await updateBikeAndState(data);
                    return "CURRENT_TRIP";
                }else{
                    dispatch(setTripState(null));
                    return null;
                }
            } catch (error: any) {
                console.log("Error getting trip current", error);
                if (tripState === TRIP_STEPS.TRIP_STEP_ONGOING) {
                    dispatch(setSnackbar({type: "danger", message: t(error.message)}));
                } else {
                    dispatch(setTripState(null));
                }
                return null;
            }finally{
                dispatch(setProcess(null));
            }
        }
    };

    const handleCookieSettings = async (analytics: boolean, adsTrack: boolean) => {
        await Settings.setAdvertiserTrackingEnabled(adsTrack);
        await firebase.analytics().setAnalyticsCollectionEnabled(analytics);
        await storeData("@RGPD", "true");
        handleBackAction();
    };

    useFocusEffect(useCallback(() => {
        checkCurrentTrip().then((response: string|null) => {
            if (response === "CURRENT_TRIP") {
                console.log("RGPDScreen - we have a current trip, skipping directly to Map");
                navigation.navigate("Map");
            }else if(response === "UNPAID_TRIP"){
                navigation.navigate("Home", {
                    screen: "TripSteps"
                });
            } else {
                loadData("@RGPD").then(data => {
                    const notSeenBool = typeof data === "undefined" || data === null;
                    console.log("RGPDScreen - notSeenBool = ", notSeenBool);
                    if (!notSeenBool) {
                        console.log("RGPDScreen - RGPD is already seen, going to news page");
                        navigation.navigate("Map");
                    } else {
                        setShowRGPDScreen(true);
                    }
                });
            }
        });
    }, []));

    if (!showRGPDScreen) {
        return <SplashScreen/>;
    }

    return (
        <View style={rgpdScreenStyles.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            <TouchableOpacity
                onPress={() => handleBackAction()}
                style={{...rgpdScreenStyles.imageCross, top: rgpdScreenStyles.imageCross.top + insets.top}}>
                <ImageAtom source={Close} style={rgpdScreenStyles.image} resizeMode={"cover"}/>
            </TouchableOpacity>
            <ScrollViewAtom
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: SIZES.padding}}
            >
                <View style={rgpdScreenStyles.contentContainer}>
                    <View style={rgpdScreenStyles.line}/>
                    <TextAtom style={rgpdScreenStyles.title}>
                        {t("cookies.title")}
                    </TextAtom>
                    <TextAtom style={rgpdScreenStyles.paragraph}>
                        {t("cookies.description")}
                    </TextAtom>
                </View>
                <TextButton
                    label={t("cookies.accept_cookies") ?? "ACCEPT ALL COOKIES"}
                    actionLabel={"ACCEPT_COOKIES"}
                    labelStyle={{fontSize: 14}}
                    buttonContainerStyle={rgpdScreenStyles.buttonAccept}
                    onPress={() => handleCookieSettings(true, true)}
                />
                <TextButton
                    label={t("cookies.title") ?? "USE OF COOKIES"}
                    actionLabel={"COOKIES_DETAILS"}
                    labelStyle={{color: COLORS.black, fontSize: 14}}
                    buttonContainerStyle={rgpdScreenStyles.buttonUseCookies}
                    onPress={() => {
                        navigation.navigate("CustomizeCookies");
                    }}
                />
                <TouchableOpacity
                    style={rgpdScreenStyles.continueWOAcceptingContainer}
                    onPress={() => handleCookieSettings(false, false)}
                >
                    <TextAtom style={rgpdScreenStyles.continueWOAccepting}>
                        {t("cookies.continue_without_accepting")}
                    </TextAtom>
                </TouchableOpacity>
            </ScrollViewAtom>
        </View>
    );
};

export default memo(RGPDScreen);
