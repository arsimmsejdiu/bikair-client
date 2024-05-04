import {EventLog} from "@models/data/EventLog";
import {TRIP_STEPS} from "@models/enums/TripSteps";
import {getBluetoothPermissionState} from "@permissions/BluetoothPermission";
import {getCameraPermissionState} from "@permissions/CameraPermission";
import {getLocationPermissionState} from "@permissions/LocationPermission";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import {setSnackbar} from "@redux/reducers/snackbar";
import {createSlice} from "@reduxjs/toolkit";
import {loadData, storeData} from "@services/asyncStorage";
import {instanceApi} from "@services/axiosInterceptor";
import {POST_EVENT_LOG} from "@services/endPoint";
import {getPosition} from "@utils/helpers";
import {
    getApplicationName,
    getBatteryLevel,
    getBrand,
    getBuildNumber,
    getBundleId,
    getCarrier,
    getDeviceType,
    getManufacturer,
    getModel,
    getSystemName,
    getSystemVersion,
    getVersion,
    isEmulator,
} from "react-native-device-info";
import {AppEventsLogger} from "react-native-fbsdk-next";

import CrispChat, {CrispSessionEventColors} from "../../native-modules/CrispChat";
import {AppThunk, RootState} from "../store";
import {setFirstOpen} from "./initialState";
import {PostCreateEventsInputData} from "@bikairproject/shared";

interface eventInitialStateType {
    phoneInfo: any
    userUuid: string | null,
    userId: number | null,
}

const eventInitialState: eventInitialStateType = {
    phoneInfo: null,
    userUuid: null,
    userId: null,
};

const eventsSlice = createSlice({
    name: "events",
    initialState: eventInitialState,
    reducers: {
        setPhoneInfo(state, action) {
            state.phoneInfo = action.payload;
        },
        setUserUuid(state, action) {
            state.userUuid = action.payload;
        },
        setUserId(state, action) {
            state.userId = action.payload;
        }
    },
});

export default eventsSlice.reducer;

// ACTIONS
export const {
    setPhoneInfo,
    setUserUuid,
    setUserId
} = eventsSlice.actions;

export const pushUserEvents = async (userEvent: EventLog) => {
    const userEventsString = await loadData("@userEvents");
    let userEvents: EventLog[] = [];
    if (userEventsString) {
        userEvents = JSON.parse(userEventsString) as EventLog[];
    }
    userEvents.push(userEvent);
    await crashlytics().log(userEvent.type);
    await storeData("@userEvents", JSON.stringify(userEvents));
};

export const getUserEvents = async () => {
    const userEventsString = await loadData("@userEvents");
    let userEvents: EventLog[] = [];
    if (userEventsString) {
        userEvents = JSON.parse(userEventsString) as EventLog[];
    }
    return userEvents;
};

export const cleanUserEvents = async () => {
    const userEvents: EventLog[] = [];
    await storeData("@userEvents", JSON.stringify(userEvents));
};

export const getPhoneInfos = (): AppThunk => async (dispatch, getState) => {
    const phoneInfo = getState().events.phoneInfo;
    if (!phoneInfo) {
        const info: any = {};
        info.applicationName = getApplicationName();
        info.buildNumber = getBuildNumber();
        info.bundleId = getBundleId();
        info.batteryLevel = await getBatteryLevel();
        info.brand = getBrand();
        info.Carrier = await getCarrier();
        info.deviceType = getDeviceType();
        info.manufacturer = await getManufacturer();
        info.model = getModel();
        info.systemName = getSystemName();
        info.systemVersion = getSystemVersion();
        info.version = getVersion();
        info.isEmulator = await isEmulator();
        dispatch(setPhoneInfo(info));
    }
};

const getCommonEventInfo = (getState: () => RootState) => {
    return {
        phoneInfo: getState().events.phoneInfo,
        user: getState().auth.me,
        userId: getState().events.userId,
        date: new Date().getTime(),
    };
};

const getAuthorisationState = async () => {
    return {
        bluetooth: await getBluetoothPermissionState(),
        camera: await getCameraPermissionState(),
        location: await getLocationPermissionState()
    };
};

export const postEvents = async () => {
    console.log("[POST] - Event_Logs sending ..............................");
    const events = await getUserEvents();
    const data = events.map(e => {
        const event: PostCreateEventsInputData = {
            data: e.data,
            userId: e.userId ?? undefined,
            type: e.type,
            date: new Date(e.date).toDateString()
        };
        return event;
    });
    instanceApi.post(POST_EVENT_LOG, data).then(() => {
        cleanUserEvents();
    });
};

