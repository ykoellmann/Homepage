import { useTranslation } from 'react-i18next';
import type { SatTrackTranslations } from './meta';

/**
 * Typed hook for SatTrack translations
 * Provides full TypeScript autocomplete and type safety
 */
export function useSatTrackTranslations(): SatTrackTranslations {
    const { t } = useTranslation('projects');

    return t('sattrack', { returnObjects: true }) as SatTrackTranslations;
}
