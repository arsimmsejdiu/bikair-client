import {BikairNotif, COLORS, FONTS} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {useAppSelector} from "@hooks/index";
import CrispChat from "@native-modules/CrispChat";
import {navigate} from "@services/rootNavigation";
import {notificationCardStyles} from "@styles/NotificationsStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {TouchableOpacity, View} from "react-native";

const NotificationCard = ({notificationItem, markAsRead}: any) => {
    const functionalities = useAppSelector(state => state.auth.functionalities?.functionalities ?? []);
    const isCrispEnabled = functionalities.length === 0 || functionalities.includes("CRISP_CHAT");
    const {t} = useTranslation();

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

    const handleCardClick = () => {
        markAsRead(notificationItem.id);
        switch (notificationItem.redirect_to) {
            case "Help":
                if (isCrispEnabled) {
                    CrispChat.openChat();
                } else {
                    navigate("Notification", {
                        screen: "NotificationItem",
                        params: {
                            Item: notificationItem
                        }
                    });
                }
                break;
            default:
                navigate("Notification", {
                    screen: "NotificationItem",
                    params: {
                        Item: notificationItem
                    }
                });
                break;
        }
    };

    return (
        <TouchableOpacity onPress={handleCardClick} style={notificationCardStyles.container}>
            <View style={{flexDirection: "row"}}>
                {/* Logo */}
                <View style={notificationCardStyles.logoContainer}>
                    <ImageAtom
                        source={BikairNotif}
                        style={notificationCardStyles.image}
                    />
                </View>
                {/* Info */}
                <View style={notificationCardStyles.infoContainer}>
                    {notificationItem.read === false ? (
                        <TextAtom style={{...FONTS.h3}}>{notificationItem?.title}</TextAtom>
                    ) : (
                        <TextAtom style={{...FONTS.body3}}>{notificationItem?.title}</TextAtom>
                    )}
                    <TextAtom style={{color: COLORS.darkGray2, ...FONTS.body4}}>
                        {notificationItem.read === false ? (
                            <TextAtom style={notificationCardStyles.readMoreText}>
                                {"read more"}
                            </TextAtom>
                        ) : (
                            <TextAtom style={notificationCardStyles.readMoreText}>
                                {"read more"}
                            </TextAtom>
                        )}

                    </TextAtom>
                    <TextAtom style={notificationCardStyles.textSentAt}>
                        {t("notification-screen.sent_at")}{" "}
                        {renderNotificationDate(notificationItem?.created_at)}
                    </TextAtom>
                </View>
            </View>
            {notificationItem.read === false ? (
                <View style={notificationCardStyles.redPoint}/>
            ) : null}
        </TouchableOpacity>
    );
};

export default NotificationCard;
