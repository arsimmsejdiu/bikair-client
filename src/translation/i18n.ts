import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import en from "./en.json";
import fr from "./fr.json";
import {LanguageDetector} from "./LanguageDetector";

const resources = {
    en: {
        translation: en,
    },
    fr: {
        translation: fr,
    },
    default: {
        translation: en,
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        compatibilityJSON: "v3",
        fallbackLng: "default",
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        resources,
    }).then(r => console.log(r));

export default i18n;
