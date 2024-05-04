import {BASE, COLORS, FONTS, SIZES} from "@assets/constant";
import {StyleSheet} from "react-native";

export const tripPriceStyles = StyleSheet.create({
    textWrapper: {
        width: BASE.window.width - 20,
        backgroundColor: "white",
        padding: 10,
        marginBottom: BASE.margin,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: BASE.radius.main
    },
    textPriceLineThrough: {
        color: COLORS.darkGrey,
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
        fontSize: 15
    },
    textPrice: {
        color: COLORS.black,
        paddingVertical: 20,
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 20
    }
});

export const tripEndStyles = StyleSheet.create({
    frame: {
        minHeight: BASE.window.height,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: COLORS.white,
        marginBottom: 20,
    },
    textWrapper: {
        width: BASE.window.width - 20,
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10,
        padding: 10,
        marginBottom: BASE.margin

    },
    iconWrapper: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",

    },
    cbWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    },
    text: {
        padding: 20,
        fontSize: FONTS.sizeText,
        color: COLORS.black,
        fontWeight: "500",
        textAlign: "center"
    },
    buttonContainer: {
        width: BASE.window.width - 20,
        marginBottom: 30
    }
});

export const tripPause = StyleSheet.create({
    frame: {
        minHeight: BASE.window.height,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        width: "100%",
    },
    title: {
        color: COLORS.black,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 25,
        borderRadius: BASE.radius.main,
        paddingTop: 5,
        paddingBottom: 5,
    },
    paragraph: {
        fontSize: 17,
        color: COLORS.black,
        fontWeight: "500",
        textAlign: "center"
    },
    image: {
        height: 250,
        width: 250,
    },
    descContainer: {
        padding: 15,
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10,
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 30,
    },
});

export const tripHistoryStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightGrey,
    },
    itemContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: "white",
        borderRadius: BASE.radius.main,
        width: BASE.window.width - 20,
    },
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    date: {
        fontSize: 17,
        textTransform: "capitalize",
        color: COLORS.lightBlue,
    },
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.yellow,
    },
    priceCross: {
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
        color: COLORS.darkGrey,
    },
    noTrip: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: COLORS.darkGrey
    }
});

export const stepBeginCheckStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 270,
        width: 270,
    }
});

export const stepCheckDeposit = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 270,
        width: 270,
    }
});

export const stepTripBegin = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 300,
        width: 300
    }
});

export const stepTripUnlock = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 270,
        width: 270,
    }
});

export const stepTripStart = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 270,
        width: 270,
    }
});

export const tripStopStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    frame: {
        minHeight: BASE.window.height,
        backgroundColor: COLORS.white,
    },
    container: {
        minHeight: BASE.window.height,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 70,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 50,
        padding: 10,
        elevation: 10,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        marginTop: 20
    },
    buttonYellow: {
        backgroundColor: COLORS.yellow,
        shadowColor: COLORS.yellow
    },
    buttonLightBlue: {
        backgroundColor: COLORS.lightBlue,
        shadowColor: COLORS.lightBlue
    },
    textBtn: {
        color: COLORS.white,
        justifyContent: "center",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        marginRight: 10
    },
    message: {
        fontWeight: "600",
        fontSize: 22,
        textAlign: "center",
        color: COLORS.gray,
        marginTop: 10
    },
    image: {
        height: 250,
        width: 250,
    },
});

export const tripStepClosingLockStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80
    },
    image: {
        marginTop: 20,
        height: 270,
        width: 270,
    }
});

export const checkLockDefaultStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 270,
        width: 270,
    }
});

export const endCheckStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 270,
        width: 270
    }
});

export const stepFinishPaymentStyles = StyleSheet.create({
    submitContainer: {
        width: "100%",
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    image: {
        height: 200,
        width: 200,
    },
    crossButton: {
        position: "absolute",
        top: 50,
        right: 25
    },
});

export const stepTripEndStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 27,
        marginBottom: 10,
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        marginBottom: 30,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 270,
        width: 270,
    }
});

export const stepTripEndErrorStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
    },
    title: {
        marginTop: SIZES.padding,
        marginBottom: SIZES.radius,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    buttonContainerStyle: {
        height: 60,
        width: "100%",
        marginTop: SIZES.padding,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue,
    },
    buttonContainerStyle1: {
        height: 60,
        width: "100%",
        marginTop: SIZES.base,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue
    }
});

export const stepManualLockStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        justifyContent: "center",
        alignItems: "center"
    },
    imageContainer: {
        flexDirection: "row",
        marginTop: 30,
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 27
    },
    image: {
        height: 120,
        width: 120,
    },
    locks: {
        backgroundColor: COLORS.inputGrey,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});

export const stepManualLockBlackStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
    },
    title: {
        marginTop: SIZES.padding,
        marginBottom: SIZES.radius,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    textWrapper: {
        width: "100%",
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10,
        padding: 10,
        marginTop: SIZES.padding,
        marginBottom: BASE.margin
    },
    subTitleContainer: {
        padding: 10,
    },
    subTitle: {
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    buttonContainerStyle: {
        height: 60,
        width: "100%",
        marginTop: SIZES.base,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue
    },
    buttonContainerStyle1: {
        height: 60,
        width: "100%",
        marginTop: SIZES.padding,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue,
    }
});

export const stepManualLockBlackTutorialStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: SIZES.padding,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        marginBottom: SIZES.radius,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 27
    },
    textWrapper: {
        width: "100%",
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10,
        padding: 10,
        marginTop: SIZES.padding,
        marginBottom: BASE.margin
    },
    subTitleContainer: {
        padding: 10
    },
    subTitle: {
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    buttonContainerStyle: {
        height: 60,
        width: "100%",
        marginTop: SIZES.base,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue
    },
    buttonContainerStyle1: {
        height: 60,
        width: "100%",
        marginTop: SIZES.padding,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue,
    }
});

export const stepManualLockWhiteStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
    },
    title: {
        marginTop: SIZES.padding,
        marginBottom: SIZES.radius,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18,
        marginTop: 20,
        marginBottom: 20
    },
    buttonContainerStyle: {
        height: 60,
        width: "100%",
        marginTop: SIZES.radius,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue
    }
});

export const stepTripCancelStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 190,
        width: 190,
        marginBottom: 20
    }
});

export const stepTripClosingStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 270,
        width: 270
    }
});

export const stepTripEndValidateStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 27,
        marginBottom: 10,
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        marginBottom: 30,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    image: {
        height: 270,
        width: 270,
    }
});

export const stepTripLockConnectStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30,
        marginBottom: 15
    },
    subTitle: {
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 80,
        height: 80
    },
    image: {
        height: 270,
        width: 270,
    }
});

export const stepTripLockOpenStyles = StyleSheet.create({
    submitContainer: {
        width: "100%",
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 35,
        marginBottom: 30,
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        marginBottom: 30,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    loader: {
        width: 50,
        height: 13,
        marginBottom: 10
    },
    image: {
        height: 130,
        width: 130,
        marginBottom: 25
    }
});

export const stepTripLockTimeOutStyles = StyleSheet.create({
    submitContainer: {
        flexDirection: "row",
        padding: 2,
        width: "100%",
        justifyContent: "space-between",
    },
    button: {
        height: 50,
    },
    bleButton: {
        height: 50,
        paddingVertical: 10
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 27
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        marginBottom: 30,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    image: {
        height: 150,
        width: 150,
        marginBottom: 30
    }
});

export const stepTripPaidStyles = StyleSheet.create({
    submitContainer: {
        width: "100%",
        justifyContent: "flex-end"
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        marginBottom: 30,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    image: {
        height: 100,
        width: 100,
        marginBottom: 30
    }
});

export const stepTripPauseStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonContainer: {
        width: "100%",
    },
    title: {
        color: COLORS.black,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 25,
        borderRadius: BASE.radius.main,
        paddingTop: 5,
        paddingBottom: 5,
    },
    paragraph: {
        fontSize: 17,
        color: COLORS.black,
        fontWeight: "500",
        textAlign: "center"
    },
    image: {
        height: 270,
        width: 270,
    },
    descContainer: {
        padding: 15,
        backgroundColor: COLORS.transparentPrimary9,
        borderRadius: 10,
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 30,
    },
});

export const stepTripPaymentErrorStyles = StyleSheet.create({
    submitContainer: {
        paddingTop: 10,
        width: "100%"
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    image: {
        height: 270,
        width: 270,
    }
});

export const stepTripRetryClosingStyles = StyleSheet.create({
    submitContainer: {
        paddingTop: 10,
        width: "100%",
        justifyContent: "flex-end"
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 30
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    image: {
        height: 170,
        width: 170,
    }
});

export const stepTripReviewStyles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SIZES.padding
    },
    image: {
        alignSelf: "center",
        width: 200,
        height: 200,
    },
    blocStar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: 200,
        marginBottom: 100,
        marginTop: 10
    },
    inputOpinionView: {
        width: "100%",
    },
    inputOpinion: {
        textAlignVertical: "top",
        color: COLORS.black,
        width: "100%",
        height: 100,
        borderColor: "#63B1F9",
        backgroundColor: COLORS.transparentPrimary9,
        borderWidth: 2,
        borderRadius: 20,
        paddingLeft: 15,
        paddingRight: 5,
        paddingTop: 15,
        marginTop: 20,
        marginBottom: 20,
        elevation: 10,
        shadowColor: COLORS.lightBlue,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    buttonContainer: {
        width: "100%"
    },
    title: {
        color: COLORS.black,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 30,
        borderRadius: BASE.radius.main,
        paddingTop: 5,
        paddingBottom: 5,
    },
    subTitle: {
        color: COLORS.gray,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 10,
    },
    probWrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
    },
    childWrapper: {
        width: "100%",
        alignItems: "center",
    },
    text: {
        color: COLORS.gray,
        textAlign: "center",
        ...FONTS.h3
    },
});

export const stepVerifyLockClosedStyles = StyleSheet.create({
    submitContainer: {
        marginTop: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 26
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        marginBottom: 10,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    image: {
        height: 150,
        width: 150,
        marginBottom: 10
    }
});

export const stepWaitValidationStyles = StyleSheet.create({
    submitContainer: {
        width: "100%",
        justifyContent: "flex-end"
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        marginTop: SIZES.padding,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 25
    },
    subTitle: {
        marginTop: SIZES.padding,
        color: COLORS.gray,
        marginBottom: 30,
        fontWeight: "600",
        textAlign: "center",
        fontSize: 18
    },
    image: {
        height: 100,
        width: 100,
        marginBottom: 30
    }
});

export const TripDiscountStyles = StyleSheet.create({
    container: {
        width: BASE.window.width - 20,
        backgroundColor: "white",
        padding: 10,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    textPrice: {
        color: COLORS.black,
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 18
    }
});
