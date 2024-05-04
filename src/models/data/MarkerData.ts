import {Position} from "geojson";

import {BikeClient, BikeStatusType, BikeTagType, GetSpotsNearbyOutputData, Point, Polygon} from "@bikairproject/shared";

export type MarkerData = CommonMarkerData & (SpotMarker | BikeMarker);
export type Spot = CommonMarkerData & SpotMarker;
export type Bike = CommonMarkerData & BikeMarker;

export interface CommonMarkerData {
    id: number;
    uuid: string;
    nodeId: string;
    address: string | null;
    city_id: number;
    name: string;
    coordinates: Point;
    marker_coordinates: Point;
    cluster: false;
    polygon?: Polygon
    distance?: number
}

export interface SpotMarker extends GetSpotsNearbyOutputData {
    marker_type: "SPOT";
}

export interface BikeMarker extends BikeClient {
    marker_type: "BIKE"
}
