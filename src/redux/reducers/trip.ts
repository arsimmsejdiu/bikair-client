import {TRIP_STEPS} from "@models/enums/TripSteps";
import {ProcessType} from "@models/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_FIRST_TRIP, GET_TRIP_LIST} from "@services/endPoint";

import {AppThunk} from "../store";
import {setSnackbar} from "./snackbar";
import {GetUserTripsOutput, TripReduction} from "@bikairproject/shared";
import {GetUserTripsOutputData} from "@bikairproject/shared/dist/interfaces/users/get-user-trips/GetUserTripsOutput";

// Define a type for the slice state
interface tripInitialStateType {
    lastUpdated: number | null,
    hideTutorial: boolean,
    processType: ProcessType,
    bike_name: string | null,
    lat: number | null,
    lng: number | null,
    returnUrl: string | null,
    isFetching: boolean,
    bluetooth: string,
    redirectUrl: string | null,
    error: any,
    currentTrip: number | null,
    tripOnHold: boolean | null,
    timeEnd: number | null,
    trips: GetUserTripsOutputData[],
    trip: GetUserTripsOutputData | null,
    pendingStartRequest: boolean,
    tripState: TRIP_STEPS | null,
    timeStart: number | null,
    endPhotoName: string | null,
    savingPhoto: boolean,
    tripReduction: TripReduction | null,
}

const tripInitialState: tripInitialStateType = {
    lastUpdated: null,
    hideTutorial: false,
    processType: "TRIP_UNLOCK",
    bike_name: null,
    lat: null,
    lng: null,
    returnUrl: null,
    isFetching: false,
    bluetooth: "PoweredOff",
    redirectUrl: null,
    error: null,
    currentTrip: null,
    tripOnHold: null,
    timeEnd: null,
    trips: [],
    trip: null,
    pendingStartRequest: false,
    tripState: null,
    timeStart: null,
    endPhotoName: null,
    savingPhoto: false,
    tripReduction: null,
};

const tripSlice = createSlice({
    name: "trip",
    initialState: tripInitialState,
    reducers: {
        fetching(state, action) {
            console.log("Trip state - set trip fetching : ", action.payload);
            state.isFetching = action.payload;
            state.error = null;
            // state.returnUrl = null
        },
        setHideTutorial(state, action) {
            state.hideTutorial = action.payload;
        },
        failed(state, action) {
            state.error = action.payload;
        },
        setProcessType(state, action: PayloadAction<ProcessType>) {
            state.processType = action.payload;
        },
        setUserPosition(state, action) {
            state.lat = action.payload.lat;
            state.lng = action.payload.lng;
        },
        setCurrentTrip(state, action) {
            state.currentTrip = action.payload;
        },
        setTimeStart(state, action) {
            state.timeStart = action.payload;
        },
        setTrips(state, action) {
            state.trips = action.payload;
        },
        setRedirectUrl(state, action) {
            state.redirectUrl = action.payload;
        },
        setBikeName(state, action) {
            console.log(`store set bikeName = ${action.payload}`);
            state.bike_name = action.payload;
        },
        setTimeEnd(state, action) {
            state.timeEnd = action.payload;
        },
        resetTrip(state) {
            state.currentTrip = null;
            console.log("store set bikeName = null");
            state.bike_name = null;
            state.lat = null;
            state.lng = null;
            state.tripReduction = null;
        },
        setPendingStartRequest(state, action) {
            state.pendingStartRequest = action.payload;
        },
        setTripState(state, action) {
            state.tripState = action.payload;
        },
        setTripReduction(state, action: PayloadAction<TripReduction | null>) {
            state.tripReduction = action.payload;
        },
        setFirstTrip(state, action) {
            state.trip = action.payload;
        }
    },
});

export default tripSlice.reducer;

// ACTIONS
export const {
    fetching,
    setTimeStart,
    failed,
    setTrips,
    setRedirectUrl,
    setBikeName,
    resetTrip,
    setUserPosition,
    setProcessType,
    setTimeEnd,
    setHideTutorial,
    setTripState,
    setTripReduction,
    setFirstTrip
} = tripSlice.actions;


// Get list trips
export const getTrips = (): AppThunk => async dispatch => {
    dispatch(fetching(true));
    try {
        const response = await instanceApi.get<GetUserTripsOutput>(GET_TRIP_LIST);
        dispatch(setTrips(response.data));
    } catch (err: any) {
        dispatch(setSnackbar({message: err.message, type: "danger"}));
    } finally {
        dispatch(fetching(false));
    }
};

export const getFirstTrip = (): AppThunk => async (dispatch) => {
    try {
        const response = await instanceApi.get<GetUserTripsOutputData>(GET_FIRST_TRIP);
        dispatch(setFirstTrip(response.data));
    } catch (err) {
        dispatch(setSnackbar({message: String(err), type: "danger"}));
    }
};
