import {BASE, COLORS, FONTS} from "@assets/index";
import DrawerComponent from "@components/Drawer";
import Header from "@components/Header";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {authLogout} from "@redux/reducers/auth";
import HelpScreen from "@screens/HelpScreen";
import PromotionScreen from "@screens/PromotionScreen";
import SponsorScreen from "@screens/SponsorScreen";
import TermsScreen from "@screens/TermsScreen";
import TripsHistoryScreen from "@screens/TripsHistoryScreen";
import UserScreen from "@screens/UserScreen";
import React from "react";
import {useTranslation} from "react-i18next";
import {StyleSheet} from "react-native";

import HomeStack from "./HomeStack";
import NotificationsStack from "./NotificationsStack";
import PaymentStack from "./PaymentStack";
import ProductStack from "./ProductStack";
import {DrawerStackParamList} from "./types";

const Drawer = createDrawerNavigator<DrawerStackParamList>();

const DrawerStack = () => {
    const {t} = useTranslation();

    // Redux
    const auth = useAppSelector(state => state.auth);

    const user = auth.me;
    const newUser = auth.newUser;
    const dispatch = useAppDispatch();

    const disconnect = async () => {
        dispatch(authLogout());
    };

    return (
        <>
            <Drawer.Navigator
                initialRouteName={newUser ? "User" : "Home"}
                backBehavior="history"
                screenOptions={{
                    headerShown: false,
                    drawerActiveTintColor: "red",
                    drawerItemStyle: {marginVertical: 3},
                    overlayColor: "transparent",
                    drawerStyle: {margin: 0},
                    swipeEdgeWidth: 0
                }}
                drawerContent={props => (
                    <DrawerComponent
                        {...props}
                        user={user}
                        disconnect={() => disconnect()}
                    />
                )}>
                <Drawer.Screen name="Home" component={HomeStack}/>
                <Drawer.Screen
                    options={{
                        headerShown: true,
                        header: props => (
                            <Header {...props} home={true} title={t("headers.trips")}/>
                        ),
                    }}
                    name="Trips"
                    component={TripsHistoryScreen}
                />
                <Drawer.Screen name="Payment" component={PaymentStack}/>
                <Drawer.Screen
                    options={{
                        headerShown: true,
                        header: props => (
                            <Header {...props} home={true} title={t("headers.promotion")}/>
                        ),
                    }}
                    name="Promotion"
                    component={PromotionScreen}
                />
                <Drawer.Screen
                    name="Subscription"
                    component={ProductStack}
                />
                <Drawer.Screen
                    options={{
                        headerShown: false,
                        header: props => (
                            <Header {...props} home={true} title={t("headers.sponsor")}/>
                        ),
                    }}
                    name="Sponsor"
                    component={SponsorScreen}
                />
                <Drawer.Screen
                    options={{
                        headerShown: true,
                        header: props => (
                            <Header {...props} home={true} title={t("headers.help")}/>
                        ),
                    }}
                    name="Help"
                    component={HelpScreen}
                />
                <Drawer.Screen
                    options={{
                        headerShown: false,
                        header: props => (
                            <Header {...props} home={true} text={"NotificationList"} title={t("headers.help")}/>
                        ),
                    }}
                    name="Notification"
                    component={NotificationsStack}
                />
                <Drawer.Screen
                    options={{
                        headerShown: !newUser,
                        header: props => (
                            <Header {...props} home={true} title={t("headers.account")}/>
                        ),
                    }}
                    name="User"
                    component={UserScreen}
                />
                <Drawer.Screen
                    options={{
                        headerShown: true,
                        header: props => (
                            <Header {...props} home={!newUser} title={t("headers.terms")}/>
                        ),
                    }}
                    name="Terms"
                    component={TermsScreen}
                />
            </Drawer.Navigator>
        </>
    );
};

export default DrawerStack;

StyleSheet.create({
    container: {
        flex: 1,
        width: BASE.drawer.width,
        backgroundColor: COLORS.white,
    },

    header: {
        height: 130,
        backgroundColor: COLORS.lightBlue,
        alignItems: "center",
        paddingTop: 10,
    },

    profileTouchable: {
        position: "absolute",
        top: 80,
        left: (BASE.drawer.width - 110) / 2,
        width: 110,
        height: 150,
    },
    logo: {
        height: 55,
        width: 55,
    },
    avatarContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 104,
        width: 104,
        borderRadius: 52,
        borderColor: COLORS.white,
        backgroundColor: COLORS.lightGrey,
        borderWidth: 2,
        overflow: "hidden",
    },
    avatar: {
        height: "100%",
        width: "100%",
        backgroundColor: "blue",
        // height: windowHeight < 600 ? 80 : 104,
        // width: windowHeight < 600 ? 80 : 104,
        // borderRadius: windowHeight < 600 ? 40 : 52,
    },
    name: {
        marginTop: 75,
        textAlign: "center",
        fontFamily: FONTS.main,
        fontSize: 16,
        color: COLORS.lightBlue,
    },

    lines: {
        flex: 1,
        padding: 25,
        marginTop: 15,
    },

    line: {
        flexDirection: "row",
        height: 45,
        alignItems: "center",
    },

    icon: {
        marginRight: 25,
    },

    lineText: {
        fontFamily: FONTS.main,
        fontSize: FONTS.sizeText,
        color: COLORS.black,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 25,
        paddingBottom: 10,
    },

    cgu: {
        fontFamily: FONTS.main,
        fontSize: 13,
        color: COLORS.black,
    },

    version: {
        fontFamily: FONTS.main,
        fontSize: 12,
        color: COLORS.darkGrey,
    },
});
