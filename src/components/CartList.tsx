import {Clock, COLORS, FONTS, SIZES} from "@assets/index";
import {TextAtom} from "@components/Atom/TextAtom";
import {ProductCart} from "@models/data/ProductCart";
import {cartListStyles} from "@styles/GeneralStyles";
import {formatPriceWithLocale} from "@utils/helpers";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";

import CartLogo from "./Molecule/CartLogo";
import IconLabel from "./Molecule/IconLabel";
import {ComputedPrice} from "@bikairproject/shared";

interface Props extends ViewProps {
    cart: ProductCart | null
    cartHeight?: number
}

const CartList: React.FC<Props> = ({cart, children, cartHeight}): React.ReactElement | null => {
    const [description, setDescription] = useState<any>({});
    const [toPay, setToPay] = useState<number>(0);
    const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
    const [locale, setLocale] = useState("fr");
    const [percent, setPercent] = useState<number>(0);
    const {i18n} = useTranslation();

    useEffect(() => {
        const newLocale = i18n.language === "fr" ? "fr" : "en";
        setLocale(newLocale);
    }, [i18n.language]);

    useEffect(() => {
        if (cart) {
            let computedPrice: ComputedPrice | undefined;
            if (cart.variation) {
                if (cart.variation.computedPrice) {
                    computedPrice = cart.variation.computedPrice;
                }
                if (cart.variation.description && cart.variation.description[locale]) {
                    setDescription(cart.variation.description[locale]);
                }
            } else {
                if (cart.computedPrice) {
                    computedPrice = cart.computedPrice;
                }
                if (cart.description && cart.description[locale]) {
                    setDescription(cart.description[locale]);
                }
            }
            if (computedPrice) {
                setToPay(computedPrice.discounted_amount);
                setIsDiscounted(computedPrice.discounted_amount !== computedPrice.price);
                const reduction = computedPrice.price - computedPrice.discounted_amount;
                setPercent(Math.round(reduction / computedPrice.price * 100));
            } else {
                setToPay(cart.variation?.price ?? cart.price);
                setIsDiscounted(false);
            }
        }
    }, [cart, locale]);

    return (
        <View style={{
            flexDirection: "row",
            marginTop: cartHeight ?? SIZES.base,
            paddingHorizontal: SIZES.padding,
        }}>
            <View style={cartListStyles.cartItemContainer}>
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <CartLogo active={!cart?.recurring}/>
                    <View
                        style={{
                            flex: 1,
                            marginLeft: SIZES.radius,
                            flexDirection: "row"
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "space-between"
                            }}
                        >
                            <TextAtom style={{color: COLORS.darkBlue, marginTop: 10, ...FONTS.body3}}>
                                {description.name}
                            </TextAtom>
                            <TextAtom style={{color: COLORS.gray, ...FONTS.body5}}>
                                {description.title}
                            </TextAtom>
                        </View>
                        <View style={[cartListStyles.price, {
                            position: "absolute",
                            top: -(SIZES.radius + 20),
                            right: -SIZES.radius
                        }]}>
                            {isDiscounted ? (
                                <>
                                    <View style={cartListStyles.discount}>
                                        <TextAtom style={{
                                            color: COLORS.white,
                                            fontSize: 10
                                        }}>-{percent}%</TextAtom>
                                    </View>
                                    <TextAtom style={{
                                        color: COLORS.white,
                                        textDecorationLine: "line-through",
                                        paddingHorizontal: 5,
                                        textDecorationStyle: "solid",
                                        ...FONTS.body5
                                    }}>
                                        {formatPriceWithLocale(cart?.price ?? 2999, locale)}
                                    </TextAtom>
                                </>
                            ) : null}

                            <TextAtom style={{
                                color: COLORS.white,
                                paddingHorizontal: 5,
                                textDecorationStyle: "solid",
                                ...FONTS.h4
                            }}>
                                {formatPriceWithLocale(toPay, locale)}
                            </TextAtom>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: SIZES.padding
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-evenly",
                            width: "100%"
                        }}
                    >
                        {description.frequency ? (
                            <View style={[cartListStyles.IconLabel, {backgroundColor: COLORS.yellow}]}>
                                <TextAtom
                                    numberOfLines={1}
                                    adjustsFontSizeToFit={true}
                                    style={{
                                        color: COLORS.white,
                                        ...FONTS.h5,
                                    }}
                                >
                                    {description.frequency}
                                </TextAtom>
                            </View>
                        ) : null}
                        {description.expire ? (
                            <IconLabel
                                containerStyle={{
                                    marginLeft: SIZES.xl,
                                    paddingHorizontal: 0,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                icon={Clock}
                                iconStyle={{
                                    tintColor: COLORS.darkBlue
                                }}
                                labelStyle={{
                                    ...FONTS.h5
                                }}
                                label={description.expire}
                            />
                        ) : null}
                    </View>
                </View>
                {children}
            </View>
        </View>
    );
};

export default CartList;


