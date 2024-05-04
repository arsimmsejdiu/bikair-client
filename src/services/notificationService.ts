import {instanceApi} from "./axiosInterceptor";
import {GET_PUSH_NOTIFICATION, GET_PUSH_NOTIFICATIONS, PUT_PUSH_NOTIFICATIONS} from "./endPoint";
import {
    GetUserNotificationByIdOutput,
    GetUserNotificationsOutput,
    PutUserNotificationsInput
} from "@bikairproject/shared";

export const getPushNotifications = async () => {
    try {
        const {data} = await instanceApi.get<GetUserNotificationsOutput>(GET_PUSH_NOTIFICATIONS);
        return data;
    } catch (err) {
        console.log("error", err);
    }
};
export const getPushNotificationById = async (notificationId: string) => {
    try {
        const {data} = await instanceApi.get<GetUserNotificationByIdOutput>(GET_PUSH_NOTIFICATION(notificationId));
        return data;
    } catch (err) {
        console.log("error", err);
        return null;
    }
};

export const setNotificationAsRead = async (id: number | string) => {
    try {
        const body: PutUserNotificationsInput = {
            read: true
        };
        await instanceApi.put(PUT_PUSH_NOTIFICATIONS(id), body);
    } catch (err) {
        console.log("error", err);
    }
};
