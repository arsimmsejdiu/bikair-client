import {AppCamera} from "@components/AppCamera/AppCamera";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {EndPhotoData} from "@models/data/EndPhotoData";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {onTripStepEvent, userClickBackInManualLockEvent, userClickTakeLockPhotoEvent,} from "@redux/reducers/events";
import {storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_TRIP_CURRENT} from "@services/endPoint";
import React, {memo, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ActivityIndicator, StyleSheet, View, ViewProps} from "react-native";
import {PhotoFile} from "react-native-vision-camera";

import {GetTripCurrentOutput} from "@bikairproject/shared";

interface Props extends ViewProps {
    onStateChange: (state: TRIP_STEPS | null) => void
}

const ManualLockPhotoStep: React.FC<Props> = ({onStateChange}): React.ReactElement | null => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const tripLat = useAppSelector(state => state.trip.lat);
    const tripLng = useAppSelector(state => state.trip.lng);

    const handleMediaCaptured = async (photo: PhotoFile | null) => {
        setLoading(true);
        dispatch(userClickTakeLockPhotoEvent());
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
            await storeData("@fileLockPhoto", JSON.stringify(fileData));
        }

        onStateChange(TRIP_STEPS.TRIP_STEP_END_VALIDATE);
        setLoading(false);
    };

    const handleBackAction = () => {
        dispatch(userClickBackInManualLockEvent());
        onStateChange(TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_BLACK_TUTORIAL);
    };

    useEffect(() => {
        dispatch(onTripStepEvent(TRIP_STEPS.TRIP_STEP_MANUAL_LOCK_PHOTO));
    }, []);

    return (
        <View style={StyleSheet.absoluteFill}>
            <AppCamera
                type={"label"}
                captureEnabled={!loading}
                onBackAction={handleBackAction}
                onMediaCaptured={handleMediaCaptured}
            />
            {loading ? <ActivityIndicator color="#ffffff" style={styles.loading} size="large"/> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
});

export const StepManualLockPhoto = memo(ManualLockPhotoStep);
