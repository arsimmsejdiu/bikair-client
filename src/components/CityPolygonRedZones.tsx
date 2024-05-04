import {COLORS} from "@assets/index";
import {constructCoordinatesArray} from "@utils/helpers";
import React, {useState} from "react";
import {ViewProps} from "react-native";
import {Polygon} from "react-native-maps";

import {GetCityRedZonesOutputData} from "@bikairproject/shared";

type CoordsType = { latitude: number, longitude: number }

type CoordArrayType = {
    city_name: string | null | undefined,
    coordinates: CoordsType[]
}

interface Props extends ViewProps {
    cityRedZones: GetCityRedZonesOutputData[]
}

const CityPolygonRedZones: React.FC<Props> = ({cityRedZones}): React.ReactElement | null => {
    const [array, setArray] = useState<CoordArrayType[] | null>(null);

    const getArray = () => {
        if (array === null) {
            const result = constructCoordinatesArray(cityRedZones);
            setArray(result);
            return result;
        } else {
            return array;
        }
    };

    if (cityRedZones.length === 0) {
        return null;
    }

    return (
        <>
            {
                getArray().map((item, i) => {
                    return <Polygon
                        key={i}
                        coordinates={item.coordinates}
                        strokeColor={COLORS.red}
                        strokeWidth={2}
                        fillColor="rgba(255, 0, 0, 0.4)"
                    />;
                })
            }
        </>
    );
};

export default CityPolygonRedZones;


