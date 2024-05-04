import en from "../translation/en.json";
import fr from "../translation/fr.json";
import {RemoteConfigData} from "./data";

export const defaultRemoteConfig: RemoteConfigData = {
    test: "default config",
    report_collector: "{}",
    report_controller: "{}",
    trad_fr: JSON.stringify(fr),
    trad_en: JSON.stringify(en),
    camera_preset: "medium"
};
