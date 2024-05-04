import {TextAtom} from "@components/Atom/TextAtom";
import {toastNotificationStyles} from "@styles/TabButtonsStyles";
import React from "react";
import {TouchableOpacity, View,} from "react-native";
import {useToast} from "react-native-toast-notifications";

interface ToastNotificationProps {
    title?: string | null
    actionLabel?: string | null;
    action?: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({title, actionLabel, action}): React.ReactElement => {
    const toast = useToast();

    const handleHide = () => {
        toast.hideAll();
    };

    const handleAction = () => {
        if (typeof action !== "undefined") {
            action();
        }
        handleHide();
    };

    return (
        <View
            style={toastNotificationStyles.container}
        >
            <TextAtom style={toastNotificationStyles.textTitle}>
                {title ?? ""}
            </TextAtom>
            <TouchableOpacity onPress={handleAction}>
                <TextAtom style={toastNotificationStyles.text}>{actionLabel ?? "Hide"}</TextAtom>
            </TouchableOpacity>
        </View>
    );
};

export default ToastNotification;
