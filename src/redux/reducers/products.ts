import {createSlice, PayloadAction} from "@reduxjs/toolkit";

import {GetProductsAvailableOutput, GetProductsUserOutput, UserSubscriptionDetail} from "@bikairproject/shared";

interface initialStateState {
    change: boolean,
    active: boolean,
    isRecurringActive: boolean,
    isPassActive: boolean,
    isFetching: boolean,
    products: GetProductsAvailableOutput
    productsUser: GetProductsUserOutput
    selectedTab: "MY_SUBSCRIPTIONS" | "PASS"
    recurring: boolean
    error: any
    productId: number
    productPrice: number
    productRecurring: boolean
    productFrom: string
    productPeriod: number
    productDescription: string
}

const initialState: initialStateState = {
    change: false,
    active: false,
    isRecurringActive: false,
    isPassActive: false,
    isFetching: false,
    error: null,
    selectedTab: "PASS",
    recurring: false,
    products: [],
    productsUser: [],
    productId: 0,
    productPrice: 30,
    productRecurring: false,
    productFrom: new Date().toISOString(),
    productPeriod: 30,
    productDescription: "subscription_screen.success_message"
};

const ProductSlice = createSlice({
    name: "products",
    initialState: initialState,
    reducers: {
        setProducts(state, action) {
            state.products = action.payload;
        },
        setProductsUser(state, action) {
            state.active = action.payload.length > 0;
            state.isRecurringActive = action.payload.filter((p: UserSubscriptionDetail) => p.product_recurring).length > 0;
            state.isPassActive = action.payload.filter((p: UserSubscriptionDetail) => !p.product_recurring).length > 0;
            state.productsUser = action.payload;
        },
        setActive(state, action) {
            state.active = action.payload;
        },
        setChange(state, action) {
            state.change = action.payload;
        },
        setSelectedTab(state, action: PayloadAction<"MY_SUBSCRIPTIONS" | "PASS">) {
            state.selectedTab = action.payload;
        },
        setSubscription(state, action) {
            state.recurring = action.payload;
        },
        fetching(state, action) {
            state.isFetching = action.payload;
            state.error = null;
        },
        failed(state, action) {
            state.error = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setProductInfo(state, action: PayloadAction<{ from: string,id: number, price: number, recurring: boolean, period: number, description: string }>) {
            state.productId = action.payload.id;
            state.productPrice = action.payload.price;
            state.productRecurring = action.payload.recurring;
            state.productFrom = action.payload.from;
            state.productPeriod = action.payload.period;
            state.productDescription = action.payload.description;
        }
    }
});

export default ProductSlice.reducer;

export const {
    setActive,
    fetching,
    failed,
    setProducts,
    setSelectedTab,
    setSubscription,
    setProductsUser,
    setError,
    setChange,
    setProductInfo
} = ProductSlice.actions;
