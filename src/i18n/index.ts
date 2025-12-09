import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import deCommon from './locales/de/common.json';
import deProjects from './locales/de/projects.json';
import deModernView from './locales/de/modernView.json';
import enCommon from './locales/en/common.json';
import enProjects from './locales/en/projects.json';
import enModernView from './locales/en/modernView.json';

// Get stored language or default to German
const storedLanguage = localStorage.getItem('language') || 'de';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            de: {
                common: deCommon,
                projects: deProjects,
                modernView: deModernView
            },
            en: {
                common: enCommon,
                projects: enProjects,
                modernView: enModernView
            }
        },
        lng: storedLanguage,
        fallbackLng: 'de',
        defaultNS: 'common',
        ns: ['common', 'projects', 'modernView'],
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
