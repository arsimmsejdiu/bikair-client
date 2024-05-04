import {TextAtom} from "@components/Atom/TextAtom";
import {contactStyles} from "@styles/GeneralStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {Linking, TouchableOpacity, View, ViewProps} from "react-native";

type Props = ViewProps

const Contact: React.FC<Props> = (): React.ReactElement => {

    const {t} = useTranslation();

    return (
        <View style={contactStyles.container}>
            <TextAtom style={{...contactStyles.text, ...contactStyles.first}}>
                {t("contact.question")}
            </TextAtom>
            <TextAtom style={contactStyles.text}>{t("contact.open_hours")}</TextAtom>
            <TextAtom style={contactStyles.text}>{t("contact.callUs")}</TextAtom>
            <TouchableOpacity
                onPress={() =>
                    Linking.openURL(`tel:${t("contact.phoneNumber")}`)
                }>
                <TextAtom style={contactStyles.textPhone}>
                    {t("contact.phoneNumberText")}
                </TextAtom>
            </TouchableOpacity>
        </View>
    );
};

export default Contact;
