import {GoBack} from "@assets/index";
import {FadeInView} from "@components/Animations/FadeInView";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {goBackStyles} from "@styles/GeneralStyles";
import React from "react";
import {TouchableOpacity, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface GoBackCrossProps extends ViewProps {
    onClick: () => void
}

const GoBackCross = ({onClick}: GoBackCrossProps) => {
    const insets = useSafeAreaInsets();

    const handleBackAction = () => {
        onClick();
    };

    return (
        <View style={{
            ...goBackStyles.headerBar,
            paddingTop: insets.top + 10,
        }}>
            <View>
                <TouchableOpacity
                    onPress={handleBackAction}
                    style={goBackStyles.imageCross}
                >
                    <FadeInView>
                        <ImageAtom style={goBackStyles.imageCross} source={GoBack} resizeMode={"cover"}/>
                    </FadeInView>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default GoBackCross;
