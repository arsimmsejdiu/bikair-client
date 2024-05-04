import {COLORS} from "@assets/index";
import React from "react";
import Animated, {Extrapolate, interpolate, interpolateColor, useAnimatedStyle} from "react-native-reanimated";

export const PaginationBar: React.FC<{
    index: number
    length: number
    animValue: Animated.SharedValue<number>
}> = (props) => {
    const {animValue, index, length} = props;
    const inputRange = [index - 1, index, index + 1];

    const animStyle = useAnimatedStyle(() => {
        const outputRangeWidth = [10, 40, 10];
        const outputRangeColor = [COLORS.lightBlue, COLORS.darkBlue, COLORS.lightBlue];

        const width = interpolate(
            animValue?.value,
            inputRange,
            outputRangeWidth,
            Extrapolate.CLAMP,
        );

        const backgroundColor = interpolateColor(
            animValue?.value,
            inputRange,
            outputRangeColor
        );

        return {
            width,
            backgroundColor
        };
    }, [animValue, index, length]);

    return (
        <Animated.View style={[{
            height: 10,
            borderRadius: 5,
            marginHorizontal: 8
        }, animStyle]}/>
    );
};
