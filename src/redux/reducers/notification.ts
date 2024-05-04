import notifee from "@notifee/react-native";
import {createSlice} from "@reduxjs/toolkit";
import {getPushNotifications, setNotificationAsRead} from "@services/notificationService";
import {getTimeDiff} from "@utils/helpers";

import {AppThunk} from "../store";
import {GetUserNotificationsOutput, UserNotifications} from "@bikairproject/shared";

interface initialStateState {
    nbUnread: number,
    redirect: string,
    isFetching: boolean,
    notifications: GetUserNotificationsOutput,
    lastUnread: UserNotifications | null,
    lastUpdate: number | null,
    show: boolean,
    modal: boolean
}

const initialState: initialStateState = {
    notifications: [],
    redirect: "NotificationItem",
    nbUnread: 0,
    isFetching: false,
    lastUnread: null,
    lastUpdate: null,
    show: false,
    modal: false,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState: initialState,
    reducers: {
        setNotifications(state, action) {
            state.notifications = action.payload;
        },
        markAsRead(state, action) {
            const index = state.notifications.findIndex(n => n.id === action.payload);
            state.notifications = [
                ...state.notifications.slice(0, index),
                {
                    ...state.notifications[index],
                    read: true,
                },
                ...state.notifications.slice(index + 1),
            ];
        },
        setNbUnread(state, action) {
            state.nbUnread = action.payload;
        },
        setIsFetching(state, action) {
            state.isFetching = action.payload;
        },
        setLastUnread(state, action) {
            state.lastUnread = action.payload;
        },
        setLastUpdate(state, action) {
            state.lastUpdate = action.payload;
        },
        setShow(state, action) {
            state.show = action.payload;
        },
        setModal(state, action){
            state.modal = action.payload;
        },
    }
});

export default notificationSlice.reducer;

// ACTIONS
export const {setModal, setShow, setNotifications, setNbUnread, setLastUnread, setLastUpdate, markAsRead, setIsFetching} = notificationSlice.actions;

export const fetchNotifications = (): AppThunk => async (dispatch, getState) => {
    dispatch(setIsFetching(true));
    const lastUpdate = getState().notification.lastUpdate;
    console.log("Notification lastUpdate = ", lastUpdate);
    const timeDiff = lastUpdate ? getTimeDiff(new Date(lastUpdate), new Date()) : 1000;
    console.log("Notification timeDiff = ", timeDiff);
    if (!lastUpdate || timeDiff >= 1) {
        dispatch(getNotifications());
    }else{
        dispatch(setIsFetching(false));
    }
};

export const getNotifications = (): AppThunk => async (dispatch, getState) => {
    dispatch(setLastUpdate(Date.now()));
    const response = await getPushNotifications();
    console.log("[response]", response);
    dispatch(setNotifications(response));
    dispatch(updateNbUnread());
    if (getState().notification.nbUnread > 0) {
        const firstUnread = getState().notification.notifications.filter(n => !n.read)[0];
        dispatch(setLastUnread(firstUnread));
    } else {
        dispatch(setLastUnread(null));
    }
    dispatch(setIsFetching(false));
};

export const markNotificationAsRead = (id: number | string): AppThunk => async (dispatch) => {
    await setNotificationAsRead(id);
    dispatch(markAsRead(id));
    dispatch(updateNbUnread());
};

export const markAllNotificationAsRead = (): AppThunk => async (dispatch, getState) => {
    const notifications = getState().notification.notifications;
    for await (const n of notifications) {
        await setNotificationAsRead(n.id ?? 0);
        dispatch(markAsRead(n.id));
    }
    dispatch(updateNbUnread());
};

export const updateNbUnread = (): AppThunk => async (dispatch, getState) => {
    const notifications = getState().notification.notifications;
    const allUnread = (notifications ?? []).filter(n => !n.read);
    const nbUnread = allUnread.length;
    dispatch(setNbUnread(nbUnread));
    await notifee.setBadgeCount(nbUnread);
};
