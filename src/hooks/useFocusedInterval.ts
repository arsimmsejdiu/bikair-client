import {useFocusEffect} from "@react-navigation/native";
import {useCallback, useEffect, useRef} from "react";

export default function useFocusedInterval(callback: () => void, delay: number) {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useFocusEffect(
        useCallback(() => {
            function tick() {
                if (savedCallback.current) {
                    savedCallback.current();
                }
            }

            if (delay !== null) {
                const id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]));
}
