import {instanceApi} from "./axiosInterceptor";
import {GET_USER, POST_DISCOUNT, PUT_USER_SETTINGS} from "./endPoint";
import {
    CreateUserDiscountInput,
    CreateUserDiscountOutput,
    GetMeOutput,
    PutUserSettingsInput
} from "@bikairproject/shared";

export const getUserMe = async () => {
    const req = await instanceApi.get<GetMeOutput>(GET_USER);
    console.log(req.data.user);
    return req.data;
};

export const putUserSettings = async (data: Omit<PutUserSettingsInput, "id">) => {
    try {
        await instanceApi.put(PUT_USER_SETTINGS, data);
    } catch (error) {
        console.log(error);
    }
};

export const postUserDiscounts = async (data: CreateUserDiscountInput) => {
    try {
        const response = await instanceApi.post<CreateUserDiscountOutput>(POST_DISCOUNT, data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


