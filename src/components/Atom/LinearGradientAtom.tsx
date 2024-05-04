import React from "react";
import LinearGradient from "react-native-linear-gradient";

interface LinearGradientAtomProps {
    children?: any,
    colors?: any,
    start?: any
    end?: any,
    style?: any
}

export const LinearGradientAtom = ({children, colors, end, start, style}: LinearGradientAtomProps) => {
    return (
        <LinearGradient colors={colors} end={end} start={start} style={style}>
            {children}
        </LinearGradient>
    );
};
