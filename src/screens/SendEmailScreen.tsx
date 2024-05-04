// SendEmailScreen.tsx

/**
 * Screen that allows user to enter their email for phone number verification.
 * Uses PhoneInput library for formatted phone number input.
 * Dispatches redux actions to initiate phone number verification request.
 * Navigates to EmailScreen on successful verification.
 */
import {COLORS, FeatherIcon, LogoBikAir} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import {SubmitButton} from "@components/Buttons";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {authPhone, updateFailed} from "@redux/reducers/auth";
import {userClickPhoneValidationEvent} from "@redux/reducers/events";
import {isUpdateAvailable} from "@redux/reducers/initialState";
import {AuthStackScreenProps} from "@stacks/types";
import {phoneScreenStyles} from "@styles/PhoneScreenStyles";
import {validateEmail} from "@utils/helpers";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {KeyboardAvoidingView, Platform, StatusBar, TextInput, View, ViewProps} from "react-native";

interface IProps extends ViewProps, AuthStackScreenProps<"SendEmail"> {
}

const SendEmailScreen = ({
    navigation
}: IProps): React.ReactElement => {
    const {t} = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const auth = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(updateFailed(null));
    }, [dispatch]);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("SEND_EMAIL_SCREEN", "SendEmailScreen").then(r => console.log(r));
    }, []));
    /*
     *
     * It is an async function called onSubmit that takes an optional token parameter.
     * It gets the formatted phone number and country code using the phoneInput ref.
     * It dispatches a userClickPhoneValidationEvent action.
     * It dispatches an authPhone action, passing the formatted phone number, country code, token, and email address.
     * It navigates to the "Email" screen if a formatted phone number is present.
     * Otherwise, it sets an error message using the t translation function.
     * So in summary, this is submitting a phone number for authentication, dispatching relevant actions, and navigating to the next screen if valid. The token parameter is likely used for account verification flows.
     *
     */
    const onSubmit = async () => {
        const formattedEmail = validateEmail(email ?? "");
        try {
            if (formattedEmail) {
                dispatch(userClickPhoneValidationEvent());
                dispatch(authPhone(`${auth.phoneNumber}`, `${auth.countryCodes}`, true, email)).then(() => {
                    navigation.navigate("Code");
                });
            } else {
                setError(t("phone_verify.error"));
                return;
            }
        } catch (error) {
            console.log("error while onSubmit send email");
            console.error(error);
        }
    };

    const renderEmailInput = () => {
        return (
            <View style={phoneScreenStyles.phoneVerificationForm}>
                <View style={phoneScreenStyles.textInput}>
                    <FeatherIcon
                        name={"mail"}
                        size={25}
                        color={"black"}
                    />
                    <TextInput
                        style={phoneScreenStyles.text}
                        value={email || ""}
                        onChangeText={(text: string) => setEmail(text)}
                        placeholder={t("auth.email") ?? "Email"}
                        placeholderTextColor={COLORS.gray}
                        maxLength={30}
                        autoCapitalize="none"
                    />
                </View>
                <View style={phoneScreenStyles.submitContainer}>
                    <SubmitButton
                        inProgress={auth.isFetching}
                        disabled={auth.isFetching || !validateEmail(email || "")}
                        value={t("phone_verify.submit")}
                        onClick={onSubmit}
                        actionLabel={"SUBMIT_EMAIL"}
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
                keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
            >
                <ImageAtom source={LogoBikAir} resizeMode={"contain"} style={phoneScreenStyles.logo}/>
                <TextAtom style={phoneScreenStyles.title}>{t("phone_verify.title")}</TextAtom>
                <TextAtom style={auth.error ? phoneScreenStyles.error : phoneScreenStyles.instruction}>
                    {auth.error
                        ? t("phone_verify.error")
                        : t("send_email.title")}
                </TextAtom>
                {error ? (
                    <TextAtom style={phoneScreenStyles.error}>
                        {error}
                    </TextAtom>
                ) : null}
                {renderEmailInput()}
            </KeyboardAvoidingView>
        </View>
    );
};

export default SendEmailScreen;
