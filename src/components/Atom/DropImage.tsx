import {COLORS} from "@assets/constant";
import React from "react";
import Svg, {Path} from "react-native-svg";

export const getDropImage = (backgroundColor: string, bikeColor: string | null = null) => {
    bikeColor = bikeColor ?? COLORS.white;
    return (
        <Svg width="35" height="46" viewBox="0 0 35 46">
            <Path
                fill={backgroundColor}
                stroke={COLORS.black}
                stroke-width="1"
                d="M 18 46 Q 16 41 4 28 A 17 17 0 1 1 31 28 Q 20 41 18 46 Z"
            />
            <Path
                fill="transparent"
                stroke={bikeColor}
                stroke-width="1"
                d="M 10.8 24 A 1.7 1.7 90 0 1 10.8 15.3 M 10.8 24 A 1.7 1.7 90 0 0 10.8 15.3 M 24.3 24 A 1.7 1.7 90 0 1 24.3 15.3 M 24.3 24 A 1.7 1.7 90 0 0 24.3 15.3 M 9.3 19.7 Q 12.3 21.1 12.4 15.2 Q 12.3 12.6 13.8 12.9 T 16.4 17.1 T 18.1 18.1 T 19.4 12.6 T 22.6 16.1 L 24.3 20 M 19.6 10 L 22.6 10 Z"
            />
        </Svg>
    );
};
