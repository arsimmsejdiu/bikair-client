import React from "react";
import {ActivityIndicator, View} from "react-native";

interface LoaderProps {
    style?: any,
    color?: string,
    size?: number | "small" | "large" | undefined
}

const Loader = ({color, size, style}: LoaderProps) => {
    return (
        <View style={style}>
            <ActivityIndicator color={color} size={size}/>
        </View>
    );
};

export default Loader;

