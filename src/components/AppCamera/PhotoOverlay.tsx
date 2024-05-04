import {COLORS, FeatherIcon} from "@assets/index";
import {photoOverlayStyles} from "@styles/CameraStyle";
import React from "react";
import {Image, View, ViewProps} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {PhotoFile} from "react-native-vision-camera";

interface Props extends ViewProps {
    media: PhotoFile | null,
    onValidate?: (media: PhotoFile) => void,
    onCancel?: () => void,
}

export const PhotoOverlay: React.FC<Props> = ({
    media,
    onValidate,
    onCancel,
    ...props
}): React.ReactElement | null => {

    const handleValidation = () => {
        if (typeof onValidate !== "undefined" && typeof media !== "undefined" && media !== null) {
            onValidate(media);
        }
    };

    const handleCancelation = () => {
        if (typeof onCancel !== "undefined") {
            onCancel();
        }
    };


    if (typeof media !== "undefined" && !media) return null;

    return (
        <View style={photoOverlayStyles.container}>
            <Image
                source={{
                    uri: `file://${media.path}`,
                }}
                style={photoOverlayStyles.image}
            />
            <View style={photoOverlayStyles.buttonsContainer}>
                <TouchableOpacity style={photoOverlayStyles.buttonBackground}
                    onPress={handleCancelation}
                >
                    <FeatherIcon
                        style={photoOverlayStyles.submitButton}
                        name={"x"}
                        color={COLORS.red}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={photoOverlayStyles.buttonBackground}
                    onPress={handleValidation}
                >
                    <FeatherIcon
                        style={photoOverlayStyles.submitButton}
                        name={"check"}
                        color={COLORS.green}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};


