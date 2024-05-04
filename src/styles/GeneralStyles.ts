import {BASE, COLORS, FONTS, SIZES} from "@assets/constant";
import {Platform, StyleSheet} from "react-native";

export const generalStyles = StyleSheet.create({
    ShowDetailsContainer: {
        marginHorizontal: SIZES.sm,
        flexDirection: "column",
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    ShowDetails: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    detailsDropdownImage: {
        marginLeft: SIZES.base,
        height: 15,
        width: 15
    },
});

export const goBackStyles = StyleSheet.create({
    headerBar: {
        position: "absolute",
        top: 0,
        left: 0,
        width: BASE.window.width,
        zIndex: 9,
        padding: 10,
    },
    imageCross: {
        width: 30,
        height: 30
    },
});

export const cartListStyles = StyleSheet.create({
    cartItemContainer: {
        marginTop: SIZES.xl,
        paddingBottom: SIZES.padding,
        border: SIZES.radius,
        marginBottom: SIZES.padding,
        padding: SIZES.radius,
        borderRadius: SIZES.radius,
        borderWidth: 2,
        borderColor: COLORS.lightBlue,
        backgroundColor: COLORS.transparentPrimary9,
        width: "100%"
    },
    IconLabel: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: SIZES.base,
        paddingHorizontal: SIZES.sml,
        borderRadius: SIZES.radius
    },
    price: {
        backgroundColor: COLORS.lightBlue,
        flexDirection: "row",
        paddingHorizontal: 10,
        ...FONTS.body3,
        color: COLORS.white,
        padding: 5,
        borderRadius: SIZES.base,
        marginRight: 10,
        textAlign: "center"
    },
    priceCross: {
        textDecorationStyle: "solid",
        color: COLORS.yellow,
    },
    discount: {
        backgroundColor: COLORS.yellow,
        borderRadius: 18,
        transform: [{rotate: "-30deg"}],
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: -10,
        left: -15,
        width: 30,
        height: 30
    }
});

export const cartLogoStyles = StyleSheet.create({
    logo: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: COLORS.white,
    },
    logoWidthHeight: {
        width: 35,
        height: 35,
    }
});

export const couponButtonStyles = StyleSheet.create({
    buttonUseCookies: {
        padding: 10,
        height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: Platform.OS === "ios" ? 50 : SIZES.base,
        borderRadius: SIZES.radius,
        borderColor: COLORS.gray2,
        borderWidth: 1,
        borderStyle: "dashed",
        marginTop: 10
    },
    couponContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    imageArrowRight: {
        width: 25,
        height: 25,
        tintColor: COLORS.gray,
    },
    coupons: {
        width: 30,
        height: 30
    },
    textInput: {
        fontSize: 14,
        paddingVertical: 2,
        alignItems: "center",
        paddingLeft: 10,
        fontWeight: "500",
        width: "80%"
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: COLORS.red,
        fontSize: 12
    }
});

export const countDownStyles = StyleSheet.create({
    textCountdown: {
        fontWeight: "bold",
        marginBottom: 10
    }
});

export const contactStyles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        fontFamily: FONTS.main,
        marginTop: 16,
    },
    textPhone: {
        fontSize: 20,
        fontFamily: FONTS.main,
        marginTop: 16,
        fontWeight: "600",
        color: COLORS.darkBlue,
    },
    first: {
        marginTop: 0,
    },
});

export const tripStartScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: BASE.window.height,
    },
});

export const headerStyles = StyleSheet.create({
    root: {
        backgroundColor: COLORS.lightBlue,
    },
    header: {
        justifyContent: "space-between",
        padding: 15,
        flexDirection: "row",
    },
    title: {
        flex: 1,
        marginRight: 35,
        color: "white",
        fontFamily: FONTS.main,
        fontSize: 18,
        textAlign: "center",
    },
    icon: {
        marginRight: 25,
    },
});

export const helpButtonStyles = StyleSheet.create({
    container: {
        width: BASE.window.width,
        position: "absolute",
        bottom: 0,
        left: BASE.window.width - 90,
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20,
    }
});

export const menuButtonStyles = StyleSheet.create({
    controls: {
        width: BASE.window.width,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20,
    },
    redPoint: {
        position: "absolute",
        top: 0,
        right: 0,
        height: 15,
        width: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.red,
    }
});
