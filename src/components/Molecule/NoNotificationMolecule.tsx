import {COLORS, FONTS, NoNotification} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {markAllNotificationAsRead} from "@redux/reducers/notification";
import {notificationsListStyles} from "@styles/NotificationsStyles";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {TouchableOpacity, View} from "react-native";

export const NoNotificationMolecule = () => {
    const {t} = useTranslation();

    return (
        <View style={notificationsListStyles.noNotificationContainer}>
            <ImageAtom
                source={NoNotification}
                resizeMode="contain"
                style={notificationsListStyles.image}
            />
            <TextAtom style={notificationsListStyles.text}>
                {t("notification-screen.no_notification")}
            </TextAtom>
        </View>
    );
};

export const MarkAsRead = () => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleAllAsRead = () => {
        setLoading(true);
        dispatch(markAllNotificationAsRead()).then(() => {
            setLoading(false);
        });
    };
    return (
        <View style={notificationsListStyles.markAsReadContainer}>
            <TextAtom style={{...FONTS.h3}}>
                {t("notification-screen.my_notifications")}
            </TextAtom>
            <TouchableOpacity disabled={loading} onPress={() => handleAllAsRead()}>
                <TextAtom style={{
                    color: loading ? COLORS.darkGrey : COLORS.lightBlue,
                    textDecorationLine: "underline", ...FONTS.h5
                }}>
                    {t("notification-screen.mark_as_read")}
                </TextAtom>
            </TouchableOpacity>
        </View>
    );
};
