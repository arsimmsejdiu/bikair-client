import SpotMarker from "@components/SpotMarker";
import {useAppDispatch} from "@hooks/index";
import {Spot} from "@models/data/MarkerData";
import {useFocusEffect} from "@react-navigation/native";
import {openSpotDetail} from "@redux/reducers/markerDetails";
import React, {useCallback, useState} from "react";
import {Dimensions, ViewProps} from "react-native";
import {Clusterer} from "react-native-clusterer";
import SuperCluster from "react-native-clusterer/lib/typescript/types";
import type Supercluster from "react-native-clusterer/src/types";
import {Region} from "react-native-maps";

const MAP_WIDTH = Dimensions.get("window").width;
const MAP_HEIGHT = Dimensions.get("window").height;
const MAP_DIMENSIONS = {width: MAP_WIDTH, height: MAP_HEIGHT};


interface Props extends ViewProps {
    spots: Spot[],
    show: boolean,
    region: Region,
    zoom: number,
    handleClusterClick: (element: SuperCluster.ClusterFeatureClusterer<SuperCluster.AnyProps>) => void
}

export const SpotCluster: React.FC<Props> = (
    {
        spots,
        show,
        zoom,
        region,
        handleClusterClick
    }
): React.ReactElement => {
    const dispatch = useAppDispatch();
    const [spotsValue, setSpotsValue] = useState<Supercluster.PointFeature<Spot>[]>([]);

    const handleMarkerClick = (id: string | number | undefined) => {
        const idNumber = Number(id);
        console.log("id = ", idNumber);
        const selected = spots.filter(s => s.id === idNumber)[0];
        console.log("selected = ", selected);
        dispatch(openSpotDetail(selected));
    };

    useFocusEffect(
        useCallback(() => {
            const newSpotValues: Supercluster.PointFeature<Spot>[] = [];
            if (spots.length > 0 && show) {
                for (const spot of Object.values(spots)) {
                    if (spot.coordinates) {
                        const geometry: Supercluster.PointFeature<Spot> = {
                            type: "Feature",
                            id: spot.id,
                            geometry: spot.coordinates,
                            properties: spot,
                        };
                        newSpotValues.push(geometry);
                    }
                }
            }
            setSpotsValue([...newSpotValues]);
        }, [spots, show])
    );

    return (
        <Clusterer
            data={spotsValue}
            region={region}
            options={{
                radius: 10,
                minPoints: 1000
            }}
            mapDimensions={MAP_DIMENSIONS}
            renderItem={(point) => {
                if (!point.properties?.cluster) {
                    const leaf = point as SuperCluster.PointFeature<Spot>;
                    return (
                        <SpotMarker
                            key={`point-${leaf.properties.id}`}
                            id={String(leaf.properties.id)}
                            point={point.geometry}
                            handleMarkerClick={handleMarkerClick}
                        />
                    );
                } else {
                    const cluster = point as SuperCluster.ClusterFeatureClusterer<Spot>;
                    return (
                        <SpotMarker
                            key={`cluster-${cluster.id}`}
                            id={`cluster-${cluster.id}`}
                            point={point.geometry}
                            handleMarkerClick={id => handleClusterClick(cluster)}
                        />
                    );
                }
            }}
        />
    );
};

export default SpotCluster;
