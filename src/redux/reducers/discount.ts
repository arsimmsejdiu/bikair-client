import {createSlice} from "@reduxjs/toolkit";
import {instanceApi} from "@services/axiosInterceptor";
import {GET_DISCOUNT, GET_RENTALS} from "@services/endPoint";
import {postUserDiscounts} from "@services/userService";

import {AppThunk} from "../store";
import {setSnackbar} from "./snackbar";
import {
    CreateUserDiscountInput,
    GetUserDiscountsData,
    GetUserDiscountsOutput,
    GetUserRentalsOutput, Rentals
} from "@bikairproject/shared";

interface initialStateState {
    lastUpdated: number | null,
    isFetching: boolean,
    discounts: (GetUserDiscountsData | Rentals)[],
    error: any,
    isDiscounted: boolean
}

const initialState: initialStateState = {
    lastUpdated: null,
    isFetching: false,
    discounts: [],
    error: null,
    isDiscounted: false
};

const discountSlice = createSlice({
    name: "discount",
    initialState: initialState,
    reducers: {
        fetching(state, action) {
            state.isFetching = action.payload;
            state.error = null;
        },
        failed(state, action) {
            state.error = action.payload;
        },
        setDiscounts(state, action) {
            state.discounts = action.payload;
        },
        setIsDiscounted(state, action) {
            state.isDiscounted = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    }
});

export default discountSlice.reducer;

// ACTIONS
export const {setIsDiscounted, fetching, setDiscounts, failed, setError} = discountSlice.actions;

// List user discounts
export const getDiscounts = (): AppThunk => async dispatch => {
    dispatch(fetching(true));
    try {
        const discountPromise = instanceApi.get<GetUserDiscountsOutput>(GET_DISCOUNT);
        const rentalPromise = instanceApi.get<GetUserRentalsOutput>(GET_RENTALS);
        const [discountResponse, rentalResponse] = await Promise.all([discountPromise, rentalPromise]);
        dispatch(setDiscounts([...discountResponse.data, ...rentalResponse.data]));
    } catch (err) {
        dispatch(failed(err));
    } finally {
        dispatch(fetching(false));
    }
};

// Assign discount code to a user
export const addDiscounts = (data: CreateUserDiscountInput, locale: string): AppThunk => async dispatch => {
    try {
        dispatch(setError(null));
        await postUserDiscounts(data);
        const discountPromise = instanceApi.get<GetUserDiscountsOutput>(GET_DISCOUNT);
        const rentalPromise = instanceApi.get<GetUserRentalsOutput>(GET_RENTALS);
        const [discountResponse, rentalResponse] = await Promise.all([discountPromise, rentalPromise]);
        dispatch(setDiscounts([...discountResponse.data, ...rentalResponse.data]));
        dispatch(setSnackbar({message: locale === "fr" ? "Remise ajoutée avec succès" : "Discount added successfully", type: "success"}));
    } catch (err: any) {
        dispatch(setError(err.message));
        dispatch(setSnackbar({message: err.message, type: "danger"}));
    }
};
