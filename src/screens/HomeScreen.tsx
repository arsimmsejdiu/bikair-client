import {DEFAULT_COORDS} from "@assets/index";
import CheckPermissions from "@components/CheckPermissions";
import HelpButton from "@components/HelpButton";
import MenuButton from "@components/MenuButton";
import OngoingTrip from "@components/OngoingTrip";
import PrimaryButton from "@components/PrimaryButton";
import ToastNotification from "@components/ToastNotification";
import BikeDetails from "@containers/BikeDetails";
import Map from "@containers/Map";
import {NotificationWatcher} from "@containers/NotificationWatcher";
import SpotDetails from "@containers/SpotDetails";
import { PROCESS } from "@models/enums/process";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import CrispChat from "@native-modules/CrispChat";
import notifee, {EventType} from "@notifee/react-native";
import {RequestLocationPermission} from "@permissions/LocationPermission";
import crashlytics from "@react-native-firebase/crashlytics";
import messaging from "@react-native-firebase/messaging";
import {useFocusEffect} from "@react-navigation/native";
import {getUserFunctionalities} from "@redux/reducers/auth";
import {getBikes, setLatLng, updateBikeNearBy} from "@redux/reducers/bike";
import {
    errorOccured,
    openBackgroundNotificationEventEvent,
    openForegroundNotificationEventEvent,
    photoSendEvent,
    userLockClickEvent,
    userOpenAppEvent,
    userUnlockClickEvent
} from "@redux/reducers/events";
import {getCitiesAndZones, isUpdateAvailable, setPermissionError} from "@redux/reducers/initialState";
import {getBooking} from "@redux/reducers/markerDetails";
import { setProcess } from "@redux/reducers/process";
import {setSnackbar} from "@redux/reducers/snackbar";
import {getSpots, updateSpotNearBy} from "@redux/reducers/spot";
import {getFirstTrip, setTimeEnd} from "@redux/reducers/trip";
import {loadData, removeValue} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_PM_METHOD, PUT_TRIP_START} from "@services/endPoint";
import {onSubscribeToTopic} from "@services/FCMService";
import {navigate} from "@services/rootNavigation";
import {saveEndPhoto} from "@services/storeService";
import {HomeStackScreenProps} from "@stacks/types";
import {toastNotificationStyles} from "@styles/ClusterStyles";
import {homeScreenStyles} from "@styles/HomeScreenStyles";
import {getPosition} from "@utils/helpers";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {BackHandler, Platform, View, ViewProps,} from "react-native";
import InAppReview from "react-native-in-app-review";
import MapView, {Region} from "react-native-maps";
import {useToast} from "react-native-toast-notifications";
import {requestTrackingPermission} from "react-native-tracking-transparency";

import {useAppDispatch, useAppSelector, useBluetooth, useFocusedInterval} from "../hooks";

const INTERVAL_UPDATE = 10000;
const TOAST_INTERVAL = 10000;

interface Props extends ViewProps, HomeStackScreenProps<"Map"> {
}

