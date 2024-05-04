import {COLORS} from "@assets/index";
import React from "react";
import {ViewProps} from "react-native";
import {Marker} from "react-native-maps";
import Svg, {Path} from "react-native-svg";

import {Point} from "@bikairproject/shared";

interface Props extends ViewProps {
    id?: string,
    point: Point,
    handleMarkerClick: (id: string | number | undefined) => void
}

const SpotMarker: React.FC<Props> = React.memo<Props>(({id, point, handleMarkerClick}): React.ReactElement | null => {

    if (typeof point?.coordinates === "undefined") {
        return null;
    }

    return (
        <Marker
            onPress={() => handleMarkerClick(id)}
            coordinate={{
                longitude: point.coordinates[0],
                latitude: point.coordinates[1],
            }}
            tracksViewChanges={false}
        >
            <Svg width={25} height={25} viewBox="0 0 16 16">
                <Path
                    fill={COLORS.white}
                    d="M 3 3 L 13 3 L 13 13 L 3 13 L 3 3"
                />
                <Path
                    fill={COLORS.lightBlue}
                    d="M8.27 8.074c.893 0 1.419-.545 1.419-1.488s-.526-1.482-1.42-1.482H6.778v2.97H8.27Z"
                />
                <Path
                    fill={COLORS.lightBlue}
                    d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.5 4.002h2.962C10.045 4.002 11 5.104 11 6.586c0 1.494-.967 2.578-2.55 2.578H6.784V12H5.5V4.002Z"
                />
            </Svg>
        </Marker>
    );
});

export default SpotMarker;
