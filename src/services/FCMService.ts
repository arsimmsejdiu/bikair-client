import messaging from "@react-native-firebase/messaging";

import {storeData} from "./asyncStorage";
import {putUserSettings} from "./userService";
import {TopicsType} from "@bikairproject/shared";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const onTapNotification = async ({detail}) => {
    console.log("[ONTAB-NOTIFICATION]", detail);
    return;
};

export const onSaveToken = async () => {
    try {
        const token = await messaging().getToken();
        await storeData("@deviceToken", token);
        await putUserSettings({device_token: token});
    } catch (err) {
        console.log(err);
    }
};

// Subscribe to topics
export const onSubscribeToTopic = (topics: TopicsType[]) => {
    for (let i = 0; i < topics.length; i++) {
        console.log("[SUBSCRIBE-TOPIC]");
        messaging().subscribeToTopic(topics[i]);
    }
};
