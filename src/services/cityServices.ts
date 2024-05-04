import {instanceApi} from "@services/axiosInterceptor";
import {GET_CITIES, GET_CITY_POLYGONS, GET_CITY_RED_ZONES} from "@services/endPoint";

import {GetCitiesOutput, GetCityPolygonsOutput, GetCityRedZonesOutput} from "@bikairproject/shared";
import {GetCitiesOutputData} from "@bikairproject/shared/dist/interfaces/cities/get-cities/GetCitiesOutput";
import {
    GetCityPolygonsOutputData
} from "@bikairproject/shared/dist/interfaces/cities/get-city-polygons/GetCityPolygonsOutput";
import {
    GetCityRedZonesOutputData
} from "@bikairproject/shared/dist/interfaces/cities/get-city-red-zones/GetCityRedZonesOutput";

export const getCitiesArray = async (): Promise<GetCitiesOutputData[]> => {
    // const query = "?column=status&operator=%3D&value=ACTIVE";
    const promiseCities = await instanceApi.get<GetCitiesOutput>(GET_CITIES);
    return promiseCities.data.rows;
};

export const getCityPolygonsArray = async (): Promise<GetCityPolygonsOutputData[]> => {
    // const query = "?column=status&operator=%3D&value=ACTIVE";
    const promiseCityPolygons = await instanceApi.get<GetCityPolygonsOutput>(GET_CITY_POLYGONS);
    return promiseCityPolygons.data.rows ?? promiseCityPolygons.data;
};

export const getCityRedZonesArray = async (): Promise<GetCityRedZonesOutputData[]> => {
    // const query = "?column=status&operator=%3D&value=ACTIVE";
    const promiseCityRedZone = await instanceApi.get<GetCityRedZonesOutput>(GET_CITY_RED_ZONES);
    return promiseCityRedZone.data.rows ?? promiseCityRedZone.data;
};
