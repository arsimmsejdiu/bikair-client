import {COLORS, FeatherIcon, FONTS, LogoFullWhite, SIZES} from "@assets/index";
import IconTextLink from "@components//IconTextLink";
import {ImageAtom, ScrollViewAtom, TextAtom} from "@components/Atom";
import {SocialButtonsMolecule} from "@components/Molecule/SocialButtonsMolecule";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {UserFunctions} from "@models/enums";
import CrispChat from "@native-modules/CrispChat";
import {useFocusEffect} from "@react-navigation/native";
import {
    drawerHelpMenuEvent,
    drawerLogoutMenuEvent,
    drawerNotificationMenuEvent,
    drawerPaymentMenuEvent,
    drawerProductsMenuEvent,
    drawerPromotionsMenuEvent,
    drawerSponsorMenuEvent,
    drawerTermesMenuEvent,
    drawerTripsMenuEvent,
    drawerUserMenuEvent
} from "@redux/reducers/events";
import {drawerStyles} from "@styles/DrawerStyle";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {Linking, Platform, Text, TouchableOpacity, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {version} from "../../package.json";

interface Props extends ViewProps {
    user: any,
    disconnect: any,
    navigation: any
}

const Drawer: React.FC<Props> = (
    {
        user,
        disconnect,
        navigation
    }): React.ReactElement => {

    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const userFunctions = useAppSelector(state => state.auth.functionalities);
    const unread = useAppSelector(state => state.notification.nbUnread);
    const [instagramInstalled, setInstagramInstalled] = useState(false);
    const [facebookInstalled, setFacebookInstalled] = useState(false);
    const [isCrispEnabled, setCrispEnabled] = useState(false);

    useFocusEffect(useCallback(() => {
        if (userFunctions?.functionalities && userFunctions.functionalities.length > 0) {
            setCrispEnabled(userFunctions.functionalities.includes("CRISP_CHAT"));
            console.log("Updated value for isCrispEnabled : ", userFunctions?.functionalities.includes("CRISP_CHAT"));
        } else {
            setCrispEnabled(false);
        }
    }, [userFunctions]));

    const checkInstagramInstalled = async () => {
        const supportedInstagram = await Linking.canOpenURL("instagram://");
        const supportedFacebook = await Linking.canOpenURL("fb://");
        setInstagramInstalled(supportedInstagram);
        setFacebookInstalled(supportedFacebook);
    };

    React.useEffect(() => {
        checkInstagramInstalled().then(r => console.log(r));
    }, []);
    const handleDisconnect = () => {
        dispatch(drawerLogoutMenuEvent());
        disconnect();
    };

    const handlePressFace = async () => {
        try {
            if (facebookInstalled) {
                if (Platform.OS === "ios") {
                    await Linking.openURL("fb://profile/390534851548105");
                } else {
                    await Linking.openURL("fb://page/390534851548105");
                }
            } else {
                await Linking.openURL("https://www.facebook.com/Bikaircity");
            }
        } catch (error) {
            console.error("An error occurred", error);
        }
    };

    const handlePressInsta = async () => {
        try {
            if (instagramInstalled) {
                await Linking.openURL("instagram://user?username=bikaircity");
            } else {
                await Linking.openURL("https://www.instagram.com/bikaircity");
            }
        } catch (error) {
            console.error("An error occurred", error);
        }
    };

    return (
        <View style={{
            ...drawerStyles.root,
            paddingBottom: insets.bottom,
            paddingTop: insets.top
        }}>
            <View style={drawerStyles.container}>
                <View style={drawerStyles.header}>
                    <View
                        style={drawerStyles.logo}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(drawerUserMenuEvent());
                            navigation.navigate("User");
                        }}
                        style={{
                            flexDirection: "row",
                            marginTop: -15,
                            paddingHorizontal: SIZES.base,
                        }}>
                        <View style={drawerStyles.avatarContainer}>
                            <ImageAtom
                                style={{height: 50, width: 50}}
                                resizeMode="contain"
                                source={LogoFullWhite}
                            />
                        </View>
                        <View style={{
                            justifyContent: "center",
                            paddingHorizontal: 5
                        }}>
                            <TextAtom style={drawerStyles.firsName}>
                                {user && t("subscription_screen.hello") + ", " + user.firstname + " 👋"}
                            </TextAtom>
                            <TextAtom style={{color: COLORS.gray, marginTop: 5, ...FONTS.body5}}>
                                {t("subscription_screen.profile")}
                            </TextAtom>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text style={drawerStyles.name}>
                    </Text>
                </TouchableOpacity>
                <ScrollViewAtom showsVerticalScrollIndicator={false} style={drawerStyles.lines}>
                    <IconTextLink
                        icon="map"
                        onClick={() => {
                            dispatch(drawerTripsMenuEvent());
                            navigation.navigate("Trips");
                        }}>
                        {t("drawer_menu.trip")}
                    </IconTextLink>
                    <IconTextLink
                        icon="credit-card"
                        onClick={() => {
                            dispatch(drawerPaymentMenuEvent());
                            navigation.navigate("Payment");
                        }}>
                        {t("drawer_menu.payment")}
                    </IconTextLink>
                    <IconTextLink
                        icon="gift"
                        onClick={() => {
                            dispatch(drawerPromotionsMenuEvent());
                            navigation.navigate("Promotion");
                        }}>
                        {t("drawer_menu.promotion")}
                    </IconTextLink>
                    {(userFunctions?.functionalities ?? []).includes(UserFunctions.SUBSCRIPTION_AND_PASS) &&
                        <View>
                            <IconTextLink
                                icon="tag"
                                onClick={() => {
                                    dispatch(drawerProductsMenuEvent());
                                    navigation.navigate("Subscription");
                                }}>
                                {t("drawer_menu.subscription")}
                            </IconTextLink>
                            <View style={drawerStyles.discount}>
                                <Text style={{
                                    color: COLORS.white,
                                }}>{t("subscription_screen.new")}</Text>
                            </View>
                        </View>
                    }
                    <IconTextLink
                        icon="share-2"
                        onClick={() => {
                            dispatch(drawerSponsorMenuEvent());
                            navigation.navigate(
                                "Sponsor",
                            );
                        }}>
                        {t("drawer_menu.sponsor")}
                    </IconTextLink>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start"
                    }}>
                        <IconTextLink
                            id={"notification"}
                            icon="bell"
                            onClick={() => {
                                dispatch(drawerNotificationMenuEvent());
                                navigation.navigate("Notification");
                            }}>
                            {"Notifications"}
                        </IconTextLink>
                        {unread !== 0 ? (
                            <View style={{
                                width: 20,
                                height: 20,
                                marginLeft: 5,
                                backgroundColor: COLORS.red,
                                borderRadius: SIZES.padding,
                            }}>
                                <TextAtom style={{
                                    color: COLORS.white,
                                    ...FONTS.h5,
                                    textAlign: "center"
                                }}>{unread}</TextAtom>
                            </View>
                        ) : null}
                    </View>

                    <IconTextLink
                        icon="help-circle"
                        onClick={() => {
                            dispatch(drawerHelpMenuEvent());
                            if (isCrispEnabled) {
                                CrispChat.openChat();
                            } else {
                                navigation.navigate("Help", {screen: "Help", isInCourse: false});
                            }
                        }}
                    >
                        {t("drawer_menu.help")}
                    </IconTextLink>
                    <TouchableOpacity
                        onPress={handleDisconnect}
                        activeOpacity={0.5}>
                        <View style={drawerStyles.line}>
                            <FeatherIcon
                                name={"log-out"}
                                size={18}
                                color={COLORS.red}
                                style={drawerStyles.icon}
                            />
                            <TextAtom style={drawerStyles.lineText}>
                                {t("drawer_menu.logout")}
                            </TextAtom>
                        </View>
                    </TouchableOpacity>
                </ScrollViewAtom>

                <SocialButtonsMolecule
                    handlePressFace={handlePressFace}
                    handlePressInsta={handlePressInsta}
                />

                <TouchableOpacity
                    onPress={() => {
                        dispatch(drawerTermesMenuEvent());
                        navigation.navigate("Terms");
                    }}
                    style={drawerStyles.footer}>
                    <TextAtom style={drawerStyles.cgu}>{t("cgu.title")}</TextAtom>
                    <TextAtom style={drawerStyles.version}>V{version}</TextAtom>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Drawer;
