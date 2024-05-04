import {Pin} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import {noOfferStyle} from "@styles/SubscriptionScreenStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";

export const NoOfferMolecule = () => {
    const {t} = useTranslation();

    return (
        <View style={noOfferStyle.wrapper}>
            <ImageAtom
                source={Pin}
                resizeMode="contain"
                style={noOfferStyle.image}
            />
            <TextAtom style={noOfferStyle.title}>
                {t("subscription_screen.im_sorry")}!
            </TextAtom>
            <TextAtom style={noOfferStyle.description}>
                {t("subscription_screen.sorry_message")}
            </TextAtom>
        </View>
    );
};
