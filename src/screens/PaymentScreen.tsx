import {COLORS} from "@assets/constant";
import {TextAtom} from "@components/Atom/TextAtom";
import {CardCredit} from "@components/CardCredit";
import CardInfo from "@components/CardInfo";
import CardInfoDeposit from "@components/CardInfoDeposit";
import Loader from "@components/Loader";
import TextButton from "@components/Molecule/TextButton";
import ApplePayButton from "@containers/ApplePayButton";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {UserFunctions} from "@models/enums";
import {useFocusEffect} from "@react-navigation/native";
import {getPaymentMethod} from "@redux/reducers/paymentMethod";
import {setSnackbar} from "@redux/reducers/snackbar";
import {instanceApi} from "@services/axiosInterceptor";
import {POST_PAYMENT_SHEET} from "@services/endPoint";
import {PaymentStackScreenProps} from "@stacks/types";
import {useStripe} from "@stripe/stripe-react-native";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";
import {paymentScreenStyles} from "@styles/PaymentScreenStyles";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback} from "react";
import {useTranslation} from "react-i18next";
import {Alert, Platform, View, ViewProps} from "react-native";
import {ScrollView} from "react-native-gesture-handler";

import MyConfig from "../../config";

const {CONFIG_PAYMENT} = MyConfig;

interface Props extends ViewProps, PaymentStackScreenProps<"PaymentInfo"> {
}

const PaymentScreen: React.FC<Props> = (): React.ReactElement => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = React.useState(false);
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const paymentMethod = useAppSelector(state => state.paymentMethod);
    const userFunctions = useAppSelector(state => state.auth.functionalities);
    const functionList = userFunctions && userFunctions.functionalities ? userFunctions.functionalities : [];

    useFocusEffect(useCallback(() => {
        dispatch(getPaymentMethod());
    }, []));

    const fetchPaymentSheetParams = async () => {
        setLoading(true);
        try {
            const response = await instanceApi.post(POST_PAYMENT_SHEET);
            console.log("POST_PAYMENT_SHEET", response.data);
            return response.data;
        } catch (err: any) {
            dispatch(setSnackbar({type: "danger", message: err.message}));
            setLoading(false);
        }
    };

    const handleOpenPayment = async () => {
        const {setupIntent, ephemeralKey, customer} = await fetchPaymentSheetParams();
        const {error} = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            setupIntentClientSecret: setupIntent,
            merchantDisplayName: CONFIG_PAYMENT.merchantName,
            style: "automatic",
            returnURL: "bikair://payment-method"
        });

        if (!error) {
            await openPaymentSheet();
        } else {
            setLoading(false);
        }
    };

    const openPaymentSheet = async () => {
        const {error} = await presentPaymentSheet();
        if (!error) {
            dispatch(getPaymentMethod(true));
            const title = t("wording.success");
            const message = t("payment.success");
            dispatch(setSnackbar({type: "success", message: title + "\n" + message}));
        }
        setLoading(false);
    };

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "PaymentScreen").then(r => console.log(r));
    }, []));

    if (paymentMethod.isFetching) {
        return <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>;
    }

    return (
        <View style={{flex: 1, backgroundColor: "white"}}>
            {paymentMethod.error && Alert.alert(paymentMethod.error)}
            <ScrollView showsVerticalScrollIndicator={false} style={paymentScreenStyles.container}>
                <CardCredit/>
                <View style={paymentScreenStyles.itemHolder}>
                    <TextButton
                        buttonContainerStyle={paymentScreenStyles.buttonContainerStyle}
                        onPress={handleOpenPayment}
                        actionLabel={"CHECKOUT_VALIDATION"}
                        disabled={loading}
                        inProgress={loading}
                        label={t("payment.addModifyCard") ?? "add"}
                    />
                    {
                        functionList.includes(UserFunctions.APPLE_PAY) && Platform.OS === "ios" &&
                        <>
                            <TextAtom style={{paddingVertical: 10}}>
                                {t("payment.or")}
                            </TextAtom>
                            <ApplePayButton/>
                        </>
                    }
                </View>
                <View style={paymentScreenStyles.wrapperInfo}>
                    <CardInfo/>
                </View>
                <View style={paymentScreenStyles.wrapperInfo}>
                    <CardInfoDeposit/>
                </View>
            </ScrollView>
        </View>
    );
};

export default PaymentScreen;
