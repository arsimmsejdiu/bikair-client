import {COLORS, EXPERIMENTATION_MINUTE} from "@assets/index";
import {useAppSelector} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {timeMeterStyles} from "@styles/TabButtonsStyles";
import {estimatePrice} from "@utils/helpers";
import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {Text, View, ViewProps} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import {BIKE_TAGS} from "@bikairproject/shared";

interface Props extends ViewProps {
    pause: boolean
}

const TimeMeter: React.FC<Props> = ({pause = false}): React.ReactElement | null => {
    const {t} = useTranslation();
    const insets = useSafeAreaInsets();

    const timeStart = useAppSelector(state => state.trip.timeStart);
    const tripReduction = useAppSelector(state => state.trip.tripReduction);
    const bikeTag = useAppSelector(state => state.bike.tags);

    const [minutes, setMinutes] = useState<string>("");
    const [seconds, setSeconds] = useState<string>("");
    const [hours, setHours] = useState<string>("");
    const [price, setPrice] = useState(0);

    const calculateTimeLeft = () => {
        if (!timeStart) {
            return null;
        }

        const countFrom = timeStart;
        const now = Date.now();
        const timeDifference = (now - countFrom);

        const secondsInADay = 60 * 60 * 1000 * 24,
            secondsInAHour = 60 * 60 * 1000;

        const hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour));
        const min = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000));
        const secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000);

        setHours(("0" + hours).slice(-2));
        setMinutes(("0" + min).slice(-2));
        setSeconds(("0" + secs).slice(-2));
    };

    useFocusEffect(
        useCallback(() => {
            const interval = setInterval(() => {
                if (timeStart) {
                    calculateTimeLeft();
                }
            }, 1000);
            return () => clearInterval(interval);
        }, [timeStart]),
    );

    useFocusEffect(
        useCallback(() => {
            //check if we have a tag named EXPERIMENTATION
            const hasExperimentationTag = bikeTag?.includes(BIKE_TAGS.EXPERIMENTATION) ?? false;

            if (hasExperimentationTag) {
                //
                const computedPrice = estimatePrice(timeStart ?? Date.now(), tripReduction, true);

                // Check if the time is less than or equal to 60 minutes
                if (computedPrice.minutes <= EXPERIMENTATION_MINUTE) {
                    setPrice(0);
                } else {
                    // calculate the price by computedPrice.minute minus 60 times 15 cents
                    setPrice((computedPrice.minutes - EXPERIMENTATION_MINUTE) * 0.15);
                }
            } else {
                // Handle the case where the tag does not include BIKE_TAGS.EXPERIMENTATION
                // For example, set a default price or do nothing
                // etPrice(computedPrice.discounted_amount / 100);
                const computedPrice = estimatePrice(timeStart ?? Date.now(), tripReduction, true);
                setPrice(computedPrice.discounted_amount / 100);
            }
        }, [minutes]),
    );

    return (
        <View style={[timeMeterStyles.container, {
            top: 30 + insets.top,
        }]}>
            <View style={timeMeterStyles.modalContent}>
                <View style={timeMeterStyles.priceWrapper}>
                    <View style={timeMeterStyles.priceBlock}>
                        <Text style={timeMeterStyles.label}>{t("trips.duration") ?? "Durée"}</Text>
                        <Text style={[timeMeterStyles.text, {color: pause ? COLORS.yellow : COLORS.lightBlue}]}>
                            {`${Number(hours) > 0 ? hours + ":" : ""}${minutes}:${seconds}`}
                        </Text>
                    </View>
                    <View style={timeMeterStyles.priceBlock}>
                        <Text style={timeMeterStyles.label}>{"Total"}</Text>
                        <Text style={[timeMeterStyles.text, {color: pause ? COLORS.yellow : COLORS.lightBlue}]}>
                            {`${price.toFixed(2)} €`}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default TimeMeter;
