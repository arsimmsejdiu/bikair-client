import {BASE, COLORS, FONTS} from "@assets/constant";
import {StyleSheet} from "react-native";

export const userScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.lightGrey,
    },
    error: {
        color: "red",
        textAlign: "center",
    },
    keyboard: {
        flex: 1,
    },
    switch: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 6,
        height: 30,
        width: 30,
        fontSize: 18,
        textDecorationLine: "none"
    },
    logoContainer: {
        backgroundColor: "white",
        borderRadius: 150,
        marginTop: BASE.margin,
        alignItems: "center",
        justifyContent: "center",
        height: 150,
        width: 150,
        marginBottom: 20
    },
    logo: {
        height: 100,
        width: 100,
    },
    formContainer: {
        justifyContent: "center",
    },
    fullNameContainer: {
        width: BASE.window.width - 20,
        justifyContent: "space-between",
        flexDirection: "row",
        alignContent: "center",
    },
    inputContainer: {
        width: "48%",
        marginTop: BASE.margin,
    },
    inputLabel: {
        color: COLORS.darkBlue,
        fontFamily: FONTS.label,
        fontWeight: "bold",
        fontSize: FONTS.sizeText,
    },
    input: {
        fontFamily: FONTS.main,
        fontSize: FONTS.sizeText,
        color: COLORS.black,
        height: 45,
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderColor: COLORS.darkGrey,
        borderRadius: BASE.radius.main,
    },
    submitContainer: {
        marginTop: BASE.margin * 2,
        marginBottom: BASE.margin,
    },
    deleteContainer: {
        marginTop: BASE.margin,
        marginBottom: BASE.margin,
    },
    inputIOS: {
        color: COLORS.black,
        fontSize: FONTS.sizeText,
    },
    inputAndroid: {
        color: COLORS.black,
        fontSize: FONTS.sizeText,
    },
    checkBoxWrapper: {
        marginTop: BASE.margin,
        flexDirection: "row",
    },
    cguWrapper: {
        flex: 1,
        flexWrap: "wrap",
    },
    cgu: {
        fontSize: FONTS.sizeText,
        color: COLORS.darkBlue,
        fontWeight: "bold",
        marginRight: 10,
    },
    deleteLink: {
        color: COLORS.red,
        textDecorationLine: "underline",
        textAlign: "center",
    },
});
