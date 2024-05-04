import {InitOptions, LanguageDetectorModule, Services} from "i18next";
import {NativeModules, Platform} from "react-native";

export const LanguageDetector: LanguageDetectorModule = {
    type: "languageDetector",
    detect: () => {
        let locale;
        if (Platform.OS === "ios") {
            // iOS:
            console.log(
                `iOS locale : ${NativeModules.SettingsManager.settings.AppleLocale}`,
            );
            console.log(
                `iOS locale : ${NativeModules.SettingsManager.settings.AppleLanguages[0]}`,
            );
            locale =
                NativeModules.SettingsManager.settings.AppleLocale ||
                NativeModules.SettingsManager.settings.AppleLanguages[0]; // "fr_FR"
        } else {
            // Android:
            console.log(
                `Android locale : ${NativeModules.I18nManager.localeIdentifier}`,
            );
            locale = NativeModules.I18nManager.localeIdentifier; // "fr_FR"
        }
        console.log(`Detected Locale : ${locale}`);
        return locale.split("_")[0];
    },
    cacheUserLanguage: (lng: string): void => {
        console.log(`caching ${lng}`);
    },
    init(
        services: Services,
        detectorOptions: object,
        i18nextOptions: InitOptions,
    ): void {
        console.log("init language detector");
    },
};
