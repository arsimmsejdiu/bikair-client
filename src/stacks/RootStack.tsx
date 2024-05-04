import NetworkState from "@components/NetworkState";
import {ConnectedActions} from "@containers/ConnectedActions";
import SplashScreen from "@containers/SplashScreen";
import {StartupActions} from "@containers/StartupActions";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import BleWrapper from "@providers/BleWrapper";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import {NavigationContainer} from "@react-navigation/native";
import {LinkingOptions} from "@react-navigation/native/lib/typescript/src/types";
import { authLogout } from "@redux/reducers/auth";
import {getCurrentRouteName, navigationRef, routeNameRef, setRouteNameRef} from "@services/rootNavigation";
import {useStripe} from "@stripe/stripe-react-native";
import React from "react";
import {Linking} from "react-native";

import AuthStack from "./AuthStack";
import DrawerStack from "./DrawerStack";
import {DrawerStackParamList} from "./types";

const stripeUrls = ["payment-deposit", "payment-trip", "payment-trip-unpaid", "payment-method", "save-card", "payment-subscription", "payment-pass"];

const RootStack = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth);
    const initialState = useAppSelector(state => state.initialState);
    const {handleURLCallback} = useStripe();

    const linking: LinkingOptions<DrawerStackParamList> = {
        prefixes: [
            "bikair://",
        ],
        async getInitialURL() {
            //default deep link handling
            const url = await Linking.getInitialURL();
            console.log("Initial URL = ", url);

            return url;
        },

        // Custom function to subscribe to incoming links
        subscribe(listener) {
            // Listen to incoming links from deep linking
            const linkingSubscription = Linking.addEventListener("url", ({url}) => {
                console.log("Linking url event on ", url);
                if (url && stripeUrls.includes(url.split("//")[1])) {
                    console.log("Handle Stripe url");
                    handleURLCallback(url).then(() => console.log("Stripe url callback done"));
                }
                console.log("call listener for url");
                listener(url);
            });

            return () => {
                // Clean up the event listeners
                linkingSubscription.remove();
            };
        },
        config: {
            /* configuration for matching screens with paths */
            screens: {
                Home: {
                    screens: {
                        W3DSecure: {
                            path: "payment-deposit",
                            exact: true
                        },
                        // eslint-disable-next-line no-dupe-keys, @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        W3DSecure: {
                            path: "payment-trip",
                            exact: true
                        },
                        // eslint-disable-next-line no-dupe-keys, @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        W3DSecure: {
                            path: "payment-trip-unpaid",
                            exact: true
                        },
                        // eslint-disable-next-line no-dupe-keys, @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        W3DSecure: {
                            path: "payment-method",
                            exact: true
                        },
                        // eslint-disable-next-line no-dupe-keys, @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        W3DSecure: {
                            path: "save-card",
                            exact: true
                        },
                        // eslint-disable-next-line no-dupe-keys, @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        W3DSecure: {
                            path: "payment-subscription",
                            exact: true
                        },
                        // eslint-disable-next-line no-dupe-keys, @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        W3DSecure: {
                            path: "payment-pass",
                            exact: true
                        }
                    },
                },
                Subscription: {
                    screens: {
                        Offers: {
                            path: "products",
                            exact: true
                        }
                    }
                }
            },
        },
    };

    if(auth.me && auth.me.is_block){
        crashlytics().log("user is blocked");
        dispatch(authLogout());
    }

    return (
        <NavigationContainer
            ref={navigationRef}
            linking={linking}
            fallback={<SplashScreen/>}
            onReady={() => {
                setRouteNameRef(getCurrentRouteName());
            }}
            onStateChange={async () => {
                const previousRouteName = routeNameRef;
                const currentRouteName = getCurrentRouteName();

                if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                    });
                }
                setRouteNameRef(currentRouteName);
            }}
        >
            <StartupActions>
                {
                    auth.isAuthenticated ?
                        <BleWrapper>
                            <ConnectedActions>
                                <DrawerStack/>
                                <NetworkState isOnline={initialState.isOnline}/>
                            </ConnectedActions>
                        </BleWrapper>
                        :
                        <>
                            <AuthStack/>
                        </>
                }
            </StartupActions>
        </NavigationContainer>
    );
};

export default RootStack;
