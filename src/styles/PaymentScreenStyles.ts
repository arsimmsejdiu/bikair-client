import {BASE, COLORS, FONTS, SIZES} from "@assets/constant";
import {StyleSheet} from "react-native";

export const paymentScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: SIZES.radius
    },
    itemHolder: {
        borderRadius: 10,
        paddingBottom: 10,
        marginBottom: 15,
        paddingTop: 20,
        width: "100%",
        alignItems: "center"
    },
    wrapperInfo: {
        marginBottom: 20
    },
    buttonContainerStyle: {
        width: "100%",
        height: 55,
        borderRadius: SIZES.padding,
        marginVertical: 10
    }
});

export const cardInfoStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginTop: 10,
        padding: 15,
        borderRadius: 12,
        backgroundColor: "#e9e9fa"
    },
    cardInfoContainer: {
        flex: 1,
        marginLeft: 12
    },
    imageCardInfoContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    imageCardInfo: {
        width: 120,
        height: 120,
    },
    textCardInfoContainer: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 18,
        lineHeight: 22,
        paddingVertical: 5,
        textAlign: "center"
    },
    innerTextCardInfo: {
        fontWeight: "bold",
        textDecorationLine: "underline"
    }
});

export const cardInfoDepositStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        padding: 15,
        borderRadius: 12,
        backgroundColor: "#e9e9fa"
    },
    imageContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    image: {
        width: 120,
        height: 120,
    },
    text: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 18,
        lineHeight: 22,
        paddingVertical: 5,
        textAlign: "center"
    },
    text1: {
        fontFamily: "Poppins-SemiBold",
        fontSize: 18,
        lineHeight: 22,
        paddingVertical: 5,
        textAlign: "center",
        fontWeight: "bold",
        textDecorationLine: "underline"
    }
});

export const cardCreditStyles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        justifyContent: "space-between",
        padding: 20,
        borderRadius: 15,
        marginTop: 20,
        height: 200,
        shadowColor: COLORS.lightBlue,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    brandContainer: {
        flex: 1,
        alignItems: "center"
    },
    last4Container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    lat4Text: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 16
    },
    paymentExpired: {
        color: COLORS.white,
        fontWeight: "300",
        fontSize: 12
    },
    text: {
        color: COLORS.white,
        fontSize: 10
    },
    addCartText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 16
    },
    firstAndLastName: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 14,
        marginTop: 10,
    }
});

export const googlePayStyles = StyleSheet.create({
    googlePay: {
        backgroundColor: "black",
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: BASE.radius.main,
        height: 50,
        flexDirection: "row",
        width: BASE.window.width - (BASE.margin * 2)
    },
    whiteText: {
        fontFamily: FONTS.main,
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    }
});

export const paymentButtonStyles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.lightBlue,
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: BASE.radius.main,
        height: 50,
        flexDirection: "row",
        width: BASE.window.width - (BASE.margin * 2)
    },
    whiteText: {
        fontFamily: FONTS.main,
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    }
});

export const applePayStyles = StyleSheet.create({
    applePay: {
        backgroundColor: "black",
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: BASE.radius.main,
        height: 50,
        flexDirection: "row",
        width: BASE.window.width - (BASE.margin * 2)
    },
    whiteText: {
        fontFamily: FONTS.main,
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    }
});

export const linearGradientColors = [COLORS.darkBlue, COLORS.lightBlue, COLORS.lightBlue];
