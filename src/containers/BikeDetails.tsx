import {COLORS, FeatherIcon} from "@assets/index";
import {CancelButton, SecondaryButton} from "@components/Buttons";
import CountDown from "@components/CountDown";
import ErrorMessage from "@components/ErrorMessage";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {userBookBikeEvent, userUnbookBikeEvent} from "@redux/reducers/events";
import {cancelBooking, closeBooking, createBooking} from "@redux/reducers/markerDetails";
import {bikeDetailsStyles} from "@styles/ClusterStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {SafeAreaView, Text, TouchableOpacity, View, ViewProps} from "react-native";
import openMap from "react-native-open-maps";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type Props = ViewProps;

const BikeDetails: React.FC<Props> = (): React.ReactElement | null => {

    // Redux
    const markerDetails = useAppSelector(state => state.markerDetails);
    const auth = useAppSelector(state => state.auth);
    const currentTrip = useAppSelector(state => state.trip.currentTrip);
    const {current, bike, open, error} = markerDetails;
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();

    const handleClose = () => {
        dispatch(closeBooking());
    };

    const handleCancelBooking = () => {
        dispatch(cancelBooking());
    };

    const handleBooking = () => {
        if (bike) {
            dispatch(userBookBikeEvent());
            dispatch(createBooking(bike.name));
        }
    };

    const handleUnBooking = () => {
        dispatch(userUnbookBikeEvent());
        dispatch(cancelBooking());
    };

    if (!current && !bike || currentTrip || !open) {
        return null;
    }

    const handleColor = () => {
        if (!bike || !bike.capacity) return "transparent";
        if (!bike.capacity) return COLORS.lightGrey;

        if (bike.capacity > 25 && bike.capacity <= 35) {
            return COLORS.yellow;
        }
        if (bike.capacity > 15 && bike.capacity <= 25) {
            return COLORS.orange;
        }
        if (bike.capacity <= 15) {
            return COLORS.red;
        }
        if (bike.capacity > 35) {
            return COLORS.green;
        }
    };
    const goToMaps = () => {
        openMap({end: bike?.address ?? "", provider: "google", waypoints: []});
    };


    return (
        <SafeAreaView style={{
            flex: 1,
            position: "absolute",
            top: insets.top + 30,
        }}>
            <View style={bikeDetailsStyles.modalView}>
                <View style={bikeDetailsStyles.bikeWrap}>
                    <Text style={bikeDetailsStyles.title}>{current ? current.name : bike?.name}</Text>
                </View>
                <ErrorMessage message={error}/>
                {/*If no provider set, it will determine according to Platform.OS*/}
                <TouchableOpacity onPress={goToMaps} style={bikeDetailsStyles.addressWrap}>
                    <FeatherIcon
                        style={{marginRight: 5}}
                        name={"map-pin"}
                        size={20}
                        color={COLORS.darkGrey}
                    />
                    <Text style={bikeDetailsStyles.addressText}>{current ? current.address : bike?.address}</Text>
                </TouchableOpacity>
                <View style={bikeDetailsStyles.infoWrap}>
                    <FeatherIcon
                        style={{marginRight: 5}}
                        name={"battery"}
                        size={25}
                        color={handleColor()}
                    />
                    <Text
                        style={bikeDetailsStyles.text}>{t("booking.autonomy")}: {current?.capacity ?? bike?.capacity ?? 0} km</Text>
                </View>

                <CountDown
                    booking={current}
                    cancelBooking={handleCancelBooking}
                />
                {auth.isAuthenticated && current?.status !== "RENTAL" && (
                    <View style={bikeDetailsStyles.button}>
                        {
                            !current ?
                                <SecondaryButton
                                    onClick={handleBooking}
                                    inProgress={markerDetails.isFetching}
                                    value={t("booking.book")}
                                    actionLabel={"BOOK_BIKE"}
                                />
                                : <CancelButton
                                    onClick={handleUnBooking}
                                    inProgress={markerDetails.isFetching}
                                    value={t("booking.cancelbook")}
                                    actionLabel={"UNBOOK_BIKE"}
                                />
                        }
                    </View>
                )}
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                    }}
                    onPress={handleClose}>
                    <FeatherIcon
                        name={"x"}
                        size={30}
                        color={COLORS.darkGrey}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default BikeDetails;
