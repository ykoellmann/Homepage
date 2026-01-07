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
        proceduralDungeons: { title: string; description: string; searchWeight: number; icon: string };
        weaponVariety: { title: string; description: string; searchWeight: number; icon: string };
        enemyAi: { title: string; description: string; searchWeight: number; icon: string };
        inventory: { title: string; description: string; searchWeight: number; icon: string };
        smoothMovement: { title: string; description: string; searchWeight: number; icon: string };
        medievalAesthetic: { title: string; description: string; searchWeight: number; icon: string };
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
        items: Array<{ name: string; searchWeight: number; category: string }>;
    };
}

// ============================================================================
// Static Data (NOT translated)
// ============================================================================

/**
 * Static page data for Cryptborne.
 * Extends BasePageData which includes RunConfig.
 *
 * All feature/techStack data is now in translation files (projects.json)
 * Since this has url/debugUrl, it's automatically "runnable" in IDE controls!
 */
export const cryptborneData: BasePageData = {
    // Base page info
    slug: 'cryptborne',
    category: 'Projects',
    icon: '⚔️',

    // RunConfig (inherited from BasePageData interface)
    // Having url/debugUrl makes this project appear in IDE run controls automatically
    url: 'https://jy-studios.github.io/cryptborne/',
    debugUrl: 'https://github.com/JY-Studios/cryptborne',
};

export type CryptborneData = typeof cryptborneData;

