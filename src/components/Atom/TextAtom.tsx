import React from "react";
import {Text} from "react-native";
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";
import {TextStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface TextAtomProps {
    children?: any,
    style?: StyleProp<TextStyle> | undefined,
    numberOfLines?: number | undefined,
    adjustsFontSizeToFit?: boolean | undefined,
}

export const TextAtom = ({children, style, adjustsFontSizeToFit, numberOfLines}: TextAtomProps) => {
    return <Text
        style={style}
        adjustsFontSizeToFit={adjustsFontSizeToFit}
        numberOfLines={numberOfLines}
    >
        {children}
    </Text>;
};
