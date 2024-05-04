import {FONTS} from "@assets/constant";
import {ImageAtom, TextAtom} from "@components/Atom";
import {ISlidesItem} from "@models/dto/ISlideItem";
import {onboardingScreenPageViewStyles} from "@styles/OnboardingScreenStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {ImageBackground, View} from "react-native";

interface PageViewProps {
    item: ISlidesItem;
}

export const PageView = ({item}: PageViewProps) => {
    const {t} = useTranslation();
    return (
        <View style={onboardingScreenPageViewStyles.container}>
            {/* Header */}
            <View style={onboardingScreenPageViewStyles.imageContainer}>
                <ImageBackground
                    source={item.backgroundImage}
                    resizeMode="stretch"
                    style={onboardingScreenPageViewStyles.imageBackground}>
                    <ImageAtom
                        source={item.image}
                        resizeMode="contain"
                        style={onboardingScreenPageViewStyles.image}
                    />
                </ImageBackground>
            </View>

            {/* Detail */}
            <View
                style={onboardingScreenPageViewStyles.detailsContainer}>
                <TextAtom style={{...FONTS.h1, fontSize: 25}}>
                    {t(item.title)}
                </TextAtom>
                <TextAtom
                    style={onboardingScreenPageViewStyles.detailsText}>
                    {t(item.description)}
                </TextAtom>
            </View>
        </View>
    );
};
