import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18nextHttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .use(i18nextHttpBackend)
  .init({
    // lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    backend: {
      // The path now includes /api/ as defined in your Express server
      loadPath: "http://localhost:3000/api/translate/{{lng}}", // <-- UPDATE THIS URL
    },
    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // Caches the language in localStorage
      caches: ['localStorage'],
    }
  });

export default i18n;