import {Clock, COLORS, FONTS, SIZES} from "@assets/index";
import DetailsDropdown from "@components/DetailsDropdown";
import CartLogo from "@components/Molecule/CartLogo";
import IconLabel from "@components/Molecule/IconLabel";
import TextButton from "@components/Molecule/TextButton";
import {useAppDispatch} from "@hooks/index";
import {useNavigation} from "@react-navigation/native";
import {setProductInfo} from "@redux/reducers/products";
import {storeData} from "@services/asyncStorage";
import {reactivateSubscription, retryPaymentSubscription} from "@services/productService";
import {ProductNavigationProps} from "@stacks/types";
import {getDate} from "@utils/helpers";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Platform, StyleSheet, Text, View} from "react-native";

import {
    DISCOUNT_CODE,
    PostReactivateProductsUserInput,
    PostSubscriptionRetryInput,
    STATUS,
    SUBSCRIPTION_STATUS,
    UserSubscriptionDetail
} from "@bikairproject/shared";

interface UserSubscriptionProps {
    item: UserSubscriptionDetail
}

const UserSubscription = ({item}: UserSubscriptionProps) => {
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();
    const [tripRests, setTripRests] = useState(0);
    const [tripRestsString, setTripRestsString] = useState<string | null>(null);
    const [description, setDescription] = useState<any>({});
    const [locale, setLocale] = useState("fr");
    const navigation = useNavigation<ProductNavigationProps>();
    const {i18n} = useTranslation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        setLocale(i18n.language === "fr" ? "fr" : "en");
    }, [i18n.language]);

    useEffect(() => {
        console.log(item);
        if (item.product_variation && item.product_variation.description && item.product_variation.description[locale]) {
            setDescription(item.product_variation.description[locale]);
        } else if (item.product_description && (item.product_description as any)[locale]) {
            setDescription((item.product_description as any)[locale]);
        }
        if(item.product_variation?.discount_type === DISCOUNT_CODE.PACK || item.discount_type === DISCOUNT_CODE.PACK) {
            const valueRest = Math.abs((item.product_variation?.discount_value ?? item.discount_value ?? 0) - (item.total_usage ?? 0));
            setTripRests(valueRest);
            setTripRestsString(`${valueRest} ${t("wording.minutes")}`);
        } else {
            const valueRest = Math.abs((item.product_variation?.max_usage ?? item.max_usage ?? 0) - (item.period_usage ?? 0));
            setTripRests(valueRest);
            setTripRestsString(`${valueRest} ${t("wording.trips")}`);
        }
    }, [item, locale]);

    const handleCancelSubscription = async () => {
        setLoading(true);
        try {
            navigation.navigate("ProductCancel", {
                Item: item
            });
        } catch (err) {
            console.log(err);
            navigation.navigate("Offers");
        } finally {
            setLoading(false);
        }
    };

    const handleReactivateSubscription = async () => {
        console.log("handleReactivateSubscription");
        if (!item.id) return;
        setLoading(true);
        try {
            const body: PostReactivateProductsUserInput = {
                subscription_id: item.id ?? 0
            };
            await reactivateSubscription(body);
            const date = (getDate(item.next_billing_date) ?? getDate(item.created_at)) ?? new Date();
            if (typeof item.next_billing_date !== "undefined") {
                date.setDate(date.getDate() - (item.product_period ?? 30));
            }
            dispatch(setProductInfo({
                from: new Date().toISOString(),
                period: item.period_usage ?? 30,
                description: description.success_message,
                id: 0,
                price: 0,
                recurring: false
            }));
            navigation.navigate("ProductSuccess");
        } catch (err) {
            console.log(err);
            navigation.navigate("ProductError");
        } finally {
            setLoading(false);
        }
    };

    const handleUnPaidSubscription = async () => {
        console.log("handleUnPaidSubscription");
        if (!item.product_id) return;
        setLoading(true);
        try {
            const body: PostSubscriptionRetryInput = {
                subscription_id: item.id ?? 0
            };
            const data = await retryPaymentSubscription(body);
            dispatch(setProductInfo({
                from: new Date().toISOString(),
                period: item.period_usage ?? 30,
                description: description.success_message,
                id: 0,
                price: 0,
                recurring: false
            }));

            if (data.redirectUrl) {
                await storeData("@clientSecret", data.client_secret ?? "");
                navigation.navigate("Home", {
                    screen: "W3DSecure",
                    params: {
                        uri: data.redirectUrl
                    }
                });
            } else {
                const date = (getDate(item.next_billing_date) ?? getDate(item.created_at)) ?? new Date();
                if (item.next_billing_date) {
                    date.setDate(date.getDate() - (item.product_period ?? 30));
                }
                navigation.navigate("ProductSuccess");
            }
        } catch (err) {
            console.log(err);
            navigation.navigate("ProductError");
        } finally {
            setLoading(false);
        }
    };

    const renderSubscriptionPassDate = (date?: Date | string | null) => {
        if (date) {
            let realDate: Date;
            if (typeof date === "string") {
                realDate = new Date(date);
            } else {
                realDate = date;
            }
            const formattedDate = new Intl.DateTimeFormat("fr-FR", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
            }).format(realDate);
            return `${formattedDate}`;
        } else {
            return null;
        }
    };

    return (
        <View style={[styles.container, {
            borderColor: COLORS.lightBlue
        }]}>
            <View style={{flexDirection: "row"}}>
                <CartLogo active={!item.next_billing_date}/>
                <View
                    style={{
                        flex: 1,
                        marginLeft: SIZES.radius,
                        flexDirection: "row"
                    }}
                >
                    <View>
                        <Text style={{color: COLORS.darkBlue, ...FONTS.h3}}>
                            {description.name}
                        </Text>
                        <Text style={{
                            color: item.recurring ?
                                item.status === SUBSCRIPTION_STATUS.CANCELED ?
                                    COLORS.red : COLORS.yellow : COLORS.yellow,
                            ...FONTS.body5
                        }}
                        >
                            {
                                item.recurring ?
                                    item.status === SUBSCRIPTION_STATUS.CANCELED ? t("subscription_screen.will_be_cancel") :
                                        (item.status === SUBSCRIPTION_STATUS.ACTIVE ? t("subscription_screen.renewed_on") : t("subscription_screen.unpaid"))
                                    : null
                            }
                            {!item.recurring ? t("subscription_screen.valid_until") : null}
                            &nbsp;{item.status === SUBSCRIPTION_STATUS.UNPAID ? null : renderSubscriptionPassDate(item.expiration_date)}
                        </Text>
                        <Text style={{color: COLORS.gray, ...FONTS.body5}}>
                            {description.title}
                        </Text>
                    </View>
                    <View style={{position: "absolute", top: -(SIZES.radius + 20), right: -SIZES.radius}}>
                        <Text
                            style={[
                                styles.price,
                                {
                                    backgroundColor: item.recurring && item.status === SUBSCRIPTION_STATUS.UNPAID ? COLORS.yellow : COLORS.green
                                }]}>
                            {item.status === SUBSCRIPTION_STATUS.UNPAID ?
                                t("subscription_screen.unpaid") :
                                t("subscription_screen.paid")
                            }
                        </Text>
                    </View>
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    marginTop: SIZES.padding
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                        width: "100%"
                    }}
                >
                    <View style={[styles.IconLabel,{backgroundColor: COLORS.yellow}]}>
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit={true}
                            style={{
                                color: COLORS.white,
                                ...FONTS.body5,
                            }}
                        >
                            {description.frequency}
                        </Text>
                    </View>
                    <IconLabel
                        containerStyle={{
                            marginLeft: SIZES.base,
                            paddingHorizontal: 0,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        icon={Clock}
                        iconStyle={{
                            tintColor: COLORS.darkBlue
                        }}
                        labelStyle={{
                            ...FONTS.body4
                        }}
                        label={tripRestsString}
                    />
                </View>
            </View>
            <DetailsDropdown productId={item.product_id}>
                {
                    (description.describe ?? []).map((el: string, index: number) => {
                        return <Text
                            key={index}
                            style={{
                                color: COLORS.darkGrey, ...FONTS.body5,
                                paddingVertical: 1
                            }}>
                            &#x2022; {el}
                        </Text>;
                    })
                }
            </DetailsDropdown>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: SIZES.padding
                }}
            >
                {item.product_recurring && item.status === SUBSCRIPTION_STATUS.UNPAID ? (
                    <TextButton
                        disabled={loading}
                        inProgress={loading}
                        buttonContainerStyle={{
                            ...styles.textButtonContainer,
                            backgroundColor: COLORS.yellow
                        }}
                        label={t("subscription_screen.retry") ?? "Retry"}
                        actionLabel={"PRODUCT_RETRY_PAYMENT"}
                        labelStyle={{...FONTS.body4}}
                        onPress={() => handleUnPaidSubscription()}
                    />
                ) : null}

                {item.product_recurring && item.status === STATUS.ACTIVE ? (
                    <TextButton
                        disabled={loading}
                        inProgress={loading}
                        buttonContainerStyle={{
                            ...styles.textButtonContainer,
                            backgroundColor: COLORS.lightRed
                        }}
                        label={t("subscription_screen.cancel") ?? "Cancel"}
                        actionLabel={"PRODUCT_CANCEL"}
                        labelStyle={{...FONTS.body4}}
                        onPress={() => handleCancelSubscription()}
                    />
                ) : null}
                {item.product_recurring && item.status === SUBSCRIPTION_STATUS.CANCELED ? (
                    <TextButton
                        disabled={loading}
                        inProgress={loading}
                        buttonContainerStyle={{
                            ...styles.textButtonContainer,
                            backgroundColor: COLORS.lightBlue
                        }}
                        label={t("subscription_screen.resume_subscription") ?? "Resume subscription"}
                        actionLabel={"PRODUCT_RESUME_SUBSCRIPTION"}
                        labelStyle={{...FONTS.body4}}
                        onPress={() => handleReactivateSubscription()}
                    />
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        border: SIZES.radius,
        marginBottom: SIZES.xl,
        padding: SIZES.radius,
        borderRadius: SIZES.radius,
        borderWidth: 2,
        backgroundColor: COLORS.transparentPrimary9,
        position: "relative"
    },
    IconLabel: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: SIZES.base,
        paddingHorizontal: SIZES.sml,
        borderRadius: SIZES.radius
    },
    price: {
        backgroundColor: COLORS.lightBlue,
        width: 80,
        ...FONTS.body3,
        color: COLORS.white,
        padding: 5,
        borderRadius: Platform.OS === "ios" ? 12 : SIZES.base,
        marginRight: 10,
        textAlign: "center"
    },
    textButtonContainer: {
        flex: 1,
        height: 50,
        borderRadius: SIZES.padding,
    }
});

export default UserSubscription;
