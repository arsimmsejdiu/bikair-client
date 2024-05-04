import {FeatherIcon} from "@assets/index";
import {useNavigation} from "@react-navigation/native";
import {SAFE_AREA_PADDING} from "@services/constants";
import {qrCodeOverlayStyles} from "@styles/CameraStyle";
import React, {useLayoutEffect} from "react";
import {useTranslation} from "react-i18next";
import {StyleSheet, Text, View, ViewProps} from "react-native";
import {PressableOpacity} from "react-native-pressable-opacity";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface Props extends ViewProps {
    visible?: boolean,
    supportsFlash: any,
    flash: string,
    onFlashPressed: () => void
    onBackAction?: () => void
}

const QrCodeOverlayImpl: React.FC<Props> = ({
    visible,
    supportsFlash,
    flash,
    onFlashPressed,
    onBackAction
}): React.ReactElement | null => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    });

    if (typeof visible !== "undefined" && !visible) return null;

    return (
        <View style={StyleSheet.absoluteFillObject}>
            <View style={[qrCodeOverlayStyles.rightButtonRow, {
                right: SAFE_AREA_PADDING(insets).paddingRight,
                top: SAFE_AREA_PADDING(insets).paddingTop
            }]}>
                {supportsFlash && (
                    <PressableOpacity style={qrCodeOverlayStyles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
                        <FeatherIcon name={flash === "on" ? "zap" : "zap-off"} size={30} color={"white"}/>
                    </PressableOpacity>
                )}
            </View>
            <View style={qrCodeOverlayStyles.header}>
                <View>
                    <Text style={qrCodeOverlayStyles.title}>{t("start_trip.title")}</Text>
                </View>
            </View>
            <View style={qrCodeOverlayStyles.targetContainer}>
                <View style={qrCodeOverlayStyles.targetWrapper}>
                    <View style={qrCodeOverlayStyles.sideTarget}/>
                    <View style={qrCodeOverlayStyles.target}>
                        <View
                            style={[
                                qrCodeOverlayStyles.corner,
                                qrCodeOverlayStyles.cornerTopLeft,
                            ]}
                        />
                        <View
                            style={[
                                qrCodeOverlayStyles.corner,
                                qrCodeOverlayStyles.cornerBottomLeft,
                            ]}
                        />
                        <View
                            style={[
                                qrCodeOverlayStyles.corner,
                                qrCodeOverlayStyles.cornerTopRight,
                            ]}
                        />
                        <View
                            style={[
                                qrCodeOverlayStyles.corner,
                                qrCodeOverlayStyles.cornerBottomRight,
                            ]}
                        />
                    </View>
                    <View style={qrCodeOverlayStyles.sideTarget}/>
                </View>
            </View>
            <View style={[qrCodeOverlayStyles.rightButtonRow, {
                left: SAFE_AREA_PADDING(insets).paddingLeft,
                top: SAFE_AREA_PADDING(insets).paddingTop
            }]}>
                <PressableOpacity
                    style={qrCodeOverlayStyles.button}
                    onPress={onBackAction}
                    disabledOpacity={0.4}>
                    <FeatherIcon name={"arrow-left"} size={30} color={"white"}/>
                </PressableOpacity>
            </View>
            <View style={qrCodeOverlayStyles.header}/>
        </View>
    );
};

export const QrCodeOverlay = React.memo(QrCodeOverlayImpl);
