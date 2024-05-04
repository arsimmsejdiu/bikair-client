import React from "react";
import {Image} from "react-native";
import {ImageResizeMode} from "react-native/Libraries/Image/ImageResizeMode";
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";
import {ImageStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface TextAtomProps {
    style?: StyleProp<ImageStyle> | undefined,
    source?: any,
    resizeMode?: ImageResizeMode | undefined,
    alt?: string | undefined
}

export const ImageAtom = ({source, resizeMode, alt, style}: TextAtomProps) => {
    return (
        <Image
            source={source}
            resizeMode={resizeMode}
            alt={alt}
            style={style}
        />
    );
};
