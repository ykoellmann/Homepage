import { useTranslation } from 'react-i18next';
import type { CryptborneTranslations } from './meta';

/**
 * Typed hook for Cryptborne translations
 * Provides full TypeScript autocomplete and type safety
 */
export function useCryptborneTranslations(): CryptborneTranslations {
    const { t } = useTranslation('projects');

    // This casts the t function result to our typed interface
    // The structure is guaranteed by the interface definition in meta.ts
    return t('cryptborne', { returnObjects: true }) as CryptborneTranslations;
}
