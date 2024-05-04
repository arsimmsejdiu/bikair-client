import {instanceApi} from "@services/axiosInterceptor";
import {GET_SPOTS_NEAR_BY} from "@services/endPoint";

import {GetSpotsNearbyOutput} from "@bikairproject/shared";

export async function getCitySpots(retry = 0) {
    try {
        const resCitySpots = await instanceApi.get<GetSpotsNearbyOutput>(GET_SPOTS_NEAR_BY);
        return resCitySpots.data.rows;
    } catch (err) {
        if (retry < 3) {
            await getCitySpots(retry + 1);
        } else {
            throw err;
        }
    }
}
