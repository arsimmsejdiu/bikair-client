import {
    API_ENDPOINT,
    API_KEY_ANDROID,
    API_KEY_IOS,
    APP_ENV,
    ASSETS_URL,
    GOOGLE_GEOCODING_API_KEY,
    IS_GOOGLE_PAY_TEST,
    STRIPE_PUBLISHABLE_KEY,
} from "@env";

const MyConfig = {
    APP_ENV: APP_ENV,
    API_ENDPOINT: API_ENDPOINT,
    API_KEY_IOS: API_KEY_IOS,
    API_KEY_ANDROID: API_KEY_ANDROID,
    STRIPE_PUBLISHABLE_KEY: STRIPE_PUBLISHABLE_KEY,

    // External assets
    ASSETS_URL: ASSETS_URL,

    // Google pay
    isGooglePayTest: IS_GOOGLE_PAY_TEST,
    googleGeocodingApiKey: GOOGLE_GEOCODING_API_KEY,

    // Payment config
    CONFIG_PAYMENT: {
        currency: "EUR",
        country: "FR",
        merchantName: "Bik'Air SAS"
    },
};


export default MyConfig;
