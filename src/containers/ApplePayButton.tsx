import {ApplePay} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import {TextAtom} from "@components/Atom/TextAtom";
import {useAppDispatch} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {addPaymentMethod} from "@redux/reducers/paymentMethod";
import {setSnackbar} from "@redux/reducers/snackbar";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_CLIENT_SECRET} from "@services/endPoint";
import {useApplePay} from "@stripe/stripe-react-native";
import {applePayStyles} from "@styles/PaymentScreenStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {ActivityIndicator, TouchableOpacity, View, ViewProps} from "react-native";

import MyConfig from "../../config";

const {CONFIG_PAYMENT} = MyConfig;

type Props = ViewProps

const ApplePayButtonComponent: React.FC<Props> = (): React.ReactElement => {

    const {t} = useTranslation();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [appleSupported, setAppleSupported] = React.useState<boolean | null>(false);
    const {
        isApplePaySupported,
        presentApplePay,
        confirmApplePayPayment,
        openApplePaySetup,
    } = useApplePay();

    // Redux
    const dispatch = useAppDispatch();

    useFocusEffect(() => setAppleSupported(isApplePaySupported));

    /**
     * 1. Open Apple Pay window
     * 2. Retrieve card information
     * 3. Save card information to DB
     * 4. Confirm payment (with apple-pay we need to confirm the payment with client_secret)
     * @returns
     */
    const handleApplePay = async () => {
        setLoading(true);
        if (!appleSupported) {
            await openApplePaySetup();
            setAppleSupported(true);
            setLoading(false);
            return;
        }
        const response = await presentApplePay({
            cartItems: [
                {
                    label: CONFIG_PAYMENT.merchantName + " - " + t("payment.add_card"),
                    amount: "0.00",
                    paymentType: "Immediate"
                },
            ],
            country: CONFIG_PAYMENT.country,
            currency: CONFIG_PAYMENT.currency,
        });

        if (response.error) {
            setAppleSupported(false);
            setLoading(false);
            dispatch(setSnackbar({type: "danger", message: response.error.message}));
        }

        if (response.paymentMethod) {
            try {
                // 1. We need to save and attach to payment method to stripe before you create a payment intent !
                dispatch(addPaymentMethod(response.paymentMethod.id));

                // 2. Create a stripe secret to confirm the card (payment)
                const {data} = await instanceApi.get(GET_CLIENT_SECRET);

                // 3. Confirm payment (card)
                const {error: confirmError} = await confirmApplePayPayment(data);

                if (confirmError) {
                    dispatch(setSnackbar({type: "danger", message: confirmError.message}));
                    return;
                }
            } catch (err: any) {
                dispatch(setSnackbar({type: "danger", message: err.message}));
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <TouchableOpacity
            disabled={loading}
            onPress={handleApplePay}
            activeOpacity={0.8}
            style={applePayStyles.applePay}
        >
            <ImageAtom
                style={{height: 25, width: 25, marginRight: 10}}
                resizeMode="contain"
                source={ApplePay}
            />
            <TextAtom style={applePayStyles.whiteText}>
                {loading ? (
                    <ActivityIndicator
                        style={{
                            marginTop: 20,
                        }}
                        size="small"
                        color={"white"}
                    />
                ) : (
                    t(`wording.${appleSupported ? "applepay" : "applepaycard"}`)
                )}
            </TextAtom>
        </TouchableOpacity>
    );
};

export default ApplePayButtonComponent;
