import {COLORS} from "@assets/index";
import React from "react";
import {View} from "react-native";

export const LineDivider = ({lineStyle}: any) => {
    return (
        <View
            style={{
                height: 2,
                width: "100%",
                backgroundColor: COLORS.lightGray2,
                ...lineStyle
            }}
        />
    );
};
