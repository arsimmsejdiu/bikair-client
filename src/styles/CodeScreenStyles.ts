import {BASE, COLORS, FONTS, SHADOW, SIZES} from "@assets/constant";
import {Platform, StyleSheet} from "react-native";

export const codeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightGrey,
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
        fontSize: 13,
        fontWeight: "bold",
        padding: 20,
    },
    formContainer: {
        width: BASE.window.width - 20,
    },
    submitContainer: {
        marginTop: 5,
    },
    buttonUseCookies: {
        height: 55,
        width: "100%",
        marginBottom: Platform.OS === "ios" ? 50 : SIZES.base,
        borderRadius: SIZES.base,
        borderColor: COLORS.gray2,
        borderWidth: 1,
        backgroundColor: COLORS.white,
        marginTop: 10,
        boxShadow: SHADOW,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 5,
    },
});
