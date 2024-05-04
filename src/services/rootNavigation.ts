import {NavigationContainerRef} from "@react-navigation/core";
import * as React from "react";

export const navigationRef = React.createRef<NavigationContainerRef<any>>();
export let routeNameRef = "";

export const setRouteNameRef = (name: string) => {
    routeNameRef = name;
};

export const getCurrentRouteName = () => {
    const currentRoute = navigationRef.current?.getCurrentRoute();
    if(typeof currentRoute === "undefined") {
        return "";
    } else {
        return currentRoute.name;
    }
};

export function navigate(name: any, params?: any) {
    if (navigationRef.current) {
        navigationRef.current.navigate(name, params);
    }
}
