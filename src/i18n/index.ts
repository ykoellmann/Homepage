import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import deCommon from './locales/de/common.json';
import deProjects from './locales/de/projects.json';
import enCommon from './locales/en/common.json';
import enProjects from './locales/en/projects.json';

// Get stored language or default to German
const storedLanguage = localStorage.getItem('language') || 'de';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            de: {
                common: deCommon,
                projects: deProjects
            },
            en: {
                common: enCommon,
                projects: enProjects
            }
        },
        lng: storedLanguage,
        fallbackLng: 'de',
        defaultNS: 'common',
        ns: ['common', 'projects'],
        interpolation: {
            escapeValue: false // React already escapes values
        },
        react: {
            useSuspense: false
        }
    });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;
