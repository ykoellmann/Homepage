import { useTranslation } from 'react-i18next';
import type { CommonTranslations } from '../i18n/commonTranslations';

/**
 * Typed hook for common translations
 * Provides full TypeScript autocomplete and type safety
 *
 * Usage:
 *   const translations = useCommonTranslations();
 *   const text = translations.emptyState.shortcuts.search;
 */
export function useCommonTranslations(): CommonTranslations {
    const { t } = useTranslation('common');

    // Build the object manually by accessing each key
    // This ensures we get the full object structure
    return {
        nav: t('nav', { returnObjects: true }),
        sections: t('sections', { returnObjects: true }),
        buttons: t('buttons', { returnObjects: true }),
        languages: t('languages', { returnObjects: true }),
        emptyState: t('emptyState', { returnObjects: true }),
    } as CommonTranslations;
}
