// Group all global variable for theme
import {Dimensions, Platform} from "react-native";

// Constant
const {width, height} = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

export const NB_TUTO_DISPLAY = 8;
export const S3_URL_NEWS = "https://bikair-news.s3.eu-west-3.amazonaws.com/";

// Themes
export const COLORS = {
    darkBlue: "#277CC2",
    lightBlue: "#47B2FF",
    extraLightBlue: "#ecf2f9",
    yellow: "#FDC556",
    darkYellow: "#cd994f",
    orange: "#ee9612",
    rose: "#D6398F",
    bordeau: "#B20238",
    darkGrey: "#A4AAB3",
    darkGray: "#525C67",
    darkGray2: "#757D85",
    lightGrey: "#F7F7F7",
    black: "#4A4A4A",
    red: "#EC4B4B",
    lightRed: "#eea6a6",
    green: "#1BCE8A",
    gray: "#898B9A",
    gray2: "#BBBDC1",
    gray3: "#CFD0D7",
    white: "#FFFFFF",
    inputGrey: "#DCDCDC",
    transparentPrimary9: "#e9eeffe6",
    transparentPrimary10: "#e9eeff",
    transparentBlack7: "#000000b3",
    lightGray1: "#DDDDDD",
    lightGray2: "#F5F5F8",
    transparent: "transparent",
    white2: "#FBFBFB",
    greenSpot: "#6EFF33"
};

export const STATUS_COLORS = {
    PAYMENT_SUCCESS: COLORS.green,
    FREE_TRIP: COLORS.green,
    OPEN: COLORS.yellow,
    WAIT_VALIDATION: COLORS.orange,
    CLOSED: COLORS.darkGrey,
    FAILED: COLORS.red,
    PAYMENT_FAILED: COLORS.red,
    PAYMENT_IN_PROGRESS: COLORS.darkYellow,
    PAYMENT_ON_HOLD: COLORS.yellow,
    CANCEL: COLORS.red,
    EXPERIMENTATION: COLORS.orange
};

export const SIZES = {
    // global sizes
    sm: 4,
    sml: 6,
    base: 8,
    font: 14,
    radius: 12,
    radiusL: 18,
    padding: 24,
    xl: 30,

    // font sizes
    largeTitle: 40,
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    h5: 12,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,
    body6: 10,

    // app dimensions
    width,
    height
};

export const FONTS = {
    main: "AvenirNext-Regular",
    text: "Roboto-Regular",
    label: "AvenirNext-Bold",
    sizeText: 17,
    largeTitle: {fontFamily: "Poppins-Black", fontSize: SIZES.largeTitle},
    h1: {fontFamily: "Poppins-Bold", fontSize: SIZES.h1, lineHeight: 36},
    h2: {fontFamily: "Poppins-Bold", fontSize: SIZES.h2, lineHeight: 30},
    h3: {fontFamily: "Poppins-SemiBold", fontSize: SIZES.h3, lineHeight: 22},
    h4: {fontFamily: "Poppins-SemiBold", fontSize: SIZES.h4, lineHeight: 22},
    h5: {fontFamily: "Poppins-SemiBold", fontSize: SIZES.h5, lineHeight: 22},
    body1: {fontFamily: "Poppins-Regular", fontSize: SIZES.body1, lineHeight: 36},
    body2: {fontFamily: "Poppins-Regular", fontSize: SIZES.body2, lineHeight: 30},
    body3: {fontFamily: "Poppins-Regular", fontSize: SIZES.body3, lineHeight: 22},
    body4: {fontFamily: "Poppins-Regular", fontSize: SIZES.body4, lineHeight: 22},
    body5: {fontFamily: "Poppins-Regular", fontSize: SIZES.body5, lineHeight: 22},
};

export const BASE = {
    margin: 20,
    window: {
        width,
        height,
        screenWidth: screenDimensions.width,
        screenHeight: screenDimensions.height,
    },
    padding: {
        main: 15,
        small: 5,
    },
    header: {
        height: 64,
    },
    drawer: {
        width: 270,
    },
    radius: {
        main: 6,
        rounded: 50,
        medium: 20
    },
    elevation: {
        medium: 5,
        small: 2
    },
    inputHeight: Platform.OS === "ios" ? 50 : 50
};

export const SHADOW = {
    main: {
        shadowColor: "#A4AAB3",
        shadowOffset: {width: 3, height: 3},
        shadowOpacity: 0.25,
        shadowRadius: 3,
    }
};

export const DEFAULT_COORDS = {
    latitude: 48.85341,
    longitude: 2.3488,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003 * (width / height)
};

export const MAX_PERIMETER = 3000;

export const BUTTON_SIZE = 40;

export const EXPERIMENTATION_MINUTE = 60
