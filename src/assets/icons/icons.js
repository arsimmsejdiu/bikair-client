import React from "react";
import { StyleSheet } from "react-native";
import { createIconSetFromFontello } from "react-native-vector-icons";
import Feather from "react-native-vector-icons/dist/Feather";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/dist/SimpleLineIcons";

import {COLORS} from "../constant";
import fontelloConfig from "./fontelloConfig.json";

const FontelloIconSet = createIconSetFromFontello(fontelloConfig);

const defaultStyle = StyleSheet.create({
    icon: {
        backgroundColor: "transparent",
    },
});

export const FontelloIcon = props => (
    <FontelloIconSet
        name={props.name}
        size={props.size !== "undefined" ? props.size : 20}
        color={props.color !== "undefined" ? props.color : COLORS.darkBlue}
        style={
            props.style !== "undefined"
                ? [defaultStyle.icon, props.style]
                : defaultStyle.icon
        }
    />
);

export const FeatherIcon = props => (
    <Feather
        name={props.name}
        size={props.size !== "undefined" ? props.size : 20}
        color={props.color !== "undefined" ? props.color : COLORS.darkBlue}
        style={
            props.style !== "undefined"
                ? [defaultStyle.icon, props.style]
                : defaultStyle.icon
        }
    />
);

export const FontAwesomeIcon = props => (
    <FontAwesome
        name={props.name}
        size={props.size !== "undefined" ? props.size : 20}
        color={props.color !== "undefined" ? props.color : COLORS.darkBlue}
        style={
            props.style !== "undefined"
                ? [defaultStyle.icon, props.style]
                : defaultStyle.icon
        }
    />
);

export const SimpleLine = props => (
    <SimpleLineIcons
        name={props.name}
        size={props.size !== "undefined" ? props.size : 20}
        color={props.color !== "undefined" ? props.color : COLORS.darkBlue}
        style={
            props.style !== "undefined"
                ? [defaultStyle.icon, props.style]
                : defaultStyle.icon
        }
    />
);
