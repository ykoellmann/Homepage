import type { TFunction } from 'i18next';
import { searchService } from './searchService';
import { getCryptborneMeta, getSatTrackMeta, getCteXecutorMeta, getHomepageMeta } from './i18nMetaHelpers';
import { aboutPageMeta } from '../pages/about/meta';
import { contactPageMeta } from '../pages/contact/meta';

/**
 * Registers all pages with the search service using current translations
 * Should be called on app init and when language changes
 */
export function registerAllPages(t: TFunction) {
    searchService.clearPages();

    // Register pages with translations
    searchService.registerPage(aboutPageMeta);
    searchService.registerPage(getCryptborneMeta(t));
    searchService.registerPage(getSatTrackMeta(t));
    searchService.registerPage(getCteXecutorMeta(t));
    searchService.registerPage(getHomepageMeta(t));
    searchService.registerPage(contactPageMeta);
}
