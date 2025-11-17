/**
 * Cryptborne Project Data
 *
 * This file contains:
 * - Static data (URLs, icons, search weights) - NOT translated
 * - Translation interface (names, descriptions) - Loaded from projects.json
 * - RunConfig is automatically included via BasePageData
 */

import type { BasePageData, BasePageTranslations } from '../../../lib/pageTypes';

// ============================================================================
// Translation Interface (loaded from projects.json -> cryptborne)
// ============================================================================

export interface CryptborneTranslations extends BasePageTranslations {
    name: string;
    description: string;
    keywords: string[];
    about: {
        title: string;
        paragraph1: string;
        paragraph2: string;
    };
    features: {
        title: string;
        proceduralDungeons: { title: string; description: string };
        weaponVariety: { title: string; description: string };
        enemyAi: { title: string; description: string };
        inventory: { title: string; description: string };
        smoothMovement: { title: string; description: string };
        medievalAesthetic: { title: string; description: string };
    };
    gameplayHighlights: {
        title: string;
        modularDungeons: { title: string; description: string };
        weaponVariety: { title: string; description: string };
        combatSystem: { title: string; description: string };
        lowPolyAesthetic: { title: string; description: string };
    };
    techStack: {
        title: string;
        unity6: string;
        csharp: string;
        kaykit: string;
        proceduralGen: string;
    };
}

// ============================================================================
// Static Data (NOT translated)
// ============================================================================

// Feature search configuration (icons, search weights)
const features = {
    proceduralDungeons: { searchWeight: 10, icon: '🏰' },
    weaponVariety: { searchWeight: 9, icon: '⚔️' },
    enemyAi: { searchWeight: 8, icon: '👾' },
    inventory: { searchWeight: 7, icon: '🎒' },
    smoothMovement: { searchWeight: 8, icon: '🎮' },
    medievalAesthetic: { searchWeight: 6, icon: '🎨' },
} as const;

// Tech stack search configuration (categories, weights)
const techStack = {
    unity6: { searchWeight: 10, category: 'engine' as const },
    csharp: { searchWeight: 9, category: 'engine' as const },
    kaykit: { searchWeight: 7, category: 'assets' as const },
    proceduralGen: { searchWeight: 8, category: 'library' as const },
} as const;

/**
 * Static page data for Cryptborne.
 * Extends BasePageData which includes RunConfig.
 *
 * Since this has url/debugUrl, it's automatically "runnable" in IDE controls!
 * No need for separate runConfig export.
 */
export const cryptborneData: BasePageData & {
    readonly features: typeof features;
    readonly techStack: typeof techStack;
} = {
    // Base page info
    slug: 'cryptborne',
    category: 'Projects',
    icon: '⚔️',

    // RunConfig (inherited from BasePageData interface)
    // Having url/debugUrl makes this project appear in IDE run controls automatically
    url: 'https://jy-studios.github.io/cryptborne/',
    debugUrl: 'https://github.com/JY-Studios/cryptborne',

    // Project-specific data
    features,
    techStack,
};

export type CryptborneData = typeof cryptborneData;

// ============================================================================
// Usage in component:
// ============================================================================
// const data = usePageData<typeof cryptborneData, CryptborneTranslations>(
//     cryptborneData,
//     'cryptborne',
//     'projects'
// );
//
// // RunConfig is automatically available:
// const runConfig = getRunConfig(data);
// // { name: "Cryptborne", url: "https://...", debugUrl: "https://..." }
