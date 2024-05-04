import {BASE, COLORS} from "@assets/index";
import {TripDiscountStyles} from "@styles/TripStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {Text, View, ViewProps} from "react-native";

import {TripReductionDiscount} from "@bikairproject/shared";

interface TripDiscountProps extends ViewProps {
    reduction: TripReductionDiscount
}

const TripDiscount: React.FC<TripDiscountProps> = (
    {
        reduction
    }): React.ReactElement | null => {
    const {t} = useTranslation();

    const {value, type, code} = reduction;
    return <View style={[TripDiscountStyles.container, {justifyContent: "center", borderRadius: BASE.radius.main}]}>
        <Text style={TripDiscountStyles.textPrice}>{t("end_trip.discount")}{" "}({code}) :
            <Text style={{color: COLORS.yellow}}>
                {" "}{value} {type === "PERCENT" ? "%" : t("end_trip.minutes")}
            </Text>
        </Text>
    </View>;
};

export default TripDiscount;



