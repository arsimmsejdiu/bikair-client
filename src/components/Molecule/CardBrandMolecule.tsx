import {ImageAtom, TextAtom} from "@components/Atom";
import React from "react";
import {View} from "react-native";

interface CardBrandMoleculeProps {
    children?: any,
    imageStyle?: any,
    container?: any
    textStyle?: any
    source?: any,
    resizeMode?: any,
    alt?: string
}

export const CardBrandMolecule = ({source, resizeMode, alt, imageStyle, textStyle, container, children}: CardBrandMoleculeProps) => {
    return(
        <View style={container}>
            <ImageAtom
                source={source}
                style={imageStyle}
                alt={alt}
                resizeMode={resizeMode}
            />
            <TextAtom style={textStyle}>
                {children}
            </TextAtom>
        </View>
    );
};