const HomeScreen: React.FC<Props> = (
    {
        navigation,
        ...props
    }): React.ReactElement => {
    const {t} = useTranslation();
    const {bleOn} = useBluetooth();
    const map = React.useRef<MapView>(null);

    const [location, setLocation] = React.useState(DEFAULT_COORDS);
    const [lastLocation, setLastLocation] = React.useState(DEFAULT_COORDS);

    // Redux
    const dispatch = useAppDispatch();
    const trip = useAppSelector(state => state.trip);
    const auth = useAppSelector(state => state.auth);
    const lock = useAppSelector(state => state.lock);
    const initialState = useAppSelector(state => state.initialState);
    const userFunctions = useAppSelector(state => state.auth.functionalities);
    const hasTrip = useAppSelector(state => state.trip.tripState !== null);
    const authRefreshing = useAppSelector(state => state.auth.isRefreshing);
    const process = useAppSelector(state => state.process.name);

    const [loadingMainButton, setLoadingMainButton] = useState(false);
    const [functionalitiesFetched, setFunctionalitiesFetched] = useState<number>(0);

    const cityPolygons = initialState.cityPolygons;
    const cityRedZones = initialState.cityRedZones;

    const bikesNearBy = useAppSelector(state => state.bike.bikesNearBy);
    const spotsNearBy = useAppSelector(state => state.spot.spotsNearBy);

    const initFetching = initialState.initFetching;
    const tripState = trip.tripState;

    const toast = useToast();

    // get Installation id for firebase in messaging app test device
    useEffect(() => {
        const getInstallationId = async () => {
            try {
                const token = await messaging().getToken();
                const installationId = token.split(":")[0];
                console.log("****************** Installation ID:", installationId);
            } catch (error) {
                console.log("Error retrieving installation ID:", error);
            }
        };

        getInstallationId().then(r => console.log(r));
    }, []);


    const getCities = async () => {
        try {
            dispatch(setProcess(PROCESS.FETCH_CITIES));
            dispatch(getCitiesAndZones());
        } catch (error) {
            dispatch(errorOccured(error, "GET CITIES"));
        }finally{
            dispatch(setProcess(null));
        }
    };

    const requestRating = () => {
        loadData("@goodRating").then(goodRating => {
            if (goodRating && InAppReview.isAvailable()) {
                InAppReview.RequestInAppReview()
                    .then(hasFlowFinishedSuccessfully => {
                        if (hasFlowFinishedSuccessfully) {
                            removeValue("@goodRating").then(r => console.log(r));
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        });
    };

    const handleNotificationOpen = async () => {
        const initialNotification = await notifee.getInitialNotification();
        const remoteMessage = await messaging().getInitialNotification();

        if (initialNotification || remoteMessage) {
            const messageId = initialNotification?.notification?.id ?? remoteMessage?.messageId;
            const title = initialNotification?.notification?.title ?? remoteMessage?.notification?.title;
            const redirectTo = initialNotification?.notification?.data?.redirectTo ?? remoteMessage?.data?.redirectTo;
            console.log("| NOTIFEE | getInitialNotification :  ", initialNotification?.notification ?? remoteMessage?.notification);
            dispatch(openBackgroundNotificationEventEvent(messageId, title));
            if (redirectTo) {
                switch (redirectTo) {
                    case "Help":
                        CrispChat.openChat();
                        break;
                    default:
                        navigation.navigate("Notification", {
                            screen: "NotificationList"
                        });
                        break;
                }
            }
        }
    };

    const getStatusTransparency = async () => {
        if (Platform.OS === "ios") {
            await requestTrackingPermission();
        }
    };

    const getLocation = async (event: string) => {
        try {
            if (event === "update") {
                const permission = await RequestLocationPermission();
                
                if (!permission) {
                    dispatch(setPermissionError("gps"));
                    return;
                }
                const locations: any = await getPosition();
                const {latitude, longitude} = locations.coords;
                dispatch(setLatLng({lat: latitude, lng: longitude}));
                const newLocation = {
                    ...DEFAULT_COORDS,
                    latitude: latitude,
                    longitude: longitude
                };
                setLocation(newLocation);
                if (map.current) {
                    map.current.animateToRegion(newLocation);
                }
            }
        } catch (err) {
            console.log(err);
            dispatch(errorOccured(err, "GET_USER_LOCATION"));
        }
    };

    const retryStartRequest = () => {
        loadData("@startParams").then(result => {
            if (typeof result !== "undefined" && result !== null) {
                console.log("retry sending start request");
                const startParams = JSON.parse(result);
                instanceApi.put(PUT_TRIP_START, {
                    time_start: startParams.timeStart,
                    lat: startParams.lat,
                    lng: startParams.lng,
                })
                    .then(() => {
                        removeValue("@startParams").then(r => console.log(r));
                    })
                    .catch(error => {
                        if (error.status === 404) {
                            removeValue("@startParams").then(r => console.log(r));
                        } else {
                            dispatch(errorOccured(error));
                            removeValue("@startParams").then(r => console.log(r));
                        }
                    });
            }
        });
    };

    const triggerSaveEndPhoto = () => {
        console.log("Saving photo from HomeScreen. ", typeof tripState);
        saveEndPhoto()
            .then(photoSaved => {
                console.log("attempted to save photo");
                if (photoSaved) {
                    dispatch(photoSendEvent());
                }
            })
            .catch(error => {
                dispatch(errorOccured(error, "SAVE PHOTO"));
            });
    };

    const getMainButtonLabel = () => {
        if (tripState !== null) {
            return t("home_map.lock");
        } else {
            return t("home_map.unlock");
        }
    };

    const handleMainButtonPressed = async () => {
        setLoadingMainButton(true);
        try {
            await dispatch(setTimeEnd(new Date().getTime()));
            const response = await instanceApi.get(GET_PM_METHOD);
            const payment = response.data;
            if (!payment) {
                navigation.navigate("Payment");
            } else if (tripState !== null) {
                dispatch(userLockClickEvent());
                if (!bleOn) {
                    dispatch(setSnackbar({type: "danger", message: t("alert.bluetooth.close")}));
                    return;
                }
                navigation.navigate("Home", {
                    screen: "TripStop"
                });
            } else {
                await removeValue("@lockDefault");
                dispatch(userUnlockClickEvent());
                navigation.navigate("Home", {
                    screen: "TripStart"
                });
            }
        } catch (error: any) {
            dispatch(setSnackbar({type: "danger", message: t(error.message)}));
        } finally {
            setLoadingMainButton(false);
        }
    };

    const handleRegionChange = (region: Region) => {
        if (
            Math.abs(region.latitude - lastLocation.latitude) > 0.0005 ||
            Math.abs(region.longitude - lastLocation.longitude) > 0.0005 ||
            Math.abs(region.latitudeDelta - lastLocation.latitudeDelta) > 0.0005 ||
            Math.abs(region.longitudeDelta - lastLocation.longitudeDelta) > 0.0005
        ) {
            setLocation(region);
            setLastLocation(region);
            dispatch(updateBikeNearBy(region));
            dispatch(updateSpotNearBy(region));
        }
    };

    const onFirstOpenActions = () => {
        dispatch(userOpenAppEvent());
        getStatusTransparency().then(r => console.log(r));
        dispatch(setLatLng({lat: location.latitude, lng: location.longitude}));
        dispatch(getBikes());
        getCities().finally(() => console.log("End fetch cities"));
        dispatch(getFirstTrip());
        dispatch(getBooking());
        if (auth.settings && auth.settings.topics) {
            onSubscribeToTopic(auth.settings.topics);
        }
        if (trip.tripState === null) {
            requestRating();
        }
        handleNotificationOpen().then(r => console.log(r));
    };

    const onOpenActions = () => {
        if (!auth.me || !auth.me.stripe_customer || !auth.me.email || !auth.me.city_id) {
            navigation.navigate("User");
        }
        getLocation("update").then(r => console.log(r));
        retryStartRequest();
        if (trip.tripState === null) {
            triggerSaveEndPhoto();
            dispatch(isUpdateAvailable());
        }
    };

    useEffect(() => {
        onFirstOpenActions();
    }, []);

    useFocusEffect(
        useCallback(() => {
            onOpenActions();
        }, [])
    );

    //Fetch bikes list every 30second
    useFocusedInterval(() => {
        dispatch(getBikes());
        dispatch(getSpots());
    }, INTERVAL_UPDATE);

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", backAction);
            };
        }, []),
    );

    const getFunctionalities = async () => {
        console.log("Fetching functionnalities");
        if (Date.now() > functionalitiesFetched) {
            dispatch(getUserFunctionalities(location.latitude, location.longitude));
            // Set time for 1 hour
            setFunctionalitiesFetched(Date.now() + (60 * 60 * 1000));
        }
    };

    const handleNotificationNavigate = (redirectTo?: string | null) => {
        switch (redirectTo) {
            case "Help":
                CrispChat.openChat();
                break;
            default:
                navigate("Notification", {
                    screen: "NotificationList"
                });
                break;
        }
    };

    const handleForegroundNotification = (messageId: string | undefined, title: string | undefined, redirectTo: string | undefined) => {
        dispatch(openForegroundNotificationEventEvent(messageId, title));
        const isSupportNotification = redirectTo === "Help";
        const isAction = !hasTrip || isSupportNotification;
        const actionLabel = isAction ? t("notification-screen.open") : t("notification-screen.hide");
        toast.show(<ToastNotification
            title={title}
            action={() => handleNotificationNavigate(redirectTo)}
            actionLabel={actionLabel}
        />, {
            duration: TOAST_INTERVAL,
            style: toastNotificationStyles.toastNotification
        });
    };

    // Initialize notification handler
    useEffect(() => {
        const onMessageListener = messaging().onMessage(data => {
            console.log("| NOTIFEE | onMessage : ", data);
            handleForegroundNotification(data.messageId, data.notification?.title, JSON.stringify(data.data?.redirectTo));
        });

        const onForegroundMessageListener = notifee.onForegroundEvent(({type, detail}) => {
            console.log(`| NOTIFEE | [${EventType[type]}] onForegroundEvent : `, detail);
            if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
                dispatch(openForegroundNotificationEventEvent(detail.notification?.id, detail.notification?.title));
                handleNotificationNavigate(String(detail.notification?.data?.redirectTo));
            }
        });

        const unsubscribeOnNotification = messaging().onNotificationOpenedApp(async (remoteMessage) => {
            console.log("Message handled in the background!", remoteMessage);
            console.log("Notification : ", remoteMessage.notification);
            dispatch(openBackgroundNotificationEventEvent(remoteMessage.messageId, remoteMessage.notification?.title));
            handleNotificationNavigate(JSON.stringify(remoteMessage.data?.redirectTo));
        });

        notifee.onBackgroundEvent(async ({type, detail}) => {
            console.log(`| NOTIFEE | [${EventType[type]}] onBackgroundEvent : `, detail);
            if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
                dispatch(openBackgroundNotificationEventEvent(detail.notification?.id, detail.notification?.title));
                handleNotificationNavigate(String(detail.notification?.data?.redirectTo));
            }
        });

        return () => {
            onMessageListener();
            onForegroundMessageListener();
            unsubscribeOnNotification();
        };
    }, []);

    useEffect(() => {
        if (location.latitude !== DEFAULT_COORDS.latitude && location.longitude !== DEFAULT_COORDS.longitude) {
            getFunctionalities().then(r => console.log("getFunctionalities", r));
        }
    }, [location]);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "HomeScreen").then(r => console.log("LAST_SCREEN", r));
    }, []));

    return (
        <View style={homeScreenStyles.container}>
            <Map
                location={location}
                cityPolygons={cityPolygons}
                cityRedZones={cityRedZones}
                bikes={bikesNearBy}
                citySpots={spotsNearBy}
                userFunctions={userFunctions}
                ref={map}
                initFetching={initFetching || authRefreshing}
                onUpdateRegion={handleRegionChange}
            />
            <View style={homeScreenStyles.unlock}>
                <PrimaryButton
                    inProgress={loadingMainButton || !!process || trip.isFetching || lock.fetching}
                    onClick={handleMainButtonPressed}
                    variant="contained_lightBlue"
                    textColor="white"
                    border="rounded"
                    iconSize={25}
                    icon="lock"
                    value={getMainButtonLabel()}
                />
            </View>
            {tripState === null && <MenuButton id={"Menu"} {...props}/>}
            <HelpButton {...props} centerLocation={getLocation}/>
            {tripState === TRIP_STEPS.TRIP_STEP_ONGOING && <OngoingTrip/>}
            {tripState === null && <BikeDetails/>}
            <SpotDetails/>
            <CheckPermissions/>
            <NotificationWatcher/>
        </View>
    );
};

export default HomeScreen;
