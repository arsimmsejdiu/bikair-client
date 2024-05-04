import {COLORS} from "@assets/index";
import {TextAtom} from "@components/Atom/TextAtom";
import Loader from "@components/Loader";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {getUserSettings, updateTopics} from "@redux/reducers/auth";
import {putUserSettings} from "@services/userService";
import {NotificationsStackScreenProps} from "@stacks/types";
import {notificationSettingsStyles} from "@styles/NotificationsStyles";
import React, {useCallback} from "react";
import {useTranslation} from "react-i18next";
import {Switch, View, ViewProps} from "react-native";

import {TOPICS, TopicsType} from "@bikairproject/shared";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";

const topicsList: TopicsType[] = [
    TOPICS.PROMOTIONS,
    TOPICS.INFORMATIONS
];


interface Props extends ViewProps, NotificationsStackScreenProps<"NotificationOption"> {
}

const NotificationsSettingScreen: React.FC<Props> = (): React.ReactElement => {
    const {t} = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const dispatch = useAppDispatch();
    const userSettings: { topics: TopicsType[] } | null = useAppSelector(state => state.auth.settings);
    const isFetching: boolean = useAppSelector(state => state.auth.isFetching);
    const topics: TopicsType[] = userSettings?.topics ?? [];

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getUserSettings());
        }, []),
    );

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "NotificationsSettingScreen").then(r => console.log(r));
    }, []));

    const toggleSwitch = async (e: any, topic: string): Promise<void> => {
        setLoading(true);
        try {
            let t;
            if (e) {
                t = topics ? [...topics, topic] : [topic];
            } else {
                t = topics.filter(el => el !== topic);
            }
            dispatch(updateTopics(t));
            await putUserSettings({topics: t});
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    if (isFetching) {
        return <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>;
    }

    if (!userSettings) {
        return <View style={notificationSettingsStyles.container}>
            <TextAtom>{t("settings.no_params")}</TextAtom>
        </View>;
    }

    return (
        <View style={notificationSettingsStyles.container}>
            <View style={notificationSettingsStyles.content}>
                <TextAtom style={notificationSettingsStyles.title}>
                    {t("settings.notifications")}
                </TextAtom>
                <TextAtom style={notificationSettingsStyles.subtitle}>
                    {t("settings.notif_infos")}
                </TextAtom>
                {
                    topicsList.map((topic: TopicsType, index: number) => {
                        return <View key={index} style={notificationSettingsStyles.notificationWrapper}>
                            <TextAtom style={notificationSettingsStyles.text}>
                                {t(`settings.${topic}`)}{"\n"}
                                <TextAtom style={notificationSettingsStyles.subtitle}>
                                    {t(`settings.${topic}_INFOS`)}
                                </TextAtom>
                            </TextAtom>
                            <View>
                                <Switch
                                    trackColor={{false: COLORS.darkGrey, true: COLORS.darkBlue}}
                                    thumbColor={topics && topics.includes(topic) ? COLORS.lightBlue : COLORS.lightGrey}
                                    ios_backgroundColor={COLORS.darkGrey}
                                    onValueChange={(e) => toggleSwitch(e, topic)}
                                    value={topics && topics.includes(topic)}
                                    disabled={loading}
                                />
                            </View>
                        </View>;
                    })
                }
            </View>
        </View>
    );
};

export default NotificationsSettingScreen;
