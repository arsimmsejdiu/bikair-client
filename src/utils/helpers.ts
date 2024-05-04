import {EXPERIMENTATION_MINUTE} from "@assets/constant";
import {Region} from "@models/data";
import {Bike} from "@models/data/MarkerData";
import Geolocation from "@react-native-community/geolocation";
import crashlytics from "@react-native-firebase/crashlytics";
import {degreesToRadians, radiansToLength} from "@turf/helpers";
import moment from "moment";
import {Item} from "react-native-picker-select";

import {GetCitiesOutputData, GetCityPolygonsOutputData, Point, TripReduction} from "@bikairproject/shared";
import {computePrice} from "@bikairproject/utils";

type CoordsType = { latitude: number, longitude: number }

type CoordArrayType = {
    city_name: string | null | undefined,
    coordinates: CoordsType[]
}

export const getPosition = async (timeout = 12000, maximumAge = 30000) => {
    return await new Promise(function (resolve, reject) {
        return Geolocation.getCurrentPosition(info => resolve(info), error => reject(error), {
            timeout: timeout,
            maximumAge: maximumAge,
            enableHighAccuracy: true
        });
    });
};

export const calculateBikeTagPrice = (item: any, hasExperimentationTag: boolean, priceToPay: number) => {
    if (hasExperimentationTag) {
        return item.duration <= 60 ? priceToPay : (item.duration - 60) * 0.15;
    } else {
        return priceToPay;
    }
};

export const setCrashlyticsAttribute = async (attributeName: string, attributeValue: string) => {
    return await crashlytics()
        .setAttribute(attributeName, attributeValue);
};

export const calcPerimeter = (region: Region) => {
    if (!region) return 1000;
    const unit = "meters";
    const {latitudeDelta, longitudeDelta}: Region = region;
    if (!latitudeDelta || !longitudeDelta) return 0;
    const greaterAxis: number =
        latitudeDelta > longitudeDelta ? latitudeDelta : longitudeDelta;
    return radiansToLength(degreesToRadians(greaterAxis), unit);
};

export const estimatePrice = (time: number, tripReduction: TripReduction | null, withStartingPrice: boolean) => {
    const mins = getDuration(time);
    return computePrice(tripReduction, time, mins, withStartingPrice);
};

export const millisToMinutesAndSeconds = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    return minutes + 1;
};

export const getDuration = (time: any, end: any = new Date()) => {
    if (!time) {
        return 0;
    }
    const countFrom = parseInt(time);
    const timeDifference = (end - countFrom);

    return millisToMinutesAndSeconds(timeDifference);
};

// Check if timestamp difference above 1500milliseconds
export const timestampDifference = (start: number, end: number): boolean => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    console.log("time diff in seconds : ", seconds);
    return seconds < 1.5;
};

export const parseUrl = (url: string) => {
    const part = url.substring(
        url.lastIndexOf("/") + 1,
        url.lastIndexOf("?"),
    );
    const params: any = {url: part};

    return params;
};

export const formatPriceWithLocale = (total: number, locale = "fr") => {
    const price = locale === "fr" ?
        (total / 100).toFixed(2).replace(".", ",") :
        (total / 100).toFixed(2);
    return price + " €";
};

// Source: http://www.regular-expressions.info/email.html
// See the link above for an explanation of the tradeoffs.
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const emailFormatValid = (value: string): boolean => {
    return !!(value && EMAIL_RE.test(value.trim()));
};


// Calculate age above 16
export const getAge = (dateString: string): number => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

/**
 * Check that the given parameter is a Date object.
 *
 *
 * @returns {boolean} true if given parameter is a Date object.
 * @param date
 */
export const isDate = (date: any) =>
    date && Object.prototype.toString.call(date) === "[object Date]" && !Number.isNaN(date.getTime());


export const toStringDate = (date: string): string => {
    return moment(date).format("dddd D MMMM, YYYY");
};


