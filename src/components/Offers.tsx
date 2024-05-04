import {Clock, COLORS, FONTS, SIZES} from "@assets/index";
import {TextAtom} from "@components/Atom/TextAtom";
import IconLabel from "@components/Molecule/IconLabel";
import TextButton from "@components/Molecule/TextButton";
import VariantItem from "@components/VariantItem";
import {ProductCart} from "@models/data/ProductCart";
import {subscriptionScreenStyles} from "@styles/SubscriptionScreenStyles";
import {formatPriceWithLocale} from "@utils/helpers";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";

import {ProductDetail} from "@bikairproject/shared";
import {ProductVariationsOutputData} from "@bikairproject/shared/dist/dto/ProductDetail";

interface OfferProps extends ViewProps {
    item: ProductDetail
    onPress: (selection: ProductCart) => void
    selectedTab: string
}

const Offers: React.FC<OfferProps> = ({item, onPress, selectedTab}): React.ReactElement | null => {
    const {t} = useTranslation();
    const [toPay, setToPay] = useState<number>(0);
    const [selectedVariation, setSelectedVariation] = React.useState<ProductVariationsOutputData | null>(null);
    const [percent, setPercent] = useState<number>(0);
    const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [frequency, setFrequency] = useState<string>("");
    const [obligation, setObligation] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const {i18n} = useTranslation();
    const [locale, setLocale] = useState("fr");

    useEffect(() => {
        const newLocale = i18n.language === "fr" ? "fr" : "en";
        setLocale(newLocale);
    }, [i18n.language]);

    useEffect(() => {
        let description;
        let computedPrice;
        if (selectedVariation) {
            description = selectedVariation.description[locale];
            computedPrice = selectedVariation.computedPrice;
        } else {
            description = item.description[locale];
            computedPrice = item.computedPrice;
        }

        if (computedPrice) {
            setToPay(computedPrice.discounted_amount);
            setIsDiscounted(computedPrice.discounted_amount !== computedPrice.price);
            const reduction = computedPrice.price - computedPrice.discounted_amount;
            setPercent(Math.round(reduction / computedPrice.price * 100));
        } else {
            setToPay(Number(description?.price ?? "2999"));
            setIsDiscounted(false);
        }

        setName(description?.name ?? "");
        setFrequency(description?.frequency ?? "");
        setDuration(description?.expire ?? "");
        setDescription(description?.description ?? "");
        setObligation(description?.obligation ?? "");
        setPrice(Number(description?.price ?? "2999"));
        setTitle(description?.title ?? "");
    }, [item, locale, selectedVariation]);

    const handleChange = (variation: ProductVariationsOutputData) => {
        setSelectedVariation(variation);
    };

    return (
        <View style={subscriptionScreenStyles.container}>
            <View style={{flexDirection: "row"}}>
                <View style={subscriptionScreenStyles.headerContainer}>
                    <View style={subscriptionScreenStyles.headerPosition}>
                        <TextAtom style={{color: COLORS.darkBlue, ...FONTS.h3}}>
                            {name}
                        </TextAtom>
                        {!obligation ? null : (
                            <TextAtom style={{color: COLORS.yellow, ...FONTS.body5}}>
                                {obligation}
                            </TextAtom>
                        )}
                        <TextAtom style={{color: COLORS.gray, ...FONTS.body5}}>
                            {title}
                        </TextAtom>
                    </View>
                    <View
                        style={[subscriptionScreenStyles.price, {
                            position: "absolute",
                            top: -(SIZES.radius + 20),
                            right: -SIZES.radius
                        }]}>
                        {isDiscounted ? (
                            <>
                                <View style={subscriptionScreenStyles.discount}>
                                    <TextAtom style={subscriptionScreenStyles.percentDiscountText}>
                                        -{percent}%
                                    </TextAtom>
                                </View>
                                <TextAtom style={subscriptionScreenStyles.priceDiscountText}>
                                    {formatPriceWithLocale(price ?? 2999, locale)}
                                </TextAtom>
                            </>
                        ) : null}

                        <TextAtom style={subscriptionScreenStyles.toPayText}>
                            {formatPriceWithLocale(toPay, locale)}
                        </TextAtom>

                    </View>
                </View>
            </View>
            <View style={subscriptionScreenStyles.contentContainer}>
                <View style={subscriptionScreenStyles.frequencyDurationWrapper}>
                    {frequency ? (
                        <View style={[subscriptionScreenStyles.IconLabel, {backgroundColor: COLORS.yellow}]}>
                            <TextAtom
                                numberOfLines={1}
                                adjustsFontSizeToFit={true}
                                style={{
                                    color: COLORS.white,
                                    ...FONTS.h5,
                                }}
                            >
                                {frequency}
                            </TextAtom>
                        </View>
                    ) : null}
                    {duration ? (
                        <IconLabel
                            icon={Clock}
                            iconStyle={{
                                tintColor: COLORS.darkBlue
                            }}
                            labelStyle={{
                                ...FONTS.h5
                            }}
                            label={duration}
                        />
                    ) : null}

                </View>
            </View>
            {description ? (
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: SIZES.base
                    }}
                >
                    <TextAtom style={{color: COLORS.gray, ...FONTS.h5}}>
                        {description}
                    </TextAtom>
                </View>
            ) : null}
            {typeof item.product_variations !== "undefined" && item.product_variations !== null && item.product_variations.length !== 0 ? (
                <VariantItem
                    productVariation={item.product_variations}
                    onChange={handleChange}
                />
            ) : null}

            <View
                style={{
                    flexDirection: "row",
                    marginTop: 15
                }}
            >
                <TextButton
                    buttonContainerStyle={{
                        ...subscriptionScreenStyles.textButtonContainer,
                        backgroundColor: COLORS.lightBlue
                    }}
                    label={t("subscription_screen.explore_more") ?? "Acheter"}
                    actionLabel={"PRODUCT_CHECKOUT"}
                    labelStyle={{...FONTS.body4}}
                    onPress={() => onPress({
                        ...item,
                        variation: selectedVariation
                    })}
                />

            </View>
        </View>
    );
};

export default Offers;
