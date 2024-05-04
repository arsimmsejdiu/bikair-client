import BleInfo from "@models/data/BleInfo";
import {LockStatus} from "@models/types";
import * as React from "react";

interface BleContextType {
    bleOn: boolean;
    lockStatus: LockStatus[] | null;
    updateBleInfo: (infos: BleInfo) => void;
    disconnect: () => Promise<void>;
    connect: () => Promise<void>;
    open: () => Promise<void>;
    close: () => Promise<void>;
}

const defaultContext: BleContextType = {
    bleOn: false,
    lockStatus: null,
    updateBleInfo: (infos: BleInfo) => {
        console.log("default updateBleInfo function. ", infos);
    },
    disconnect: async () => {
        console.log("default getStatus function");
    },
    connect: async () => {
        console.log("default login function");
    },
    open: async () => {
        console.log("default logout function");
    },
    close: async () => {
        console.log("default login function");
    }
};

const BleContext = React.createContext<BleContextType>(defaultContext);

export default BleContext;
