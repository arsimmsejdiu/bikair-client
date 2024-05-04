import {Platform} from "react-native";
import {check, PERMISSIONS} from "react-native-permissions";

import {requestPermission} from "./permissionService";

export const getLocationPermissionState = async () => {
    if (Platform.OS === "ios") {
        return await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
    if (Platform.OS === "android") {
        return await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
};

export const RequestLocationPermission = async () => {
    if (Platform.OS === "ios") {
        return await requestPermission(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
    if (Platform.OS === "android") {
        return await requestPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
};
