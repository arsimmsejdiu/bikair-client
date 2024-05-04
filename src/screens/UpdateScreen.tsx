import {COLORS, LogoBikAir} from "@assets/index";
import {TextAtom} from "@components/Atom";
import {SecondaryButton, SubmitButton} from "@components/Buttons";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {setShouldUpdate} from "@redux/reducers/initialState";
import {HomeStackScreenProps} from "@stacks/types";
import {updateScreenStyles} from "@styles/HomeScreenStyles";
import React, {useCallback, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Image, Linking, Platform, StatusBar, View, ViewProps} from "react-native";
import {useDispatch} from "react-redux";

interface Props extends ViewProps, HomeStackScreenProps<"Update"> {
}

const UpdateScreen: React.FC<Props> = ({navigation, route}): React.ReactElement => {

    const {t} = useTranslation();
    const [showNotNow, setShowNotNow] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const notNow = () => {
        dispatch(setShouldUpdate(false));
        navigation.goBack();
    };

    useEffect(() => {
        if (typeof route.params.forceUpdate !== "undefined" || route.params.forceUpdate !== null) {
            setShowNotNow(!route.params.forceUpdate);
        } else {
            setShowNotNow(true);
        }
    }, [route.params]);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "UpdateScreen").then(r => console.log(r));
    }, []));

    const onSubmit = () => {
        if (Platform.OS === "android") {
            Linking.canOpenURL("market://details?id=com.bikair.rn")
                .then(() => {
                    Linking.openURL("market://details?id=com.bikair.rn").then(r => console.log(r));
                })
                .catch();
            // Redirect Apple Store
        } else if (Platform.OS === "ios") {
            Linking.canOpenURL("itms-apps://apps.apple.com/fr/app/bikair/id1467271309")
                .then(() =>
                    Linking.openURL("itms-apps://apps.apple.com/fr/app/bikair/id1467271309"),
                )
                .catch();
        }
    };

    return (
        <View style={updateScreenStyles.container}>
            <StatusBar
                backgroundColor={COLORS.lightGrey}
                barStyle={"dark-content"}
            />

            <Image source={LogoBikAir} resizeMode={"contain"} style={updateScreenStyles.logo}/>
            <View>
                <TextAtom style={updateScreenStyles.title}>
                    {t("update.title")}{"\n"}
                </TextAtom>
                <TextAtom style={updateScreenStyles.instruction}>
                    {t("update.line_1")}
                </TextAtom>
                <TextAtom style={updateScreenStyles.instruction}>
                    {t("update.line_2")}
                </TextAtom>
            </View>

            <View style={updateScreenStyles.submitContainer}>
                <SubmitButton
                    value={t("update.submit")}
                    onClick={onSubmit}
                    actionLabel={"CLICK_UPDATE"}
                />
            </View>
            {
                showNotNow &&
                <View style={updateScreenStyles.submitContainer}>
                    <SecondaryButton
                        value={t("update.not_now")}
                        onClick={notNow}
                        actionLabel={"DELAY_UPDATE"}
                    />
                </View>
            }
        </View>
    );
};

export default UpdateScreen;


