import {COLORS, FONTS, SIZES} from "@assets/constant";
import {StyleSheet} from "react-native";

export const cancelScreenStyle = StyleSheet.create({
    cancelContainer: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelReason: {
        marginTop: SIZES.padding,
        marginBottom: 30,
        fontWeight: "bold",
        fontSize: 21
    },
    cancelingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SIZES.base,
    },
    checkbox: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        marginBottom: 10
    },
    iconStyle: {
        borderColor: COLORS.darkGrey,
        borderRadius: 6,
        height: 25,
        width: 25,
    },
    innerIconStyle: {
        borderColor: COLORS.darkGrey,
        borderRadius: 6,
        height: 25,
        width: 25,
    },
    textInput: {
        flexDirection: "row",
        borderWidth: 1,
        marginTop: 10,
        borderColor: COLORS.black,
        marginBottom: 20,
        borderRadius: 10,
        width: "100%",
        height: 55,
        paddingHorizontal: 20,
        color: COLORS.black
    },
    buttonStyle: {
        height: 55,
        width: "100%",
        marginBottom: SIZES.base,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue
    },
    buttonStyle1: {
        height: 55,
        marginBottom: SIZES.padding,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.yellow,
        width: "100%"
    }
});

export const deleteScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white
    },
    contentContainerTrue: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    imageTrue: {
        width: 200,
        height: 200
    },
    textTrue: {
        marginTop: SIZES.sm,
        textAlign: "center",
        ...FONTS.h2
    },
    contentContainerFalse: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    imageFalse: {
        width: 120,
        height: 120
    },
    textFalse: {
        marginTop: SIZES.padding,
        ...FONTS.h1
    },
    buttonContainerStyle: {
        height: 55,
        marginBottom: SIZES.padding,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue
    }
});

export const errorScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white
    },
    imageContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    imageBikeYellow: {
        width: 200,
        height: 200
    },
    validatePurchase: {
        marginTop: SIZES.sm,
        textAlign: "center", ...FONTS.h2
    },
    orderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    errorMessage: {
        textAlign: "center",
        marginTop: SIZES.base,
        color: COLORS.darkGrey,
        ...FONTS.body3
    },
    buttonStyle: {
        height: 55,
        marginBottom: SIZES.padding,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue
    }
});

export const successScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white
    },
    contentContainerTrue: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    imageTrue: {
        width: 200,
        height: 200
    },
    textTrue: {
        marginTop: SIZES.sm,
        textAlign: "center",
        ...FONTS.h2
    },
    contentContainerFalse: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    imageFalse: {
        width: 220,
        height: 220
    },
    textFalse: {
        marginTop: SIZES.padding,
        ...FONTS.h1
    },
    date: {
        textAlign: "center",
        marginTop: SIZES.base,
        color: COLORS.darkGrey,
        ...FONTS.body3
    }
});
