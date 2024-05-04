import {GooglePay} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {useAppDispatch} from "@hooks/index";
import {addPaymentMethod} from "@redux/reducers/paymentMethod";
import {setSnackbar} from "@redux/reducers/snackbar";
import {useGooglePay} from "@stripe/stripe-react-native";
import {googlePayStyles} from "@styles/PaymentScreenStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {ActivityIndicator, TouchableOpacity, ViewProps} from "react-native";

import MyConfig from "../../config";

const {isGooglePayTest, CONFIG_PAYMENT} = MyConfig;


type Props = ViewProps

const GooglePayButton: React.FC<Props> = (): React.ReactElement | null => {

    const {t} = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(false);
    const {
        isGooglePaySupported,
        initGooglePay,
        createGooglePayPaymentMethod
    } = useGooglePay();

    // Redux
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        initGoogle().then(r => console.log(r));
    }, []);

    const initGoogle = async () => {
        const isGoogleSupported = await isGooglePaySupported({testEnv: isGooglePayTest === "true"});

        if (!isGoogleSupported) {
            return;
        }

        const {error} = await initGooglePay({
            testEnv: isGooglePayTest === "true",
            merchantName: CONFIG_PAYMENT.merchantName,
            countryCode: CONFIG_PAYMENT.country,
            billingAddressConfig: {
                format: "MIN",
                isPhoneNumberRequired: false,
                isRequired: false,
            },
            existingPaymentMethodRequired: false,
            isEmailRequired: false,
        });

        if (error) {
            dispatch(setSnackbar({type: "danger", message: error.message}));
            return;
        }
    };

    const handleGooglePay = async () => {
        if (!isGooglePaySupported) {
            dispatch(setSnackbar({type: "danger", message: "payment.error_google_pay"}));
            return;
        }
        try {
            setLoading(true);
            const {error, paymentMethod} = await createGooglePayPaymentMethod({
                amount: 0.00,
                currencyCode: CONFIG_PAYMENT.currency,
            });

            if (error) {
                // handle error
                dispatch(setSnackbar({type: "danger", message: error.message}));
                return;
            }
            if (paymentMethod) {
                // 1. Save payment method in DB for later use
                dispatch(addPaymentMethod(paymentMethod.id));
            }
        } catch (err: any) {
            dispatch(setSnackbar({type: "danger", message: err.message}));
        } finally {
            setLoading(false);
        }
    };


    return <TouchableOpacity
        disabled={loading}
        onPress={handleGooglePay}
        activeOpacity={0.8}
        style={googlePayStyles.googlePay}
    >
        <ImageAtom
            style={{height: 25, width: 25, marginRight: 10}}
            resizeMode="contain"
            source={GooglePay}/>
        <TextAtom style={googlePayStyles.whiteText}>
            {
                loading ?
                    <ActivityIndicator
                        style={{
                            marginTop: 20,
                        }}
                        size="small"
                        color={"white"}
                    />
                    : t("wording.googlepay")
            }
        </TextAtom>
    </TouchableOpacity>;
};

export default GooglePayButton;
