import notifee, {AuthorizationStatus} from "@notifee/react-native";

export const RequestNotificationPermission = async () => {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log("Permission settings:", settings);
        return true;
    } else {
        console.log("User declined permissions");
        return false;
    }
};
