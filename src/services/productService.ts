import {instanceApi} from "./axiosInterceptor";
import {
    GET_PRODUCT_BY_ID,
    GET_PRODUCTS,
    GET_PRODUCTS_USER,
    POST_CANCEL_PRODUCTS_USER,
    POST_REACTIVATE_PRODUCTS_USER,
    POST_SUBSCRIPTION_RETRY
} from "./endPoint";
import {
    GetProductByIdOutput,
    GetProductsAvailableOutput,
    GetProductsUserOutput,
    PostCancelProductsUserInput,
    PostCancelProductsUserOutput,
    PostReactivateProductsUserInput,
    PostReactivateProductsUserOutput,
    PostSubscriptionRetryOutput
} from "@bikairproject/shared";

export const getProducts = async (cityId = 0) => {
    try {
        const {data} = await instanceApi.get<GetProductsAvailableOutput>(GET_PRODUCTS + "?city_id=" + cityId);
        console.log("Products nb = ", data.length);
        return data;
    } catch (err) {
        console.log("error", err);
    }
};

export const getProductById = async (productId: number | string, cityId = 0) => {
    try {
        const {data} = await instanceApi.get<GetProductByIdOutput>(GET_PRODUCT_BY_ID(productId) + "?city_id=" + cityId);
        return data;
    } catch (err) {
        console.log("Error --> ", err);
        return null;
    }
};

export const getProductsUser = async () => {
    try {
        const {data} = await instanceApi.get<GetProductsUserOutput>(GET_PRODUCTS_USER);
        console.log("Users Products nb = ", data.length);
        return data;
    } catch (err) {
        console.log("error", err);
    }
};


export const cancelSubscription = async (body: PostCancelProductsUserInput) => {
    try {
        await instanceApi.post<PostCancelProductsUserOutput>(POST_CANCEL_PRODUCTS_USER, body);
    } catch (err) {
        console.log("error", err);
        throw err;
    }
};

export const reactivateSubscription = async (body: PostReactivateProductsUserInput) => {
    try {
        await instanceApi.post<PostReactivateProductsUserOutput>(POST_REACTIVATE_PRODUCTS_USER, body);
    } catch (err) {
        console.log("error", err);
        throw err;
    }
};


export const retryPaymentSubscription = async (body: any) => {
    try {
        const {data} = await instanceApi.post<PostSubscriptionRetryOutput>(POST_SUBSCRIPTION_RETRY, body);
        return data;
    } catch (err) {
        console.log("error", err);
        throw err;
    }
};
