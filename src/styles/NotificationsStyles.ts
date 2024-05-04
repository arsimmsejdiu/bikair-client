import {BASE, COLORS, FONTS, SIZES} from "@assets/constant";
import {StyleSheet} from "react-native";

export const notificationsListStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    markAsReadContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: SIZES.padding
    },
    flatList: {
        marginBottom: 10,
        height: "85%",
        paddingHorizontal: SIZES.padding
    },
    noNotificationContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SIZES.padding
    },
    image: {
        width: 200,
        height: 200
    },
    text: {
        marginTop: SIZES.padding,
        textAlign: "center",
        ...FONTS.h3
    }
});

export const notificationCardStyles = StyleSheet.create({
    container: {
        marginTop: SIZES.padding,
        padding: SIZES.radius,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.transparentPrimary9
    },
    logoContainer: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: COLORS.white2,
    },
    image: {
        width: 35,
        height: 35,
    },
    infoContainer: {
        flex: 1,
        marginLeft: SIZES.radius
    },
    redPoint: {
        position: "absolute",
        top: -5,
        right: 5,
        height: 15,
        width: 15,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.red,
    },
    textSentAt: {
        color: COLORS.lightBlue,
        ...FONTS.body5
    },
    readMoreText: {
        flex: 1, color:
        COLORS.yellow,
        ...FONTS.body5,
        paddingVertical: 15
    }
});

export const notificationSettingsStyles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: "center",
        backgroundColor: COLORS.white,
        padding: BASE.margin
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,

    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
        color: COLORS.darkGrey
    },
    content: {
        width: "100%",
        // height: 40,

    },
    notificationWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        height: "auto",
        borderWidth: 1,
        borderColor: COLORS.darkGrey,
        marginBottom: 10,
        padding: 10,
        borderRadius: BASE.radius.main
    },
    text: {
        width: "80%"
    }
});

export const notificationItemScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.xl,
        backgroundColor: COLORS.white
    },
    itemContainer: {
        marginBottom: SIZES.padding,
        padding: SIZES.radius,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.transparentPrimary9
    },
    imageContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        paddingHorizontal: SIZES.base
    },
    image: {
        width: 100,
        height: 100
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        paddingHorizontal: SIZES.base
    },
    title: {
        flex: 1,
        ...FONTS.h3,
        fontSize: 18,
        textAlign: "center"
    },
    messageContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIZES.base
    },
    message: {
        flex: 1,
        color: COLORS.darkGrey,
        ...FONTS.h5,
        paddingVertical: 15
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: SIZES.base
    },
    date: {
        color: COLORS.lightBlue,
        ...FONTS.body5
    },
});
