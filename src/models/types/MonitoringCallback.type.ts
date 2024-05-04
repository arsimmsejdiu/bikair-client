import {BleError} from "react-native-ble-plx";

import {LockStatus} from "./LockStatus";

type MonitoringCallbackType = ((error?: BleError | null, status?: LockStatus[] | null) => void) | null | undefined

export default MonitoringCallbackType;
