import {BASE, BUTTON_SIZE, COLORS, FONTS, SIZES} from "@assets/constant";
import {CAPTURE_BUTTON_SIZE} from "@services/constants";
import {Platform, StyleSheet} from "react-native";

export const appCameraStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    captureButton: {
        position: "absolute",
        alignSelf: "center",
        marginBottom: SIZES.radius,
    },
});

export const captureButtonStyles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    shadow: {
        position: "absolute",
        width: CAPTURE_BUTTON_SIZE,
        height: CAPTURE_BUTTON_SIZE,
        borderRadius: CAPTURE_BUTTON_SIZE / 2,
    },
    button: {
        width: CAPTURE_BUTTON_SIZE,
        height: CAPTURE_BUTTON_SIZE,
        borderRadius: CAPTURE_BUTTON_SIZE / 2,
        borderWidth: 3,
        borderColor: "white",
    },
    innerButton: {
        width: 65,
        height: 65,
        borderRadius: CAPTURE_BUTTON_SIZE / 2,
        backgroundColor: "white",
        alignSelf: "center",
        marginTop: 3
    }
});

export const labelOverlayStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: COLORS.white2,
        marginHorizontal: 25,
        marginTop: 20,
        width: "90%",
        height: "40%",
        borderRadius: 10
    },
    button: {
        marginBottom: SIZES.padding,
        width: 50,
        height: 50,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: "rgba(140, 140, 140, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonCross: {
        marginBottom: SIZES.padding,
        width: 60,
        height: 60,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
    },
    rightButtonRow: {
        position: "absolute",
        zIndex: 20,
        elevation: 20,
    },
    header: {
        marginTop: Platform.OS === "ios" ? 0 : -15,
        paddingTop: Platform.OS === "ios" ? 50 : 25,
        height: "33.33%",
    },
    title: {
        color: COLORS.black,
        marginTop: 20,
        paddingHorizontal: 15,
        textAlign: "center",
        ...FONTS.h5
    },
    title1: {
        color: COLORS.white,
        marginTop: 15,
        paddingHorizontal: 15,
        textAlign: "center",
        alignItems: "center",
        ...FONTS.h4
    },
    image: {
        width: 50,
        height: 50,
        position: "absolute",
        bottom: 2,
        right: 1,
        opacity: 0.7
    },
    image1: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    targetContainer: {
        height: Platform.OS === "ios" ? "40%" : "50%",
        marginTop: -50
    },
    targetWrapper: {
        flex: 1,
        flexDirection: "row",
    },
    sideTarget: {
        flex: 1,
    },
    target: {
        flex: 10,
        padding: 20,
        position: "relative",
    },
    corner: {
        width: 30,
        height: 30,
        position: "absolute",
    },
    cornerTopLeft: {
        left: 0,
        top: 0,
        borderLeftColor: COLORS.yellow,
        borderLeftWidth: 5,
        borderTopColor: COLORS.yellow,
        borderTopWidth: 5,
    },
    cornerBottomLeft: {
        left: 0,
        bottom: 0,
        borderLeftColor: COLORS.yellow,
        borderLeftWidth: 5,
        borderBottomColor: COLORS.yellow,
        borderBottomWidth: 5,
    },
    cornerTopRight: {
        right: 0,
        top: 0,
        borderRightColor: COLORS.yellow,
        borderRightWidth: 5,
        borderTopColor: COLORS.yellow,
        borderTopWidth: 5,
    },
    cornerBottomRight: {
        right: 0,
        bottom: 0,
        borderRightColor: COLORS.yellow,
        borderRightWidth: 5,
        borderBottomColor: COLORS.yellow,
        borderBottomWidth: 5,
    },
});

export const photoOverlayStyles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        width: BASE.window.width,
        height: BASE.window.height,
    },
    image: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    buttonsContainer: {
        position: "absolute",
        width: "80%",
        left: "10%",
        bottom: "20%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonBackground: {
        borderRadius: 100,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    submitButton: {
        margin: 10,
        fontSize: 50,
    }
});

export const qrCodeOverlayStyles = StyleSheet.create({
    header: {
        marginTop: Platform.OS === "ios" ? 0 : 0,
        paddingTop: Platform.OS === "ios" ? 50 : 25,
        paddingLeft: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: "33.33%",
    },
    button: {
        marginBottom: SIZES.padding,
        width: 50,
        height: 50,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: "rgba(140, 140, 140, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    rightButtonRow: {
        position: "absolute",
        zIndex: 20,
        elevation: 20,
    },
    title: {
        color: "white",
        fontFamily: FONTS.main,
        fontSize: 20,
        marginTop: 80,
        textAlign: "center",
    },
    targetContainer: {
        height: "33.35%",

    },
    targetWrapper: {
        flex: 1,
        flexDirection: "row",
    },
    sideTarget: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    target: {
        flex: 3,
        padding: 20,
        position: "relative",
    },
    corner: {
        width: 30,
        height: 30,
        position: "absolute",
    },
    cornerTopLeft: {
        left: 0,
        top: 0,
        borderLeftColor: "white",
        borderLeftWidth: 3,
        borderTopColor: "white",
        borderTopWidth: 3,
    },

    cornerBottomLeft: {
        left: 0,
        bottom: 0,
        borderLeftColor: "white",
        borderLeftWidth: 3,
        borderBottomColor: "white",
        borderBottomWidth: 3,
    },

    cornerTopRight: {
        right: 0,
        top: 0,
        borderRightColor: "white",
        borderRightWidth: 3,
        borderTopColor: "white",
        borderTopWidth: 3,
    },

    cornerBottomRight: {
        right: 0,
        bottom: 0,
        borderRightColor: "white",
        borderRightWidth: 3,
        borderBottomColor: "white",
        borderBottomWidth: 3,
    },
});

export const statusBarBlurBackgroundStyles = StyleSheet.create({
    statusBarBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
});
