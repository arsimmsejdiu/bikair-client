import {useAppDispatch, useAppSelector, useBluetooth} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {RequestBluetoothPermission} from "@permissions/BluetoothPermission";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {setName, setStatus, setTags} from "@redux/reducers/bike";
import {setPermissionError} from "@redux/reducers/initialState";
import {setSnackbar} from "@redux/reducers/snackbar";
import {setBikeName, setTripState} from "@redux/reducers/trip";
import {getBikeStatus} from "@services/bikeService";
import {HomeStackScreenProps} from "@stacks/types";
import {tripStartScreenStyle} from "@styles/GeneralStyles";
import React, {lazy, Suspense, useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {KeyboardAvoidingView, Platform, View, ViewProps} from "react-native";
import {check, Permission, PERMISSIONS, request} from "react-native-permissions";

import {BIKE_STATUS, BIKE_TAGS} from "@bikairproject/shared";

const CheckPermissions = lazy(() => import("@components/CheckPermissions"));
const Scanner = lazy(() => import("@components/Scanner"));
const BlueTooth = lazy(() => import("@containers/BlueTooth"));


interface Props extends ViewProps, HomeStackScreenProps<"TripStart"> {
}

const StartTripScreen: React.FC<Props> = ({navigation, ...props}): React.ReactElement => {
    const {t} = useTranslation();
    const {bleOn} = useBluetooth();

    const [loading, setLoading] = useState(false);
    const [cameraPerm, setCameraPerm] = useState(false);
    const [showBluetooth, setShowBluetooth] = useState(true);

    // Redux
    const isOnline = useAppSelector(state => state.initialState.isOnline);
    const dispatch = useAppDispatch();

    /**
     * 1. Ensure bike availability
     * 2. Launch deposit check
     * 3. Redirect to MapScreen
     * 4. Check if the bike has a tag Experimentation
     * @Param name string
     */
    const startNewTrip = (name: string) => {
        setLoading(true);
        setShowBluetooth(false);
        RequestBluetoothPermission().then((perms) => {
            if (perms) {
                if (!isOnline) {
                    setLoading(false);
                    dispatch(setSnackbar({type: "danger", message: t("alert.network.online")}));
                    return;
                }
                if (!bleOn) {
                    setLoading(false);
                    dispatch(setSnackbar({type: "danger", message: t("alert.bluetooth.open")}));
                    return;
                }
                if (typeof name === "undefined" || name === null || name.trim() === "") {
                    setLoading(false);
                    return;
                }

                const trimName =  name.trim();
                dispatch(setName(trimName));
                dispatch(setBikeName(trimName));
                getBikeStatus(trimName)
                    .then((r: any) => {
                        const status = r.status;
                        const tags = r.tags;
                        if (status !== null && typeof status !== "undefined") {
                            if (status === BIKE_STATUS.AVAILABLE && tags === BIKE_TAGS.EXPERIMENTATION) {
                                dispatch(setTags(tags));
                                navigation.navigate("BikeTags");
                            } else if (status === BIKE_STATUS.AVAILABLE) {
                                dispatch(setTripState(TRIP_STEPS.TRIP_STEP_BEGIN_CHECK));
                                navigation.navigate("TripSteps");
                            } else {
                                dispatch(setStatus(status));
                                navigation.navigate("BikeStatus");
                            }
                        }
                    })
                    .catch((error) => {
                        if (error.status !== 404) {
                            navigation.navigate("BikeStatus");
                        } else {
                            throw error;
                        }
                    })
                    .finally(() => setLoading(false));
            } else {
                dispatch(setSnackbar({type: "danger", message: t("alert.bluetooth.open")}));
                setLoading(false);
            }
        }).catch(() => {
            setLoading(false);
        });
    };


    const requestPermission = async (permission: Permission) => {
        let perm = await check(permission);
        if (perm === "denied") {
            perm = await request(permission);
            if (perm === "blocked" || perm === "denied") {
                return false;
            }
        } else if (perm === "blocked") {
            return false;
        }
        return true;
    };

    const handleBackAction = () => {
        navigation.navigate("Map");
    };

    useFocusEffect(
        useCallback(() => {
            setShowBluetooth(true);
            const permissionName = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
            requestPermission(permissionName).then(cameraPerm => {
                if (cameraPerm) {
                    setCameraPerm(true);
                } else {
                    dispatch(setPermissionError("camera"));
                }
            });
        }, []),
    );

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "StartTripScreen").then(() => console.log(""));
    }, []));

    const renderCamera = () => {
        if (cameraPerm) {
            return (
                <Suspense fallback={<View></View>}>
                    <Scanner
                        loading={loading}
                        startNewTrip={startNewTrip}
                        onBackAction={handleBackAction}
                        {...props}
                    />
                </Suspense>
            );
        } else {
            return null;
        }
    };

    return <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tripStartScreenStyle.container}
    >
        {renderCamera()}
        {cameraPerm && showBluetooth ? <Suspense fallback={<View></View>}><BlueTooth/></Suspense> : null}
        <Suspense fallback={<View></View>}>
            <CheckPermissions/>
        </Suspense>
    </KeyboardAvoidingView>;
};

export default StartTripScreen;
