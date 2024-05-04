import BleContext from "@contexts/BleContext";
import * as React from "react";

export const useBluetooth = () => {
    return React.useContext(BleContext);
};
