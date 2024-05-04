import React from "react";
import {ScrollView} from "react-native";

interface ScrollViewAtomProps {
    children?: any,
    style?: any
    contentContainerStyle?: any,
    showsVerticalScrollIndicator?: any
}

export const ScrollViewAtom = ({
    children,
    style,
    contentContainerStyle,
    showsVerticalScrollIndicator
}: ScrollViewAtomProps) => {
    return <ScrollView
        style={style}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
        {children}
    </ScrollView>;
};
