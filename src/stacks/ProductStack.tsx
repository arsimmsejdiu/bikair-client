import Header from "@components/Header";
import {createStackNavigator} from "@react-navigation/stack";
import CancelScreen from "@screens/CancelScreen";
import DeleteScreen from "@screens/DeleteScreen";
import ErrorScreen from "@screens/ErrorScreen";
import MyCartScreen from "@screens/MyCartScreen";
import SubscriptionScreen from "@screens/SubscriptionScreen";
import SuccessScreen from "@screens/SuccessScreen";
import React from "react";
import {useTranslation} from "react-i18next";

// Private Screens
import {ProductStackParamList} from "./types";

const Stack = createStackNavigator<ProductStackParamList>();

const PaymentStack = () => {
    const {t} = useTranslation();

    return (
        <Stack.Navigator
            initialRouteName="Offers"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: (props) => <Header {...props} home={true} title={t("headers.subscription")}/>,
                }}
                name="Offers" component={SubscriptionScreen}
            />
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: (props) => <Header {...props} home={false} text={"Offers"} title={t("headers.my_cart")}/>,
                }}
                name="MyCart" component={MyCartScreen}
            />
            <Stack.Screen
                name="ProductSuccess" component={SuccessScreen}
            />
            <Stack.Screen
                name="ProductError" component={ErrorScreen}
            />
            <Stack.Screen
                name="ProductCancel" component={CancelScreen}
            />
            <Stack.Screen
                name="ProductDeleted" component={DeleteScreen}
            />
        </Stack.Navigator>
    );
};

export default PaymentStack;
