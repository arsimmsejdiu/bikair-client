import {Spot} from "@models/data/MarkerData";
import { PROCESS } from "@models/enums/process";
import {AppThunk} from "@redux/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getCitySpots} from "@services/spotService";
import {getMarkerNearby} from "@utils/helpers";

import { setProcess } from "./process";
import {GetSpotsNearbyOutputData} from "@bikairproject/shared";


interface initialStateState {
    isFetching: boolean,
    error: any,
    lastUpdated: number | null,
    spotsCache: { [key: string]: Spot },
    spotsNearBy: Spot[]
}

const initialState: initialStateState = {
    isFetching: false,
    error: null,
    lastUpdated: null,
    spotsCache: {},
    spotsNearBy: []
};

const spotSlice = createSlice({
    name: "spot",
    initialState: initialState,
    reducers: {
        fetching(state, action) {
            state.isFetching = action.payload;
        },
        setLastUpdated(state, action) {
            state.lastUpdated = Date.now();
        },
        failed(state, action) {
            state.error = action.payload;
        },
        setSpotCache(state, action: PayloadAction<GetSpotsNearbyOutputData[] | undefined>) {
            if (action.payload) {
                const now = Date.now();
                for (let i = 0; i < action.payload.length; i++) {
                    const currentSpot = action.payload[i];
                    if (currentSpot.coordinates !== null && currentSpot.polygon !== null && currentSpot.marker_coordinates !== null) {
                        state.spotsCache[currentSpot.uuid] = {
                            ...currentSpot,
                            nodeId: `${currentSpot.uuid}-${now}`,
                            cluster: false,
                            status: currentSpot.status,
                            name: currentSpot.name ?? "Spot",
                            marker_type: "SPOT",
                            coordinates: currentSpot.coordinates,
                            marker_coordinates: currentSpot.marker_coordinates!,
                            polygon: currentSpot.polygon
                        };
                    }
                }
            }
            console.log("- spot reducer - Number of spot in cache : ", Object.values(state.spotsCache).length);
        },
        setSpotsNearBy(state, action: PayloadAction<Spot[]>) {
            state.spotsNearBy = action.payload;
        }
    },
});

export default spotSlice.reducer;

// ACTIONS
export const {
    fetching,
    failed,
    setSpotCache,
    setSpotsNearBy,
    setLastUpdated
} = spotSlice.actions;

export const getSpots = (): AppThunk => async (dispatch, getState) => {
    dispatch(fetching(true));
    try {
        const lastUpdated = getState().spot.lastUpdated;
        if(lastUpdated){
            const currentTimestamp = new Date().getTime();
            const timeDifference = currentTimestamp - lastUpdated;
            if( timeDifference < 30 * 60 * 1000) return;
        }
        const data = await getCitySpots();
        dispatch(setSpotCache(data));
        dispatch(setLastUpdated(null));
    } catch (err) {
        dispatch(failed(JSON.stringify(err)));
    } finally {
        dispatch(fetching(false));
    }
};

export const updateSpotNearBy = (location: {
    latitude: number,
    longitude: number
}): AppThunk => async (dispatch, getState) => {
    const cacheValues = Object.values(getState().spot.spotsCache);

    console.log("- spot reducer - sorting nearest spots...");
    const filtered = getMarkerNearby(cacheValues, location, 100, 5);

    console.log("- spot reducer - number of spot in sorted : ", filtered.length);

    dispatch(setSpotsNearBy(filtered));
};
