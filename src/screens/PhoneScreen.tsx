import {COLORS, LogoBikAir} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {LowProfileButton, SubmitButton} from "@components/Buttons";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {authPhone, loginFailed, updateFailed} from "@redux/reducers/auth";
import {userClickPhoneValidationEvent} from "@redux/reducers/events";
import {isUpdateAvailable} from "@redux/reducers/initialState";
import {storeData} from "@services/asyncStorage";
import {AuthStackScreenProps} from "@stacks/types";
import {phoneScreenStyles} from "@styles/PhoneScreenStyles";
import React, {useCallback, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {KeyboardAvoidingView, Platform, StatusBar, View, ViewProps} from "react-native";
import PhoneInput from "react-native-phone-number-input";

interface Props extends ViewProps, AuthStackScreenProps<"Phone"> {
}

const PhoneVerification: React.FC<Props> = ({
    navigation,
    ...props
}): React.ReactElement => {

    const {t} = useTranslation();
    const phoneInput = React.useRef<PhoneInput>(null);
    const [phone, setPhone] = React.useState<string>("");

    // Redux state
    const auth = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        // redirect to CodeScreen
        if (auth.accessToken) {
            navigation.navigate("Code");
        }
    }, [auth, navigation, props]);

    React.useEffect(() => {
        dispatch(updateFailed(null));
    }, [dispatch]);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "PhoneVerification").then(r => console.log(r));
    }, []));

    const onSubmit = async () => {
        const formattedPhoneNumber = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
        const countryCode = phoneInput.current?.getCountryCode() ?? "FR";
        if (formattedPhoneNumber?.number) {
            dispatch(userClickPhoneValidationEvent());
            dispatch(authPhone(formattedPhoneNumber.formattedNumber, countryCode));
        } else {
            dispatch(loginFailed({
                message: t("phone_verify.error")
            }));
        }
    };

    const handleMapClick = async () => {
        await storeData("@IntroViewed", "true");
        navigation.navigate("Map");
    };

    const renderPhoneNumber = () => {
        return (
            <View style={phoneScreenStyles.phoneVerificationForm}>
                <PhoneInput
                    ref={phoneInput}
                    defaultCode="FR"
                    placeholder={t("phone_verify.instruction") || ""}
                    layout="first"
                    containerStyle={phoneScreenStyles.phoneInputContainer}
                    textContainerStyle={phoneScreenStyles.phoneTextContainer}
                    withDarkTheme
                    onChangeText={(text: string) => setPhone(text)}
                    autoFocus
                />
                <View style={phoneScreenStyles.submitContainer}>
                    <SubmitButton
                        inProgress={auth.isFetching}
                        disabled={auth.isFetching || phone.length < 5}
                        value={phone.length < 5 ? t("phone_verify.valid") : t("phone_verify.submit")}
                        onClick={onSubmit}
                        actionLabel={"SUBMIT_PHONE"}
                    />
                    <LowProfileButton
                        onClick={handleMapClick}
                        value={t("tips.map")}
                        style={phoneScreenStyles.secondButton}
                        actionLabel={"OPEN_OFFLINE_MAP"}
                    />
                </View>
            </View>
        );
    };

    useEffect(() => {
        // Update city list
        dispatch(isUpdateAvailable());
    }, [dispatch]);

    return (
        <View style={phoneScreenStyles.container}>
            <StatusBar backgroundColor={COLORS.lightGrey} barStyle={"dark-content"}/>
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={phoneScreenStyles.keyboard}
                enabled={Platform.OS === "ios"}
                keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}>
                <ImageAtom source={LogoBikAir} resizeMode={"contain"} style={phoneScreenStyles.logo}/>
                <View>
                    <TextAtom style={phoneScreenStyles.title}>{t("phone_verify.title")}</TextAtom>
                    <TextAtom style={auth.error ? phoneScreenStyles.error : phoneScreenStyles.instruction}>
                        {auth.error
                            ? t( auth.error?.message ?? "phone_verify.error")
                            : t("phone_verify.instruction")}
                    </TextAtom>
                    {renderPhoneNumber()}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default PhoneVerification;
