import {COLORS, DEFAULT_COORDS} from "@assets/index";
import CheckPermissions from "@components/CheckPermissions";
import HelpButton from "@components/HelpButton";
import PrimaryButton from "@components/PrimaryButton";
import BikeDetails from "@containers/BikeDetails";
import Map from "@containers/Map";
import SpotDetails from "@containers/SpotDetails";
import {useAppDispatch, useAppSelector, useFocusedInterval} from "@hooks/index";
import {RequestLocationPermission} from "@permissions/LocationPermission";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {getBikesNearby, setLatLng} from "@redux/reducers/bike";
import {errorOccured, userOpenAppEvent} from "@redux/reducers/events";
import {getCitiesAndZones, setPermissionError} from "@redux/reducers/initialState";
import {AuthStackScreenProps} from "@stacks/types";
import {getPosition} from "@utils/helpers";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {BackHandler, Platform, StyleSheet, View, ViewProps,} from "react-native";
import MapView, {Region} from "react-native-maps";
import {requestTrackingPermission} from "react-native-tracking-transparency";

const INTERVAL_UPDATE = 30000;

interface Props extends ViewProps, AuthStackScreenProps<"Map"> {
}

const OfflineHomeScreen: React.FC<Props> = (
    {
        navigation,
        ...props
    }): React.ReactElement => {
    const {t} = useTranslation();
    const map = React.useRef<MapView>(null);

    const [location, setLocation] = React.useState(DEFAULT_COORDS);
    const [lastLocation, setLastLocation] = React.useState(DEFAULT_COORDS);

    // Redux
    const dispatch = useAppDispatch();
    const trip = useAppSelector(state => state.trip);
    const lock = useAppSelector(state => state.lock);
    const initialState = useAppSelector(state => state.initialState);
    const userFunctions = useAppSelector(state => state.auth.functionalities);
    const [loadingCities, setLoadingCities] = useState(false);

    const cityPolygons = initialState.cityPolygons;
    const cityRedZones = initialState.cityRedZones;

    const bike = useAppSelector(state => state.bike);
    const bikes = bike.bikes;

    const initFetching = initialState.initFetching;
    const tripState = trip.tripState;
    console.log("Trip State --> ", tripState);

    const getCities = async () => {
        try {
            dispatch(getCitiesAndZones());
        } catch (error) {
            dispatch(errorOccured(error, "GET CITIES"));
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
                if(!locations) throw new Error("No location found!");
                const {latitude, longitude} = locations.coords;
                dispatch(setLatLng({lat: latitude, lng: longitude}));
                const newLocation = {
                    ...DEFAULT_COORDS,
                    latitude: latitude,
                    longitude: longitude
                };

                setLocation(newLocation);
                if (tripState === null) {
                    dispatch(getBikesNearby(newLocation));
                }
                if (map.current) {
                    map.current.animateToRegion(newLocation);
                }
            }
        } catch (err) {
            dispatch(errorOccured(err, "GET_USER_LOCATION"));
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
            if (tripState === null) {
                dispatch(getBikesNearby(region));
            }
        }
    };

    const onFirstOpenActions = () => {
        dispatch(userOpenAppEvent());
        getStatusTransparency().then(r => console.log(r));
        dispatch(setLatLng({lat: location.latitude, lng: location.longitude}));
        dispatch(getBikesNearby(location));
        setLoadingCities(true);
        getCities().finally(() => setLoadingCities(false));
    };

    useEffect(() => {
        onFirstOpenActions();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getLocation("update").then(r => console.log(r));
        }, [])
    );

    //Fetch bikes list every 30second
    useFocusedInterval(() => {
        dispatch(getBikesNearby(location));
    }, INTERVAL_UPDATE);

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                navigation.navigate("Phone");
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", backAction);
            };
        }, []),
    );

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "OfflineHomeScreen");
    }, []));

    return (
        <View style={styles.container}>
            <Map
                location={location}
                cityPolygons={cityPolygons}
                cityRedZones={cityRedZones}
                bikes={bikes}
                citySpots={[]}
                userFunctions={userFunctions}
                ref={map}
                initFetching={initFetching}
                onUpdateRegion={handleRegionChange}
            />

            <View style={styles.unlock}>
                <PrimaryButton
                    inProgress={loadingCities || trip.isFetching || lock.fetching}
                    onClick={() => navigation.navigate("Phone")}
                    variant="contained_lightBlue"
                    textColor="white"
                    border="rounded"
                    iconSize={25}
                    icon="lock"
                    value={t("wording.connection")}
                />
            </View>

            <HelpButton {...props} centerLocation={getLocation}/>
            <BikeDetails/>
            <SpotDetails/>
            <CheckPermissions/>
        </View>
    );
};

export default OfflineHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightGrey,
    },
    unlock: {
        position: "absolute",
        bottom: 40,
        zIndex: 4,
    }
});

