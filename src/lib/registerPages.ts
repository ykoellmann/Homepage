import type { TFunction } from 'i18next';
import { searchService } from './searchService';
import { aboutPageData } from '../pages/about/meta';
import { contactPageData } from '../pages/contact/meta';
import { cryptborneData } from '../pages/src/cryptborne/meta';
import { homepageData } from '../pages/src/homepage/meta';
import { satTrackData } from '../pages/src/SatTrack/meta';
import { cteXecutorData } from '../pages/src/cteXecutor/meta';

/**
 * Registers all pages with the search service using current translations
 * Should be called on app init and when language changes
 */
export function registerAllPages(t: TFunction) {
    searchService.clearPages();

    // Get translations for About and Contact pages
    const aboutTranslations = t('pages.about', { returnObjects: true }) as any;
    const contactTranslations = t('pages.contact', { returnObjects: true }) as any;

    // Register About and Contact pages with translations
    searchService.registerPage({ ...aboutPageData, ...aboutTranslations } as any);
    searchService.registerPage({ ...contactPageData, ...contactTranslations } as any);

    // Register all projects with translations
    const allProjectData = [cryptborneData, homepageData, satTrackData, cteXecutorData];

    allProjectData.forEach(projectData => {
        // Get translations for this project (from 'projects' namespace)
        const translations = t(`projects:${projectData.slug}`, { returnObjects: true });

        // Merge data with translations and register
        searchService.registerPage({ ...projectData, ...translations } as any);
    });
}
