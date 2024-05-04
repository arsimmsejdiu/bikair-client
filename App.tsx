import "react-native-reanimated";
import "react-native-gesture-handler";
import SnackBar from "@containers/SnackBar";
import Geolocation from "@react-native-community/geolocation";
import {firebase} from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import {store} from "@redux/store";
import {StripeProvider} from "@stripe/stripe-react-native";
import React, {useEffect} from "react";
import {StatusBar} from "react-native";
import {Settings} from "react-native-fbsdk-next";
import {EventProvider} from "react-native-outside-press";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ToastProvider} from "react-native-toast-notifications";
import {Provider} from "react-redux";

import MyConfig from "./config";
import RootStack from "./src/stacks/RootStack";

const {
    STRIPE_PUBLISHABLE_KEY
} = MyConfig;

const App = () => {

    Geolocation.setRNConfiguration({
        skipPermissionRequests: true,
        authorizationLevel: "whenInUse",
        locationProvider: "playServices",
        enableBackgroundLocationUpdates: true,
    });


    useEffect(() => {
        Settings.initializeSDK();
        Settings.setAdvertiserTrackingEnabled(false).then(r => console.log(r));
        firebase.analytics().setAnalyticsCollectionEnabled(false).then(r => console.log(r));
        crashlytics().setCrashlyticsCollectionEnabled(true).then(r => console.log(r));
        crashlytics().log("App start");
    }, []);

    return (
        <StripeProvider
            publishableKey={STRIPE_PUBLISHABLE_KEY}
            urlScheme="bikair://save-card"
            merchantIdentifier="merchant.com.bik-air.bikair">
            <Provider store={store}>
                <SafeAreaProvider>
                    <ToastProvider
                        placement={"top"}
                        animationDuration={250}
                        animationType={"zoom-in"}
                        swipeEnabled={true}
                        offsetTop={15}
                    >
                        <EventProvider style={{flex: 1}}>
                            <StatusBar barStyle="light-content"/>
                            <RootStack/>
                            <SnackBar/>
                        </EventProvider>
                    </ToastProvider>
                </SafeAreaProvider>
            </Provider>
        </StripeProvider>
    );
};

export default App;
