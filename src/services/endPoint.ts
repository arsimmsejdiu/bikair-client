/**
 * End point API
 */
import MyConfig from "../../config";

const API_ENDPOINT = MyConfig.API_ENDPOINT + "/v2";

// Trips ---------------------------------------------------------------------------------------------------------------
const TRIP_ENDPOINT = `${API_ENDPOINT}/trips`;
export const GET_TRIP_CURRENT = `${TRIP_ENDPOINT}/current`;
export const GET_TRIP_UNPAID = `${TRIP_ENDPOINT}/unpaid`;
export const POST_TRIP_BEGIN = `${TRIP_ENDPOINT}/begin`;
export const PUT_TRIP_START = `${TRIP_ENDPOINT}/start`;
export const PUT_TRIP_CANCEL = `${TRIP_ENDPOINT}/cancel`;
export const PUT_TRIP_PAUSE = `${TRIP_ENDPOINT}/pause`;
export const PUT_TRIP_END = `${TRIP_ENDPOINT}/end`;
export const GET_PAYMENT_RETRIEVE = `${TRIP_ENDPOINT}/retrieve-payment`;
export const GET_FIRST_TRIP = `${TRIP_ENDPOINT}/first`;
export const PUT_TRIP_END_PHOTO = `${TRIP_ENDPOINT}/endPhoto`;
export const GET_TRIP_PRICE = (timeEnd: number) => `${TRIP_ENDPOINT}/price?time_end=${timeEnd}`;
export const GET_TRIP_REDUCTION = `${TRIP_ENDPOINT}/reduction`;

// Deposits ------------------------------------------------------------------------------------------------------------
export const GET_TRIP_DEPOSIT = `${API_ENDPOINT}/deposits/check-deposit`;
export const PUT_TRIP_DEPOSIT = (id: number | string) => `${API_ENDPOINT}/deposits/${id}`;

// Locks----------------------------------------------------------------------------------------------------------------
export const PUT_LOCK_STATE = `${API_ENDPOINT}/locks/state`;
export const POST_LOCK_ALERT_START = `${API_ENDPOINT}/locks/error/still-closed`;
export const POST_LOCK_ALERT_END = `${API_ENDPOINT}/locks/error/instant-closed`;


// Users ---------------------------------------------------------------------------------------------------------------
const USER_ENDPOINT = `${API_ENDPOINT}/users`;
export const GET_USER = `${USER_ENDPOINT}/me`;
export const PUT_USER = `${USER_ENDPOINT}/`;
export const DELETE_USER = `${USER_ENDPOINT}/`;
export const GET_USER_SETTING = `${USER_ENDPOINT}/settings`;
export const GET_DISCOUNT = `${USER_ENDPOINT}/discounts`;
export const GET_RENTALS = `${USER_ENDPOINT}/rentals`;
export const POST_DISCOUNT = `${USER_ENDPOINT}/discounts`;
export const GET_TRIP_LIST = `${USER_ENDPOINT}/trips`;
export const PUT_USER_SETTINGS = `${USER_ENDPOINT}/settings`;
export const GET_USER_FUNCTIONALITIES = `${USER_ENDPOINT}/functionalities`;
export const POST_USER_TICKET = `${USER_ENDPOINT}/ticket`;


// Bookings ------------------------------------------------------------------------------------------------------------
export const POST_BOOKING = `${API_ENDPOINT}/bookings/`;
export const GET_BOOKING = `${API_ENDPOINT}/bookings/current`;
export const CANCEL_BOOKING = `${API_ENDPOINT}/bookings/cancel`;


// Payment-methods -----------------------------------------------------------------------------------------------------
export const GET_PM_METHOD = `${API_ENDPOINT}/payment-methods/`;
export const GET_CLIENT_SECRET = `${API_ENDPOINT}/payment-methods/secret`;
export const POST_PAYMENT_SHEET = `${API_ENDPOINT}/payment-methods/sheet`;
export const POST_PM_METHOD = `${API_ENDPOINT}/payment-methods/`;

// Reviews -------------------------------------------------------------------------------------------------------------
export const POST_REVIEW = `${API_ENDPOINT}/reviews/`;

