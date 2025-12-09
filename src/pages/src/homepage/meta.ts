/**
 * Homepage Project Data
 *
 * This file contains:
 * - Static data (features, tech stack configuration)
 * - Translation interface (names, descriptions)
 * - RunConfig automatically included via BasePageData
 */

import type { BasePageData, BasePageTranslations } from '../../../lib/pageTypes';

// ============================================================================
// Translation Interface (loaded from projects.json -> homepage)
// ============================================================================

export interface HomepageTranslations extends BasePageTranslations {
    name: string;
    description: string;
    keywords: string[];
    about: {
        title: string;
        paragraph1: string;
        paragraph2: string;
    };
    goals: {
        title: string;
        goal1: string;
        goal2: string;
        goal3: string;
        goal4: string;
    };
    features: {
        title: string;
        ideInterface: { title: string; description: string; searchWeight: number; icon: string };
        tabSystem: { title: string; description: string; searchWeight: number; icon: string };
        searchEverywhere: { title: string; description: string; searchWeight: number; icon: string };
        customizableKeymaps: { title: string; description: string; searchWeight: number; icon: string };
        dualViewModes: { title: string; description: string; searchWeight: number; icon: string };
        i18n: { title: string; description: string; searchWeight: number; icon: string };
        interactiveBackground: { title: string; description: string; searchWeight: number; icon: string };
        breadcrumbNavigation: { title: string; description: string; searchWeight: number; icon: string };
        responsiveDesign: { title: string; description: string; searchWeight: number; icon: string };
        githubPages: { title: string; description: string; searchWeight: number; icon: string };
    };
    techStack: {
        title: string;
        items: Array<{ name: string; searchWeight: number; category: string }>;
    };
    architecture: {
        title: string;
        fileTree: { title: string; description: string };
        routing: { title: string; description: string };
        persistence: { title: string; description: string };
        search: { title: string; description: string };
    };
}

// ============================================================================
// Static Data (NOT translated)
// ============================================================================

/**
 * Static page data for Homepage project.
 * Extends BasePageData which includes RunConfig.
 *
 * All feature/techStack data is now in translation files (projects.json)
 */
export const homepageData: BasePageData = {
    slug: 'homepage',
    category: 'Projects',
    icon: '💼',

    // RunConfig - makes this project runnable
    debugUrl: 'https://github.com/ykoellmann/homepage',
};

export type HomepageData = typeof homepageData;
