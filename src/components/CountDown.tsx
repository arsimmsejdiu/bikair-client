import {TextAtom} from "@components/Atom/TextAtom";
import {useFocusEffect} from "@react-navigation/native";
import {countDownStyles} from "@styles/GeneralStyles";
import React from "react";
import {ViewProps} from "react-native";

import {PostCreateBookingOutput} from "@bikairproject/shared";

interface CountDownProps extends ViewProps {
    booking: PostCreateBookingOutput | null
    cancelBooking?: () => void
}

const CountDown: React.FC<CountDownProps> = (
    {
        booking,
        cancelBooking
    }): React.ReactElement | null => {
    const [timeLeft, setTimeLeft] = React.useState<string | null>(null);
    const [sequence, setSequence] = React.useState(2);

    //
    const calculateTimeLeft = (expiredAt?: string | null) => {

        if (!expiredAt) return null;

        // Stop the interval when booking time is over
        const x = parseInt(expiredAt);
        const n = new Date().getTime();
        if (x <= n) {

            setSequence(11);
            if (sequence === 2) {
                if (typeof cancelBooking !== "undefined") {
                    cancelBooking();
                }
                return null;
            }
            return null;
        }
        let difference = x - n;
        const minutesDifference = Math.floor(difference / 1000 / 60);
        difference -= minutesDifference * 1000 * 60;

        const secondsDifference = Math.floor(difference / 1000);

        return minutesDifference + " minutes : " + secondsDifference + " secondes";
    };

    useFocusEffect(
        React.useCallback(() => {
            const interval = setInterval(() => {
                if (booking)
                    setTimeLeft(calculateTimeLeft(booking.expired_at));
            }, 1000);
            return () => clearInterval(interval);
        }, [booking])
    );

    React.useEffect(() => {
        if (booking)
            setTimeLeft(calculateTimeLeft(booking.expired_at));
    }, []);


    // No booking booking
    if (!booking || booking.status === "RENTAL") return null;

    return <TextAtom style={countDownStyles.textCountdown}> {timeLeft}</TextAtom>;
};

export default CountDown;
