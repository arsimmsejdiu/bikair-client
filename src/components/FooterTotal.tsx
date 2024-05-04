import {COLORS, FONTS, SIZES} from "@assets/index";
import {LinearGradientAtom} from "@components/Atom/LinearGradientAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import TextButton from "@components/Molecule/TextButton";
import {useAppSelector} from "@hooks/index";
import {ProductCart} from "@models/data/ProductCart";
import {footerTotalStyles} from "@styles/SubscriptionScreenStyles";
import {formatPriceWithLocale} from "@utils/helpers";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";

import {ComputedPrice} from "@bikairproject/shared";

interface FooterTotalProps {
    buttonText: string,
    onPress: () => void,
    disabled: boolean,
    cart?: ProductCart | null,
    loading: boolean,
    checked: boolean
}

const FooterTotal = ({buttonText, onPress, disabled, cart, loading, checked}: FooterTotalProps) => {
    const [total, setTotal] = useState<number>(0);
    const [toPay, setToPay] = useState<number>(0);
    const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
    const locale: string = useAppSelector(state => "fr" || state.auth.me?.locale);
    const [percent, setPercent] = useState<number>(0);
    const {t} = useTranslation();

    console.log(!cart?.recurring);

    useEffect(() => {
        let computedPrice: ComputedPrice | undefined;
        if (cart?.variation?.computedPrice) {
            computedPrice = cart.variation.computedPrice;
        } else if (cart?.computedPrice) {
            computedPrice = cart.computedPrice;
        }
        if (computedPrice) {
            console.log(computedPrice);
            setToPay(computedPrice.discounted_amount);
            setIsDiscounted(computedPrice.discounted_amount !== computedPrice.price);
            const reduction = computedPrice.price - computedPrice.discounted_amount;
            setPercent(Math.round(reduction / computedPrice.price * 100));
            setTotal(computedPrice.price);
        } else {
            setTotal(cart?.price ?? 2999);
            setToPay(cart?.price ?? 2999);
            setIsDiscounted(false);
        }
    }, [cart]);

    return (
        <View>
            <LinearGradientAtom
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                colors={[COLORS.transparent, COLORS.lightGray1]}
                style={footerTotalStyles.linearGradient}
            />

            <View style={footerTotalStyles.container}>
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <TextAtom style={{flex: 1, ...FONTS.h2}}>Total:</TextAtom>
                    <View style={footerTotalStyles.priceContainer}>
                        {isDiscounted ? (
                            <>
                                <View style={footerTotalStyles.discount}>
                                    <TextAtom style={{
                                        color: COLORS.white,
                                    }}>
                                        -{percent}%
                                    </TextAtom>
                                </View>
                                <TextAtom style={[footerTotalStyles.totalDiscounted,
                                    {textDecorationLine: isDiscounted ? "line-through" : "none"}
                                ]}>
                                    {formatPriceWithLocale(total)}
                                </TextAtom>
                            </>

                        ) : null}
                        <TextAtom style={footerTotalStyles.toPay}>
                            {formatPriceWithLocale(toPay, locale)}
                        </TextAtom>
                    </View>

                </View>
                {isDiscounted && cart?.recurring ? (
                    <TextAtom style={footerTotalStyles.total}>
                        {t("card_info.deposit.deposit6")}{t("card_info.deposit.deposit7")} {formatPriceWithLocale(total)}/{t("card_info.deposit.deposit8")}
                    </TextAtom>
                ) : null}
                <TextButton
                    disabled={disabled}
                    inProgress={loading}
                    buttonContainerStyle={{
                        height: 60,
                        marginTop: SIZES.padding,
                        borderRadius: SIZES.padding,
                        backgroundColor: checked ? COLORS.lightBlue : COLORS.gray,
                    }}
                    label={buttonText}
                    onPress={onPress}
                    actionLabel={checked ? "CHECKOUT_VALIDATION" : "CHECKOUT_HIGHLIGHT_CHECK"}
                />
            </View>
        </View>
    );
};

export default FooterTotal;
