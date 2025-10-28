import { useTranslation } from 'react-i18next';
import type { HomepageTranslations } from './meta';

/**
 * Typed hook for Homepage translations
 * Provides full TypeScript autocomplete and type safety
 */
export function useHomepageTranslations(): HomepageTranslations {
    const { t } = useTranslation('projects');

    return t('homepage', { returnObjects: true }) as HomepageTranslations;
}
