import {COLORS} from "@assets/index";
import {TextAtom} from "@components/Atom/TextAtom";
import Loader from "@components/Loader";
import TripDiscount from "@components/TripDiscount";
import TripSubscription from "@components/TripSubscription";
import {useAppSelector} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {getTripPrice} from "@services/tripService";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";
import {tripPriceStyles} from "@styles/TripStyles";
import {formatPriceWithLocale} from "@utils/helpers";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";

import {BIKE_TAGS, ComputedPrice, TRIP_REDUCTIONS} from "@bikairproject/shared";

type Props = ViewProps

/**
 * 1. price no discount
 * 2. price with discount
 * 3. price with subscription
 * 4. price with pass
 * @returns
 */
const TripPrice: React.FC<Props> = (): React.ReactElement | null => {
    const {t} = useTranslation();
    const [computedPrice, setComputedPrice] = useState<ComputedPrice | null>(null);
    const [isDiscounted, setIsDiscounted] = React.useState<boolean>(false);
    const bikeTag = useAppSelector(state => state.bike.tags);

    // Price
    const {timeEnd, tripReduction} = useAppSelector(state => state.trip);
    const locale: string = useAppSelector(state => state.auth.me?.locale || "fr");
    const [loading, setLoading] = React.useState(true);


    const finalPrice = async () => {
        setLoading(true);
        const time_end = timeEnd ? timeEnd : Date.now();
        const price = await getTripPrice(time_end);
        setComputedPrice(price ?? null);
        setIsDiscounted((price?.reduction ?? 0) > 0);
        setLoading(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            finalPrice().then(() => console.log("Final price"));
        }, [])
    );

    const renderPriceDisplay = () => {
        switch (tripReduction?.reductionType) {
            case TRIP_REDUCTIONS.RENTAL:
                return null;
            case TRIP_REDUCTIONS.PRODUCT:
                return <TripSubscription
                    loading={loading}
                    reduction={tripReduction}
                    computedPrice={computedPrice}
                />;
            case TRIP_REDUCTIONS.DISCOUNT:
                return <TripDiscount reduction={tripReduction}/>;
            default:
                return null;
        }
    };

    return (
        <View>
            <View style={tripPriceStyles.textWrapper}>
                {
                    !loading ?
                        <>
                            {renderPriceDisplay()}
                            <TextAtom style={tripPriceStyles.textPrice}>{t("end_trip.total")} :&nbsp;
                                {
                                    (isDiscounted || (bikeTag?.includes(BIKE_TAGS.EXPERIMENTATION ?? false))) &&
                                    <TextAtom style={tripPriceStyles.textPriceLineThrough}>
                                        {formatPriceWithLocale(computedPrice?.price ?? 0, locale)}
                                    </TextAtom>
                                }
                                <TextAtom style={{
                                    color: COLORS.yellow,
                                    // textDecorationLine: duration > 2 ? "none" : "line-through" //TODO: i dont know why do we need this, if someone does please fix it or add explanation
                                }}>
                                    {"  "}{formatPriceWithLocale(computedPrice?.discounted_amount ?? 0, locale)}
                                </TextAtom>
                            </TextAtom>
                        </>
                        : <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>
                }
            </View>
        </View>
    );
};

export default TripPrice;
