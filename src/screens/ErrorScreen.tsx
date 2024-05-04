import {BikeYellow, FONTS, Order, SIZES} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import TextButton from "@components/Molecule/TextButton";
import {useAppSelector} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {ProductStackScreenProps} from "@stacks/types";
import {errorScreenStyle} from "@styles/CancelScreenStyle";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {BackHandler, Text, View, ViewProps} from "react-native";

interface Props extends ViewProps, ProductStackScreenProps<"ProductError"> {
}

const ErrorScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const [loading, setLoading] = useState(true);
    const {t} = useTranslation();

    const error = useAppSelector(state => state.products.error);

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            return true;
        });
        setTimeout(() => {
            setLoading(false);
        }, 5000);
        return () => backHandler.remove();
    }, []);

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "ErrorScreen").then(() => console.log(""));
    }, []));


    return (
        <View style={errorScreenStyle.container}>
            {loading ? (
                <View style={errorScreenStyle.imageContainer}>
                    <ImageAtom
                        source={BikeYellow}
                        resizeMode="contain"
                        style={errorScreenStyle.imageBikeYellow}
                    />
                    <TextAtom style={errorScreenStyle.validatePurchase}>
                        {t("subscription_screen.loading_validate_purchase")}
                    </TextAtom>
                </View>
            ) : (
                <View style={errorScreenStyle.orderContainer}>
                    <ImageAtom
                        source={Order}
                        resizeMode="contain"
                        style={{
                            width: 120,
                            height: 120
                        }}
                    />
                    <TextAtom style={{marginTop: SIZES.padding, ...FONTS.h1}}>
                        {t("subscription_screen.payment_failed")}!
                    </TextAtom>
                    <Text style={errorScreenStyle.errorMessage}>
                        {error ? error : t("subscription_screen.error_message")}
                    </Text>
                </View>
            )}

            {loading ? null : (
                <TextButton
                    label={t("subscription_screen.understood") ?? ""}
                    actionLabel={"CLOSE_ERROR_CONFIRM"}
                    buttonContainerStyle={errorScreenStyle.buttonStyle}
                    onPress={() => navigation.navigate("Offers")}
                />
            )}
        </View>
    );
};

export default ErrorScreen;
