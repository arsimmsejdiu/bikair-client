import {COLORS, FeatherIcon, LogoBikAir} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {SubmitButton} from "@components/Buttons";
import InputText from "@components/InputField";
import TextButton from "@components/Molecule/TextButton";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {authConfirm} from "@redux/reducers/auth";
import {userClickOtpValidationEvent} from "@redux/reducers/events";
import {AuthStackScreenProps} from "@stacks/types";
import {codeScreenStyles} from "@styles/CodeScreenStyles";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback, useEffect, useMemo,useState} from "react";
import {useTranslation} from "react-i18next";
import {KeyboardAvoidingView, Platform, StatusBar, View, ViewProps} from "react-native";

interface Props extends ViewProps, AuthStackScreenProps<"Code"> {
    navigation: any
}

const CodeScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const {t} = useTranslation();
    const [otp, setOtp] = useState<string | null>(null);
    const auth = useAppSelector(state => state.auth);
    const [showEmailButton, setShowEmailButton] = useState(false);
    const dispatch = useAppDispatch();

    // Extracted variables
    const isIOS = useMemo(() => Platform.OS === "ios", []);
    const isOtpEmpty = useMemo(() => otp === null, [otp]);

    const onSubmit = useCallback(() => {
        if (!isOtpEmpty && otp) {
            dispatch(authConfirm(otp));
        }
    }, [otp, dispatch, isOtpEmpty]);

    useEffect(() => {
        dispatch(userClickOtpValidationEvent(otp));
    }, [otp, dispatch, isOtpEmpty]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setShowEmailButton(true);
        }, 10000); // Delay of 10 seconds

        return () => {
            clearTimeout(timerId); // Clear the timer when the component is unmounted or the button is shown
        };
    }, []);

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "CodeScreen").then(r => console.log(r));
    }, []));

    return (
        <View style={codeScreenStyles.container}>
            <StatusBar
                backgroundColor={COLORS.lightGrey}
                barStyle={"dark-content"}
            />
            <KeyboardAvoidingView
                behavior={isIOS ? "padding" : "height"}
                style={codeScreenStyles.keyboard}
                enabled={Platform.OS === "ios"}
                keyboardVerticalOffset={isIOS ? 0 : 20}>
                <ImageAtom
                    source={LogoBikAir}
                    resizeMode={"contain"}
                    style={codeScreenStyles.logo}
                />

                <View style={codeScreenStyles.formContainer}>
                    <TextAtom style={codeScreenStyles.title}>
                        {t("auth.title")}
                    </TextAtom>
                    <TextAtom style={auth.error ? codeScreenStyles.error : codeScreenStyles.instruction}>
                        {auth.error ? t("phone_verify.error") : t("auth.instruction")}
                    </TextAtom>
                    <View style={codeScreenStyles.formContainer}>
                        <InputText
                            onChange={setOtp}
                            value={otp}
                            placeholder={t("auth.code") ?? "Code"}
                        >
                            <FeatherIcon
                                name={"rotate-ccw"}
                                size={20}
                                color={"black"}
                            />
                        </InputText>
                        <View style={codeScreenStyles.submitContainer}>
                            <SubmitButton
                                disabled={auth.isFetching || (otp === null || otp.length !== 5)}
                                inProgress={auth.isFetching}
                                value={otp === null ? t("auth.enter") : t("auth.submit")}
                                onClick={onSubmit}
                                actionLabel={"SUBMIT_OTP"}
                            />
                        </View>

                        {showEmailButton && <View style={codeScreenStyles.submitContainer}>
                            <TextAtom style={{
                                textAlign: "center",
                                paddingVertical: 10,
                                color: COLORS.darkGrey
                            }}>{t("auth.not_received")}</TextAtom>
                            <TextButton
                                label={t("auth.email") ?? "Resend via email"}
                                actionLabel={"SUBMIT_OTP"}
                                labelStyle={{color: COLORS.black, fontSize: 14}}
                                buttonContainerStyle={codeScreenStyles.buttonUseCookies}
                                onPress={() => navigation.navigate("SendEmail")}
                            />
                        </View>
                        }
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default CodeScreen;
