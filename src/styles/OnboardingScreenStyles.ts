import {COLORS, FONTS, SIZES} from "@assets/constant";
import {StyleSheet} from "react-native";

export const onboardingScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    image: {
        marginTop: 30,
        width: SIZES.width * 0.5,
        height: 100,
    },
    dotsContainer: {
        height: 160,
    },
    paginateDots: {
        flex: 1,
        justifyContent: "center",
    },
    paginateBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        alignSelf: "center",
    }
});

export const onboardingScreenPageViewStyles = StyleSheet.create({
    container: {
        width: SIZES.width,
        height: "100%"
    },
    imageContainer: {
        flex: 3,
    },
    imageBackground: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        height: "100%",
        width: "100%",
    },
    image: {
        width:
            SIZES.height > 800
                ? SIZES.width * 0.8
                : SIZES.width * 0.7,
        height:
            SIZES.height > 800
                ? SIZES.width * 0.8
                : SIZES.width * 0.7,
        marginBottom: -SIZES.padding,
    },
    detailsContainer: {
        flex: 1,
        marginTop: 30,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SIZES.radius,
    },
    detailsText: {
        marginTop: SIZES.radius,
        textAlign: "center",
        color: COLORS.darkGray,
        paddingHorizontal: SIZES.padding,
        ...FONTS.body3,
    }
});

export const onboardingScreenButtonsStyles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    skipContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: SIZES.padding,
        marginVertical: SIZES.padding,
    },
    labelSkipStyle: {
        color: COLORS.darkGray2,
    },
    buttonContainerSkipStyle: {
        height: 60,
        width: 200,
        borderRadius: SIZES.padding,
    },
    buttonContainer: {
        paddingHorizontal: SIZES.padding,
        marginVertical: SIZES.padding,
    },
    buttonContainerStyle: {
        height: 60,
        borderRadius: SIZES.radius,
    }
});
