import {FONTS, SIZES} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import React from "react";
import {StyleSheet, View} from "react-native";

const IconLabel = ({containerStyle, icon, iconStyle, label, labelStyle}: any) => {
    return (
        <View style={[styles.IconLabel, {...containerStyle}]}>
            <ImageAtom
                source={icon}
                style={{
                    width: 15,
                    height: 15,
                    ...iconStyle
                }}
            />
            <TextAtom
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                style={{
                    marginLeft: SIZES.sm,
                    ...FONTS.body3,
                    ...labelStyle
                }}
            >
                {label}
            </TextAtom>
        </View>
    );
};

const styles = StyleSheet.create({
    IconLabel: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: SIZES.base,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius
    }
});

export default IconLabel;
