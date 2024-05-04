import {createStackNavigator} from "@react-navigation/stack";
import CodeScreen from "@screens/CodeScreen";
import OfflineHomeScreen from "@screens/OfflineHomeScreen";
import OnBoardingScreen from "@screens/OnBoardingScreen";
import PhoneScreen from "@screens/PhoneScreen";
import SendEmailScreen from "@screens/SendEmailScreen";
import UpdateScreen from "@screens/UpdateScreen";
import React from "react";

import {AuthStackParamList} from "./types";


const Stack = createStackNavigator<AuthStackParamList>();


const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName={"Intro"}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Intro" component={OnBoardingScreen}/>
            <Stack.Screen name="Phone" component={PhoneScreen}/>
            <Stack.Screen name="Code" component={CodeScreen}/>
            <Stack.Screen name="SendEmail" component={SendEmailScreen}/>
            <Stack.Screen name="Map" component={OfflineHomeScreen}/>
            <Stack.Screen name="Update" component={UpdateScreen}/>
        </Stack.Navigator>
    );
};

export default AuthStack;
