/**
 * This exposes the native RNZendeskUnifiedModule module as a JS module.
 */
import {store} from "@redux/store";
import { NativeModules } from "react-native";

export enum CrispSessionEventColors {
    RED = 0,
    ORANGE = 1,
    YELLOW = 2,
    GREEN = 3,
    BLUE = 4,
    PURPLE = 5,
    PINK = 6,
    BROWN = 7,
    GREY = 8,
    BLACK = 9,
}

type CrispChatInterface = {
    setTokenId: (id: string) => void;
    setUserEmail: (email: string) => void;
    setUserNickname: (name: string) => void;
    setUserPhone: (phone: string) => void;
    setUserAvatar: (url: string) => void;
    setSessionSegment: (segment: string) => void;
    setSessionString: (key: string, value: string) => void;
    setSessionBool: (key: string, value: boolean) => void;
    setSessionInt: (key: string, value: number) => void;
    pushSessionEvent: (name: string, color: CrispSessionEventColors) => void;
    resetSession: () => void;
    show: () => void;
    openChat: () => void;
};

const CrispChat = NativeModules.CrispChat as CrispChatInterface;

CrispChat.openChat = () => {
    console.log("Open chat");
    const me = store.getState().auth.me;
    console.log("set bike_name");
    CrispChat.setSessionString("bike_name", me?.last_bike_name ?? "none");
    const tripState = store.getState().trip.tripState;
    console.log("set trip_step");
    CrispChat.setSessionString("trip_step", tripState ?? "none");
    CrispChat.show();
};

export default CrispChat;
