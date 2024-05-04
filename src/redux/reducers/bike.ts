import {Bike} from "@models/data/MarkerData";
import { TRIP_STEPS } from "@models/enums/TripSteps";
import {AppThunk} from "@redux/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getAllBikes, getAllBikesNearby} from "@services/bikeService";
import {getMarkerNearby} from "@utils/helpers";

import {
    BikeClient,
    BikeStatusType,
    BikeTagType,
    GetBikesNearbyOutput,
    GetBikesStatusOutput
} from "@bikairproject/shared";


interface initialStateState {
    lat: number | null,
    lng: number | null,
    perimeter: number | null,
    status: GetBikesStatusOutput
    tags: string;
    isFetching: boolean,
    total: number,
    error: any,
    name: string,
    bikes: Bike[],
    bikesCache: { [key: string]: Bike },
    bikesNearBy: Bike[],
    lastUpdate: number | null,
    lastUpdatedAt: number | null
}

const initialState: initialStateState = {
    lat: null,
    lng: null,
    perimeter: null,
    isFetching: false,
    total: 0,
    error: null,
    status: "",
    tags: "",
    name: "",
    bikes: [],
    bikesCache: {},
    bikesNearBy: [],
    lastUpdate: null,
    lastUpdatedAt: null
};

const bikeSlice = createSlice({
    name: "bike",
    initialState: initialState,
    reducers: {
        fetching(state, action) {
            state.isFetching = action.payload;
        },
        failed(state, action) {
            state.error = action.payload;
        },
        setPerimeter(state, action) {
            state.perimeter = action.payload;
        },
        setLatLng(state, action) {
            state.lat = action.payload.lat;
            state.lng = action.payload.lng;
        },
        setBikes(state, action: PayloadAction<GetBikesNearbyOutput>) {
            state.bikes = action.payload.rows.map(b => {
                return {
                    ...b,
                    nodeId: `${b.uuid}-${Date.now()}`,
                    cluster: false,
                    status: b.status as BikeStatusType,
                    tags: b.tags as BikeTagType[],
                    marker_type: "BIKE"
                } as Bike;
            });
            state.total = action.payload.total;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
        setTags(state, action) {
            state.tags = action.payload;
        },
        setName(state, action) {
            state.name = action.payload;
        },
        setBikeCache(state, action: PayloadAction<BikeClient[] | undefined>) {
            if (action.payload) {
                const now = Date.now();
                for (let i = 0; i < action.payload.length; i++) {
                    const currentBike = action.payload[i];
                    state.bikesCache[currentBike.uuid] = {
                        ...currentBike,
                        nodeId: `${currentBike.uuid}-${now}`,
                        cluster: false,
                        status: currentBike.status as BikeStatusType,
                        tags: currentBike.tags as BikeTagType[],
                        marker_type: "BIKE"
                    };
                }
            }
            console.log("- bike reducer - Number of bike in cache : ", Object.values(state.bikesCache).length);
        },
        setBikeLastUpdate(state, action: PayloadAction<number | null | undefined>) {
            state.lastUpdate = action.payload ?? null;
            state.lastUpdatedAt = Date.now();
        },
        updateBikeCache(state, action: PayloadAction<Bike | null | undefined>) {
            if (typeof action.payload !== "undefined" && action.payload !== null) {
                const now = Date.now();
                action.payload.nodeId = `${action.payload.uuid}-${now}`;
                state.bikesCache[action.payload.uuid] = {
                    ...state.bikesCache[action.payload.uuid],
                    ...action.payload
                };
            }
        },
        setBikesNearBy(state, action: PayloadAction<Bike[]>) {
            state.bikesNearBy = action.payload;
        }
    },
});

export default bikeSlice.reducer;

// ACTIONS
export const {
    fetching,
    failed,
    setBikes,
    setLatLng,
    setPerimeter,
    setStatus,
    setName,
    setBikeCache,
    setBikeLastUpdate,
    updateBikeCache,
    setBikesNearBy,
    setTags
} = bikeSlice.actions;


export const getBikesNearby = (location: { latitude: number, longitude: number }): AppThunk => async (dispatch) => {
    dispatch(fetching(true));
    try {
        const data = await getAllBikesNearby(location);
        console.log("- getBikes - fetches new bikes : ", data.rows.length);
        dispatch(setBikes(data));
    } catch (err) {
        dispatch(failed(JSON.stringify(err)));
    } finally {
        dispatch(fetching(false));
    }
};
export const getBikes = (): AppThunk => async (dispatch, getState) => {
    dispatch(fetching(true));
    try {
        const lastUpdated = getState().bike.lastUpdatedAt;
        const tripState = getState().trip.tripState;
        if(tripState === TRIP_STEPS.TRIP_STEP_ONGOING){
            return;
        }
        if(lastUpdated){
            const currentTimestamp = new Date().getTime();
            const timeDifference = currentTimestamp - lastUpdated;
            if( timeDifference < 9 * 1000) return;
        }
        const data = await getAllBikes();
        console.log("- getBikes - fetches new bikes : ", data.rows.length);
        dispatch(setBikeCache(data.rows));
        dispatch(setBikeLastUpdate(data.lastUpdate));
    } catch (err) {
        dispatch(failed(JSON.stringify(err)));
    } finally {
        dispatch(fetching(false));
    }
};

export const updateBikeNearBy = (location: {
    latitude: number,
    longitude: number
}): AppThunk => async (dispatch, getState) => {
    const cacheValues = Object.values(getState().bike.bikesCache);

    console.log("- bike reducer - sorting nearest bikes...");
    const filtered = getMarkerNearby(cacheValues, location, 200, 5);

    console.log("- bike reducer - number of bike in sorted : ", filtered.length);

    dispatch(setBikesNearBy(filtered));
};
