import {instanceApi} from "./axiosInterceptor";
import {POST_LOCK_ALERT_END, POST_LOCK_ALERT_START} from "./endPoint";

export const sendAlertUnlockedBike = async (message: string) => {
    try {
        switch (message) {
            case "POST_LOCK_ALERT_END":
                await instanceApi.post(POST_LOCK_ALERT_END);
                break;
            case "POST_LOCK_ALERT_START":
                await instanceApi.post(POST_LOCK_ALERT_START);
                break;
            default:
                break;
        }
    } catch (err) {
        console.log(err);
    }
};
