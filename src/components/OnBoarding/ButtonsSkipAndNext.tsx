import TextButton from "@components/Molecule/TextButton";
import {onboardingScreenButtonsStyles} from "@styles/OnboardingScreenStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {View} from "react-native";

interface ButtonsSkipAndNextProps {
    index: number,
    lastSlides: number,
    onPhone: () => void,
    onNext: () => void
}

export const ButtonsSkipAndNext = ({index, lastSlides, onNext, onPhone}: ButtonsSkipAndNextProps) => {
    const {t} = useTranslation();

    return (
        <View style={onboardingScreenButtonsStyles.container}>
            {/* Buttons */}
            {index < lastSlides ? (
                <View
                    style={onboardingScreenButtonsStyles.skipContainer}>
                    <TextButton
                        label={t("tutorial.skip") ?? ""}
                        actionLabel={"SKIP_TUTORIAL"}
                        buttonContainerStyle={{
                            backgroundColor: null,
                        }}
                        labelStyle={onboardingScreenButtonsStyles.labelSkipStyle}
                        onPress={onPhone}
                    />

                    <TextButton
                        label={t("tutorial.next") ?? ""}
                        actionLabel={"TUTORIAL_NEXT"}
                        buttonContainerStyle={onboardingScreenButtonsStyles.buttonContainerSkipStyle}
                        onPress={onNext}
                    />
                </View>
            ) : null}

            {index === lastSlides ? (
                <View
                    style={onboardingScreenButtonsStyles.buttonContainer}>
                    <TextButton
                        label={t("tutorial.get_started") ?? ""}
                        actionLabel={"TUTORIAL_START"}
                        buttonContainerStyle={onboardingScreenButtonsStyles.buttonContainerStyle}
                        onPress={onPhone}
                    />
                </View>
            ) : null}
        </View>
    )
}
