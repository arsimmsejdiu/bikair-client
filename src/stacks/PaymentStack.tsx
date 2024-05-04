import Header from "@components/Header";
import {createStackNavigator} from "@react-navigation/stack";
import PaymentScreen from "@screens/PaymentScreen";
import React from "react";
import {useTranslation} from "react-i18next";

import {PaymentStackParamList} from "./types";

const Stack = createStackNavigator<PaymentStackParamList>();

const PaymentStack = () => {
    const {t} = useTranslation();
    return (
        <Stack.Navigator
            initialRouteName="PaymentInfo"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: (props) => <Header {...props} home={true} title={t("headers.payment_add")}/>,
                }}
                name="PaymentInfo"
                component={PaymentScreen}/>
        </Stack.Navigator>
    );
};

export default PaymentStack;
