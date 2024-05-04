import {BASE, COLORS, FONTS} from "@assets/constant";
import {StyleSheet} from "react-native";

export const drawerStyles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.lightBlue,
    },
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: COLORS.white,
    },

    header: {
        height: 90,
        backgroundColor: COLORS.lightBlue,
        alignItems: "center",
        paddingTop: 10,
    },

    profileTouchable: {
        position: "absolute",
        top: 80,
        left: (BASE.drawer.width - 110) / 2,
        width: 110,
        height: 150,
    },
    logo: {
        height: 55,
        width: 55,
    },
    avatarContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 80,
        width: 80,
        borderRadius: 52,
        borderColor: COLORS.white,
        backgroundColor: COLORS.lightBlue,
        borderWidth: 1,
        overflow: "hidden",
    },
    avatar: {
        height: "100%",
        width: "100%",
        backgroundColor: "blue",
    },
    name: {
        marginTop: 30,
        textAlign: "center",
        fontFamily: FONTS.main,
        fontSize: FONTS.sizeText,
        color: COLORS.lightBlue,
    },
    firsName: {
        flexWrap: "wrap",
        color: COLORS.white,
        ...FONTS.h3
    },

    lines: {
        flex: 1,
        padding: 25,
        marginTop: 15,
    },

    line: {
        flexDirection: "row",
        height: 45,
        alignItems: "center",
        marginBottom: 25,
    },

    icon: {
        marginRight: 25,
    },

    lineText: {
        fontFamily: FONTS.main,
        fontSize: FONTS.sizeText,
        color: COLORS.black,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 25,
        paddingVertical: 10,
    },

    cgu: {
        fontFamily: FONTS.main,
        fontSize: 13,
        color: COLORS.black,
    },

    version: {
        fontFamily: FONTS.main,
        fontSize: 12,
        color: COLORS.darkGrey,
    },

    discount: {
        backgroundColor: COLORS.yellow,
        borderRadius: 50,
        // transform: [{rotate: "30deg"}],
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
        position: "absolute",
        top: -15,
        right: 1,
        padding: 5
    }
});
