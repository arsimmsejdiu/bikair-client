import {BASE, COLORS, FONTS, SIZES} from "@assets/constant";
import {StyleSheet} from "react-native";

export const promotionScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.white,
    },
    buttonUseCookies: {
        padding: 10,
        height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: SIZES.base,
        borderRadius: SIZES.radius,
        borderColor: COLORS.lightBlue,
        borderWidth: 1.5,
        borderStyle: "dashed",
        marginTop: 30
    },
    couponContainer: {
        flexDirection: "row",
        alignItems: "center",
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
    content: {
        width: BASE.window.width - 20,
        backgroundColor: COLORS.white,
    },
    formContainer: {
        // backgroundColor: 'white',
        borderBottomWidth: 2,
        borderColor: COLORS.darkGrey,
        borderRadius: BASE.radius.main,
    },
    input: {
        fontSize: FONTS.sizeText,
        backgroundColor: "transparent",
        paddingLeft: 10,
        // textTransform: "uppercase",
        height: BASE.inputHeight,
        color: COLORS.black,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom:20
    },
    listContainer: {
        flex: 1,
    },
    itemContainer: {
        width: BASE.window.width - 20,
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 10,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: COLORS.darkGrey,

    },
    header: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",

    },
    value: {
        backgroundColor: COLORS.green,
        width: "100%",
        color: "white",
        borderTopRightRadius: 6,
        borderBottomLeftRadius: 6,
        padding: 10,
        fontSize: 19,
        textAlign: "center",
        fontWeight: "bold",
    },
    text: {
        fontSize: FONTS.sizeText,
        marginTop: 10,

    },
    progressBarContainer: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    }
});
