import {COLORS, SHADOW, SIZES} from "@assets/constant";
import {Platform, StyleSheet} from "react-native";

export const acceptCookiesStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        zIndex: 10
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        justifyContent: "center",
        alignItems: "center"
    },
    paragraphContainer1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    paragraphContainer2: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    line: {
        width: 150,
        height: 1,
        marginBottom: 50,
        backgroundColor: COLORS.inputGrey
    },
    imageCross: {
        position: "absolute",
        top: 30,
        left: 30
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.black,
        marginBottom: 30,
        textAlign: "left"
    },
    paragraph: {
        color: "#767474",
        fontSize: 16,
        lineHeight: 30
    },
    buttonAccept: {
        height: 55,
        width: "100%",
        marginBottom: Platform.OS === "ios" ? 50 : SIZES.base,
        borderRadius: SIZES.base,
        backgroundColor: COLORS.lightBlue,
        marginTop: 70,
        boxShadow: SHADOW,
        shadowColor: COLORS.lightBlue,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
    },
});

export const rgpdScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        zIndex: 10,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 120,
        paddingBottom: 30
    },
    line: {
        width: 150,
        height: 1,
        marginBottom: 50,
        alignSelf: "flex-start",
        backgroundColor: COLORS.inputGrey
    },
    imageCross: {
        position: "absolute",
        top: 30,
        left: 30
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.black,
        marginBottom: 30,
        textAlign: "left",
        alignSelf: "flex-start",
    },
    paragraph: {
        color: "#767474",
        fontSize: 14,
        lineHeight: 30
    },
    buttonAccept: {
        height: 55,
        width: "100%",
        marginBottom: Platform.OS === "ios" ? 50 : SIZES.base,
        borderRadius: SIZES.base,
        backgroundColor: COLORS.lightBlue,
        boxShadow: SHADOW,
        shadowColor: COLORS.lightBlue,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
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
    continueWOAcceptingContainer: {
        marginTop: 20,
        marginBottom: 20
    },
    continueWOAccepting: {
        color: COLORS.darkGrey,
        textDecorationLine: "underline",
        fontSize: 14,
        textAlign: "center"
    },
    image: {
        width: 20,
        height: 20
    }
});
