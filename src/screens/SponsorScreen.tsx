import {Close, COLORS, FeatherIcon, PriceTag, ShareIcon} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import {useAppSelector} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {DrawerStackScreenProps} from "@stacks/types";
import {sponsorScreenStyles} from "@styles/SponsorScreenStyles";
import React, {useCallback} from "react";
import {useTranslation} from "react-i18next";
import {Alert, ScrollView, Share, ShareContent, StatusBar, TouchableOpacity, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {UserMe} from "@bikairproject/shared/dist/dto";

interface Props extends ViewProps, DrawerStackScreenProps<"Sponsor"> {
}

const SponsorScreen: React.FC<Props> = ({navigation}): React.ReactElement => {

    const {t} = useTranslation();
    const insets = useSafeAreaInsets();

    const user: UserMe | null = useAppSelector(state => state.auth.me);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "SponsorScreen").then(r => console.log(r));
    }, []));

    const onShare = async () => {
        try {
            if (user) {
                const message: ShareContent = {message: user.sponsor_code};
                await Share.share(message);
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={sponsorScreenStyles.wrapper}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    ...sponsorScreenStyles.crossContainer,
                    top: sponsorScreenStyles.crossContainer.top + insets.top
                }}
            >
                <ImageAtom
                    style={sponsorScreenStyles.imageCross}
                    source={Close}
                    resizeMode={"cover"}
                />
            </TouchableOpacity>
            <ScrollView
                contentContainerStyle={sponsorScreenStyles.container}>
                <StatusBar backgroundColor={COLORS.white}/>
                <View>
                    <ImageAtom
                        style={sponsorScreenStyles.image}
                        resizeMode="contain"
                        source={ShareIcon}
                    />
                    <View style={{flex: 3}}>
                        <View style={{flex: 2}}>
                            <TextAtom style={sponsorScreenStyles.title}>
                                {t("sponsor.subtitle")}
                            </TextAtom>
                        </View>
                        <View style={sponsorScreenStyles.descWrapper}>
                            <View style={sponsorScreenStyles.descContainer}>
                                <ImageAtom
                                    source={PriceTag}
                                    style={sponsorScreenStyles.imagePriceTag}
                                    resizeMode={"contain"}
                                />
                                <TextAtom style={sponsorScreenStyles.textContainer}>
                                    {t("sponsor.second_line")}
                                    <TextAtom style={{
                                        color: COLORS.yellow,
                                        textDecorationLine: "underline"
                                    }}>
                                        {t("sponsor.spam_second_line")}
                                    </TextAtom>
                                </TextAtom>
                            </View>
                            <View style={sponsorScreenStyles.descContainer}>
                                <ImageAtom
                                    source={PriceTag}
                                    style={sponsorScreenStyles.imagePriceTag}
                                    resizeMode={"contain"}
                                />
                                <TextAtom style={sponsorScreenStyles.textContainer}>
                                    {t("sponsor.third_line")}
                                    <TextAtom style={{
                                        color: COLORS.yellow,
                                        textDecorationLine: "underline"
                                    }}>
                                        {t("sponsor.spam_third_line")}
                                    </TextAtom>
                                </TextAtom>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1, justifyContent: "center"}}>
                        <TextAtom style={sponsorScreenStyles.textLabel}>
                            {t("sponsor.label")}
                        </TextAtom>
                        <TouchableOpacity
                            style={sponsorScreenStyles.button}
                            onPress={onShare}>
                            <TextAtom style={sponsorScreenStyles.textBtn}>
                                {user?.sponsor_code}
                            </TextAtom>
                            <FeatherIcon
                                name={"share"}
                                size={25}
                                color={COLORS.white}
                                style={sponsorScreenStyles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>

    );
};

export default SponsorScreen;

