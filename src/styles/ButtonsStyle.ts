import {BASE, COLORS, FONTS} from "@assets/constant";
import {StyleSheet} from "react-native";

export const ButtonsStyles = StyleSheet.create({
    squareContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: BASE.radius.main,
        height: 50,
    },
    primaryButton: {
        backgroundColor: COLORS.lightBlue,
    },
    successButton: {
        backgroundColor: COLORS.green,
    },
    highlightContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: BASE.radius.main,
        padding: 15,
        height: 50,
        backgroundColor: COLORS.yellow,
    },
    cancelButtonContainer: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: BASE.radius.main,
        backgroundColor: COLORS.red,
    },
    whiteText: {
        fontFamily: FONTS.main,
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    },
    control: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 25,
    },
    lowProfileButton: {
        backgroundColor: "none",
        justifyContent: "center",
        alignItems: "center",
    },
    lowProfileText: {
        textDecorationLine: "underline",
    },
});
