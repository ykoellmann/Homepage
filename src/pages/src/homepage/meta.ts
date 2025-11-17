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
        ideInterface: { title: string; description: string };
        tabSystem: { title: string; description: string };
        searchEverywhere: { title: string; description: string };
        customizableKeymaps: { title: string; description: string };
        dualViewModes: { title: string; description: string };
        i18n: { title: string; description: string };
        interactiveBackground: { title: string; description: string };
        breadcrumbNavigation: { title: string; description: string };
        responsiveDesign: { title: string; description: string };
        githubPages: { title: string; description: string };
    };
    techStack: {
        title: string;
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

const features = {
    ideInterface: { searchWeight: 10, icon: '🖥️' },
    tabSystem: { searchWeight: 10, icon: '📑' },
    searchEverywhere: { searchWeight: 9, icon: '🔍' },
    customizableKeymaps: { searchWeight: 8, icon: '⌨️' },
    dualViewModes: { searchWeight: 9, icon: '🎨' },
    i18n: { searchWeight: 7, icon: '🌍' },
    interactiveBackground: { searchWeight: 6, icon: '✨' },
    breadcrumbNavigation: { searchWeight: 7, icon: '🧭' },
    responsiveDesign: { searchWeight: 6, icon: '📱' },
    githubPages: { searchWeight: 5, icon: '🚀' },
} as const;

// Tech stack (no translation needed for names)
const techStack = [
    { name: 'React 18', searchWeight: 10, category: 'library' as const },
    { name: 'TypeScript', searchWeight: 10, category: 'library' as const },
    { name: 'Vite', searchWeight: 9, category: 'tool' as const },
    { name: 'Tailwind CSS 4', searchWeight: 9, category: 'library' as const },
    { name: 'React Router', searchWeight: 8, category: 'library' as const },
    { name: 'react-i18next', searchWeight: 7, category: 'library' as const },
    { name: 'Lucide Icons', searchWeight: 5, category: 'assets' as const },
    { name: 'GitHub Pages', searchWeight: 6, category: 'tool' as const },
] as const;

/**
 * Static page data for Homepage project.
 * Extends BasePageData which includes RunConfig.
 */
export const homepageData: BasePageData & {
    readonly features: typeof features;
    readonly techStack: typeof techStack;
} = {
    slug: 'homepage',
    category: 'Projects',
    icon: '💼',

    // RunConfig - makes this project runnable
    debugUrl: 'https://github.com/ykoellmann/homepage',

    features,
    techStack,
};

export type HomepageData = typeof homepageData;
