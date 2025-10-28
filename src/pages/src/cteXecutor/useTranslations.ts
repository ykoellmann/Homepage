import { useTranslation } from 'react-i18next';
import type { CteXecutorTranslations } from './meta';

/**
 * Typed hook for cteXecutor translations
 * Provides full TypeScript autocomplete and type safety
 */
export function useCteXecutorTranslations(): CteXecutorTranslations {
    const { t } = useTranslation('projects');

    return t('ctexecutor', { returnObjects: true }) as CteXecutorTranslations;
}
