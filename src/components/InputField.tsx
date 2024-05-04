import {BASE, COLORS, FONTS} from "@assets/index";
import React from "react";
import {StyleSheet, TextInput, TouchableOpacity, View, ViewProps,} from "react-native";

interface InputFieldProps extends ViewProps {
    value?: string | null
    placeholder?: string
    onChange: (value: string) => void
}

const InputField: React.FC<InputFieldProps> = (
    {
        value,
        placeholder,
        onChange,
        children
    }): React.ReactElement => {
    return (
        <View style={styles.fields}>
            <TouchableOpacity onPress={() => onChange("")}>
                <View style={styles.retry}>
                    {children}
                </View>
            </TouchableOpacity>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={COLORS.darkGrey}
                style={styles.input}
                autoComplete={"sms-otp"}
                value={value ?? ""}
                onChangeText={onChange}
                textContentType={"oneTimeCode"} //for IOS
                keyboardType={"phone-pad"}
                maxLength={5}
            />
        </View>
    );
};

export default InputField;

const styles = StyleSheet.create({
    fields: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
        height: 60,
        backgroundColor: "white",
        borderRadius: BASE.radius.main,
        marginBottom: 20,
    },
    retry: {
        marginRight: 10,
    },
    input: {
        fontFamily: FONTS.main,
        fontSize: FONTS.sizeText,
        color: COLORS.black,
        width: "100%",
    },
});
