/**
 * cteXecutor Project Meta
 *
 * This file defines:
 * 1. TypeScript interfaces for JSON translation structure
 * 2. Non-translatable metadata (URLs, search weights, icons)
 */

// ============================================================================
// Translation Structure (matches projects.json structure)
// ============================================================================

export interface CteXecutorTranslations {
    name: string;
    description: string;
    keywords: string[];
    features: {
        cteManagement: {
            title: string;
            cteDetection: {
                title: string;
                description: string;
            };
            visualHighlighting: {
                title: string;
                description: string;
            };
            smartExecution: {
                title: string;
                description: string;
            };
            copyClipboard: {
                title: string;
                description: string;
            };
        };
        executeFromHere: {
            title: string;
            badge: string;
            executeFromHere: {
                title: string;
                description: string;
            };
            dependencyResolution: {
                title: string;
                description: string;
            };
            smartDetection: {
                title: string;
                description: string;
            };
        };
        productivity: {
            title: string;
            keyboardShortcuts: {
                title: string;
                description: string;
            };
            minimalUi: {
                title: string;
                description: string;
            };
            autoCleanup: {
                title: string;
                description: string;
            };
            lightweight: {
                title: string;
                description: string;
            };
        };
    };
    shortcuts: {
        title: string;
        runCtQuery: {
            action: string;
            keys: string;
            description: string;
        };
        executeFromHere: {
            action: string;
            keys: string;
            description: string;
        };
        copySql: {
            action: string;
            keys: string;
            description: string;
        };
        editAndRun: {
            action: string;
            keys: string;
            description: string;
        };
    };
    installation: {
        title: string;
        step1: string;
        step2: string;
        step3: string;
        step4: string;
        step5: string;
    };
    support: {
        title: string;
        intro: string;
        githubStar: string;
        marketplaceReview: string;
        bugReports: string;
        featureIdeas: string;
    };
}

// ============================================================================
// Non-Translatable Metadata
// ============================================================================

export const cteXecutorMeta = {
    slug: 'ctexecutor' as const,
    category: 'Projects' as const,
    icon: '🚀',
    url: 'https://plugins.jetbrains.com/plugin/27835-ctexecutor/',
    debugUrl: 'https://github.com/ykoellmann/cteXecutor',
    version: '2.0.0',
    downloads: '100+',

    // Feature search configuration by category
    features: {
        cteManagement: {
            cteDetection: { searchWeight: 10, icon: '🎯' },
            visualHighlighting: { searchWeight: 9, icon: '✨' },
            smartExecution: { searchWeight: 10, icon: '⚡' },
            copyClipboard: { searchWeight: 7, icon: '📋' },
        },
        executeFromHere: {
            executeFromHere: { searchWeight: 10, icon: '🎯' },
            dependencyResolution: { searchWeight: 9, icon: '🔗' },
            smartDetection: { searchWeight: 8, icon: '🧠' },
        },
        productivity: {
            keyboardShortcuts: { searchWeight: 8, icon: '⌨️' },
            minimalUi: { searchWeight: 6, icon: '🎨' },
            autoCleanup: { searchWeight: 7, icon: '🧹' },
            lightweight: { searchWeight: 6, icon: '🪶' },
        },
    },

    // Shortcut search configuration
    shortcuts: {
        runCtQuery: { searchWeight: 10 },
        executeFromHere: { searchWeight: 10 },
        copySql: { searchWeight: 8 },
        editAndRun: { searchWeight: 8 },
    },
} as const;

export type CteXecutorMeta = typeof cteXecutorMeta;

// Export for runConfig compatibility
export const runConfig = {
    name: 'cteXecutor',
    url: cteXecutorMeta.url,
    debugUrl: cteXecutorMeta.debugUrl,
};
