import {BikeYellow, FeatherIcon} from "@assets/index";
import {useFocusEffect} from "@react-navigation/native";
import {SAFE_AREA_PADDING} from "@services/constants";
import {labelOverlayStyles} from "@styles/CameraStyle";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {Image, StyleSheet, Text, View, ViewProps} from "react-native";
import {PressableOpacity} from "react-native-pressable-opacity";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {PhotoFile} from "react-native-vision-camera";

import FilterModal from "../FilterModal";

interface Props extends ViewProps {
    mediaCaptured: PhotoFile | null,
    media: PhotoFile | null,
    visible?: boolean,
    supportsFlash: any,
    flash: string,
    onFlashPressed: () => void,
    onValidate?: (media: PhotoFile) => void,
    onCancel?: () => void,
    onBackAction?: () => void
}

const BUTTON_SIZE = 40;

const LabelOverlayImpl: React.FC<Props> = (
    {
        visible,
        media,
        supportsFlash,
        flash,
        onFlashPressed,
        mediaCaptured,
        onValidate,
        onCancel,
        onBackAction
    }): React.ReactElement | null => {
    const {t} = useTranslation();
    const insets = useSafeAreaInsets();
    const [showFilterModal, setShowFilterModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            return () => {
                setShowFilterModal(false);
            };
        }, [])
    );

    if (typeof visible !== "undefined" && !visible) {
        return null;
    }

    return (
        <View style={StyleSheet.absoluteFillObject}>
            <FilterModal
                media={media}
                onValidate={onValidate}
                onCancel={onCancel}
                isVisible={showFilterModal}
                onClose={() => setShowFilterModal(false)}
            />
            <Image
                source={{
                    uri: `file://${media?.path}`,
                }}
                resizeMode={"cover"}
                style={labelOverlayStyles.image1}
            />
            <View style={{
                height: "33.33%",
            }}>
                <View style={{
                    ...labelOverlayStyles.container,
                    marginTop: labelOverlayStyles.container.marginTop + insets.top
                }}>
                    <Text style={labelOverlayStyles.title}>{t("parking_photo.title1")}</Text>
                    <Image source={BikeYellow} style={labelOverlayStyles.image}/>
                </View>
            </View>

            {!mediaCaptured && (
                <View style={labelOverlayStyles.targetContainer}>
                    <View style={labelOverlayStyles.targetWrapper}>
                        <View style={labelOverlayStyles.sideTarget}/>
                        <View style={labelOverlayStyles.target}>
                            <View
                                style={[
                                    labelOverlayStyles.corner,
                                    labelOverlayStyles.cornerTopLeft,
                                ]}
                            />
                            <View
                                style={[
                                    labelOverlayStyles.corner,
                                    labelOverlayStyles.cornerBottomLeft,
                                ]}
                            />
                            <View
                                style={[
                                    labelOverlayStyles.corner,
                                    labelOverlayStyles.cornerTopRight,
                                ]}
                            />
                            <View
                                style={[
                                    labelOverlayStyles.corner,
                                    labelOverlayStyles.cornerBottomRight,
                                ]}
                            />
                        </View>
                        <View style={labelOverlayStyles.sideTarget}/>
                    </View>
                </View>
            )}
            <View style={[labelOverlayStyles.rightButtonRow, {
                right: SAFE_AREA_PADDING(insets).paddingRight,
                bottom: SAFE_AREA_PADDING(insets).paddingBottom
            }]}>
                {(supportsFlash && !mediaCaptured) && (
                    <PressableOpacity style={labelOverlayStyles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
                        <FeatherIcon name={flash === "on" ? "zap" : "zap-off"} size={30} color={"white"}/>
                    </PressableOpacity>
                )}
            </View>
            <View style={[labelOverlayStyles.rightButtonRow, {
                right: SAFE_AREA_PADDING(insets).paddingRight,
                bottom: SAFE_AREA_PADDING(insets).paddingBottom
            }]}>
                {mediaCaptured && (
                    <PressableOpacity
                        style={labelOverlayStyles.buttonCross}
                        onPress={() => setShowFilterModal(true)}
                        disabledOpacity={0.4}
                    >
                        <FeatherIcon name={"check"} size={30} color={"white"}/>
                    </PressableOpacity>
                )}
            </View>
            <View style={[labelOverlayStyles.rightButtonRow, {
                left: SAFE_AREA_PADDING(insets).paddingLeft,
                bottom: SAFE_AREA_PADDING(insets).paddingBottom
            }]}>
                {typeof onBackAction !== "undefined" ?
                    <PressableOpacity
                        style={labelOverlayStyles.button}
                        onPress={onBackAction}
                        disabledOpacity={0.4}>
                        <FeatherIcon name={"arrow-left"} size={30} color={"white"}/>
                    </PressableOpacity>
                    : null
                }
            </View>
        </View>
    );
};

export const LabelOverlay = React.memo(LabelOverlayImpl);
