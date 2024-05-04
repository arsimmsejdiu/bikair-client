import CrispChat from "@native-modules/CrispChat";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import {AppThunk} from "@redux/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadData, removeValue, storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {
    DELETE_USER,
    GET_USER_FUNCTIONALITIES,
    GET_USER_SETTING,
    POST_AUTH_CONFIRM,
    POST_AUTH_LOGOUT,
    POST_AUTH_PHONE
} from "@services/endPoint";
import {getUserMe} from "@services/userService";
import {Platform} from "react-native";

import {version} from "../../../package.json";
import {getDiscounts} from "./discount";
import {setUserId, setUserUuid} from "./events";
import {getPaymentMethod} from "./paymentMethod";
import {setSnackbar} from "./snackbar";
import {resetTrip} from "./trip";
import {GetMeOutput, GetUserFunctionalitiesOutput, TopicsType} from "@bikairproject/shared";
import {UserMe} from "@bikairproject/shared/dist/dto";

interface authInitialStateType {
    isAuthenticated: boolean,
    accessToken: string | null,
    newUser: boolean,
    isDeleting: boolean,
    isFetching: boolean,
    isRefreshing: boolean,
    error: any,
    me: UserMe | null,
    settings: { topics: TopicsType[] } | null,
    functionalities: GetUserFunctionalitiesOutput | null,
    phoneNumber: string | null,
    countryCodes: string;
}

const authInitialState: authInitialStateType = {
    isAuthenticated: false,
    accessToken: null,
    newUser: false,
    isDeleting: false,
    isFetching: false,
    isRefreshing: false,
    error: null,
    me: null,
    settings: {topics: []},
    functionalities: null,
    phoneNumber: null,
    countryCodes: "FR",
};

const authSlice = createSlice({
    name: "auth",
    initialState: authInitialState,
    reducers: {
        fetching(state, action) {
            state.isFetching = action.payload;
        },
        deleting(state, action) {
            state.isDeleting = action.payload;
        },
        refreshing(state, action) {
            state.isRefreshing = action.payload;
            state.error = null;
        },
        logoutSuccess(state, action) {
            state.isAuthenticated = false;
            state.accessToken = null;
            state.error = null;
            state.me = null;
        },
        phoneSuccess(state, action) {
            state.accessToken = action.payload.accessToken;
            console.log(`newUser = ${action.payload.newUser}`);
            state.newUser = action.payload.newUser;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.isAuthenticated = true;
            state.me = action.payload.user;
            state.settings = {topics: action.payload.user.topics};
            state.accessToken = null;
            console.log(`newUser = ${action.payload.newUser}`);
            state.newUser = action.payload.newUser;
            state.error = null;
        },
        setNewUser(state, action) {
            state.newUser = action.payload;
        },
        updateSuccess(state, action) {
            state.isAuthenticated = true;
            state.error = null;
            state.me = {...state.me, ...action.payload};
        },
        loginFailed(state, action) {
            state.isAuthenticated = false;
            state.isRefreshing = false;
            state.isFetching = false;
            state.error = action.payload;
        },
        setUserSettings(state, action) {
            state.settings = action.payload;
        },
        updateTopics(state, action) {
            state.settings = {topics: action.payload};
        },
        updateFailed(state, action) {
            state.error = action.payload;
        },
        setFunctionalities(state, action: PayloadAction<GetUserFunctionalitiesOutput | null>) {
            state.functionalities = action.payload;
        },
        setLastBike(state, action: PayloadAction<string | null>) {
            if (state.me && action.payload) {
                state.me.last_bike_name = action.payload;
            }
        },
        setPhoneNumber(state, action: PayloadAction<string | null>) {
            state.phoneNumber = action.payload;
        },
        setCountryCodes(state, action: PayloadAction<string>) {
            state.countryCodes = action.payload;
        }
    },
});

export default authSlice.reducer;

