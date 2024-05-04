import {NewsPhotoName} from "@models/data/NewsPhotoName";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadData, storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {getCitiesArray, getCityPolygonsArray, getCityRedZonesArray} from "@services/cityServices";
import {GET_API_KEY} from "@services/endPoint";
import {convertCity} from "@utils/helpers";
import {Platform} from "react-native";

import MyConfig from "../../../config";
import * as RootNavigation from "../../services/rootNavigation";
import {AppThunk} from "../store";
import {
    GetApiKeyOutput,
    GetCitiesOutputData,
    GetCityPolygonsOutputData,
    GetCityRedZonesOutputData
} from "@bikairproject/shared";

const {API_KEY_ANDROID, API_KEY_IOS} = MyConfig;

interface initialStateState {
    firstOpen: boolean,
    isOnline: boolean,
    isFetchingCities: boolean,
    active: string,
    error: any,
    cities: GetCitiesOutputData[],
    citiesSelectPicker: [],
    cityRedZones: GetCityRedZonesOutputData[],
    cityPolygons: GetCityPolygonsOutputData[],
    shouldUpdate: boolean,
    permissionError: any,
    initFetching: boolean,
    cameraPreset: string,
    startupAction: boolean,
    newsPhotoNames: NewsPhotoName[],
    newsIsActive: boolean;
}

const initialState: initialStateState = {
    firstOpen: false,
    isOnline: false,
    isFetchingCities: false,
    active: "active",
    error: null,
    cities: [],
    citiesSelectPicker: [],
    cityRedZones: [],
    cityPolygons: [],
    shouldUpdate: true,
    permissionError: null,
    initFetching: false,
    cameraPreset: "medium",
    startupAction: false,
    newsPhotoNames: [],
    newsIsActive: true
};

const initialStateSlice = createSlice({
    name: "initialState",
    initialState: initialState,
    reducers: {
        setFetchingCities(state, action: PayloadAction<boolean>) {
            state.isFetchingCities = action.payload;
        },
        initFailed(state, action) {
            state.error = action.payload;
        },
        setActiveApp(state, action) {
            state.active = action.payload;
        },
        setCities(state, action) {
            state.cities = action.payload;
        },
        setCitiesSelectPicker(state, action) {
            state.citiesSelectPicker = action.payload;
        },
        setCityPolygons(state, action: PayloadAction<GetCityPolygonsOutputData[]>) {
            state.cityPolygons = action.payload;
        },
        setCityRedZones(state, action: PayloadAction<GetCityRedZonesOutputData[]>) {
            state.cityRedZones = action.payload;
        },
        setNetworkState(state, action) {
            state.isOnline = action.payload;
        },
        setFirstOpen(state, action) {
            state.firstOpen = action.payload;
        },
        setShouldUpdate(state, action) {
            state.shouldUpdate = action.payload;
        },
        setPermissionError(state, action) {
            state.permissionError = action.payload;
        },
        setCameraPreset(state, action: PayloadAction<string>) {
            state.cameraPreset = action.payload;
        },
        setStartupAction(state, action) {
            state.startupAction = action.payload;
        },
        setNewsPhotoName(state, action: PayloadAction<NewsPhotoName[]>) {
            state.newsPhotoNames = action.payload;
        },
        setNewsActive(state, action: PayloadAction<boolean>) {
            state.newsIsActive = action.payload;
        }
    },
});

export default initialStateSlice.reducer;

// ACTIONS
export const {
    setFetchingCities,
    setCitiesSelectPicker,
    setCities,
    setCityPolygons,
    setCityRedZones,
    initFailed,
    setFirstOpen,
    setNetworkState,
    setActiveApp,
    setShouldUpdate,
    setPermissionError,
    setCameraPreset,
    setStartupAction,
    setNewsPhotoName,
    setNewsActive
} = initialStateSlice.actions;


// Get initial set after user has logged in
export const getCitiesAndZones = (retry = 0): AppThunk => async (dispatch, getState) => {
    try {
        if (!getState().initialState.isFetchingCities) {
            dispatch(setFetchingCities(true));
            const lastUpdateCities = await loadData("@lastUpdateCities");
            let isLastUpdateFar = true;
            if (typeof lastUpdateCities !== "undefined" && lastUpdateCities !== null) {
                const lastUpdateCitiesNumber = Number(lastUpdateCities);
                if (!Number.isNaN(lastUpdateCitiesNumber)) {
                    if ((Date.now() - lastUpdateCitiesNumber) < (1000 * 60 * 60 * 24)) {
                        isLastUpdateFar = false;
                    }
                }
            }

            const oneIsEmpty = getState().initialState.cities.length === 0 || getState().initialState.citiesSelectPicker.length === 0 || getState().initialState.cityRedZones.length === 0 || getState().initialState.cityPolygons.length === 0;

            if (isLastUpdateFar || oneIsEmpty) {
                const promiseCities = getCitiesArray();
                const promiseCityRedZone = getCityRedZonesArray();
                const promiseCityPolygons = getCityPolygonsArray();

                const [resCities, resCityRedZone, resCityPolygons] = await Promise.all([promiseCities, promiseCityRedZone, promiseCityPolygons]);

                dispatch(setCities(resCities));
                dispatch(setCitiesSelectPicker(convertCity(resCities)));
                dispatch(setCityRedZones(resCityRedZone));
                dispatch(setCityPolygons(resCityPolygons));
                await storeData("@lastUpdateCities", Date.now() + "");
            }
        }
    } catch (err) {
        if (retry < 4) {
            dispatch(getCitiesAndZones(retry + 1));
        }
        dispatch(initFailed(JSON.stringify(err)));
    } finally {
        dispatch(setFetchingCities(false));
    }
};

export const isUpdateAvailable = (): AppThunk => async (dispatch, getState) => {
    if (getState().initialState.shouldUpdate) {
        try {
            const key = Platform.OS === "ios" ? API_KEY_IOS : API_KEY_ANDROID;
            const {data} = await instanceApi.get<GetApiKeyOutput>(GET_API_KEY(key));
            console.log("---SHOULD-UPDATE----", data.isUpdate);
            if (data.isUpdate) {
                RootNavigation.navigate("Update", {
                    forceUpdate: !data.is_valid
                });
            } else {
                dispatch(setShouldUpdate(false));
            }
        } catch (error) {
            console.log(error);
        }
    }
};
