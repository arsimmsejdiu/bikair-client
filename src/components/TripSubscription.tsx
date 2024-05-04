import {COLORS, FONTS} from "@assets/index";
import React from "react";
import {useTranslation} from "react-i18next";
import {StyleSheet, Text, View, ViewProps} from "react-native";

import {ComputedPrice, DISCOUNT_CODE, TripReductionProduct} from "@bikairproject/shared";

interface Props extends ViewProps {
    reduction: TripReductionProduct;
    computedPrice: ComputedPrice | null;
    loading: boolean;
}

const TripSubscription: React.FC<Props> = (
    {
        reduction,
        computedPrice,
        loading
    }): React.ReactElement => {
    const {t} = useTranslation();

    console.log("reduction = ", reduction);
    console.log("computedPrice = ", computedPrice);

    function loadingSkeleton() {
        return (
            <View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                    <Text style={styles.textPriceSkeleton}></Text>
                    <Text style={styles.textDurationSkeleton}></Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                    <Text style={styles.textPriceSkeleton1}></Text>
                    <Text style={styles.textDurationSkeleton}></Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                    <Text style={styles.textTotalUsedSkeleton}></Text>
                </View>
            </View>
        );
    }

    function loadData() {
        return (
            <View>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                    <Text style={styles.textPrice}>
                        {t("trip_subscription.trip_duration")}:
                    </Text>
                    <Text style={styles.textDuration}>
                        {computedPrice?.minutes} {t("wording.minute")}{(computedPrice?.minutes ?? 0) > 1 ? "s" : ""}
                    </Text>
                </View>
                {computedPrice?.code ? (
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                        <Text style={styles.textPrice1}>
                            {t("trip_subscription.trip_discount")}:
                        </Text>
                        <Text style={styles.priceCross}>
                            {t(`discounts.${computedPrice?.code}`)}
                        </Text>
                    </View>
                ) : null}
                {computedPrice?.remaining ? (
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center",}}>
                        <Text style={styles.textTotalUsed}>
                            {t("trip_subscription.trip_remaining")}:
                        </Text>
                        <Text style={styles.textDuration}>
                            {computedPrice?.remaining} {reduction.discount_type === DISCOUNT_CODE.PACK ? t("wording.minutes") : t("wording.trips")}
                        </Text>
                    </View>
                ) : null}
                <View style={{width: "100%", height: 2, backgroundColor: COLORS.inputGrey, marginTop: 10}}/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {
                loading || !computedPrice ? loadingSkeleton() : loadData()
            }
        </View>
    );
};

export default TripSubscription;

const styles = StyleSheet.create({
    container: {
        width: "90%",
        backgroundColor: "white",
        padding: 10,

    },
    priceCross: {
        color: COLORS.lightBlue,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    textPrice: {
        color: COLORS.black,
        fontWeight: "bold",
        ...FONTS.h4
    },
    textPrice1: {
        color: COLORS.lightBlue,
        fontWeight: "bold",
        ...FONTS.h4
    },
    textDuration: {
        color: COLORS.darkGrey,
    },
    textTotalUsed: {
        color: COLORS.darkGrey,
    },
    textTotalUsedSkeleton: {
        width: 170,
        marginBottom: 10,
        height: 15,
        backgroundColor: COLORS.lightGray1,
        borderRadius: 50
    },
    textPriceSkeleton: {
        width: 210,
        marginBottom: 10,
        height: 15,
        backgroundColor: COLORS.lightGray1,
        borderRadius: 50
    },
    textPriceSkeleton1: {
        width: 200,
        marginBottom: 10,
        height: 15,
        backgroundColor: COLORS.lightGray1,
        borderRadius: 50
    },
    textDurationSkeleton: {
        width: 50,
        height: 15,
        marginBottom: 10,
        backgroundColor: COLORS.lightGray1,
        borderRadius: 50
    }
});