// ACTIONS
export const {
    logoutSuccess,
    loginSuccess,
    loginFailed,
    fetching,
    deleting,
    phoneSuccess,
    refreshing,
    setNewUser,
    updateSuccess,
    updateFailed,
    setUserSettings,
    updateTopics,
    setFunctionalities,
    setLastBike,
    setPhoneNumber,
    setCountryCodes
} = authSlice.actions;

const setupCrisp = (userMe: GetMeOutput) => {
    console.log("Setup crisp");
    CrispChat.resetSession();
    CrispChat.setTokenId(userMe.user.uuid);

    // Set user's info
    CrispChat.setUserEmail(userMe.user.email ?? (userMe.user.uuid + "@unknow.com"));
    CrispChat.setUserNickname(userMe.user.firstname + " " + userMe.user.lastname);
    CrispChat.setUserPhone(userMe.user.phone);
    if (userMe.user.id) {
        CrispChat.setSessionInt("id", userMe.user.id);
    }
    if (userMe.user.stripe_customer) {
        CrispChat.setSessionString("stripe_id", userMe.user.stripe_customer);
    }
    if (userMe.user.city_name) {
        CrispChat.setSessionString("city", userMe.user.city_name);
    }
    if (version) {
        CrispChat.setSessionString("version", version);
    }
    if (Platform.OS) {
        CrispChat.setSessionString("os", Platform.OS);
    }
    if (userMe.user.user_age) {
        CrispChat.setSessionInt("age", userMe.user.user_age);
    }
    if (userMe.user.deposit_expiration_date) {
        CrispChat.setSessionString("deposit_expiration_date", userMe.user.deposit_expiration_date);
    }
    if (userMe.user.last_bike_name) {
        CrispChat.setSessionString("bike_name", userMe.user.last_bike_name);
    }
    if (typeof userMe.user.production !== "undefined" || userMe.user.production !== null) {
        CrispChat.setSessionBool("production", userMe.user.production);
    }
    if (typeof userMe.user.email_verified !== "undefined" || userMe.user.email_verified !== false) {
        CrispChat.setSessionBool("email_verified", userMe.user.email_verified);
    }
    CrispChat.setSessionString("bike_name", userMe.user.last_bike_name ?? "none");
};

export const authPhone = (phone: string, countryCode: string, email_otp = false, email: null | string = null): AppThunk => async dispatch => {
    dispatch(fetching(true));
    try {
        dispatch(setPhoneNumber(phone));
        dispatch(setCountryCodes(countryCode));
        const req = await instanceApi.post(POST_AUTH_PHONE, {
            phone: phone,
            countryCode: countryCode,
            email_otp: email_otp,
            email: email
        });
        const response = req.data;
        // This is a temporary token only use to validate the phone number
        dispatch(phoneSuccess(response));
    } catch (error) {
        console.log(error);
        dispatch(loginFailed(error));
    } finally {
        dispatch(fetching(false));
    }
};

export const authConfirm = (otp: string): AppThunk => async (dispatch, getState) => {
    dispatch(fetching(true));
    try {
        const accessToken = getState().auth.accessToken;
        const auth = await instanceApi.post(POST_AUTH_CONFIRM, {
            otp: otp,
            accessToken: accessToken,
        });
        const authData = auth.data;

        // Store token in local storage
        await storeData("@bearerToken", authData.bearerToken);
        await storeData("@refreshToken", authData.refreshToken);

        console.log("authConfirm", authData);
        const userMe = await getUserMe();

        const userProperties = {
            age: String(userMe.user.user_age),
            last_usage: String(userMe.user.last_usage),
            production: String(userMe.user.production),
            os: String(Platform.OS),
            version: String(version)
        };
        await crashlytics().setUserId(userMe.user.id + "");
        if (!authData.newUser) {
            setupCrisp(userMe);
        }
        dispatch(setPhoneNumber(null));
        dispatch(setCountryCodes("FR"));

        console.log("setAnalyticsCollectionEnabled");
        await analytics().setAnalyticsCollectionEnabled(true);
        console.log("setUserId");
        await analytics().setUserId(userMe.user.uuid);
        console.log("Pushing to analytics : ", userProperties);
        await analytics().setUserProperties(userProperties);

        console.log("loginSuccess");
        dispatch(loginSuccess(userMe));
        console.log("setUserId");
        dispatch(setUserUuid(userMe.user.uuid));
        dispatch(setUserId(userMe.user.id));
        console.log("done");

    } catch (err) {
        console.log(err);
        dispatch(loginFailed(JSON.stringify(err)));
    } finally {
        dispatch(fetching(false));
        // Init discount and paymentMethod
        dispatch(getDiscounts());
        dispatch(getPaymentMethod());
    }
};

