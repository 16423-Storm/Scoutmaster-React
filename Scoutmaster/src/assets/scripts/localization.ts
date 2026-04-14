import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../localization/en.json";
// import fr from "../localization/fr.json";
// import es from "../localization/es.json";
// import pt from "../localization/pt.json";
// import ro from "../localization/ro.json";
// import tr from "../localization/tr.json";

const browserLanguage =
    typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";

// const supportedLanguages = ["en", "fr", "es", "pt", "ro", "tr"];
const supportedLanguages = ["en"];
const defaultLanguage = supportedLanguages.includes(browserLanguage)
    ? browserLanguage
    : "en";

i18n.use(initReactI18next).init({
    lng: defaultLanguage,
    fallbackLng: "en",
    resources: {
        en: { translation: en },
        // fr: { translation: fr },
        // es: { translation: es },
        // pt: { translation: pt },
        // ro: { translation: ro },
        // tr: { translation: tr },
    },
    interpolation: {
        escapeValue: false,
    },
});

export const languages = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    // { code: "fr", label: "FR", flag: "🇫🇷" },
    // { code: "es", label: "ES", flag: "🇪🇸" },
    // { code: "pt", label: "PT", flag: "🇵🇹" },
    // { code: "ro", label: "RO", flag: "🇷🇴" },
    // { code: "tr", label: "TR", flag: "🇹🇷" },
];

export default i18n;