// CGU -----------------------------------------------------------------------------------------------------------------
export const TERMS_CONDITIONS = "https://static.bik-air.fr/policies/CGAU/index.html";

/**
 * Microservices
 */

// authentication ------------------------------------------------------------------------------------------------------
export const AUTH_ENDPOINT = `${API_ENDPOINT}/auth`;
export const POST_AUTH_PHONE = `${AUTH_ENDPOINT}/phone`;
export const POST_AUTH_CONFIRM = `${AUTH_ENDPOINT}/confirm`;
export const POST_AUTH_LOGOUT = `${AUTH_ENDPOINT}/logout`;

// Subscription & Pass -------------------------------------------------------------------------------------------------
export const PRODUCTS_ENDPOINT = `${API_ENDPOINT}/products`;
export const GET_PRODUCTS = `${PRODUCTS_ENDPOINT}/available`;
export const GET_PRODUCTS_USER = `${PRODUCTS_ENDPOINT}/user`;
export const POST_PRODUCTS_USER = `${PRODUCTS_ENDPOINT}/user`;
export const POST_CANCEL_PRODUCTS_USER = `${PRODUCTS_ENDPOINT}/user/cancel`;
export const GET_PRODUCT_BY_ID = (product_id: number | string) => `${PRODUCTS_ENDPOINT}/${product_id}`;
export const POST_REACTIVATE_PRODUCTS_USER = `${PRODUCTS_ENDPOINT}/user/reactivate`;
export const POST_SUBSCRIPTION_RETRY = `${PRODUCTS_ENDPOINT}/subscription/retry`;

// Push Notifications --------------------------------------------------------------------------------------------------
export const PUSH_NOTIFICATION = `${API_ENDPOINT}/notifications`;
export const GET_PUSH_NOTIFICATIONS = `${PUSH_NOTIFICATION}/user`;
export const GET_PUSH_NOTIFICATION = (id: number | string) => `${PUSH_NOTIFICATION}/user/${id}`;
export const PUT_PUSH_NOTIFICATIONS = (id: number | string) => `${PUSH_NOTIFICATION}/user/${id}`;

//Bikes
const BIKE_ENDPOINTS = `${API_ENDPOINT}/bikes`;
export const GET_BIKES_NEARBY = `${BIKE_ENDPOINTS}/near-by`;
export const GET_BIKES_USER = `${BIKE_ENDPOINTS}/user`;
export const PUT_BIKE_ADDRESS_BY_ID = (id: number | string) => `${BIKE_ENDPOINTS}/address/${id}`;
export const GET_KEYSAFE_OTP_BY_ID = (id: number | string) => `${BIKE_ENDPOINTS}/ekeys/${id}`;
export const GET_BIKE_AVAILABILITY_BY_BIKE_NAME = (bikeName: string) => `${BIKE_ENDPOINTS}/availability/${bikeName}`;
export const GET_BIKE_STATUS = (bikeName: string) => `${BIKE_ENDPOINTS}/status/${bikeName}`;

// List-cities ---------------------------------------------------------------------------------------------------------
export const GET_CITIES = `${API_ENDPOINT}/cities/`;
export const GET_CITY_POLYGONS = `${API_ENDPOINT}/cities/polygons`;
export const GET_CITY_RED_ZONES = `${API_ENDPOINT}/cities/red-zones`;
export const POST_CITY_CHECK_ZONES = `${API_ENDPOINT}/cities/check-zones`;

// Event log -----------------------------------------------------------------------------------------------------------
export const POST_EVENT_LOG = `${API_ENDPOINT}/event-log/`;
export const POST_EVENT_LOG_LOCK_PAUSE = `${API_ENDPOINT}/event-log/lock-pause`;

//Storage
export const CREATE_SIGNED_URL = `${API_ENDPOINT}/storage/create-presigned-url`;
export const POST_END_PHOTO_FORM = `${API_ENDPOINT}/storage/end-photo-form`;

export const GET_API_KEY = (key: string) => `${API_ENDPOINT}/auth/check/api-key/${key}`;

// Spot ----------------------------------------------------------------------------------------------------------------
export const GET_SPOTS_NEAR_BY = `${API_ENDPOINT}/spots/near-by`;

