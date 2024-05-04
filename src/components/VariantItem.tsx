import {COLORS, FONTS, Minus, Plus, SIZES} from "@assets/index";
import {TextAtom} from "@components/Atom/TextAtom";
import IconButton from "@components/IconButton";
import {useAppSelector} from "@hooks/index";
import React, {memo, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";

import {ProductVariationsOutputData} from "@bikairproject/shared/dist/dto/ProductDetail";

interface VariationProps extends ViewProps {
    productVariation: ProductVariationsOutputData[];
    onChange?: (variation: ProductVariationsOutputData) => void
}

const VariantItem: React.FC<VariationProps> = ({onChange, productVariation}): React.ReactElement | null => {
    const localeTime = useAppSelector(state => state.auth.me?.locale ?? "fr");
    const [index, setIndex] = useState<number>(0);
    const [locale, setLocale] = useState("fr");
    const [description, setDescription] = useState<any>({});
    const {i18n} = useTranslation();

    useEffect(() => {
        const newLocale = i18n.language ?? localeTime;
        setLocale(newLocale);
    }, [i18n.language]);


    useEffect(() => {
        if (typeof productVariation !== "undefined" && productVariation !== null && productVariation.length > 0) {
            setDescription(productVariation[index].description ?? "");
            if (typeof onChange !== "undefined") {
                onChange(productVariation[index]);
            }
        }
    }, [index]);

    const handlePlus = () => {
        setIndex(index + 1);
    };

    const handleMinus = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    if (typeof productVariation !== "undefined" && productVariation !== null && productVariation.length === 0) {
        return null;
    }

    return (
        <View
            style={{
                flexDirection: "row",
                height: 60,
                alignItems: "center",
                justifyContent: "center",
                marginTop: SIZES.radius,
                paddingHorizontal: SIZES.padding,
                borderWidth: 2,
                borderRadius: SIZES.radius,
                borderColor: COLORS.lightBlue,
            }}>
            <IconButton
                containerStyle={{
                    width: 50,
                    alignItems: "center",
                    justifyContent: "center"
                }}
                icon={Minus}
                iconStyle={{
                    height: 20,
                    width: 20,
                    tintColor: index === 0 ? COLORS.darkGray2 : COLORS.lightBlue
                }}
                onPress={handleMinus}
                disable={index === 0}
            />
            {/* Title */}
            <TextAtom style={{
                flex: 1,
                textAlign: "center", ...FONTS.h3,
                color: COLORS.darkGray2
            }}>
                {description[locale]?.label ?? ""}
            </TextAtom>
            <IconButton
                containerStyle={{
                    width: 50,
                    alignItems: "center",
                    justifyContent: "center"
                }}
                icon={Plus}
                iconStyle={{
                    height: 20,
                    width: 20,
                    tintColor: productVariation !== null && index >= productVariation.length - 1 ? COLORS.darkGray2 : COLORS.lightBlue
                }}
                onPress={handlePlus}
                disable={productVariation !== null && index >= productVariation.length - 1}
            />
        </View>
    );
};

export default memo(VariantItem);
