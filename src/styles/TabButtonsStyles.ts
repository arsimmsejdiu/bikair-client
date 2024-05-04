import {BASE, COLORS, FONTS, SIZES} from "@assets/constant";
import {StyleSheet} from "react-native";

export const tabButtonsStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 50,
        marginTop: SIZES.radius,
        paddingHorizontal: SIZES.padding
    },
    buttonContainerStyle: {
        flex: 1,
        borderRadius: SIZES.radius,
    },
    buttonContainerStyle1: {
        flex: 1,
        borderRadius: SIZES.radius,
        marginLeft: SIZES.padding,
    }
});

export const textButtonsStyles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.lightBlue,
        shadowColor: COLORS.lightBlue,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    text: {
        flex: 1,
        textAlign: "right",
        color: COLORS.white,
        ...FONTS.h3,
    }
});

export const timeMeterStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        justifyContent: "flex-start",
        position: "absolute",
        width: BASE.window.width - BASE.margin,
        borderRadius: BASE.radius.medium,
        elevation: BASE.elevation.medium,
        padding: BASE.margin,
    },
    modalView: {},
    modalContent: {
        backgroundColor: "white",
    },
    priceWrapper: {
        flexDirection: "row",
        flex: 1,
        flexWrap: "wrap",
        justifyContent: "space-evenly",
    },
    priceBlock: {
        marginLeft: 5,
        marginRight: 5,
        alignItems: "center",
    },
    label: {
        textTransform: "uppercase",
        color: COLORS.darkGrey,
        textAlign: "left",
        marginBottom: -5,
        ...FONTS.h4
    },
    text: {
        textTransform: "uppercase",
        color: COLORS.lightBlue,
        fontWeight: "bold",
        textAlign: "center",
        ...FONTS.body1
    },
});

export const toastNotificationStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 20,
    },
    text: {
        color: COLORS.lightBlue,
        ...FONTS.h5
    },
    textTitle: {
        flexWrap: "wrap",
        color: COLORS.lightBlue,
        width: "90%",
        ...FONTS.h5
    }
});

export const networkStateStyles = StyleSheet.create({
    container: {
        backgroundColor: "red",
        padding: 2,
    },
    text: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold"
    }
});
