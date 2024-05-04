import {COLORS, STATUS_COLORS} from "@assets/constant";
import {TextAtom} from "@components/Atom";
import {renderAddress} from "@components/Molecule/RenderAddress";
import {renderDiscountCode} from "@components/Molecule/RenderDiscountCode";
import {tripHistoryStyles} from "@styles/TripStyles";
import {formatPriceWithLocale, toStringDate} from "@utils/helpers";
import React from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";

interface RenderTripsHistoryProps {
    item: any
}

export const RenderTripsHistory = ({item}: RenderTripsHistoryProps) => {
    const {t} = useTranslation();
    const price = item.price ? Number(item.price) : 0;
    const toPay = item.discounted_amount ? item.price - Number(item.discounted_amount) : price;
    const color: string = STATUS_COLORS[item.status as keyof typeof STATUS_COLORS];

    const renderSubscriptionPassDate = (dates: number) => {
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        }).format(dates);

        return `${formattedDate}`;
    };

    return (
        <View style={tripHistoryStyles.itemContainer}>
            <View style={tripHistoryStyles.header}>
                <TextAtom style={tripHistoryStyles.date}>
                    {toStringDate(item.created_at)}
                </TextAtom>
                {item.discounted_amount ?
                    <TextAtom style={tripHistoryStyles.priceCross}>
                        {formatPriceWithLocale(price)}
                    </TextAtom> : null}
                <TextAtom
                    style={[tripHistoryStyles.price, {textDecorationLine: item.duration > 2 ? "none" : "line-through"}]}>
                    {formatPriceWithLocale(toPay)}
                </TextAtom>
            </View>
            {renderAddress(item.start_address)}
            {renderAddress(item.end_address)}
            <View style={{flex: 1, flexDirection: "row", marginTop: 5}}>
                <TextAtom style={{color: item.duration < 2 || item.status === "CANCEL" ? COLORS.red : color}}>
                    {item.duration < 2 || item.status === "CANCEL" ? t("trips.status.CANCEL") : t(`trips.status.${item.status}`)}
                </TextAtom>
                <TextAtom>
                    &nbsp;|&nbsp;{t("trips.duration")} {item.duration} {t("trips.minutes")}
                </TextAtom>
            </View>
            <TextAtom style={tripHistoryStyles.text}>
                {t("trips.start")}: {renderSubscriptionPassDate(item.time_start)} |
                &nbsp;{t("trips.end")}: {renderSubscriptionPassDate(item.time_end)}
            </TextAtom>
            <TextAtom style={tripHistoryStyles.text}>
                Ref: {item.reference}
            </TextAtom>
            <TextAtom style={tripHistoryStyles.text}>
                Bike: {item.bike_name}
            </TextAtom>
            {item.last_4 ?
                <TextAtom style={tripHistoryStyles.text}>
                    {t("card")}: ****-****-****-{item.last_4}
                </TextAtom> : null}
            {renderDiscountCode(item.type, item.value, item.code)}
            {item.refund_amount > 0 ? (
                <TextAtom style={tripHistoryStyles.text}>
                    {t("trips.refund")}: {formatPriceWithLocale(item.refund_amount)}
                </TextAtom>
            ) : null}
        </View>
    );
};
