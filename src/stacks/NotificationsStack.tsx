import Header from "@components/Header";
import {createStackNavigator} from "@react-navigation/stack";
import NotificationsItemScreen from "@screens/NotificationsItemScreen";
import NotificationsListScreen from "@screens/NotificationsListScreen";
import NotificationsSettingScreen from "@screens/NotificationsSettingScreen";
import React from "react";
import {useTranslation} from "react-i18next";

import {NotificationsStackParamList} from "./types";

const Stack = createStackNavigator<NotificationsStackParamList>();

const NotificationsStack = () => {
    const {t} = useTranslation();
    return (
        <Stack.Navigator
            initialRouteName="NotificationList"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: (props) => <Header {...props} home={true} notification={true} title={t("headers.notifications_list")}/>,
                }}
                name="NotificationList"
                component={NotificationsListScreen}/>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: (props) => <Header {...props} home={false} text={"NotificationList"} title={t("headers.notifications_item")}/>,
                }}
                name="NotificationItem"
                component={NotificationsItemScreen}/>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: (props) => <Header {...props} home={false} text={"NotificationList"} title={t("headers.notifications_option")}/>,
                }}
                name="NotificationOption"
                component={NotificationsSettingScreen}/>
        </Stack.Navigator>
    );
};

export default NotificationsStack;
