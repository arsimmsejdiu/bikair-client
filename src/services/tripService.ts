import {instanceApi} from "./axiosInterceptor";
import {GET_TRIP_PRICE, GET_TRIP_REDUCTION} from "./endPoint";
import {GetTripPriceOutput, GetTripReductionOutput} from "@bikairproject/shared";

export const getTripPrice = async (timeEnd: number) => {
    try {
        const {data} = await instanceApi.get<GetTripPriceOutput>(GET_TRIP_PRICE(timeEnd));
        console.log("Price Info --> ", data);
        return data;
    } catch (err) {
        console.log(err);
    }
};

export const getTripReduction = async () => {
    const {data} = await instanceApi.get<GetTripReductionOutput>(GET_TRIP_REDUCTION);
    return data;
};