export const userOpenAppEvent = (): AppThunk => async (dispatch, getState) => {
    const {firstOpen} = getState().initialState;
    if (!firstOpen) {
        const location: any = await getPosition();
        const authorisationState = await getAuthorisationState();
        try {
            const type = "USER_OPEN_APP";
            const event = {
                data: {
                    ...getCommonEventInfo(getState),
                    ...authorisationState,
                    position: location.coords,
                },
                type: type,
                userId: getState().events.userId,
                date: new Date().getTime()
            };
            await pushUserEvents(event);
            await analytics().logEvent(type);
            await analytics().logAppOpen();
            await postEvents();
        } catch (error) {
            console.log(error);
        }
        dispatch(setFirstOpen(true));
    }
};

export const errorOccured = (error: any, context = "ERROR"): AppThunk => async (dispatch, getState) => {
    try {
        const message = error && error.message ? error.message : error;
        console.log(`!!! ${context} !!! `, message);
        const type = "ERROR_OCCURED";
        const authorisationState = await getAuthorisationState();
        const event = {
            data: {
                ...getCommonEventInfo(getState),
                ...authorisationState,
                message: `!!! ${context} !!! ` + message,
                error: JSON.stringify(error)
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        CrispChat.pushSessionEvent(`ERROR : ${context}`, CrispSessionEventColors.RED);
        crashlytics().recordError(new Error(error), context);
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const onButtonClick = (actionLabel: string): AppThunk => async (dispatch, getState) => {
    try {
        const type = "BUTTON_" + actionLabel;
        const event = {
            data: {
                ...getCommonEventInfo(getState),
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await crashlytics().setAttribute("LAST_CLICK", actionLabel);
        await crashlytics().log(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const onTripStepEvent = (step: TRIP_STEPS): AppThunk => async (dispatch, getState) => {
    try {
        const event = {
            data: getCommonEventInfo(getState),
            type: step,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await crashlytics().setAttribute("LAST_TRIP_STEP", step ?? "NONE");
        await analytics().logEvent(step);
        let crispColor = CrispSessionEventColors.BLUE;
        switch (step) {
            case TRIP_STEPS.TRIP_STEP_BEGIN_CHECK:
            case TRIP_STEPS.TRIP_STEP_BEGIN:
            case TRIP_STEPS.TRIP_STEP_START:
            case TRIP_STEPS.TRIP_STEP_END_CHECK:
            case TRIP_STEPS.TRIP_STEP_CLOSE_LOCK:
            case TRIP_STEPS.TRIP_STEP_END_VALIDATE:
            case TRIP_STEPS.TRIP_STEP_END:
            case TRIP_STEPS.TRIP_STEP_REVIEW:
                crispColor = CrispSessionEventColors.GREEN;
                await postEvents();
                break;
            case TRIP_STEPS.TRIP_STEP_RETRY_CLOSING:
            case TRIP_STEPS.TRIP_STEP_LOCK_TIMEOUT:
                crispColor = CrispSessionEventColors.YELLOW;
                await postEvents();
                break;
            case TRIP_STEPS.TRIP_STEP_CANCEL:
                crispColor = CrispSessionEventColors.ORANGE;
                await postEvents();
                break;
            case TRIP_STEPS.TRIP_STEP_MANUAL_LOCK:
                crispColor = CrispSessionEventColors.PURPLE;
                await postEvents();
                break;
            case TRIP_STEPS.TRIP_STEP_PAYMENT_ERROR:
            case TRIP_STEPS.TRIP_STEP_ERROR_DEPOSIT_UNCAPTURED:
            case TRIP_STEPS.TRIP_STEP_ERROR_UNLOCK_FAILED:
            case TRIP_STEPS.TRIP_STEP_ERROR_LOCK_CONNECTION_CANCEL:
            case TRIP_STEPS.TRIP_STEP_ERROR_BEGIN_FAILED:
            case TRIP_STEPS.TRIP_STEP_ERROR_START_FAILED:
                crispColor = CrispSessionEventColors.RED;
                await postEvents();
                break;
            case TRIP_STEPS.TRIP_STEP_ONGOING:
            case TRIP_STEPS.TRIP_STEP_W3D_SECURE:
                crispColor = CrispSessionEventColors.PINK;
                break;
            default:
                crispColor = CrispSessionEventColors.BLUE;
                break;
        }
        CrispChat.pushSessionEvent(step, crispColor);
    } catch (error) {
        console.log(error);
    }
};

export const userUnlockClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_UNLOCK";
        const authorisationState = await getAuthorisationState();
        const event = {
            data: {
                ...getCommonEventInfo(getState),
                ...authorisationState
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userLockClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_LOCK";
        const authorisationState = await getAuthorisationState();
        const event = {
            data: {
                ...getCommonEventInfo(getState),
                ...authorisationState
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userPauseClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_PAUSE";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userEndTripClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_END_TRIP";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const askForTripUnpaid = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "ASK_FOR_TRIP_UNPAID";
        const event = {
            data: getCommonEventInfo(getState),
            type: "ASK_FOR_TRIP_UNPAID",
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const currentTripDetected = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "CURRENT_TRIP_DETECTED";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const askW3DSecure = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "ASK_W3D_SECURE";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error: any) {
        dispatch(setSnackbar({message: error.message, type: "danger"}));
        console.log(error);
    }
};

export const userUnpauseClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_UNPAUSE";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userPaymentClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_PAY";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userLockStateYesClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_YES_LOCK_STATE";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userBookBikeEvent = (): AppThunk => async (dispatch, getState) => { // key moment
    try {
        const type = "USER_CLICK_BOOKING";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userUnbookBikeEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_UNBOOKING";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickRetryLockConnectionEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_RETRY_LOCK_CONNECTION";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickRetryLockClosingEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_RETRY_LOCK_CLOSING";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickCancelTripEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_CANCEL_TRIP";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickManualLockEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_MANUAL_LOCK";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickWhiteLockEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_WHITE_LOCK";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickBackInManualLockEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_BACK_IN_MANUAL_LOCK";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickBlackLockEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_BLACK_LOCK";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickManualLockSupportEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_MANUAL_LOCK_SUPPORT";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickBlackLockTutorialEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_BLACK_LOCK_TUTORIAL";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickManualLockPhotoEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_MANUAL_LOCK_PHOTO";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickOkStartTripEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_OK_START";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickOkPaidTripEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_OK_PAID";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickOkWaitValidationEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_OK_WAIT_VALIDATION";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickConfirmPaymentEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_CONFIRM_PAYMENT";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickTripPaymentErrorEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_TRIP_PAYMENT_ERROR";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickTripEndErrorSupportEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_TRIP_END_ERROR_SUPPORT";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickTripEndErrorConfirmEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_TRIP_END_ERROR_CONFIRM";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickPhoneValidationEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_PHONE_VALIDATION";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickOtpValidationEvent = (otp?: string | null): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_OTP_VALIDATION";
        const event = {
            data: {
                ...getCommonEventInfo(getState),
                otp: otp
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await analytics().logLogin({
            method: "phone"
        });
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickSubscriptionEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_SUBSCRIPTION";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickDiscountValidationEvent = (code?: string | null): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_DISCOUNT_VALIDATION";
        const event = {
            data: {
                ...getCommonEventInfo(getState),
                code: code,
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickDeleteCbEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_DELETE_CB";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickAddCbEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_ADD_CB";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await analytics().logAddPaymentInfo({payment_type: "CB"});
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const userClickSupportTicketEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_SUPPORT_TICKET";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const tripStepEndPhotoEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "TRIP_STEP_END_PHOTO";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const userClickTakePhotoEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_TAKE_PHOTO";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const userClickTakeLockPhotoEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "USER_CLICK_TAKE_LOCK_PHOTO";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const photoSendEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "PHOTO_SEND";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const drawerUserMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_USER_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const drawerTripsMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_TRIPS_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const drawerPaymentMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_PAYMENT_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const drawerPromotionsMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_PROMOTIONS_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const drawerProductsMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_PRODUCTS_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.ViewedContent, {
            [AppEventsLogger.AppEventParams.ContentType]: "Pass",
        });
    } catch (error) {
        console.log(error);
    }
};

export const drawerSponsorMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_SPONSOR_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const drawerNotificationMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_NOTIFICATION_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const drawerHelpMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_HELP_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const drawerLogoutMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_LOGOUT_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const drawerTermesMenuEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "DRAWER_TERMES_MENU";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const productTabSubscriptionClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "PRODUCTS_TAB_SUBSCRIPTION_CLICK";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.ViewedContent, {
            [AppEventsLogger.AppEventParams.ContentType]: "Subscriptions",
        });
    } catch (error) {
        console.log(error);
    }
};

export const productTabActiveClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "PRODUCTS_TAB_ACTIVE_CLICK";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const productTabPassClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "PRODUCTS_TAB_PASS_CLICK";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const productTabOffersClickEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "PRODUCTS_TAB_OFFERS_CLICK";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const productSubscriptionCheckoutEvent = (productId: number, price: number): AppThunk => async (dispatch, getState) => {
    try {
        const type = "PRODUCTS_CHECKOUT_SUBSCRIPTION";
        const event = {
            data: {
                contentType: "subscription",
                contentID: String(productId),
                numItems: "1",
                caymentInfoAvailable: "true",
                Currency: "EUR",
                ...getCommonEventInfo(getState)
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logBeginCheckout({
            currency: "EUR",
            value: price,
            items: [
                {
                    item_id: String(productId),
                    price: price,
                    quantity: 1,
                    item_category: "subscription"
                }
            ]
        });
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.InitiatedCheckout, price, {
            [AppEventsLogger.AppEventParams.ContentType]: "product",
            [AppEventsLogger.AppEventParams.ContentID]: String(productId),
            [AppEventsLogger.AppEventParams.NumItems]: "1",
            [AppEventsLogger.AppEventParams.PaymentInfoAvailable]: "true",
            [AppEventsLogger.AppEventParams.Currency]: "EUR",
        });
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const productPassCheckoutEvent = (productId: number, price: number): AppThunk => async (dispatch, getState) => {
    try {
        const type = "PRODUCTS_CHECKOUT_PASS";
        const event = {
            data: {
                contentType: "product",
                contentID: String(productId),
                numItems: "1",
                caymentInfoAvailable: "true",
                Currency: "EUR",
                ...getCommonEventInfo(getState)
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logBeginCheckout({
            currency: "EUR",
            value: price,
            items: [
                {
                    item_id: String(productId),
                    price: price,
                    quantity: 1,
                    item_category: "product"
                }
            ]
        });
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.InitiatedCheckout, price, {
            [AppEventsLogger.AppEventParams.ContentType]: "product",
            [AppEventsLogger.AppEventParams.ContentID]: String(productId),
            [AppEventsLogger.AppEventParams.NumItems]: "1",
            [AppEventsLogger.AppEventParams.PaymentInfoAvailable]: "true",
            [AppEventsLogger.AppEventParams.Currency]: "EUR",
        });
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const productSubscriptionPurchaseEvent = (productId: number, price: number): AppThunk => async (dispatch, getState) => {
    try {
        const type = "PRODUCTS_PURCHASE_SUBSCRIPTION";
        const event = {
            data: {
                contentType: "subscription",
                contentID: String(productId),
                numItems: "1",
                Currency: "EUR",
                ...getCommonEventInfo(getState)
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logPurchase({
            currency: "EUR",
            value: price,
            items: [
                {
                    item_id: String(productId),
                    price: price,
                    quantity: 1,
                    item_category: "subscription"
                }
            ]
        });
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Subscribe, price, {
            [AppEventsLogger.AppEventParams.OrderId]: String(productId),
            [AppEventsLogger.AppEventParams.Currency]: "EUR",
        });
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const productPassPurchaseEvent = (productId: number, price: number): AppThunk => async (dispatch, getState) => {
    try {
        const type = "PRODUCTS_PURCHASE_PASS";
        const event = {
            data: {
                contentType: "Pass",
                contentID: String(productId),
                numItems: "1",
                Currency: "EUR",
                ...getCommonEventInfo(getState)
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logPurchase({
            currency: "EUR",
            value: price,
            items: [
                {
                    item_id: String(productId),
                    price: price,
                    quantity: 1,
                    item_category: "Pass"
                }
            ]
        });
        AppEventsLogger.logEvent(AppEventsLogger.AppEvents.Purchased, price, {
            [AppEventsLogger.AppEventParams.ContentType]: "product",
            [AppEventsLogger.AppEventParams.ContentID]: String(productId),
            [AppEventsLogger.AppEventParams.NumItems]: 1,
            [AppEventsLogger.AppEventParams.Currency]: "EUR",
        });
        await postEvents();
    } catch (error) {
        console.log(error);
    }
};

export const openBackgroundNotificationEventEvent = (notificationId: string | undefined, title: string | undefined): AppThunk => async (dispatch, getState) => {
    try {
        const type = "BACKGROUND_NOTIFICATION_OPEN";
        const event = {
            data: {
                notificationId: notificationId,
                title: title,
                ...getCommonEventInfo(getState)
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type, {
            notificationId: notificationId,
            title: title,
        });
    } catch (error) {
        console.log(error);
    }
};

export const openForegroundNotificationEventEvent = (notificationId: string | undefined, title: string | undefined): AppThunk => async (dispatch, getState) => {
    try {
        const type = "FOREGROUND_NOTIFICATION_OPEN";
        const event = {
            data: {
                notificationId: notificationId,
                title: title,
                ...getCommonEventInfo(getState)
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type, {
            notificationId: notificationId,
            title: title,
        });
    } catch (error) {
        console.log(error);
    }
};

export const clickBluetoothSettingEvent = (): AppThunk => async (dispatch, getState) => {
    try {
        const type = "CLICK_OPEN_BLE_SYSTEM_SETTINGS";
        const event = {
            data: getCommonEventInfo(getState),
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

export const clickScanOrTypeBikeNumberEvent = (bikeName: string): AppThunk => async (dispatch, getState) => {
    try {
        const type = "CLICK_SCAN_OR_TYPE_BIKE_NUMBER";
        const event = {
            data: {
                bike_name: bikeName,
                ...getCommonEventInfo(getState),
            },
            type: type,
            userId: getState().events.userId,
            date: new Date().getTime()
        };
        await pushUserEvents(event);
        await analytics().logEvent(type);
    } catch (error) {
        console.log(error);
    }
};

