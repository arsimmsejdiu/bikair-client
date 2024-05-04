import {COLORS, FONTS, SIZES} from "@assets/constant";
import {Platform, StyleSheet} from "react-native";

export const subscriptionScreenStyles = StyleSheet.create({
    container: {
        border: SIZES.radius,
        marginBottom: SIZES.xl,
        marginTop: SIZES.radius,
        padding: SIZES.radius,
        borderRadius: SIZES.radius,
        borderWidth: 2,
        borderColor: COLORS.lightBlue,
        backgroundColor: COLORS.transparentPrimary9,
        position: "relative",
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
    priceCross: {
        textDecorationStyle: "solid",
        color: COLORS.yellow,
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
    textButtonContainer: {
        flex: 1,
        height: 50,
        borderRadius: SIZES.padding,
    },
    logo: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: COLORS.white,
    },
    discount: {
        backgroundColor: COLORS.yellow,
        borderRadius: 18,
        transform: [{rotate: "-30deg"}],
        position: "absolute",
        top: -10,
        left: -15,
        width: 30,
        height: 30
    },
    percentDiscountText: {
        color: COLORS.white,
        marginTop: 8,
        textAlign: "center",
        fontSize: 10
    },
    priceDiscountText: {
        color: COLORS.white,
        textDecorationLine: "line-through",
        paddingHorizontal: 5,
        textDecorationStyle: "solid",
        ...FONTS.body5
    },
    toPayText: {
        color: COLORS.white,
        paddingHorizontal: 5,
        textDecorationStyle: "solid",
        ...FONTS.h4
    },
    headerContainer: {
        flex: 1,
        marginLeft: SIZES.radius,
        flexDirection: "row",
    },
    headerPosition: {
        flexDirection: "column",
        justifyContent: "space-between",
    },
    contentContainer: {
        flexDirection: "row",
        marginTop: SIZES.base
    },
    frequencyDurationWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        width: "100%",
        paddingVertical: 5
    }
});

export const myCartScreenStyles = StyleSheet.create({
    myCartContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    wrapper: {
        paddingHorizontal: SIZES.padding,
        marginBottom: 10
    },
    wrappingWarningContent: {
        flexDirection: "row",
        paddingVertical: 10
    },
    warningInfoContainer: {
        flex: 1,
        marginLeft: 12
    },
    warningContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
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
    contentWrapper: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 12,
        lineHeight: 22,
        paddingVertical: 5,
        textAlign: "center"
    },
    imageInfo: {
        width: 30,
        height: 30,
    },
    errorMessage: {
        color: COLORS.red,
        textAlign: "center"
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
        width: "80%",
        color: COLORS.black
    },
    creditCardWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderColor: COLORS.inputGrey,
        borderRadius: 10,
        borderWidth: 1,
        padding: 20
    },
    imageCardVisaCB: {
        width: 25,
        height: 25,
        paddingHorizontal: 15
    },
    imageMaster: {
        width: 35,
        height: 25,
        paddingHorizontal: 5
    },
    addCardText: {
        marginRight: 10,
        color: COLORS.darkBlue
    },
    image: {
        width: 25, height: 25
    }
});

export const footerTotalStyles = StyleSheet.create({
    container: {
        padding: SIZES.padding,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: COLORS.white
    },
    priceContainer: {
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: SIZES.padding,
        flexDirection: "row",
        paddingHorizontal: SIZES.radius,
    },
    linearGradient: {
        position: "absolute",
        top: -15,
        left: 0,
        right: 0,
        height: Platform.OS === "ios" ? 200 : 50,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    discount: {
        backgroundColor: COLORS.yellow,
        borderRadius: 50,
        transform: [{rotate: "-30deg"}],
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        top: -20,
        left: -20,
        width: 40,
        height: 40
    },
    total: {
        textAlign: "right",
        color: COLORS.lightBlue,
        paddingTop: 10
    },
    toPay: {
        color: COLORS.lightBlue,
        textDecorationStyle: "solid",
        paddingHorizontal: 5,
        ...FONTS.h2
    },
    button: {
        height: 60,
        marginTop: SIZES.padding,
        borderRadius: SIZES.padding,
    },
    totalDiscounted: {
        color: COLORS.lightBlue,
        paddingHorizontal: SIZES.base,
        marginTop: 5,
        textDecorationStyle: "solid",
        ...FONTS.body3
    }
});

export const noOfferStyle = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SIZES.padding
    },
    image: {
        width: 150,
        height: 150
    },
    title: {
        marginTop: SIZES.padding,
        ...FONTS.h1
    },
    description: {
        textAlign: "center",
        marginTop: SIZES.sm,
        color: COLORS.darkGrey,
        ...FONTS.body3
    }
});

export const productListStyle = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: SIZES.padding,
        paddingHorizontal: SIZES.padding
    },
    headerHeight: {
        height: 20
    },
    footerHeight: {
        height: 50
    }
});

export const subscriptionListStyle = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: SIZES.padding,
        paddingHorizontal: SIZES.padding
    },
});
