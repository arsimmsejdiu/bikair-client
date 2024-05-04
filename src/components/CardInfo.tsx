import {Coin} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {cardInfoStyles} from "@styles/PaymentScreenStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";

const CardInfo = () => {
    const {t} = useTranslation();

    return (
        <View style={cardInfoStyles.container}>
            <View style={cardInfoStyles.cardInfoContainer}>
                <View style={cardInfoStyles.imageCardInfoContainer}>
                    <ImageAtom source={Coin} style={cardInfoStyles.imageCardInfo}/>
                </View>
                <TextAtom style={cardInfoStyles.textCardInfoContainer}>
                    {t("card_info.price.price1")}{" "}
                    <TextAtom style={cardInfoStyles.innerTextCardInfo}>
                        {t("card_info.price.price2")}
                    </TextAtom>
                    {" "}{t("card_info.price.price3")}.
                </TextAtom>
            </View>
        </View>
    );
};

export default CardInfo;
