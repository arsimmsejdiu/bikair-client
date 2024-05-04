import {COLORS, FeatherIcon} from "@assets/index";
import ErrorMessage from "@components/ErrorMessage";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {closeBooking} from "@redux/reducers/markerDetails";
import {spotDetailsStyles} from "@styles/ClusterStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {SafeAreaView, Text, TouchableOpacity, View, ViewProps} from "react-native";
import openMap from "react-native-open-maps";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Svg, {Path} from "react-native-svg";

type Props = ViewProps;

const SpotDetails: React.FC<Props> = (): React.ReactElement | null => {
    // Redux
    const markerDetails = useAppSelector(state => state.markerDetails);
    const functionalities = useAppSelector(state => state.auth.functionalities);
    const functionalitiesList = functionalities?.functionalities ?? [];
    const {spot, open, error} = markerDetails;
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const {t} = useTranslation();
    const trip = useAppSelector(state => state.trip);
    const tripState = trip.tripState;

    const handleClose = () => {
        dispatch(closeBooking());
    };

    if (!spot) {
        return null;
    }

    if (!open) {
        return null;
    }
    const goToMaps = () => {
        openMap({end: spot?.address ?? "", provider: "google", waypoints: [""]});
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            position: "absolute",
            top: tripState === TRIP_STEPS.TRIP_STEP_ONGOING ? 150 + insets.top : 30 + insets.top,
        }}>
            <View style={spotDetailsStyles.modalView}>
                <View style={spotDetailsStyles.bikeWrap}>
                    <Svg width={50} height={50} viewBox="0 0 16 16">
                        <Path
                            fill={COLORS.white}
                            d="M 3 3 L 13 3 L 13 13 L 3 13 L 3 3"
                        />
                        <Path
                            fill={COLORS.lightBlue}
                            d="M8.27 8.074c.893 0 1.419-.545 1.419-1.488s-.526-1.482-1.42-1.482H6.778v2.97H8.27Z"
                        />
                        <Path
                            fill={COLORS.lightBlue}
                            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.5 4.002h2.962C10.045 4.002 11 5.104 11 6.586c0 1.494-.967 2.578-2.55 2.578H6.784V12H5.5V4.002Z"
                        />
                    </Svg>
                    <View style={spotDetailsStyles.spotNameContainer}>
                        <Text style={{flexWrap: "wrap", fontSize: 16, fontWeight: "700"}}>{spot.name}</Text>
                    </View>

                </View>

                <ErrorMessage message={error}/>
                {/*If no provider set, it will determine according to Platform.OS*/}
                <TouchableOpacity onPress={goToMaps} style={spotDetailsStyles.addressWrap}>
                    <FeatherIcon
                        style={{marginRight: 5}}
                        name={"map-pin"}
                        size={20}
                        color={COLORS.lightBlue}
                    />
                    <Text style={spotDetailsStyles.addressText}>{spot?.address}</Text>
                </TouchableOpacity>
                <View style={spotDetailsStyles.descriptionWrap}>
                    <Text style={spotDetailsStyles.descriptionText}>{t("spot.description")}</Text>
                    {
                        functionalitiesList.includes("SPOT_PARKING_PROMO") ?
                            <Text style={spotDetailsStyles.descriptionText}>{t("spot.discount_info")}</Text>
                            :
                            null
                    }
                </View>
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
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

export default SpotDetails;
