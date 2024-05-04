import {Bank} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {cardInfoDepositStyles} from "@styles/PaymentScreenStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";

const CardInfoDeposit = () => {
    const {t} = useTranslation();

    return (
        <View style={cardInfoDepositStyles.container}>
            <View style={cardInfoDepositStyles.imageContainer}>
                <ImageAtom source={Bank} style={cardInfoDepositStyles.image}/>
            </View>
            <TextAtom style={cardInfoDepositStyles.text}>
                {t("card_info.deposit.deposit1")}
                <TextAtom style={{fontWeight: "bold", textDecorationLine: "underline"}}>
                    {t("card_info.deposit.deposit2")}
                </TextAtom>
                {t("card_info.deposit.deposit3")}
            </TextAtom>
            <TextAtom style={cardInfoDepositStyles.text1}>
                {t("card_info.deposit.deposit4")}
            </TextAtom>
        </View>
    );
};

export default CardInfoDeposit;
