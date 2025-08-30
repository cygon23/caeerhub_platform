import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files directly (for immediate implementation)
import enCommon from "../../public/locales/en/common.json";
import enHome from "../../public/locales/en/home.json";
import swCommon from "../../public/locales/sw/common.json";
import swHome from "../../public/locales/sw/home.json";
// import frCommon from "../../public/locales/fr/common.json";
// import frHome from "../../public/locales/fr/common.json";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
  },
  // sw: {
  //   common: swCommon,
  //   home: swHome,
  // },
  // fr: {
  //   common: frCommon,
  //   home: frHome,
  // },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    // Namespaces for organization
    defaultNS: "common",
    ns: ["common", "home"],
  });

export default i18n;
