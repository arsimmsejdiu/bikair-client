import {FirebaseRemoteConfigTypes} from "@react-native-firebase/remote-config";

export interface RemoteConfigData extends FirebaseRemoteConfigTypes.ConfigDefaults {
    "test": string
    "report_controller": string
    "report_collector": string
    "trad_fr": string
    "trad_en": string,
    "camera_preset": string
}
