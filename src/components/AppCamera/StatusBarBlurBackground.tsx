import {BlurView, BlurViewProps} from "@react-native-community/blur";
import {statusBarBlurBackgroundStyles} from "@styles/CameraStyle";
import React from "react";
import {Platform} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const FALLBACK_COLOR = "rgba(140, 140, 140, 0.3)";

const StatusBarBlurBackgroundImpl = ({style, ...props}: BlurViewProps): React.ReactElement | null => {
    const insets = useSafeAreaInsets();
    if (Platform.OS !== "ios") return null;

    return (
        <BlurView
            style={[statusBarBlurBackgroundStyles.statusBarBackground, style, {height: insets.top}]}
            blurAmount={25}
            blurType="light"
            reducedTransparencyFallbackColor={FALLBACK_COLOR}
            {...props}
        />
    );
};

export const StatusBarBlurBackground = React.memo(StatusBarBlurBackgroundImpl);
