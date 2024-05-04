import {BASE, COLORS, SIZES} from "@assets/constant";
import {StyleSheet} from "react-native";

export const bikeStatusInfoStyles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        paddingHorizontal: SIZES.padding,
    },
    crossContainer: {
        position: "absolute",
        zIndex: 9,
        top: 20,
        right: 30
    },
    imageCross: {
        width: 25,
        height: 25
    },
});

export const notFoundContentStyle = StyleSheet.create({
    container: {
        height: BASE.window.height,
        paddingHorizontal: SIZES.padding,
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingBottom: 40
    },
    image: {
        width: 150,
        height: 150
    },
    textButton: {
        height: 55,
        width: "100%",
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue,
        minWidth: 200
    },
    descContainer: {
        padding: 20,
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10
    },
    message: {
        textAlign: "center",
        fontWeight: "600",
        fontSize: 22,
    },
    description: {
        marginTop: SIZES.radius,
        textAlign: "center",
        fontSize: 15,
        color: COLORS.gray,
        flexWrap: "wrap"
    }
});

export const usedContentStyles = StyleSheet.create({
    container: {
        height: BASE.window.height,
        paddingHorizontal: SIZES.padding,
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingBottom: 40
    },
    image: {
        width: 170,
        height: 170
    },
    textButton: {
        height: 55,
        width: "100%",
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue,
        minWidth: 200
    },
    descContainer: {
        padding: 20,
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10
    },
    message: {
        fontWeight: "600",
        fontSize: 22,
        textAlign: "center",
        marginBottom: 10
    },
    description: {
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
        color: COLORS.gray
    }
});

export const rentalContentStyles = StyleSheet.create({
    container: {
        height: BASE.window.height,
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingBottom: 40
    },
    image: {
        width: 250,
        height: 150,
    },
    descContainer: {
        padding: 20,
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10
    },
    message: {
        fontWeight: "600",
        fontSize: 21,
        textAlign: "center"
    },
    description: {
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
        color: COLORS.gray,
    },
    description1: {
        marginTop: SIZES.base,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
        color: COLORS.gray
    },
    invalidMessage: {
        paddingHorizontal: SIZES.radius,
        marginBottom: 10,
        marginTop: -SIZES.base,
        color: COLORS.red,
        fontWeight: "bold",
        fontSize: 12,
    },
    textInput: {
        flexDirection: "row",
        borderWidth: 2,
        marginTop: 30,
        borderColor: COLORS.black,
        marginBottom: 20,
        borderRadius: 10,
        width: "100%",
        height: 55,
        paddingHorizontal: 20,
        backgroundColor: COLORS.lightGrey
    },
    textInputText: {
        color: COLORS.black
    }
});

export const maintenanceContentStyles = StyleSheet.create({
    container: {
        height: BASE.window.height,
        paddingHorizontal: SIZES.padding,
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingBottom: 40
    },
    image: {
        width: 150,
        height: 150
    },
    textButton: {
        height: 55,
        width: "100%",
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue,
        minWidth: 200
    },
    descContainer: {
        padding: 20,
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10
    },
    message: {
        textAlign: "center",
        fontWeight: "600",
        fontSize: 22,
        marginBottom: 10
    },
    description: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "500",
        color: COLORS.gray,
        flexWrap: "wrap"
    }
});

export const bookedContentStyles = StyleSheet.create({
    container: {
        height: BASE.window.height,
        paddingHorizontal: SIZES.padding,
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingBottom: 40
    },
    image: {
        width: 150,
        height: 150
    },
    textButton: {
        height: 55,
        width: "100%",
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue,
        minWidth: 200
    },
    descContainer: {
        padding: 20,
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    message: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 21
    },
    description: {
        marginTop: SIZES.base,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 16,
        color: COLORS.gray
    }
});

export const bikePhotoStyles = StyleSheet.create({
    loading: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    root: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "none"
    },
});
