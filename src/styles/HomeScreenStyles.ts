import {BASE, COLORS, FONTS} from "@assets/constant";
import {StyleSheet} from "react-native";

export const homeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightGrey,
    },
    unlock: {
        position: "absolute",
        bottom: 40,
        zIndex: 4,
    }
});

export const updateScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightGrey,
    },
    title: {
        fontFamily: FONTS.main,
        fontSize: 25,
        color: COLORS.darkBlue,
        textAlign: "center",
    },
    logo: {
        width: 70,
        height: 50,
    },
    instruction: {
        textAlign: "center",
        fontFamily: FONTS.main,
        color: COLORS.darkGrey,
        fontSize: 13,
        padding: 20,
    },
    submitContainer: {
        marginTop: 10,
        width: BASE.window.width - 20,
    },
});

export const w3dSecureStyles = StyleSheet.create({
    indicator: {
        flex: 1,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
});
