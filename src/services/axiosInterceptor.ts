import NetInfo from "@react-native-community/netinfo";
import {authLogout} from "@redux/reducers/auth";
import {store} from "@redux/store";
import axios from "axios";
import {NativeModules, Platform, PlatformAndroidStatic} from "react-native";

import MyConfig from "../../config";
import {version} from "../../package.json";
import {loadData, removeValue, storeData} from "./asyncStorage";

const {API_ENDPOINT, API_KEY_ANDROID, API_KEY_IOS, APP_ENV} = MyConfig;

// Get local of the user-mobile
const returnLocale = () => {
    let locale;
    if (Platform.OS === "ios") {
        // iOS:
        locale =
            NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0]; // "fr_FR"
    } else {
        // Android:
        locale = NativeModules.I18nManager.localeIdentifier; // "fr_FR"
    }
    locale = locale.substring(0, 2);
    locale = locale === "fr" ? locale : "en";
    return locale;
};

const instanceApi = axios.create({
    timeout: 40000,
});
const formDataApi = axios.create({
    timeout: 40000,
});

/**
 * Catch all request and add bearerToken
 */
const headerInterceptor = async (config: InstanceType<any>) => {
    const locale = returnLocale();
    await storeData("@locale", locale);
    const type = await NetInfo.fetch().then((state: any) => state.type);

    const brand = "Brand" in Platform.constants ? Platform.constants.Brand : "apple";
    const osVersion = Platform.OS === "ios" ? Platform.constants.osVersion : (Platform as PlatformAndroidStatic).constants.Release;

    config.headers = {
        "x-api-key": Platform.OS === "ios" ? API_KEY_IOS : API_KEY_ANDROID,
        "x-origin": "MOBILE_APP",
        "x-device": Platform.OS,
        "x-app-version": version,
        "x-brand": brand,
        "x-os-version": osVersion,
        "x-locale": locale,
        "x-type": "type-" + type,
        "Accept": "application/json",
        "Content-Type": "application/json",
    };

    const token = await loadData("@bearerToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (APP_ENV !== "production") {
        console.log(`[API] ${config.method}: ${config.url}`);
    }

    return config;
};

/**
 * Catch all request and add bearerToken
 */
const headerFormInterceptor = async (config: InstanceType<any>) => {
    const locale = returnLocale();
    await storeData("@locale", locale);
    const type = await NetInfo.fetch().then((state: any) => state.type);

    const brand = "Brand" in Platform.constants ? Platform.constants.Brand : "apple";
    const osVersion = Platform.OS === "ios" ? Platform.constants.osVersion : (Platform as PlatformAndroidStatic).constants.Release;

    config.headers = {
        "x-api-key": Platform.OS === "ios" ? API_KEY_IOS : API_KEY_ANDROID,
        "x-origin": "MOBILE_APP",
        "x-device": Platform.OS,
        "x-app-version": version,
        "x-brand": brand,
        "x-os-version": osVersion,
        "x-locale": locale,
        "x-type": "type-" + type,
        "Accept": "multipart/form-data",
        "Content-Type": "multipart/form-data",
    };

    const token = await loadData("@bearerToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (APP_ENV !== "production") {
        console.log(`[API] ${config.method}: ${config.url}`);
    }

    return config;
};

const headerErrorInterceptor = (error: any) => {
    return Promise.reject(error);
};

instanceApi.interceptors.request.use(
    headerInterceptor,
    headerErrorInterceptor,
);

formDataApi.interceptors.request.use(
    headerFormInterceptor,
    headerErrorInterceptor,
);

/**
 * Catch all response and add bearerToken
 */
const responseInterceptor = (res: any) => {
    return res;
};
const responseErrorInterceptor = async (err: any, instance: InstanceType<any>) => {
    if (err.response) {
        console.log(`[${err.response.status}]-[${err.response.config?.url}] ${err.response.data?.message ?? err.message}`);
        const originalConfig = err.response.config;

        console.log("[STATUS-------------------------------------]", err.response.status);
        console.log("[STATUS-------------------------------------]", err.message);

        // catch error 401 and create a new accessToken
        if (err.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            const refreshToken = await loadData("@refreshToken");
            let newAccessToken;
            if (refreshToken) {
                newAccessToken = await requestNewBearerToken(refreshToken);
            }

            // Ensure there is no error
            if (newAccessToken) {
                originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
                return Promise.resolve(instance(originalConfig));
            }
        }
        if (err.response.data) {
            err.response.data = {
                status: err.response.status,
                message: err.response.data.message ? err.response.data.message : err.response.data
            };
            console.log(err.response.data);
            return Promise.reject(err.response.data);
        }
    } else {
        console.log(err);
    }

    return Promise.reject(err);
};
instanceApi.interceptors.response.use(
    responseInterceptor,
    err => {
        return responseErrorInterceptor(err, instanceApi);
    },
);
formDataApi.interceptors.response.use(
    responseInterceptor,
    err => {
        return responseErrorInterceptor(err, formDataApi);
    },
);

/**
 * @param {*} originalRequest
 * @param {*} refreshToken
 * @return {*} accessToken
 */
const requestNewBearerToken = (refreshToken: string) =>
    instanceApi
        .post(`${API_ENDPOINT}/v2/refresh-token/`, {
            refresh_token: refreshToken,
            headers: {
                "x-api-key": Platform.OS === "ios" ? API_KEY_IOS : API_KEY_ANDROID,
                "x-origin": "MOBILE_APP"
            }

        })
        .then(async res => {
            if (res.status === 201) {
                console.log("REFRESH", res.data);
                // 1) put token to AsyncStorage
                await storeData("@bearerToken", res.data.token);

                // 2) set a new refreshtoken ()
                await storeData("@refreshToken", res.data.refresh_token);

                // 3) return originalRequest object with Axios.
                return res.data.refresh_token;
            } else {
                await removeValue("@bearerToken");
                await removeValue("@refreshToken");
                return null;
            }
        })
        .catch(err => {
            console.log("[-------------err------------------------]", err);
            if(err.status === 403 && store.getState().auth.isAuthenticated) {
                store.dispatch(authLogout());
            }
            return err;
        });

export {instanceApi, formDataApi};
