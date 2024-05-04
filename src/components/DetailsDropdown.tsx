import {ArrowDown, ArrowUp, COLORS, FONTS} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import {generalStyles} from "@styles/GeneralStyles";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {TouchableOpacity, View, ViewProps} from "react-native";

interface DetailsDropdownProps extends ViewProps {
    productId: number | null
}

const DetailsDropdown: React.FC<DetailsDropdownProps> = (
    {
        productId,
        children
    }): React.ReactElement => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const {t} = useTranslation();

    return (
        <TouchableOpacity
            onPress={() => setCurrentIndex(productId === currentIndex ? null : (productId ?? null))}
            style={generalStyles.ShowDetailsContainer}
        >
            <View
                style={generalStyles.ShowDetails}>
                <TextAtom style={{color: COLORS.darkBlue, ...FONTS.body4, textDecorationLine: "underline"}}>
                    {currentIndex === null ?
                        t("subscription_screen.show_more") :
                        t("subscription_screen.show_less")
                    }
                </TextAtom>
                {currentIndex === null ? (
                    <ImageAtom
                        source={ArrowDown}
                        style={generalStyles.detailsDropdownImage}
                    />
                ) : (
                    <ImageAtom
                        source={ArrowUp}
                        style={generalStyles.detailsDropdownImage}
                    />
                )}
            </View>

            {productId === currentIndex && (
                <View>
                    {children}
                </View>
            )}
        </TouchableOpacity>
    );
};

export default DetailsDropdown;
