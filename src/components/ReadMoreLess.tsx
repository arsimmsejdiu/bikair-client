import React from "react";
import {TouchableOpacity, View} from "react-native";

const ReadMoreLess = ({children, onPress}: any) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                {children}
            </TouchableOpacity>
        </View>
    );
};

export default ReadMoreLess;
