import {COLORS} from "@assets/index";
import {useAppDispatch} from "@hooks/index";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {errorOccured} from "@redux/reducers/events";
import {setSnackbar} from "@redux/reducers/snackbar";
import {setRedirectUrl, setTripState} from "@redux/reducers/trip";
import {loadData, removeValue} from "@services/asyncStorage";
import {HomeStackScreenProps} from "@stacks/types";
import {useStripe} from "@stripe/stripe-react-native";
import {w3dSecureStyles} from "@styles/HomeScreenStyles";
import {parseUrl} from "@utils/helpers";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ActivityIndicator, Linking, View, ViewProps} from "react-native";
import {WebView} from "react-native-webview";

interface Props extends ViewProps, HomeStackScreenProps<"W3DSecure"> {
}

const W3DSecure: React.FC<Props> = ({route, navigation}): React.ReactElement => {
    const {t} = useTranslation();
    const [visible, setVisible] = useState(true);
    const [uri, setUri] = useState<string | null>(null);

    // Init stripe
    const {retrievePaymentIntent} = useStripe();

    // Redux
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Listening to stripe return url
        const subscription = Linking.addEventListener("url", handleEventListener);

        // Specify how to clean up after this effect:
        return function cleanup() {
            if (typeof subscription !== "undefined") {
                subscription.remove();
            }
        };
    }, []);

    useEffect(() => {
        if (route.params?.uri) {
            setUri(route.params.uri);
        }
    }, [route.params]);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "W3DSecure").then(() => console.log(""));
    }, []));

    /**
     * Ensure payment status is succeeded
     * @param {*} clientSecret
     */
    const checkPaymentIntentStatus = async (clientSecret: string) => {
        // RequiresPaymentMethod || RequiresAction || Succeeded || RequiresCapture
        try {
            const {paymentIntent} = await retrievePaymentIntent(clientSecret);
            return paymentIntent;
        } catch (err) {
            dispatch(errorOccured(err));
            dispatch(setSnackbar({type: "danger", message: t("payment.error_3Dsecure")}));
        }
    };

    /**
     * Listening to return url from stripe Hook
     * @param {*} event
     */
    const handleEventListener = async (event: { url: string }) => {
        setVisible(true);
        const url = event.url;
        const params = parseUrl(url);
        let paymentIntent, status;

        try {
            // Cleanup redirect url
            dispatch(setRedirectUrl(null));

            // retrieve payment status
            const clientSecret = await loadData("@clientSecret");
            // Ensure clientSecret is remove (used to confirm payment/deposit)
            await removeValue("@clientSecret");

            console.log("params?.url = ", params?.url);

            switch (params?.url) {
                case "save-card": // Should handle 3D secure on saving payment-method
                    // TODO Need to be tested with real 3D secure card
                    navigation.navigate("Payment", {
                        screen: "PaymentInfo"
                    });
                    break;
                case "payment-deposit":
                    console.log("Handle payment-deposit");
                    if (!clientSecret) {
                        console.log("No client secret");
                        dispatch(setSnackbar({type: "danger", message: "payment.error_3Dsecure_deposit"}));
                        dispatch(errorOccured({}, "MISSING_CLIENT_SECRET_DEPOSIT"));
                        navigation.navigate("Map");
                        break;
                    } else {
                        console.log("There is a client secret");
                    }
                    console.log("Check Payment status");
                    paymentIntent = await checkPaymentIntentStatus(clientSecret);
                    status = paymentIntent?.status;
                    // The funds are available on stripe and can be "captured" if necessary
                    console.log("Deposit payment status = ", status);
                    if (status === "RequiresCapture") {
                        // Start creating a new trip
                        console.log("Status is good");
                        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_BEGIN));
                        navigation.navigate("TripSteps");
                    } else {
                        dispatch(setSnackbar({type: "danger", message: "payment.error_3Dsecure_deposit"}));
                        dispatch(errorOccured({lockStatus: status}, "DEPOSIT_PAYMENT_ERROR"));
                        dispatch(setTripState(null));
                        navigation.navigate("Map");
                    }
                    break;
                case "payment-trip":
                    if (!clientSecret) {
                        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_PAYMENT_ERROR));
                        navigation.navigate("Map");
                        break;
                    }
                    paymentIntent = await checkPaymentIntentStatus(clientSecret);
                    status = paymentIntent?.status;
                    if (status === "Succeeded") {
                        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_PAID));
                    } else {
                        dispatch(setTripState(TRIP_STEPS.TRIP_STEP_PAYMENT_ERROR));
                    }
                    navigation.navigate("TripSteps");
                    break;
                case "payment-method":
                    navigation.navigate("Payment", {
                        screen: "PaymentAdd",
                        params: {
                            clientSecret: clientSecret ?? ""
                        }
                    });
                    break;
                case "payment-subscription":
                    if (!clientSecret) {
                        navigation.navigate("Subscription", {
                            screen: "ProductError"
                        });
                        break;
                    }
                    paymentIntent = await checkPaymentIntentStatus(clientSecret);
                    status = paymentIntent?.status;
                    if (status === "Succeeded") {
                        navigation.navigate("Subscription", {
                            screen: "ProductSuccess"
                        });
                    } else {
                        navigation.navigate("Subscription", {
                            screen: "ProductError"
                        });
                    }
                    break;
                case "payment-pass":
                    if (!clientSecret) {
                        navigation.navigate("Subscription", {
                            screen: "ProductError"
                        });
                        break;
                    }
                    paymentIntent = await checkPaymentIntentStatus(clientSecret);
                    status = paymentIntent?.status;
                    if (status === "Succeeded") {
                        navigation.navigate("Subscription", {
                            screen: "ProductSuccess"
                        });
                    } else {
                        navigation.navigate("Subscription", {
                            screen: "ProductError"
                        });
                    }
                    break;
                default:
                    break;
            }
        } catch (err: any) {
            // We need to handle GPS location error message
            const msg = err && err.message ? err.message : err;
            console.log("Error W3D secure : ", msg);
            dispatch(setSnackbar({type: "danger", message: msg}));
            dispatch(errorOccured(err));
            // Ensure clientSecret is remove (used to confirm payment/deposit)
            await removeValue("@clientSecret");
            navigation.navigate("Map");
        }
    };

    return <View style={{flex: 1}}>
        <WebView
            // originWhitelist={["bikair://"]}
            onLoadStart={() => {
                setVisible(true);
            }}
            onLoad={() => {
                setVisible(false);
            }}
            style={{flex: 1}}
            source={{uri: uri ?? ""}}
            hidesWhenStopped={true}
        />
        {visible && (
            <ActivityIndicator
                color={COLORS.lightBlue}
                style={w3dSecureStyles.indicator}
                size="large"
            />
        )}
    </View>;

};

export default W3DSecure;
