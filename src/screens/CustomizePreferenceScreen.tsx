import {COLORS, GoBack} from "@assets/index";
import {GoBackRGPDMolecule} from "@components/Molecule/RGPDMolecule";
import TextButton from "@components/Molecule/TextButton";
import {CookiesSwitch} from "@components/RGPD/CookieSwitchComponent";
import {firebase} from "@react-native-firebase/analytics";
import {useFocusEffect} from "@react-navigation/native";
import {storeData} from "@services/asyncStorage";
import {HomeStackScreenProps} from "@stacks/types";
import {acceptCookiesStyle} from "@styles/AcceptCookiesStyle";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {memo, useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ScrollView, StatusBar, Text, View, ViewProps} from "react-native";
import {Settings} from "react-native-fbsdk-next";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type Props = ViewProps & HomeStackScreenProps<"CustomizeCookies">

const CustomizePreferenceScreen: React.FC<Props> = ({navigation, route}): React.ReactElement => {
    const {t} = useTranslation();
    const insets = useSafeAreaInsets();
    const [isNecessaryCookiesEnabled, setIsNecessaryCookiesEnabled] = useState(true);
    const [isMarketingCookiesEnabled, setIsMarketingCookiesEnabled] = useState(false);

    const updateSettings = async () => {
        Settings.setAdvertiserTrackingEnabled(isNecessaryCookiesEnabled).then(r => console.log(r));
        firebase.analytics().setAnalyticsCollectionEnabled(isMarketingCookiesEnabled).then(() => console.log(""));
        await storeData("@RGPD", "true");
    };

    useEffect(() => {
        updateSettings().then(r => console.log(r));
    }, [isNecessaryCookiesEnabled, isMarketingCookiesEnabled]);

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "CustomizePreferenceScreen").then(() => console.log(""));
    }, []));

    const saveAndSubmit = () => {
        navigation.navigate("Map");
    };

    return (
        <View style={acceptCookiesStyle.container}>
            <StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"}/>
            <ScrollView contentContainerStyle={acceptCookiesStyle.scrollContainer}>
                <GoBackRGPDMolecule
                    navigation={navigation}
                    route={route}
                    image={GoBack}
                    style={{...acceptCookiesStyle.imageCross, top: acceptCookiesStyle.imageCross.top + insets.top}}
                    imageStyle={{width: 30, height: 30}}/>
                <View>
                    <View style={acceptCookiesStyle.line}/>
                    <Text style={acceptCookiesStyle.title}>
                        {t("cookies.customize_preferences")}
                    </Text>
                    <CookiesSwitch
                        label={"cookies.necessary"}
                        isEnabled={isNecessaryCookiesEnabled}
                        onValueChange={() => setIsNecessaryCookiesEnabled(prevState => !prevState)}
                        isDisabled={true}
                    />
                    <CookiesSwitch
                        label={"cookies.marketing"}
                        isEnabled={isMarketingCookiesEnabled}
                        onValueChange={() => setIsMarketingCookiesEnabled(prevState => !prevState)}
                    />
                </View>
                <TextButton
                    label={t("cookies.save_and_submit") ?? "SAVE AND SUBMIT"}
                    actionLabel={"COOKIES_SAVE_SUBMIT"}
                    labelStyle={{fontSize: 14}}
                    buttonContainerStyle={acceptCookiesStyle.buttonAccept}
                    onPress={() => saveAndSubmit()}
                />
            </ScrollView>
        </View>
    );
};

export default memo(CustomizePreferenceScreen);
