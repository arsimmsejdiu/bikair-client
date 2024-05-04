import {BASE, COLORS, FONTS} from "@assets/constant";
import {Platform, StyleSheet} from "react-native";

export const spotDetailsStyles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : 50,
    },
    modalView: {
        position: "relative",
        width: BASE.window.width - 40,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    bikeWrap: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    title: {
        color: "white",
        fontSize: 18,
    },
    error: {
        color: "red",
    },
    button: {
        borderRadius: BASE.radius.main,
        backgroundColor: COLORS.yellow,
        width: "100%",
        elevation: 2,
    },
    addressWrap: {
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15
    },
    addressText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    descriptionWrap: {
        flexDirection: "column",
        marginBottom: 5,
        backgroundColor: COLORS.transparentPrimary10,
        borderRadius: 10
    },
    descriptionText: {
        fontWeight: "600",
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    text: {
        textAlign: "center",
        flexWrap: "wrap",
    },
    spotNameContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        marginLeft: 15,
        width: 200
    }
});

export const bikeDetailsStyles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : 50,
    },
    modalView: {
        position: "relative",
        width: BASE.window.width - 40,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    bikeWrap: {
        borderRadius: 30,
        backgroundColor: COLORS.lightBlue,
        height: 40,
        width: 110,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "white",
        fontSize: 18,
    },
    error: {
        color: "red",
    },
    button: {
        borderRadius: BASE.radius.main,
        backgroundColor: COLORS.yellow,
        width: "100%",
        elevation: 2,
    },
    addressWrap: {
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    addressText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    infoWrap: {
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",

        marginBottom: 15,
    },
    text: {
        textAlign: "center",
        flexWrap: "wrap",
    },
});

export const bluetoothStyles = StyleSheet.create({
    container: {
        justifyContent: "center",
        // flex: 1,
        alignItems: "center"
    },
    modalView: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        width: BASE.window.width - 40,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textOpen: {
        fontSize: 20,
        textAlign: "center",
        fontFamily: FONTS.main,
        paddingBottom: 5,
        fontWeight: "bold",
    },
    message: {
        fontSize: 15,
        textAlign: "center",
        fontFamily: FONTS.main,
        paddingBottom: 20,
    },
    imageContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    imageBle: {
        width: 70,
        height: 110,
    },
    imageLock: {
        width: 170,
        height: 150,
    },
    button: {
        marginHorizontal: 20,
        marginVertical: 20,
        borderColor: COLORS.darkBlue,
        borderWidth: 2,
        borderRadius: 10,
        width: "70%",
        height: 30,
        alignItems: "center",
        justifyContent: "center",
    }
});

export const bluetoothErrorModalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    centeredView: {
        height: BASE.window.height,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: BASE.window.width,
    },
    modalView: {
        backgroundColor: "white",
        position: "relative",
        width: BASE.window.width - 20,
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 4,
    },
    buttonContainer: {
        width: "100%",
    },
    title: {
        color: COLORS.black,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        borderRadius: BASE.radius.main,
        paddingTop: 15,
        paddingBottom: 5,
    },
    paragraphe: {
        fontSize: 15,
        color: COLORS.black,
        marginBottom: 15,
    }
});

export const checkPermissionsStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    modalView: {
        backgroundColor: "white",
        position: "relative",
        width: BASE.window.width - 20,
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 4,
    },
    buttonContainer: {
        width: "100%",
    },
    title: {
        color: COLORS.black,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        borderRadius: BASE.radius.main,
        paddingTop: 15,
        paddingBottom: 5,
    },
    paragraphe: {
        fontSize: 15,
        color: COLORS.black,
        marginBottom: 15,
    },
});

export const ScannerStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formWrapper: {
        justifyContent: "flex-start",
        alignItems: "center",
        position: "absolute",
        bottom: 70,
        width: BASE.window.width
    },
    formContainer: {
        width: BASE.window.width - 20,
        position: "relative",
        minHeight: 60,
        flexDirection: "row",
        padding: 4,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.lightGrey,
        borderRadius: BASE.radius.main,
        marginBottom: Platform.OS === "ios" ? 0 : -50,
        backgroundColor: COLORS.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.35,
    },
    textInput: {
        backgroundColor: "transparent",
        color: COLORS.black,
        fontSize: FONTS.sizeText
    }
});


export const toastNotificationStyles = StyleSheet.create({
    toastNotification : {
        marginTop: 30,
        backgroundColor: COLORS.transparentPrimary10,
        borderRadius: 15,
        width: "100%",
        height: 75,
        borderRightColor: COLORS.lightBlue,
        borderTopColor: COLORS.lightBlue,
        borderLeftColor: COLORS.lightBlue,
        borderBottomColor: COLORS.lightBlue,
        borderRightWidth: 8,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        shadowColor: COLORS.lightBlue,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 20,
    }
});

export const helpCenterStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        alignItems: "center",
        backgroundColor: COLORS.lightGrey,
    },
    content: {
        width: BASE.window.width - 20,
    },
    inputLabel: {
        fontSize: FONTS.sizeText,
        marginTop: 20,
        color: COLORS.darkBlue,
        fontWeight: "bold",
    },
    input: {
        fontSize: FONTS.sizeText,
        color: COLORS.black,
        borderBottomWidth: 2,
        borderColor: COLORS.darkGrey,
        paddingLeft: 10,
        // backgroundColor: "white",
        height: BASE.inputHeight,
    },
    buttonContainer: {
        marginTop: 30,
    },
    error: {
        color: COLORS.red,
        fontSize: FONTS.sizeText,
        marginBottom: 10,
        fontWeight: "bold",
    },
    success: {
        color: COLORS.green,
        fontSize: FONTS.sizeText,
        marginBottom: 10,
        fontWeight: "bold",
    },
    inputIOS: {
        color: COLORS.black,
        fontSize: FONTS.sizeText,
        height: BASE.inputHeight,
        borderBottomWidth: 2,
        borderColor: COLORS.darkGrey,
    },
    inputAndroid: {
        color: COLORS.black,
        fontSize: FONTS.sizeText,
        borderBottomWidth: 2,
        borderColor: COLORS.darkGrey,
    },
    contactContainer: {
        marginTop: BASE.margin,
        marginBottom: 40,
    },
    bikePartContainer: {
        // flex: 1,
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "center",
        alignSelf: "center",
        flexDirection: "row",
        width: BASE.window.width - 20,
    },
    flatList: {
        borderWidth: 1,
        borderColor: COLORS.darkGrey,
        borderRadius: 10,
        marginHorizontal: 5,
        marginVertical: 5,
        height: 80,
        width: 80,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F7F7",
    },
    textFlatList: {
        fontFamily: FONTS.main,
        textAlign: "center",
    },
});
