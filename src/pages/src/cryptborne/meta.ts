/**
 * Cryptborne Project Meta
 *
 * This file defines:
 * 1. TypeScript interfaces for JSON translation structure
 * 2. Non-translatable metadata (URLs, search weights, icons)
 */

// ============================================================================
// Translation Structure (matches projects.json structure)
// ============================================================================

export interface CryptborneTranslations {
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
        proceduralDungeons: {
            title: string;
            description: string;
        };
        weaponVariety: {
            title: string;
            description: string;
        };
        enemyAi: {
            title: string;
            description: string;
        };
        inventory: {
            title: string;
            description: string;
        };
        smoothMovement: {
            title: string;
            description: string;
        };
        medievalAesthetic: {
            title: string;
            description: string;
        };
    };
    gameplayHighlights: {
        title: string;
        modularDungeons: {
            title: string;
            description: string;
        };
        weaponVariety: {
            title: string;
            description: string;
        };
        combatSystem: {
            title: string;
            description: string;
        };
        lowPolyAesthetic: {
            title: string;
            description: string;
        };
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
// Non-Translatable Metadata
// ============================================================================

export const cryptborneMeta = {
    slug: 'cryptborne' as const,
    category: 'Projects' as const,
    icon: '⚔️',
    url: 'https://jy-studios.github.io/cryptborne/',
    debugUrl: 'https://github.com/JY-Studios/cryptborne',

    // Feature search configuration
    features: {
        proceduralDungeons: { searchWeight: 10, icon: '🏰' },
        weaponVariety: { searchWeight: 9, icon: '⚔️' },
        enemyAi: { searchWeight: 8, icon: '👾' },
        inventory: { searchWeight: 7, icon: '🎒' },
        smoothMovement: { searchWeight: 8, icon: '🎮' },
        medievalAesthetic: { searchWeight: 6, icon: '🎨' },
    },

    // Tech stack search configuration
    techStack: {
        unity6: { searchWeight: 10, category: 'engine' as const },
        csharp: { searchWeight: 9, category: 'engine' as const },
        kaykit: { searchWeight: 7, category: 'assets' as const },
        proceduralGen: { searchWeight: 8, category: 'library' as const },
    },
} as const;

export type CryptborneMeta = typeof cryptborneMeta;

// Export for runConfig compatibility
export const runConfig = {
    name: 'Cryptborne',
    url: cryptborneMeta.url,
    debugUrl: cryptborneMeta.debugUrl,
};
