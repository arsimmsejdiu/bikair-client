import {COLORS} from "@assets/index";
import React from "react";
import {Image, TouchableOpacity} from "react-native";

const IconButton = ({containerStyle, icon, iconStyle, onPress, disable}: any) => {

    return (
        <TouchableOpacity
            style={{
                ...containerStyle
            }}
            onPress={onPress}
            disabled={disable}
        >
            <Image
                source={icon}
                style={{
                    width: 30,
                    height: 30,
                    tintColor: COLORS.white,
                    ...iconStyle
                }}
            />
        </TouchableOpacity>
    );
};

export default IconButton;
