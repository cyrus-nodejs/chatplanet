import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import Backend from "i18next-http-backend"; // Optional: for loading translations from a server
import Backend from "i18next-http-backend"; // Optional: for loading translations from a server

import en from './en.json';
import es from './es.json';
import fr from './fr.json';

i18n
//   .use(Backend)  // Optional: if using backend to load translations
.use(Backend)
  .use(initReactI18next) // Translates in React
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    lng: "en",  // Default language
    fallbackLng: "en",  // Fallback language if the translation is not available
    interpolation: {
      escapeValue: false,  // React already escapes values by default
    },
  });

export default i18n;
