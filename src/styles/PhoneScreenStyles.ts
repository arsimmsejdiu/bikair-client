import {BASE, COLORS, FONTS} from "@assets/constant";
import {StyleSheet} from "react-native";

export const phoneScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightGrey,
    },
    phoneInputContainer: {
        width: "100%",
        borderRadius: 5,
        minHeight: 60,
    },
    phoneTextContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 5,
    },
    keyboard: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 70,
        height: 50,
    },
    title: {
        fontFamily: FONTS.main,
        fontSize: 25,
        color: COLORS.darkBlue,
        textAlign: "center",
    },
    instruction: {
        textAlign: "center",
        fontFamily: FONTS.main,
        color: COLORS.darkGrey,
        fontSize: 13,
        padding: 20,
    },
    error: {
        textAlign: "center",
        fontFamily: FONTS.main,
        color: COLORS.red,
        fontWeight: "bold",
        fontSize: 13,
        padding: 20,
    },
    phoneVerificationForm: {
        width: BASE.window.width - 20,
    },
    submitContainer: {
        marginTop: 10,
    },
    secondButton: {
        color: COLORS.darkBlue,
        margin: 10,
    },
    textInput: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        height: 70,
        backgroundColor: COLORS.white,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    text: {
        fontFamily: FONTS.main,
        fontSize: FONTS.sizeText,
        color: COLORS.black,
        width: "100%",
        marginLeft: 10
    }
});
