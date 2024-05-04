import {BikeMarker} from "@components/BikeMarker";
import {useAppDispatch} from "@hooks/index";
import {Bike} from "@models/data/MarkerData";
import {useFocusEffect} from "@react-navigation/native";
import {openBooking} from "@redux/reducers/markerDetails";
import React, {useCallback, useState} from "react";
import {Dimensions, ViewProps} from "react-native";
import {Clusterer} from "react-native-clusterer";
import SuperCluster from "react-native-clusterer/lib/typescript/types";
import type Supercluster from "react-native-clusterer/src/types";
import {Region} from "react-native-maps";

import {BikeClient} from "@bikairproject/shared";

const MAP_WIDTH = Dimensions.get("window").width;
const MAP_HEIGHT = Dimensions.get("window").height;
const MAP_DIMENSIONS = {width: MAP_WIDTH, height: MAP_HEIGHT};


interface Props extends ViewProps {
    bikes: Bike[],
    show: boolean,
    region: Region,
    handleClusterClick: (element: SuperCluster.ClusterFeatureClusterer<SuperCluster.AnyProps>) => void
}

export const SpotCluster: React.FC<Props> = (
    {
        bikes,
        show,
        region,
        handleClusterClick
    }
): React.ReactElement => {
    const dispatch = useAppDispatch();
    const [bikesValue, setBikesValue] = useState<Supercluster.PointFeature<BikeClient>[]>([]);

    const handleMarkerClick = (id: string | number | undefined) => {
        const idNumber = Number(id);
        const selected = bikes.filter(b => b.id === idNumber)[0];
        dispatch(openBooking(selected));
    };

    useFocusEffect(
        useCallback(() => {
            const newBikeValues: Supercluster.PointFeature<Bike>[] = [];
            if (bikes.length > 0 && show) {
                for (const bike of bikes) {
                    if (bike && bike.coordinates) {
                        const geometry: Supercluster.PointFeature<Bike> = {
                            type: "Feature",
                            id: bike.id,
                            geometry: bike.coordinates,
                            properties: bike,
                        };
                        newBikeValues.push(geometry);
                    }
                }
            }
            console.log("- BikeCluster - Number of geometry bike : ", newBikeValues.length);
            setBikesValue([...newBikeValues]);
        }, [bikes, show])
    );

    return (
        <Clusterer
            data={bikesValue}
            region={region}
            options={{
                radius: 10,
                minPoints: 1000
            }}
            mapDimensions={MAP_DIMENSIONS}
            renderItem={(point) => {
                if (!point.properties?.cluster) {
                    const leaf = point as SuperCluster.PointFeature<BikeClient>;
                    return (
                        <BikeMarker
                            key={`point-${leaf.properties.id}-${leaf.properties.status}`}
                            id={String(leaf.properties.id)}
                            point={point.geometry}
                            status={leaf.properties.status}
                            handleMarkerClick={handleMarkerClick}
                        />
                    );
                } else {
                    const cluster = point as SuperCluster.ClusterFeatureClusterer<BikeClient>;
                    return (
                        <BikeMarker
                            key={`cluster-${cluster.id}-AVAILABLE`}
                            id={`cluster-${cluster.id}`}
                            point={point.geometry}
                            status={"AVAILABLE"}
                            handleMarkerClick={() => handleClusterClick(cluster)}
                        />
                    );
                }
            }}
        />
    );
};

export default SpotCluster;
