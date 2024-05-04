import {AppCamera} from "@components/AppCamera/AppCamera";
import Header from "@components/Header";
import Loader from "@components/Loader";
import {useAppDispatch, useAppSelector, useFocusedInterval} from "@hooks/index";
import {EndPhotoData} from "@models/data/EndPhotoData";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {DrawerHeaderProps} from "@react-navigation/drawer";
import {useFocusEffect} from "@react-navigation/native";
import {StackHeaderProps} from "@react-navigation/stack";
import {tripStepEndPhotoEvent, userClickTakePhotoEvent} from "@redux/reducers/events";
import {setTripState} from "@redux/reducers/trip";
import {storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_TRIP_CURRENT} from "@services/endPoint";
import {HomeStackScreenProps} from "@stacks/types";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {StyleSheet, View, ViewProps} from "react-native";
import {PhotoFile} from "react-native-vision-camera";

import {GetTripCurrentOutput} from "@bikairproject/shared";

const INTERVAL_TIMEOUT = 50000;

interface Props extends ViewProps, HomeStackScreenProps<"Photo"> {
}

const BikePhotoScreen: React.FC<Props> = React.memo(({navigation}): React.ReactElement => {

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const tripLat = useAppSelector(state => state.trip.lat);
    const tripLng = useAppSelector(state => state.trip.lng);
    const {t} = useTranslation();

    const handleMediaCaptured = async (photo: PhotoFile | null) => {
        setLoading(true);
        dispatch(userClickTakePhotoEvent());
        if (photo !== null) {
            const currentTrip = await instanceApi.get<GetTripCurrentOutput>(GET_TRIP_CURRENT);
            const fileData: EndPhotoData = {
                path: "file://" + photo?.path ?? "",
                uri: photo?.path ?? "",
                type: "image/jpg",
                trip: currentTrip.data.uuid,
                bike: currentTrip.data.bike_name,
                lat: tripLat ?? undefined,
                lng: tripLng ?? undefined,
            };
            await storeData("@fileEndPhoto", JSON.stringify(fileData));
        }

        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_END_CHECK));
        setLoading(false);
        navigation.navigate("TripSteps");
    };

    const handleBackAction = () => {
        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_ONGOING));
        navigation.navigate("Map");
    };

    useFocusedInterval(() => {
        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_ONGOING));
        navigation.navigate("Map");
    }, INTERVAL_TIMEOUT);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: (props: DrawerHeaderProps | StackHeaderProps) => (
                <Header {...props} backAction={handleBackAction} title={t("headers.photo")}/>
            ),
        });
    });

    useEffect(() => {
        dispatch(tripStepEndPhotoEvent());
    }, []);

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "BikePhotoScreen").then(() => console.log(""));
    }, []));

    return (
        <View style={StyleSheet.absoluteFill}>
            <AppCamera
                type={"label"}
                captureEnabled={!loading}
                onMediaCaptured={handleMediaCaptured}
                onBackAction={handleBackAction}
            />
            {loading ? <Loader color="#ffffff" style={bikePhotoStyles.loading} size="large"/> : null}
        </View>
    );

});

export default BikePhotoScreen;
