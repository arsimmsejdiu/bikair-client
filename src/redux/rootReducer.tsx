// Reducers
import auth from "@redux/reducers/auth";
import bike from "@redux/reducers/bike";
import discount from "@redux/reducers/discount";
import events from "@redux/reducers/events";
import initialState from "@redux/reducers/initialState";
import lock from "@redux/reducers/lock";
import markerDetails from "@redux/reducers/markerDetails";
import notification from "@redux/reducers/notification";
import paymentMethod from "@redux/reducers/paymentMethod";
import process from "@redux/reducers/process";
import products from "@redux/reducers/products";
import snackbar from "@redux/reducers/snackbar";
import spot from "@redux/reducers/spot";
import trip from "@redux/reducers/trip";
import {combineReducers} from "@reduxjs/toolkit";



const rootReducer = combineReducers({
    auth,
    bike,
    discount,
    events,
    initialState,
    lock,
    markerDetails,
    notification,
    paymentMethod,
    products,
    snackbar,
    spot,
    trip,
    process
});

export default rootReducer;
