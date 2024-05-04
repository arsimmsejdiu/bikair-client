import {NoTrip} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {tripHistoryStyles} from "@styles/TripStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";

export const NoTripMolecule = () => {
    const {t} = useTranslation();

    return (
        <View style={tripHistoryStyles.noTrip}>
            <ImageAtom source={NoTrip} resizeMode={"contain"} style={{width: 150, height: 150}}/>
            <TextAtom style={{paddingVertical: 20, fontSize: 20, fontWeight: "700"}}>
                {t("trips.noTrip")}
            </TextAtom>
        </View>
    );
};
