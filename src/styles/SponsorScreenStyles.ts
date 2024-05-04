import {BASE, COLORS, SIZES} from "@assets/constant";
import {StyleSheet} from "react-native";

export const sponsorScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.white
    },
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    title: {
        color: COLORS.lightBlue,
        fontSize: 30,
        paddingLeft: BASE.window.width / 8,
        paddingRight: BASE.window.width / 8,
        textAlign: "center",
    },
    descContainer: {
        paddingHorizontal: SIZES.radius,
        paddingVertical: SIZES.radius,
        backgroundColor: COLORS.lightGrey,
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 10,
    },
    descWrapper: {
        flex: 3,
        paddingHorizontal: SIZES.padding
    },
    image: {
        height: 200,
        width: 200,
        marginTop: BASE.window.width / 6,
        paddingLeft: "50%",
        paddingRight: "50%",
    },
    button: {
        position: "relative",
        justifyContent: "center",
        height: 70,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: COLORS.yellow,
        borderRadius: 50,
        padding: 10,
        elevation: 10,
        shadowColor: COLORS.yellow,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    textLabel: {
        color: COLORS.lightBlue,
        textAlign: "center",
        fontSize: 18,
        marginBottom: 10,
    },
    textBtn: {
        color: COLORS.white,
        justifyContent: "center",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
    },
    icon: {
        position: "absolute",
        right: 20,
        top: 20,
    },
    crossContainer: {
        position: "absolute",
        zIndex: 9,
        top: 30,
        left: 30
    },
    imageCross: {
        width: 25,
        height: 25
    },
    imagePriceTag: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    textContainer: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.darkGrey,
        flexWrap: "wrap",
        width: "85%"
    },
});
