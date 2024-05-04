import SplashScreen from "@containers/SplashScreen";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {defaultRemoteConfig} from "@models/defaultRemoteConfig";
import {RequestNotificationPermission} from "@permissions/NotificationPermission";
import NetInfo from "@react-native-community/netinfo";
import crashlytics from "@react-native-firebase/crashlytics";
import remoteConfig from "@react-native-firebase/remote-config";
import {refreshAuth} from "@redux/reducers/auth";
import {errorOccured, getPhoneInfos} from "@redux/reducers/events";
import {
    setActiveApp,
    setCameraPreset,
    setNetworkState,
    setNewsActive,
    setNewsPhotoName
} from "@redux/reducers/initialState";
import {closeBooking} from "@redux/reducers/markerDetails";
import {loadData} from "@services/asyncStorage";
import i18next from "i18next";
import React, {useEffect, useRef, useState} from "react";
import {AppState, ViewProps} from "react-native";

import MyConfig from "../../config";

const {APP_ENV} = MyConfig;

type Props = ViewProps

export const StartupActions: React.FC<Props> = ({children}): React.ReactElement | null => {
    const [loading, setLoading] = useState(false);
    const appState = useRef(AppState.currentState);
    const isRefreshing = useAppSelector(state => state.auth.isRefreshing);

    // Redux state
    const dispatch = useAppDispatch();

    const getRemoteParameters = () => {
        remoteConfig()
            .setDefaults(defaultRemoteConfig)
            .then(() => {
                console.log("Default values set.");
            })
            .then(() => remoteConfig().fetchAndActivate())
            .then(fetchedRemotely => {
                if (fetchedRemotely) {
                    console.log("Configs were retrieved from the backend and activated.");
                } else {
                    console.log(
                        "No configs were fetched from the backend, and the local configs were already activated",
                    );
                }
                i18next.addResourceBundle("fr", "translation", JSON.parse(remoteConfig().getString("trad_fr")), true, true);
                i18next.addResourceBundle("en", "translation", JSON.parse(remoteConfig().getString("trad_en")), true, true);
                dispatch(setCameraPreset(remoteConfig().getString("camera_preset")));
                if (APP_ENV === "production") {
                    dispatch(setNewsPhotoName(JSON.parse(remoteConfig().getString("news_photo_names"))));
                } else {
                    dispatch(setNewsPhotoName(JSON.parse(remoteConfig().getString("news_photo_names_test"))));
                }
                dispatch(setNewsActive(remoteConfig().getBoolean("news_active")));

                crashlytics().log("Remote config set");
            });
    };


    const onStartupLoading = async () => {
        try {
            dispatch(getPhoneInfos());
            // Initialize bluetooth ble
            const bearerToken = await loadData("@bearerToken");

            if (bearerToken) {
                dispatch(refreshAuth());
            } else {
                throw new Error("Wrong token");
            }
        } catch (error: any) {
            crashlytics().recordError(new Error(error), "STARTUP");
            dispatch(errorOccured(error, "STARTUP"));
        }
    };

    useEffect(() => {
        setLoading(true);
        crashlytics().setAttribute("STARTUP_LOADING_SHOW", "true");
        getRemoteParameters();
        onStartupLoading()
            .finally(() => {
                setLoading(false);
                crashlytics().setAttribute("STARTUP_LOADING_SHOW", "false");
                RequestNotificationPermission();
            });
    }, []);

    // Monitor device internet connection
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async state => {
            dispatch(setNetworkState(state.isConnected));
        });
        return () => {
            typeof unsubscribe !== "undefined" ? unsubscribe() : null;
        };
    }, []);

    // I am using this subscription to ensure the booking popup is closed when user close and reopen the app
    // @TODO => fix bug that happen only on development mode
    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                dispatch(setActiveApp(nextAppState));
            }
            dispatch(closeBooking());
            appState.current = nextAppState;
            dispatch(setActiveApp(appState.current));
        });

        return () => {
            typeof subscription !== "undefined" ? subscription.remove() : null;
        };
    }, []);

    return (
        <>
            {children}
            {loading || isRefreshing ? <SplashScreen/> : null}
        </>
    );
};
