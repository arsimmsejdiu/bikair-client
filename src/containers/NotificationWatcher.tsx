import ToastNotification from "@components/ToastNotification";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import CrispChat from "@native-modules/CrispChat";
import {markNotificationAsRead} from "@redux/reducers/notification";
import {navigate} from "@services/rootNavigation";
import {toastNotificationStyles} from "@styles/ClusterStyles";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ViewProps} from "react-native";
import {useToast} from "react-native-toast-notifications";

const TOAST_INTERVAL = 10000;

type Props = ViewProps

export const NotificationWatcher: React.FC<Props> = (): React.ReactElement | null => {
    const notification = useAppSelector(state => state.notification.lastUnread);
    const hasTrip = useAppSelector(state => state.trip.tripState !== null);
    const isSupportNotification = notification?.redirect_to === "Help";
    const functionalities = useAppSelector(state => state.auth.functionalities);
    const functionalitiesList = functionalities?.functionalities ?? [];

    const isCrispEnabled = functionalitiesList.length === 0 || functionalitiesList.includes("CRISP_CHAT");

    const {t} = useTranslation();
    const toast = useToast();
    const dispatch = useAppDispatch();

    const [lastNotificationId, setLastNotificationId] = useState<number | null>(null);
    const isAction = !hasTrip || isSupportNotification;
    const actionLabel = isAction ? t("notification-screen.open") : t("notification-screen.hide");

    const handleOpen = () => {
        if (isAction) {
            switch (notification?.redirect_to) {
                case "Help":
                    if (isCrispEnabled) {
                        dispatch(markNotificationAsRead(notification.id));
                        CrispChat.openChat();
                    } else {
                        navigate("Notification", {
                            screen: "NotificationItem",
                            params: {
                                Item: notification
                            }
                        });
                    }
                    break;
                default:
                    navigate("Notification", {
                        screen: "NotificationItem",
                        params: {
                            Item: notification
                        }
                    });
                    break;
            }
        }
    };

    useEffect(() => {
        if (notification && notification.id !== lastNotificationId) {
            setLastNotificationId(notification?.id ?? null);
            toast.show(<ToastNotification
                title={notification.title}
                action={handleOpen}
                actionLabel={actionLabel}
            />, {
                duration: TOAST_INTERVAL,
                style: toastNotificationStyles.toastNotification
            });
        }
    }, [notification]);

    return null;
};
