import {BASE, COLORS, FONTS, SHADOW, SIZES} from "@assets/constant";
import {Platform, StyleSheet} from "react-native";

export const newsPopupStyles = StyleSheet.create({
    // Container that wraps the whole page
    container: {
        flex: 1,
    },
    //Button style
    buttonAccept: {
        position: "absolute",
        alignSelf: "center",
        bottom: 20,
        zIndex: 10,
        height: 70,
        width: "90%",
        marginBottom: Platform.OS === "ios" ? 50 : SIZES.base,
        borderRadius: SIZES.padding,
        backgroundColor: COLORS.lightBlue,
        boxShadow: SHADOW,
        shadowColor: COLORS.lightBlue,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
    },
    item: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%"
    },
    touchablePart: {
        height: 200,
        position: "absolute",
        bottom: 0,
        width: BASE.window.width,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    //Close image button
    imageClose: {
        position: "absolute",
        zIndex: 10,
        top: 30,
        left: 30
    },
    imageSize: {
        width: 20,
        height: 20,
        tintColor: COLORS.black,
    },
    paginationBarContainer: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        width: 100,
        alignSelf: "center",
    }
});

export const specialOffersStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        width: "100%",
        zIndex: 9,
    },
    dotContainer: {
        justifyContent: "center",
    },
    offerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 140
    },
    offerTitle: {
        paddingHorizontal: SIZES.padding,
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    offerPhrase: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30
    },
    imageCross: {
        position: "absolute",
        zIndex: 10,
        top: 30,
        left: 30
    },
    image: {
        width: 30,
        height: 30,
        tintColor: COLORS.white
    },
    paginationBarContainer: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        width: 100,
        alignSelf: "center",
    }
});

export const firstTripOffersStyles = StyleSheet.create({
    container: {
    },
    modalView: {
        borderRadius: 30,
        width: 335,
        height: 400,
        padding: 20,
    },
    descriptionContainer: {
        borderRadius: 50,
        backgroundColor: COLORS.lightBlue,
        padding: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    description: {
        fontSize: 16,
        textAlign: "left",
        fontFamily: FONTS.main,
        paddingBottom: 5,
        color: COLORS.white,
        fontWeight: "700",
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15
    },
    title: {
        fontSize: 25,
        marginLeft: 10,
        textAlign: "left",
        fontFamily: FONTS.main,
        fontWeight: "bold",
        color: COLORS.white
    },
    imageContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.yellow,
        borderRadius: 50,
        padding: 5
    },
    buttonContainerStyle: {

    }
});
