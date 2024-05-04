import {BikairNotif, COLORS} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import Header from "@components/Header";
import Loader from "@components/Loader";
import {useAppDispatch} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {markNotificationAsRead} from "@redux/reducers/notification";
import {NotificationsStackScreenProps} from "@stacks/types";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";
import {notificationItemScreenStyle} from "@styles/NotificationsStyles";
import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";

import {UserNotifications} from "@bikairproject/shared";

interface Props extends ViewProps, NotificationsStackScreenProps<"NotificationItem"> {
}

const NotificationsItemScreen: React.FC<Props> = ({route, navigation}): React.ReactElement => {
    const [loading, setLoading] = useState(false);
    const {Item} = route.params;
    const [item, setItem] = useState<UserNotifications>();
    const {t} = useTranslation();
    const dispatch = useAppDispatch();

    const handleBackAction = () => {
        navigation.navigate("NotificationList");
    };

    useEffect(() => {
        console.log("route.param = ", route.params);
        if (route.params?.Item) {
            setLoading(true);
            if (Item) {
                setItem(Item);
                dispatch(markNotificationAsRead(Item.id));
            }
        }
        setLoading(false);
    }, [route.params]);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: (props: any) => (
                <Header {...props} backAction={handleBackAction} title={t("headers.notifications_item")}/>
            ),
        });
    });

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "NotificationsItemScreen").then(() => console.log(""));
    }, []));

    const renderNotificationDate = (dates: any) => {
        if (dates) {
            const date = new Date(dates).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            });
            return `${date}`;
        }
    };

    if (loading) {
        return <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>;
    }

    return (
        <View style={notificationItemScreenStyle.container}>
            <View style={notificationItemScreenStyle.itemContainer}>
                <View style={notificationItemScreenStyle.imageContainer}>
                    <ImageAtom source={BikairNotif} style={notificationItemScreenStyle.image}/>
                </View>
                <View style={notificationItemScreenStyle.titleContainer}>
                    <TextAtom style={notificationItemScreenStyle.title}>
                        {item?.title}
                    </TextAtom>
                </View>
                <View style={notificationItemScreenStyle.messageContainer}>
                    <TextAtom style={notificationItemScreenStyle.message}>
                        {item?.message}
                    </TextAtom>
                </View>
                <View style={notificationItemScreenStyle.dateContainer}>
                    <TextAtom style={notificationItemScreenStyle.date}>
                        {t("notification-screen.sent_at")} {renderNotificationDate(item?.created_at)}
                    </TextAtom>
                </View>
            </View>
        </View>
    );
};

export default NotificationsItemScreen;
