import Header from "@components/Header";
import {createStackNavigator} from "@react-navigation/stack";
import BikePhotoScreen from "@screens/BikePhotoScreen";
import BikeStatusInfoScreen from "@screens/BikeStatusInfoScreen";
import CustomizePreferenceScreen from "@screens/CustomizePreferenceScreen";
import HomeScreen from "@screens/HomeScreen";
import RGPDScreen from "@screens/RGPDScreen";
import TripEndScreen from "@screens/TripEndScreen";
import TripPauseScreen from "@screens/TripPauseScreen";
// import NewsScreen from "@screens/NewsScreen";
import TripStartScreen from "@screens/TripStartScreen";
import TripStepsScreen from "@screens/TripStepsScreen";
import TripStopScreen from "@screens/TripStopScreen";
import UpdateScreen from "@screens/UpdateScreen";
import W3DSecureScreen from "@screens/W3DSecureScreen";
import React from "react";
import {useTranslation} from "react-i18next";

import {HomeStackParamList} from "./types";
import BikeTagsInfoScreen from "@screens/BikeTagsInfoScreen";

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStack = () => {
    const {t} = useTranslation();

    return (
        <Stack.Navigator
            initialRouteName="Cookies"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Map"
                component={HomeScreen}
            />
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="Photo" component={BikePhotoScreen}/>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="TripStart" component={TripStartScreen}/>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="TripSteps" component={TripStepsScreen}/>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="TripEnd" component={TripEndScreen}/>

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="BikeStatus"
                component={BikeStatusInfoScreen}
            />
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="BikeTags"
                component={BikeTagsInfoScreen}
            />
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="TripStop"
                component={TripStopScreen}
            />
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="Cookies"
                component={RGPDScreen}
            />
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="CustomizeCookies"
                component={CustomizePreferenceScreen}
            />
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="TripPause"
                component={TripPauseScreen}
            />
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: (props) => <Header {...props} home={false} title={t("headers.auth_3dsecure")}/>,
                }}
                name="W3DSecure"
                component={W3DSecureScreen}/>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="Update"
                component={UpdateScreen}/>
            {/*<Stack.Screen*/}
            {/*    options={{*/}
            {/*        headerShown: false,*/}
            {/*    }}*/}
            {/*    name="News"*/}
            {/*    component={NewsScreen}/>*/}

        </Stack.Navigator>
    );
};

export default HomeStack;
