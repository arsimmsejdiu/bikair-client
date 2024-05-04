import {BikeYellow, COLORS, Confetti, SIZES} from "@assets/index";
import {ImageAtom, TextAtom} from "@components/Atom";
import TextButton from "@components/Molecule/TextButton";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {productPassPurchaseEvent, productSubscriptionPurchaseEvent} from "@redux/reducers/events";
import {setProductsUser} from "@redux/reducers/products";
import {getProductsUser} from "@services/productService";
import {ProductStackScreenProps} from "@stacks/types";
import {successScreenStyle} from "@styles/CancelScreenStyle";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {BackHandler, StatusBar, View, ViewProps} from "react-native";

interface Props extends ViewProps, ProductStackScreenProps<"ProductSuccess"> {
}

const SuccessScreen: React.FC<Props> = ({navigation}): React.ReactElement => {
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    // Use destructuring to reduce the repetitive use of useAppSelector.
    const {
        productId: id,
        productPrice: price,
        recurring,
        productFrom: from,
        productPeriod: period,
        productDescription: successMessage
    } = useAppSelector(state => state.products);
    const {t} = useTranslation();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            return true;
        });

        setTimeout(() => {
            setLoading(false);
            if (recurring) {
                dispatch(productSubscriptionPurchaseEvent(id, price));
            } else {
                dispatch(productPassPurchaseEvent(id, price));
            }
        }, 5000);
        return () => backHandler.remove();
    }, []);

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "SuccessScreen").then(() => console.log(""));
    }, []));

    const handleOk = async () => {
        const responseProductsUser = await getProductsUser();
        dispatch(setProductsUser(responseProductsUser));
        navigation.navigate("Offers");
    };

    const renderSubscriptionPassDate = () => {
        const date = new Date(from);
        date.setDate(date.getDate() + period);
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        }).format(date);

        return `${formattedDate}`;
    };

    return (
        <View style={successScreenStyle.container}>
            <StatusBar backgroundColor={COLORS.white}/>
            {loading ? (
                <View style={successScreenStyle.contentContainerTrue}>
                    <ImageAtom
                        source={BikeYellow}
                        resizeMode="contain"
                        style={successScreenStyle.imageTrue}
                    />
                    <TextAtom style={successScreenStyle.textTrue}>
                        {t("subscription_screen.loading_validate_purchase")}
                    </TextAtom>
                </View>
            ) : (
                <View style={successScreenStyle.contentContainerFalse}>
                    <ImageAtom
                        source={Confetti}
                        resizeMode="contain"
                        style={successScreenStyle.imageFalse}
                    />
                    <TextAtom style={successScreenStyle.textFalse}>
                        {t("subscription_screen.congratulations")}!
                    </TextAtom>
                    <TextAtom style={successScreenStyle.date}>
                        {successMessage}{" "}{renderSubscriptionPassDate()}
                    </TextAtom>
                </View>
            )}

            {loading ? null : (
                <TextButton
                    disabled={loading}
                    inProgress={loading}
                    label={t("subscription_screen.done") ?? "done"}
                    actionLabel={"CHECKOUT_PRODUCT_SUCCESS"}
                    buttonContainerStyle={{
                        height: 55,
                        marginBottom: SIZES.padding,
                        borderRadius: SIZES.padding,
                        backgroundColor: COLORS.lightBlue
                    }}
                    onPress={handleOk}
                />
            )}
        </View>
    );
};

export default SuccessScreen;
