import {COLORS} from "@assets/index";
import CityPolygon from "@components/CityPolygon";
import CityPolygonRedZones from "@components/CityPolygonRedZones";
import Loader from "@components/Loader";
import BikeCluster from "@containers/BikeCluster";
import SpotCluster from "@containers/SpotCluster";
import {useAppSelector} from "@hooks/index";
import {Bike, Spot} from "@models/data/MarkerData";
import {UserFunctions} from "@models/enums";
import React, {forwardRef, MutableRefObject, RefAttributes, useState} from "react";
import {Dimensions, StyleSheet, ViewProps} from "react-native";
import SuperCluster from "react-native-clusterer/lib/typescript/types";
import MapView, {PROVIDER_GOOGLE, Region} from "react-native-maps";

import {GetCityPolygonsOutputData, GetCityRedZonesOutputData} from "@bikairproject/shared";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";

const MAP_WIDTH = Dimensions.get("window").width;

interface Props extends ViewProps {
    location: Region,
    cityRedZones: GetCityRedZonesOutputData[],
    cityPolygons: GetCityPolygonsOutputData[],
    bikes: Bike[],
    citySpots: Spot[],
    initFetching: boolean
    userFunctions: any
    onUpdateRegion?: (region: Region) => void
}

export const Map: React.FC<Props & RefAttributes<MapView>> = forwardRef((
    {
        location,
        cityRedZones,
        cityPolygons,
        bikes,
        citySpots,
        initFetching,
        userFunctions,
        onUpdateRegion,
    }, ref): React.ReactElement | null => {

    const [zoom, setZoom] = useState(0);

    const functionList = userFunctions?.functionalities ?? [];
    const showSpotParking = functionList.includes(UserFunctions.SPOT_PARKING);
    const tripState = useAppSelector(state => state.trip.tripState);
    const showBikes = tripState === null && typeof bikes !== "undefined" && true && bikes.length !== 0;

    const handleRegionChange = async (region: Region) => {
        if (typeof onUpdateRegion !== "undefined") {
            onUpdateRegion(region);
        }
        const nextZoom = Math.log2(360 * ((MAP_WIDTH / 256) / region.longitudeDelta)) + 1;
        setZoom(nextZoom);
        console.log("Zoom = ", nextZoom);
    };

    const getMapRef = () => {
        if (!ref) {
            return null;
        } else {
            return ref as MutableRefObject<MapView>;
        }
    };

    const handleClusterClick = (element: SuperCluster.ClusterFeatureClusterer<SuperCluster.AnyProps>) => {
        const newRegion = element.properties.getClusterExpansionRegion();
        newRegion.longitudeDelta = newRegion.longitudeDelta + (newRegion.longitudeDelta / 2);
        newRegion.latitudeDelta = newRegion.latitudeDelta + (newRegion.latitudeDelta / 2);
        const mapRef = getMapRef();
        if (mapRef) {
            mapRef.current.animateToRegion(newRegion);
        }
    };

    if (initFetching) {
        return <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>;
    }

    return (
        <MapView
            ref={ref}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            loadingEnabled={true}
            loadingIndicatorColor={"#666666"}
            loadingBackgroundColor={COLORS.darkBlue}
            initialRegion={location}
            followsUserLocation={false}
            onRegionChangeComplete={handleRegionChange}
            showsUserLocation={true}
            zoomControlEnabled={false}
            zoomEnabled={true}
            zoomTapEnabled={true}
            showsMyLocationButton={false}
            toolbarEnabled={false}
        >
            <CityPolygon cities={cityPolygons}/>
            {/* {functionList.includes(UserFunctions.RED_ZONE) && */}
            <CityPolygonRedZones cityRedZones={cityRedZones}/>
            {/* } */}
            <SpotCluster
                spots={citySpots}
                show={showSpotParking}
                region={location}
                zoom={zoom}
                handleClusterClick={handleClusterClick}
            />
            <BikeCluster bikes={bikes} show={showBikes} region={location} handleClusterClick={handleClusterClick}/>
        </MapView>
    );
});

export default Map;

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    },
});