export const getUserSettings = (): AppThunk => async dispatch => {
    dispatch(fetching(true));
    try {
        const userSettings = await instanceApi.get(GET_USER_SETTING);
        dispatch(setUserSettings(userSettings.data));
    } catch (err: any) {
        dispatch(setSnackbar({message: err.message, type: "danger"}));
    } finally {
        dispatch(fetching(false));
    }
};

export const getUserFunctionalities = (lat: number, lng: number): AppThunk => async dispatch => {
    dispatch(fetching(true));
    try {
        const functionalities = await instanceApi.get<GetUserFunctionalitiesOutput>(GET_USER_FUNCTIONALITIES + "?lat=" + lat + "&lng=" + lng);
        dispatch(setFunctionalities(functionalities.data));
        console.log("functionalities = ", functionalities.data);
        return functionalities.data;
    } catch (err: any) {
        dispatch(setSnackbar({message: err.message, type: "danger"}));
    } finally {
        dispatch(fetching(false));
    }
};

export const refreshAuth = (): AppThunk => async dispatch => {
    dispatch(refreshing(true));

    try {
        console.log("refreshAuth");
        const userMe = await getUserMe();

        const userProperties = {
            age: String(userMe.user.user_age),
            last_usage: String(userMe.user.last_usage),
            production: String(userMe.user.production),
            os: String(Platform.OS),
            version: String(version)
        };
        await crashlytics().setUserId(userMe.user.id + "");
        setupCrisp(userMe);

        console.log("setAnalyticsCollectionEnabled");
        await analytics().setAnalyticsCollectionEnabled(true);
        console.log("setUserId");
        await analytics().setUserId(userMe.user.uuid);
        console.log("Pushing to analytics : ", userProperties);
        await analytics().setUserProperties(userProperties);

        // Init discount and paymentMethod
        dispatch(getDiscounts());
        dispatch(getPaymentMethod());
        dispatch(refreshing(false));

        // dispatch(getCitiesAndZones());
        crashlytics().log("On auth : Cities data fetched");

        dispatch(loginSuccess(userMe));
        dispatch(setUserUuid(userMe.user.uuid));
        dispatch(setUserId(userMe.user.id));

    } catch (err) {
        console.log("[ERROR]", err);
        dispatch(loginFailed(JSON.stringify(err)));
    }
};

export const deleteUser = (): AppThunk => async dispatch => {
    dispatch(deleting(true));
    try {
        console.log("deleteUser");
        const {data} = await instanceApi.delete(DELETE_USER);
        if (data === "Ok") {
            dispatch(authLogout());
        }
    } catch (err) {
        console.log("[ERROR]", err);
        dispatch(loginFailed(JSON.stringify(err)));
    } finally {
        dispatch(deleting(false));
    }
};

export const authLogout = (): AppThunk => async (dispatch) => {
    dispatch(refreshing(true));
    try {
        const refreshToken = await loadData("@refreshToken");
        await instanceApi.post(POST_AUTH_LOGOUT, {refresh_token: refreshToken});

        // Remove tokens from locale storage
        await removeValue("@bearerToken");
        await removeValue("@clientSecret");
        await removeValue("@refreshToken");

        dispatch(resetTrip());
        CrispChat.resetSession();
        await removeValue("@lockKeys");
        dispatch(logoutSuccess(null));
    } catch (err) {
        dispatch(loginFailed(JSON.stringify(err)));
    } finally {
        dispatch(refreshing(false));
    }
};
