import {FontAwesomeIcon} from "@assets/index";
import React from "react";
import {TouchableOpacity, View, ViewProps} from "react-native";

interface StarFormProps extends ViewProps {
    index: number
    currentNumber: number
    onPress?: () => void
}

export const StarForm: React.FC<StarFormProps> = (
    {
        index,
        currentNumber,
        onPress
    }): React.ReactElement | null => {

    const handleOnPress = () => {
        if (typeof onPress !== "undefined") {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            onPress={handleOnPress}
            activeOpacity={0.5}>
            <View>
                <FontAwesomeIcon
                    name={currentNumber >= index ? "star" : "star-o"}
                    size={30}
                    color={currentNumber >= index ? "#FFD700" : "#63B1F9"}
                />
            </View>
        </TouchableOpacity>
    );
};
