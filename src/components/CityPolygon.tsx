import {COLORS} from "@assets/index";
import {constructCoordinatesArray} from "@utils/helpers";
import React, {useState} from "react";
import {ViewProps} from "react-native";
import {Polygon} from "react-native-maps";

import {GetCityPolygonsOutputData} from "@bikairproject/shared";

type CoordsType = { latitude: number, longitude: number }

type CoordArrayType = {
    city_name: string | null | undefined,
    coordinates: CoordsType[]
}

interface Props extends ViewProps {
    cities: GetCityPolygonsOutputData[]
}

const CityPolygon: React.FC<Props> = ({cities}): React.ReactElement | null => {
    const [array, setArray] = useState<CoordArrayType[] | null>(null);

    const getArray = () => {
        if (array === null) {
            const result = constructCoordinatesArray(cities);
            setArray(result);
            return result;
        } else {
            return array;
        }
    };

    if (cities.length === 0) {
        return null;
    }

    return (
        <>
            {
                getArray().map((item, i) => {
                    return <Polygon
                        key={i}
                        coordinates={item.coordinates}
                        strokeColor={COLORS.darkBlue}
                        strokeWidth={5}
                        lineCap="round"
                        fillColor="rgba(255, 255, 255, 0.01)"
                    />;
                })
            }
        </>
    );
};
export default CityPolygon;
