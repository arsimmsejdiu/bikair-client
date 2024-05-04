import {Camera} from "react-native-vision-camera";

export const getCameraPermissionState = async () => {
    const permission = await Camera.getCameraPermissionStatus();
    return permission === "granted";
};

export const RequestCameraPermission = async () => {
    console.log("Requesting camera permission...");
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    return permission === "granted";
};
