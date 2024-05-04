import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {instanceApi} from "@services/axiosInterceptor";
import {CANCEL_BOOKING, GET_BOOKING, POST_BOOKING} from "@services/endPoint";

import {AppThunk} from "../store";
import {getBikes} from "./bike";
import {
    BikeClient,
    DeleteCancelBookingOutput,
    GetCurrentBookingOutput,
    GetSpotsNearbyOutputData,
    PostCreateBookingOutput
} from "@bikairproject/shared";


interface initialStateState {
    isFetching: boolean,
    error: any,
    open: boolean,
    bike: BikeClient | null,
    spot: GetSpotsNearbyOutputData | null
    current: PostCreateBookingOutput | null
}

const initialState: initialStateState = {
    isFetching: false,
    error: null,
    open: false,
    bike: null,
    spot: null,
    current: null
};

const markerDetailsSlice = createSlice({
    name: "markerDetails",
    initialState: initialState,
    reducers: {
        fetching(state, action) {
            state.isFetching = action.payload;
            state.error = null;
        },
        openBooking(state, action: PayloadAction<BikeClient | null>) {
            if (action.payload) {
                state.open = true;
                state.spot = null;
                state.bike = action.payload;
            }
        },
        openSpotDetail(state, action: PayloadAction<GetSpotsNearbyOutputData | null>) {
            if (action.payload) {
                state.open = true;
                state.bike = null;
                state.spot = action.payload;
            }
        },
        closeBooking(state) {
            state.open = false;
            state.bike = null;
            state.spot = null;
        },
        failed(state, action: PayloadAction<any>) {
            state.error = action.payload;
        },
        setBooking(state, action) {
            state.current = action.payload;
            state.isFetching = false;
            state.error = null;
        },
        setBike(state, action: PayloadAction<BikeClient>) {
            if (state.bike !== null) {
                state.bike = {
                    ...state.bike,
                    ...action.payload
                };
            }
        }
    }
});

export default markerDetailsSlice.reducer;

// ACTIONS
export const {
    fetching,
    openBooking,
    openSpotDetail,
    closeBooking,
    failed,
    setBooking,
    setBike
} = markerDetailsSlice.actions;

// Create a new booking
export const createBooking = (bikeName: string): AppThunk => async dispatch => {
    dispatch(fetching(true));
    try {
        const response = await instanceApi.post<PostCreateBookingOutput>(POST_BOOKING, {
            bike_name: bikeName
        });

        dispatch(setBooking(response.data));
        dispatch(getBikes());
    } catch (err) {
        dispatch(failed(err));
    }
};

// Get booking infos
export const getBooking = (): AppThunk => async dispatch => {
    dispatch(fetching(true));
    try {
        const response = await instanceApi.get<GetCurrentBookingOutput>(GET_BOOKING);
        if (response.data) {
            dispatch(setBooking(response.data));
        }

    } catch (err) {
        dispatch(failed(err));
    } finally {
        dispatch(fetching(false));
    }
};

// Cancel an existing booking
export const cancelBooking = (): AppThunk => async dispatch => {
    dispatch(fetching(true));
    try {
        await instanceApi.delete<DeleteCancelBookingOutput>(CANCEL_BOOKING);
        dispatch(setBooking(null));
        dispatch(getBikes());
    } catch (err) {
        dispatch(failed(err));
    }
};

