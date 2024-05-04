import {COLORS} from "@assets/constant";
import {Chip, LogoFullWhite, Master, Visa} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {LinearGradientAtom} from "@components/Atom/LinearGradientAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {CardBrandMolecule} from "@components/Molecule/CardBrandMolecule";
import {useAppSelector} from "@hooks/useAppSelector";
import {cardCreditStyles, linearGradientColors} from "@styles/PaymentScreenStyles";
import {shortenTexts} from "@utils/shortenTexts";
import React from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";

export const CardCredit = () => {
    const {t} = useTranslation();
    const user = useAppSelector(state => state.auth.me);
    const paymentMethod = useAppSelector(state => state.paymentMethod);
    const {card} = paymentMethod;

    return (
        <LinearGradientAtom
            colors={linearGradientColors}
            style={cardCreditStyles.linearGradient}
        >
            <View style={cardCreditStyles.container}>
                <ImageAtom
                    source={LogoFullWhite}
                    style={{width: 50, height: 50}}
                    alt={"White Bik'air logo"}
                    resizeMode={"contain"}
                />
                <View>
                    {card && card.last_4 ? (card?.brand === "Visa" ? (
                        <CardBrandMolecule
                            container={cardCreditStyles.brandContainer}
                            source={Visa}
                            alt={"White Bik'air logo"}
                            resizeMode={"contain"}
                            imageStyle={{width: 40, height: 40}}
                            textStyle={cardCreditStyles.text}
                            children={"Visa"}
                        />
                    ) : (
                        <CardBrandMolecule
                            container={cardCreditStyles.brandContainer}
                            source={Master}
                            alt={"White Bik'air logo"}
                            resizeMode={"contain"}
                            imageStyle={{width: 40, height: 40}}
                            textStyle={cardCreditStyles.text}
                            children={"Master"}
                        />
                    )) : null}
                </View>
            </View>
            <View>
                {card && card.last_4 ?
                    <View style={cardCreditStyles.last4Container}>
                        <View>
                            <TextAtom style={cardCreditStyles.lat4Text}>
                                XXXX-XXXX-XXXX-{card.last_4}
                            </TextAtom>
                            <TextAtom style={cardCreditStyles.paymentExpired}>
                                {t("payment.expires")} {card?.exp_month < 10 ? "0" + card?.exp_month : card?.exp_month}/{shortenTexts(card?.exp_year)}
                            </TextAtom>
                        </View>
                        <ImageAtom
                            source={Chip}
                            style={{width: 50, height: 50, tintColor: COLORS.white}}
                            alt={"White Bik'air logo"}
                            resizeMode={"contain"}
                        />
                    </View>
                    : (
                        <TextAtom style={cardCreditStyles.addCartText}>
                            {t("payment.add_cart")}
                        </TextAtom>
                    )
                }
                {card && card.last_4 ? (
                    <TextAtom style={cardCreditStyles.firstAndLastName}>
                        {user?.firstname}{" "}{user?.lastname}
                    </TextAtom>
                ) : null}
            </View>
        </LinearGradientAtom>
    );
};

