import {PaymentMethod} from "@models/data";
import { createSlice } from "@reduxjs/toolkit";
import {instanceApi} from "@services/axiosInterceptor";
import { GET_PM_METHOD, POST_PM_METHOD } from "@services/endPoint";

import {AppThunk} from "../store";
import {updateSuccess} from "./auth";

interface paymentMethodInitialStateType {
    isFetching: boolean,
    error: any,
    card: PaymentMethod | null
}

const paymentMethodInitialState: paymentMethodInitialStateType = {
    isFetching: false,
    error: null,
    card: null
};

const paymentMethodSlice = createSlice({
    name: "paymentMethod",
    initialState: paymentMethodInitialState,
    reducers: {
        fetching(state, action) {
            state.isFetching = action.payload;
            state.error = null;
        },
        cardSuccess(state, action) {
            state.card = action.payload;
        },
        cardFailed(state, action) {
            state.error = action.payload;
        },
    }
});

export default paymentMethodSlice.reducer;

// ACTIONS
export const { fetching, cardSuccess, cardFailed } = paymentMethodSlice.actions;


// Request
export const getPaymentMethod = (shouldFetch = true): AppThunk => async dispatch => {
    dispatch(fetching(shouldFetch));
    try{
        const response = await instanceApi.get(GET_PM_METHOD);
        const payment = response.data;
        console.log(payment);
        if(payment){
            dispatch(cardSuccess(payment));
            dispatch(updateSuccess({has_payment_method: true}));
        } else {
            dispatch(cardSuccess(null));
            dispatch(updateSuccess({has_payment_method: false}));
        }
    }catch(err){
        dispatch(cardFailed(err));
    }finally{
        dispatch(fetching(false));
    }
};


export const addPaymentMethod = (paymentMethodId: string): AppThunk => async dispatch => {
    try{
        const req = await instanceApi.post(POST_PM_METHOD, {paymentMethodId: paymentMethodId});
        const response = req.data;

        dispatch(updateSuccess({has_payment_method: true}));

        dispatch(cardSuccess(response));

    }catch(err){
        dispatch(cardFailed(err));
    }
};

