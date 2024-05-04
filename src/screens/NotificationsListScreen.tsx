import {COLORS} from "@assets/index";
import Loader from "@components/Loader";
import {MarkAsRead, NoNotificationMolecule} from "@components/Molecule/NoNotificationMolecule";
import NotificationCard from "@components/NotificationCard";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {fetchNotifications, getNotifications, markNotificationAsRead} from "@redux/reducers/notification";
import {NotificationsStackScreenProps} from "@stacks/types";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";
import {notificationsListStyles} from "@styles/NotificationsStyles";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback, useState} from "react";
import {FlatList, RefreshControl, View, ViewProps} from "react-native";

interface Props extends ViewProps, NotificationsStackScreenProps<"NotificationList"> {
}

const NotificationsListScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const notification = useAppSelector(state => state.notification);
    const data = notification.notifications;
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const onRefresh = async () => {
        if (!notification.isFetching) {
            dispatch(fetchNotifications());
        }
    };

    const handleMarkAsRead = async (id: number | string) => {
        dispatch(markNotificationAsRead(id));
    };

    const handleGetNotifications = () => {
        setLoading(true);
        dispatch(getNotifications()).then(() => {
            setLoading(false);
        });
    };

    useFocusEffect(
        useCallback(() => {
            handleGetNotifications();
        }, [])
    );

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "NotificationsListScreen").then(r => console.log(r));
    }, []));

    if (loading) {
        return <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>;
    }

    return (
        <View style={notificationsListStyles.container}>
            {data ? (
                <View>
                    <MarkAsRead/>
                    <FlatList
                        data={data}
                        keyExtractor={(item: any) => item.id}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                colors={[COLORS.lightBlue]} //Android
                                tintColor={COLORS.lightBlue} // IOS
                                refreshing={notification.isFetching}
                                onRefresh={onRefresh}
                            />
                        }
                        style={notificationsListStyles.flatList}
                        renderItem={({item}: any) => (
                            <NotificationCard
                                notificationItem={item}
                                navigation={navigation}
                                markAsRead={handleMarkAsRead}
                            />
                        )}
                    />
                </View>
            ) : (
                <NoNotificationMolecule/>
            )}
        </View>
    );
};

export default NotificationsListScreen;