moment.updateLocale("fr", {
    months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    monthsParseExact: true,
    weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: "HH:mm",
        LTS: "HH:mm:ss",
        L: "DD/MM/YYYY",
        LL: "D MMMM YYYY",
        LLL: "D MMMM YYYY HH:mm",
        LLLL: "dddd D MMMM YYYY HH:mm",
    },
    calendar: {
        sameDay: "[Aujourd’hui à] LT",
        nextDay: "[Demain à] LT",
        nextWeek: "dddd [à] LT",
        lastDay: "[Hier à] LT",
        lastWeek: "dddd [dernier à] LT",
        sameElse: "L",
    },
    relativeTime: {
        future: "dans %s",
        past: "il y a %s",
        s: "quelques secondes",
        m: "une minute",
        mm: "%d minutes",
        h: "une heure",
        hh: "%d heures",
        d: "un jour",
        dd: "%d jours",
        M: "un mois",
        MM: "%d mois",
        y: "un an",
        yy: "%d ans",
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal: function (number) {
        return number + (number === 1 ? "er" : "e");
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === "M";
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem: function (hours, minutes, isLower) {
        return hours < 12 ? "PD" : "MD";
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4,  // Used to determine first week of the year.
    }
});

export const getDate = (value: any): Date | null => {
    if (typeof value === "string" || typeof value === "number") {
        return new Date(value);
    } else if (value instanceof Date) {
        return value;
    } else {
        return null;
    }
};

export const getTimeDiff = (date1: Date, date2: Date) => {
    const diffMs = (date2.getTime() - date1.getTime()); // milliseconds between now & Christmas
    // const diffDays = Math.floor(diffMs / 86400000); // days
    // const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    // minutes
    return Math.round(((diffMs % 86400000) % 3600000) / 60000);
};

export const convertCity = (cities: GetCitiesOutputData[]) => {
    const arr: Item[] = [];
    for (let i = 0; i < cities.length; i++) {
        const item: Item = {
            label: cities[i].name ?? "",
            value: cities[i].id,
        };
        arr.push(item);
    }
    return arr;
};


export const validateEmail = (email: string | null) => {
    if (email) {
        const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexp.test(email);
    } else {
        return false;
    }
};

export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

export function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export function getMarkerNearby<T extends {
    coordinates: Point,
    distance?: number
}>(values: T[], location: { latitude: number, longitude: number }, maxElement = 100, radiusKm = 5) {
    return values
        .map(b => {
            if (b.coordinates?.coordinates?.length === 2) {
                const lat = b.coordinates?.coordinates[1];
                const lng = b.coordinates?.coordinates[0];
                const distance = getDistanceFromLatLonInKm(location.latitude, location.longitude, lat, lng);
                return {
                    ...b,
                    distance: distance
                };
            } else {
                return b;
            }
        })
        .sort((a, b) => {
            if (typeof a?.distance === "undefined") {
                return 1;
            }
            if (typeof b?.distance === "undefined") {
                return -1;
            }
            return a.distance - b.distance;
        })
        .slice(0, maxElement)
        .filter(b => {
            return (b.distance ?? (radiusKm + 1)) < radiusKm;
        });
}


export const sleep = async (ms: number) => {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
};

export const constructCoordinatesArray = (cities: GetCityPolygonsOutputData[]) => {
    const arr: CoordArrayType[] = [];
    for (let i = 0; i < cities.length; i++) {
        const tmp: CoordArrayType = {
            city_name: cities[i].name,
            coordinates: []
        };
        const polygon = cities[i].polygon;
        if (polygon && cities[i].status === "ACTIVE") {
            const coordinates = polygon.coordinates[0];
            for (let x = 0; x < coordinates.length; x++) {
                const coords: CoordsType = {
                    latitude: coordinates[x][1],
                    longitude: coordinates[x][0],
                };
                tmp.coordinates.push(coords);
            }
        }
        arr.push(tmp);
    }
    return arr;
};
