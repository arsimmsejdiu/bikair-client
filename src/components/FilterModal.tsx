import {COLORS, FONTS, SIZES} from "@assets/index";
import {TextAtom} from "@components/Atom";
import TextButton from "@components/Molecule/TextButton";
import MyModal from "@components/MyModal";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Animated, Platform, TouchableWithoutFeedback, View} from "react-native";

const FilterModal = ({isVisible, onClose, onCancel, onValidate, media}: any) => {
    const modalAnimatedValue = useRef(new Animated.Value(0)).current;
    const [showFilterModal, setShowFilterModal] = useState(isVisible);
    const {t} = useTranslation();

    const handleValidation = () => {
        if (typeof onValidate !== "undefined" && typeof media !== "undefined") {
            onValidate(media);
        }
    };

    const handleCancellation = () => {
        if (typeof onCancel !== "undefined") {
            onCancel();
        }
    };

    useEffect(() => {
        setShowFilterModal(isVisible);
    }, [isVisible]);

    useEffect(() => {
        if (showFilterModal) {
            Animated.timing(modalAnimatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(modalAnimatedValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start(() => typeof onClose !== "undefined" ? onClose() : undefined);
        }
    }, [showFilterModal]);

    useEffect(() => {
        return () => {
            setShowFilterModal(false);
        };
    }, []);

    const modalY = modalAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [SIZES.height, SIZES.height > 400 ? SIZES.height - 340 : SIZES.height - 280]
    });

    return (
        <MyModal
            slide={true}
            visible={showFilterModal}
        >
            <View style={{
                flex: 1,
                backgroundColor: "rgba(164, 170, 179, 0.4)",
            }}>
                {/* Transparent Background */}
                <TouchableWithoutFeedback
                    onPress={() => setShowFilterModal(false)}
                >
                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }}
                    />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={{
                        position: "absolute",
                        left: 0,
                        top: modalY,
                        width: "100%",
                        height: "100%",
                        padding: SIZES.padding,
                        borderTopRightRadius: SIZES.padding,
                        borderTopLeftRadius: SIZES.padding,
                        backgroundColor: COLORS.white
                    }}
                >
                    {/*Confirm*/}
                    {/*Header*/}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: "center"
                        }}
                    >
                        <TextAtom style={{
                            flex: 1, ...FONTS.h3,
                            fontSize: 18,
                            textAlign: "center"
                        }}>
                            {t("parking_photo.title_photo")}
                        </TextAtom>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: SIZES.base
                        }}
                    >
                        <TextAtom style={{flex: 1, color: COLORS.darkGrey, ...FONTS.h5, paddingVertical: 15}}>
                            {t("parking_photo.desc_photo")}
                        </TextAtom>
                    </View>
                    {/*Validate Buttons*/}
                    <View style={{
                        position: "relative",
                        bottom: Platform.OS === "ios" ? (SIZES.height > 400 ? 15 : 0) : 15,
                        left: 0,
                        right: 0,
                        height: 150,
                        width: "100%",
                        paddingVertical: SIZES.radius,
                        backgroundColor: COLORS.white
                    }}
                    >
                        <TextButton
                            label={t("parking_photo.valid") ?? "Valider"}
                            actionLabel={"PHOTO_VALIDATION"}
                            buttonContainerStyle={{
                                height: 60,
                                borderRadius: SIZES.base,
                                marginVertical: SIZES.base,
                                backgroundColor: COLORS.lightBlue
                            }}
                            onPress={() => {
                                handleValidation(), setShowFilterModal(false);
                            }}
                        />
                        <TextButton
                            label={t("parking_photo.retake") ?? "Retake"}
                            actionLabel={"PHOTO_RETAKE"}
                            buttonContainerStyle={{
                                height: 60,
                                borderRadius: SIZES.base,
                                backgroundColor: COLORS.black,
                            }}
                            onPress={() => {
                                handleCancellation(), setShowFilterModal(false);
                            }}
                        />
                    </View>
                </Animated.View>
            </View>
        </MyModal>
    );
};

export default FilterModal;
