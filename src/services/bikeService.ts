import {MAX_PERIMETER} from "@assets/constant";
import {store} from "@redux/store";
import {calcPerimeter} from "@utils/helpers";

import {instanceApi} from "./axiosInterceptor";
import {GET_BIKE_STATUS, GET_BIKES_NEARBY, GET_BIKES_USER} from "./endPoint";
import {BikeClient, DataCacheResult, GetBikesNearbyOutput, GetBikesStatusOutput} from "@bikairproject/shared";

export const getAllBikesNearby = async (location: {
                                         latitude: number,
                                         longitude: number
                                     }): Promise<DataCacheResult<BikeClient>> => {
    const {latitude, longitude} = location;
    const perimeter = calcPerimeter(location);
    if (!latitude && !longitude) {
        return {
            total: 0,
            lastUpdate: null,
            rows: []
        };
    }
    const area = (perimeter ?? 0) > MAX_PERIMETER ? MAX_PERIMETER : perimeter;
    const {data} = await instanceApi.get<GetBikesNearbyOutput>(`${GET_BIKES_NEARBY}?lng=${longitude}&lat=${latitude}&perimeter=${area}`);
    return data;
};
export const getAllBikes = async (lastUpdate?: number | null): Promise<DataCacheResult<BikeClient>> => {
    let query = GET_BIKES_USER;
    if (typeof lastUpdate !== "undefined" && lastUpdate !== null) {
        query += `?lastUpdate=${lastUpdate}`;
    }
    const {data} = await instanceApi.get<GetBikesNearbyOutput>(query);
    return data;
};

export const getBikeStatus = async (bikeName: string): Promise<GetBikesStatusOutput> => {
    try {
        const {data} = await instanceApi.get<GetBikesStatusOutput>(GET_BIKE_STATUS(bikeName));
        return data;
    } catch (error: any) {
        if (error.status || error.response.status === 404) {
            throw error;
        }
        return "";
    }
};

