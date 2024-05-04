import {Rentals} from "@bikairproject/shared";
import {View} from "react-native";
import {promotionScreenStyles} from "@styles/PromotionScreenStyles";
import {TextAtom} from "@components/Atom";
import {COLORS} from "@assets/constant";
import React from "react";
import {useTranslation} from "react-i18next";

export const renderRental = (item: Rentals) => {
    const {t} = useTranslation();

    return (
        <View key={`rental${item.id}`} style={promotionScreenStyles.itemContainer}>
            <View style={promotionScreenStyles.header}>
                <TextAtom style={promotionScreenStyles.value}>
                    {new Intl.DateTimeFormat("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }).format(new Date(Number(item.start_time) + (15 * 60 * 1000)))}
                </TextAtom>
            </View>
            <View style={{marginLeft: 10, marginRight: 10}}>
                <TextAtom style={promotionScreenStyles.text}>
                    {t("discounts.item.rental.message")}
                </TextAtom>
            </View>
            <TextAtom style={{marginLeft: 10, color: COLORS.darkGrey, marginTop: 10}}>
                {t("discounts.item.rental.expired_at")}
                {new Intl.DateTimeFormat("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }).format(new Date(Number(item.end_time) - (15 * 60 * 1000)))}
                {"\n"}
                {t("discounts.item.rental.single")}
            </TextAtom>
        </View>
    );
};