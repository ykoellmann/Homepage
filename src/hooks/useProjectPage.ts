import { useTranslation } from 'react-i18next';
import type { ProjectWithTechStackMeta, IDEPluginProjectMeta } from '../pages/src/shared/types';

// Import meta getters
import { getCryptborneMeta, getHomepageMeta, getSatTrackMeta, getCteXecutorMeta } from '../lib/i18nMetaHelpers';

// Import translation hooks
import { useCryptborneTranslations } from '../pages/src/cryptborne/useTranslations';
import { useHomepageTranslations } from '../pages/src/homepage/useTranslations';
import { useSatTrackTranslations } from '../pages/src/SatTrack/useTranslations';
import { useCteXecutorTranslations } from '../pages/src/cteXecutor/useTranslations';

// Import translation interfaces
import type { CryptborneTranslations } from '../pages/src/cryptborne/meta';
import type { HomepageTranslations } from '../pages/src/homepage/meta';
import type { SatTrackTranslations } from '../pages/src/SatTrack/meta';
import type { CteXecutorTranslations } from '../pages/src/cteXecutor/meta';

/**
 * Generic hook for project pages
 * Automatically provides both meta data and typed translations
 *
 * Usage:
 *   const { meta, translations } = useProjectPage('cryptborne');
 */

// Overload signatures for type safety
export function useProjectPage(slug: 'cryptborne'): {
    meta: ProjectWithTechStackMeta;
    translations: CryptborneTranslations;
};
export function useProjectPage(slug: 'homepage'): {
    meta: ProjectWithTechStackMeta;
    translations: HomepageTranslations;
};
export function useProjectPage(slug: 'sattrack'): {
    meta: ProjectWithTechStackMeta;
    translations: SatTrackTranslations;
};
export function useProjectPage(slug: 'ctexecutor'): {
    meta: IDEPluginProjectMeta;
    translations: CteXecutorTranslations;
};

// Implementation
export function useProjectPage(slug: string): {
    meta: ProjectWithTechStackMeta | IDEPluginProjectMeta;
    translations: any;
} {
    const { t } = useTranslation();

    switch (slug) {
        case 'cryptborne':
            return {
                meta: getCryptborneMeta(t),
                translations: useCryptborneTranslations(),
            };

        case 'homepage':
            return {
                meta: getHomepageMeta(t),
                translations: useHomepageTranslations(),
            };

        case 'sattrack':
            return {
                meta: getSatTrackMeta(t),
                translations: useSatTrackTranslations(),
            };

        case 'ctexecutor':
            return {
                meta: getCteXecutorMeta(t),
                translations: useCteXecutorTranslations(),
            };

        default:
            throw new Error(`Unknown project slug: ${slug}`);
    }
}
