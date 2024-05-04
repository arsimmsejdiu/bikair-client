import {HomeStackScreenProps} from "@stacks/types";
import React from "react";
import {Image, ImageSourcePropType, TouchableOpacity, ViewProps, ViewStyle} from "react-native";
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";
import {ImageStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface Props extends ViewProps, HomeStackScreenProps<"CustomizeCookies"> {
    image: ImageSourcePropType,
    style: StyleProp<ViewStyle>,
    imageStyle: StyleProp<ImageStyle>
}

export const GoBackRGPDMolecule: React.FC<Props> = ({navigation, imageStyle, image, style}): React.ReactElement => {
    const acceptAllCookies = () => {
        navigation.navigate("News");
    };
    return (
        <TouchableOpacity
            onPress={() => acceptAllCookies()}
            style={style}
        >
            <Image source={image} style={imageStyle} resizeMode={"cover"}/>
        </TouchableOpacity>
    );
};
