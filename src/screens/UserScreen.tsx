import {COLORS, LogoBikAir} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {ScrollViewAtom} from "@components/Atom/ScrollViewAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {SubmitButton} from "@components/Buttons";
import Loader from "@components/Loader";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import messaging from "@react-native-firebase/messaging";
import {useFocusEffect} from "@react-navigation/native";
import {authLogout, deleteUser, fetching, refreshAuth} from "@redux/reducers/auth";
import {errorOccured, getPhoneInfos, userClickSubscriptionEvent} from "@redux/reducers/events";
import {getCitiesAndZones} from "@redux/reducers/initialState";
import {setSnackbar} from "@redux/reducers/snackbar";
import {instanceApi} from "@services/axiosInterceptor";
import {PUT_USER} from "@services/endPoint";
import {DrawerStackScreenProps} from "@stacks/types";
import {userScreenStyles} from "@styles/UserScreenStyles";
import {getAge, validateEmail} from "@utils/helpers";
import React, {useCallback, useRef} from "react";
import {useTranslation} from "react-i18next";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ViewProps,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RNPickerSelect from "react-native-picker-select";

import i18next from "../translation/i18n";
import {PutUserOutput} from "@bikairproject/shared";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";

interface Props extends ViewProps, DrawerStackScreenProps<"User"> {
}

const UserScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const [acceptedTerms, setAcceptedTerms] = React.useState(false);
    const [lastname, setLastname] = React.useState<string | null>(null);
    const [firstname, setFirstname] = React.useState<string | null>(null);
    const [email, setEmail] = React.useState<string | null>(null);
    const [phone, setPhone] = React.useState<string | null>(null);
    const [day, setDay] = React.useState<string | null>(null);
    const [month, setMonth] = React.useState<string | null>(null);
    const [year, setYear] = React.useState<string | null>(null);
    const [city, setCity] = React.useState<number | null>(null);
    const [resident, setResident] = React.useState(true);
    const [error, setError] = React.useState<any>(null);
    const auth = useAppSelector(state => state.auth);
    const citiesSelectPicker = useAppSelector(state => state.initialState.citiesSelectPicker);
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const monthRef = useRef<TextInput | null>(null);
    const yearRef = useRef<TextInput | null>(null);
    const emailRef = useRef<TextInput | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getPhoneInfos());
            dispatch(getCitiesAndZones());
            if (auth.me && !auth.isFetching && !auth.newUser) {
                const birthdayDate = auth.me.birthdate === null ? null : new Date(auth.me.birthdate);
                const birthDay = birthdayDate === null ? null : birthdayDate.getDate();
                const birthMonth = birthdayDate === null ? null : birthdayDate.getMonth();
                const birthYear = birthdayDate === null ? null : birthdayDate.getFullYear();
                setAcceptedTerms(auth.me.terms_accepted ?? false);
                setFirstname(auth.me.firstname ?? null);
                setLastname(auth.me.lastname ?? null);
                setEmail(auth.me.email ?? null);
                setDay(String(birthDay));
                setMonth(String(birthMonth));
                setYear(String(birthYear));
                setCity(auth.me.city_id ?? null);
                setResident(auth.me.resident ?? false);
                setError(null);
            }
            setPhone(auth.me?.phone ?? null);
        }, [auth])
    );

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "UserScreen").then(r => console.log(r));
    }, []));

    const onSubmit = async () => {
        dispatch(userClickSubscriptionEvent());

        // Terms and conditions accepted
        if (!acceptedTerms) {
            setError(t("account.error_terms"));
            return;
        }

        // Validate data before sending
        if (!firstname || !lastname) {
            setError(t("account.error_lname_fname"));
            return;
        }
        if (!year || !day || !month) {
            setError(t("account.error_birthdate"));
            return;
        }
        const y = parseInt(year) >= 1900 && parseInt(year) <= 2010;
        const d = parseInt(day) >= 1 && parseInt(day) <= 31;
        const m = parseInt(month) >= 1 && parseInt(month) <= 12;
        if (!y || !d || !m) {
            setError(t("account.error_birthdate"));
            return;
        }

        if (getAge(year + "-" + month + "-" + day) < 16) {
            setError(t("account.error_age"));
            return;
        }

        if (!validateEmail(email)) {
            setError(t("account.error_email"));
            return;
        }
        if (!phone) {
            setError(t("account.error_phone"));
            return;
        }
        if (!city) {
            setError(t("account.error_city"));
            return;
        }

        const token = await messaging().getToken();
        const data = {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
            email: (email ?? "").trim(),
            phone: phone,
            city_id: city,
            resident: resident,
            birthdate: day.padStart(2, "0") + "/" + month.padStart(2, "0") + "/" + year,
            terms_accepted: acceptedTerms,
            device_token: token
        };

        // Dispatch in store
        try {
            dispatch(fetching(true));
            await instanceApi.put<PutUserOutput>(PUT_USER, data);
            dispatch(refreshAuth());
            dispatch(setSnackbar({message: i18next.t("success"), type: "success"}));
            setError(null);
            navigation.navigate("Home", {
                screen: "Cookies"
            });

        } catch (error: any) {
            dispatch(setSnackbar({message: error.message, type: "danger"}));
            dispatch(errorOccured(error));
        } finally {
            dispatch(fetching(false));
        }
    };

    const onDeleteUser = () => {
        Alert.alert(
            t("account.confirm_delete_account"),
            t("account.delete_account_info") ?? "Êtes-vous sûr de vouloir supprimer votre compte ?",
            [
                {
                    text: t("wording.yes") ?? "Oui",
                    onPress: async () => {
                        dispatch(deleteUser());
                        dispatch(authLogout());
                    },
                },
                {
                    text: t("wording.no") ?? "Non",
                },
            ],
        );
    };

    if (auth.isDeleting) {
        return <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={userScreenStyles.container}>
            <View style={userScreenStyles.logoContainer}>
                <ImageAtom
                    source={LogoBikAir}
                    resizeMode={"contain"}
                    style={userScreenStyles.logo}
                />
            </View>
            {auth.error || error ? <Text style={userScreenStyles.error}>{auth.error}{error}</Text> : null}
            <ScrollViewAtom
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}>

                <View style={userScreenStyles.formContainer}>
                    <View style={userScreenStyles.fullNameContainer}>
                        <View style={userScreenStyles.inputContainer}>
                            <TextAtom style={userScreenStyles.inputLabel}>{t("account.firstname")}</TextAtom>
                            <TextInput
                                placeholder={t("account.firstname") ?? "Nom"}
                                placeholderTextColor={COLORS.inputGrey}
                                style={[userScreenStyles.input, {borderColor: error && !firstname ? COLORS.red : COLORS.darkGrey}]}
                                value={firstname ?? ""}
                                onChangeText={text => setFirstname(text)}
                                keyboardType={"default"}
                            />
                        </View>
                        <View style={userScreenStyles.inputContainer}>
                            <TextAtom style={userScreenStyles.inputLabel}>{t("account.lastname")}</TextAtom>
                            <TextInput
                                placeholder={t("account.lastname") ?? "Prénom"}
                                placeholderTextColor={COLORS.inputGrey}
                                style={[userScreenStyles.input, {borderColor: error && !lastname ? COLORS.red : COLORS.darkGrey}]}
                                value={lastname ?? ""}
                                onChangeText={text => setLastname(text)}
                                keyboardType={"default"}
                            />
                        </View>
                    </View>
                    <View style={userScreenStyles.fullNameContainer}>
                        <View style={[userScreenStyles.inputContainer, {width: "31%"}]}>
                            <TextAtom style={userScreenStyles.inputLabel}>{t("account.day")}</TextAtom>
                            <TextInput
                                placeholder={t("account.placeholder_day") ?? "Jour"}
                                placeholderTextColor={COLORS.inputGrey}
                                style={[userScreenStyles.input, {borderColor: error && !day ? COLORS.red : COLORS.darkGrey}]}
                                value={day ?? ""}
                                onChangeText={text => {
                                    if (text.length === 2 && monthRef.current) {
                                        setDay(text);
                                        monthRef.current.focus();
                                        return;
                                    }
                                    setDay(text);
                                }}
                                keyboardType={"phone-pad"}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    if (monthRef.current) {
                                        monthRef.current.focus();
                                    }
                                }}
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={[userScreenStyles.inputContainer, {width: "31%"}]}>
                            <TextAtom style={userScreenStyles.inputLabel}>{t("account.month")}</TextAtom>
                            <TextInput
                                placeholder={t("account.placeholder_month") ?? "Mois"}
                                placeholderTextColor={COLORS.inputGrey}
                                ref={monthRef}
                                style={[userScreenStyles.input, {borderColor: error && !month ? COLORS.red : COLORS.darkGrey}]}
                                value={month ?? ""}
                                onChangeText={text => {
                                    if (text.length === 2 && yearRef.current) {
                                        setMonth(text);
                                        yearRef.current.focus();
                                        return;
                                    }
                                    setMonth(text);
                                }}
                                keyboardType={"phone-pad"}
                            />
                        </View>
                        <View style={[userScreenStyles.inputContainer, {width: "31%"}]}>
                            <TextAtom style={userScreenStyles.inputLabel}>{t("account.year")}</TextAtom>
                            <View>
                                <TextInput
                                    placeholder={t("account.placeholder_year") ?? "Année"}
                                    placeholderTextColor={COLORS.inputGrey}
                                    style={[userScreenStyles.input, {borderColor: error && !year ? COLORS.red : COLORS.darkGrey}]}
                                    value={year ?? ""}
                                    onSubmitEditing={() => {
                                        if (emailRef.current) {
                                            emailRef.current.focus();
                                        }
                                    }}
                                    blurOnSubmit={false}
                                    ref={yearRef}
                                    onChangeText={text => {
                                        if (text.length === 4 && emailRef.current) {
                                            setYear(text);
                                            emailRef.current.focus();
                                            return;
                                        }
                                        setYear(text);
                                    }}
                                    keyboardType={"phone-pad"}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={[userScreenStyles.inputContainer, {width: "100%"}]}>
                        <TextAtom style={userScreenStyles.inputLabel}>{t("account.email")}</TextAtom>
                        <TextInput
                            ref={emailRef}
                            placeholder={t("account.email") ?? "Email"}
                            placeholderTextColor={COLORS.inputGrey}
                            style={[userScreenStyles.input, {borderColor: error && !email ? COLORS.red : COLORS.darkGrey}]}
                            value={email ?? ""}
                            onChangeText={text => setEmail(text)}
                            keyboardType={"email-address"}
                        />
                    </View>
                    <View style={[userScreenStyles.inputContainer, {width: "100%"}]}>
                        <TextAtom style={userScreenStyles.inputLabel}>{t("account.phone")}</TextAtom>
                        <TextInput
                            placeholder={t("account.phone") ?? "Téléphone"}
                            placeholderTextColor={COLORS.inputGrey}
                            style={[userScreenStyles.input, {color: COLORS.darkGrey}]}
                            value={phone ?? ""}
                            editable={false}
                        />
                    </View>
                    <View style={userScreenStyles.fullNameContainer}>
                        <View style={[userScreenStyles.inputContainer, {width: "62%"}]}>
                            <TextAtom style={userScreenStyles.inputLabel}>{t("account.city")}</TextAtom>
                            <View style={userScreenStyles.input}>
                                {
                                    citiesSelectPicker.length > 0 &&
                                    <RNPickerSelect
                                        value={city}
                                        style={{
                                            inputAndroid: userScreenStyles.inputAndroid,
                                            inputIOS: userScreenStyles.inputIOS,
                                        }}
                                        placeholder={{label: t("account.select_city"), value: null}}
                                        useNativeAndroidPickerStyle={false}
                                        onValueChange={(value) => setCity(value)}
                                        items={citiesSelectPicker}
                                    />
                                }
                            </View>
                        </View>
                        <View style={[userScreenStyles.inputContainer, {width: "31%"}]}>
                            <TextAtom style={userScreenStyles.inputLabel}>
                                {resident ? t("account.residence") : t("account.vacancies")}
                            </TextAtom>
                            <Switch
                                value={resident}
                                trackColor={{false: "#767577", true: "#81b0ff"}}
                                thumbColor={resident ? "#f5dd4b" : "#f4f3f4"}
                                onValueChange={(value) => setResident(value)}
                                style={userScreenStyles.switch}
                            />
                        </View>
                    </View>
                    <View
                        style={userScreenStyles.checkBoxWrapper}>
                        <BouncyCheckbox
                            fillColor={COLORS.lightBlue}
                            iconStyle={{
                                borderColor: error && !acceptedTerms ? COLORS.red : COLORS.darkGrey,
                                borderRadius: 6,
                                height: 20,
                                width: 20,
                            }}
                            innerIconStyle={{
                                borderColor: error && !acceptedTerms ? COLORS.red : COLORS.darkGrey,
                                borderRadius: 6,
                                height: 20,
                                width: 20,
                            }}
                            useNativeDriver={true}
                            isChecked={acceptedTerms}
                            disableBuiltInState
                            onPress={() => setAcceptedTerms(!acceptedTerms)}
                        />

                        <View style={userScreenStyles.cguWrapper}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Terms")}>
                                <Text style={userScreenStyles.cgu}>{t("account.checkbox_terms")}</Text>
                            </TouchableOpacity>
                        </View>

                    </View >
                    <View style={userScreenStyles.submitContainer}>
                        <SubmitButton
                            disabled={auth.isFetching}
                            inProgress={auth.isFetching}
                            value={t(`account.${auth.newUser ? "create" : "save"}`)}
                            onClick={onSubmit}
                            actionLabel={"SUBMIT_USER_INFO"}
                        />
                    </View>
                    {
                        !auth.newUser ?
                            (
                                <View style={userScreenStyles.deleteContainer}>
                                    <TouchableOpacity onPress={onDeleteUser} disabled={auth.isDeleting}>
                                        <TextAtom
                                            style={userScreenStyles.deleteLink}>{t("account.delete_account")}</TextAtom>
                                    </TouchableOpacity>
                                </View>
                            ) : null
                    }
                </View>
            </ScrollViewAtom>
        </KeyboardAvoidingView>
    );
};

export default UserScreen;
