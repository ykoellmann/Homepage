/**
 * cteXecutor Project Data
 *
 * This file contains:
 * - Static data (features, shortcuts configuration)
 * - Translation interface (names, descriptions)
 * - RunConfig automatically included via BasePageData
 */

import type { BasePageData, BasePageTranslations } from '../../../lib/pageTypes';

// ============================================================================
// Translation Interface (loaded from projects.json -> ctexecutor)
// ============================================================================

export interface CteXecutorTranslations extends BasePageTranslations {
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
        general: {
            executeCode: { title: string; description: string };
            multiLanguage: { title: string; description: string };
            syntaxHighlighting: { title: string; description: string };
        };
        advanced: {
            customCommands: { title: string; description: string };
            outputFormatting: { title: string; description: string };
            errorHandling: { title: string; description: string };
        };
        ide: {
            toolWindow: { title: string; description: string };
            editorIntegration: { title: string; description: string };
            keyboardShortcuts: { title: string; description: string };
        };
    };
    shortcuts: {
        title: string;
        executeSelection: { action: string; keys: string; description: string };
        openToolWindow: { action: string; keys: string; description: string };
        clearOutput: { action: string; keys: string; description: string };
    };
    installation: {
        title: string;
        step1: string;
        step2: string;
        step3: string;
    };
}

// ============================================================================
// Static Data (NOT translated)
// ============================================================================

const features = {
    general: {
        executeCode: { searchWeight: 10, icon: '▶️' },
        multiLanguage: { searchWeight: 9, icon: '🌐' },
        syntaxHighlighting: { searchWeight: 7, icon: '🎨' },
    },
    advanced: {
        customCommands: { searchWeight: 8, icon: '⚙️' },
        outputFormatting: { searchWeight: 6, icon: '📝' },
        errorHandling: { searchWeight: 7, icon: '🚨' },
    },
    ide: {
        toolWindow: { searchWeight: 9, icon: '🪟' },
        editorIntegration: { searchWeight: 8, icon: '📄' },
        keyboardShortcuts: { searchWeight: 7, icon: '⌨️' },
    },
} as const;

const shortcuts = {
    executeSelection: { searchWeight: 10 },
    openToolWindow: { searchWeight: 9 },
    clearOutput: { searchWeight: 7 },
} as const;

/**
 * Static page data for cteXecutor project.
 * Extends BasePageData which includes RunConfig.
 */
export const cteXecutorData: BasePageData & {
    readonly version: string;
    readonly downloads: number;
    readonly features: typeof features;
    readonly shortcuts: typeof shortcuts;
} = {
    slug: 'ctexecutor',
    category: 'Projects',
    icon: '⚡',

    // RunConfig
    url: 'https://plugins.jetbrains.com/plugin/23812-ctexecutor',
    debugUrl: 'https://github.com/ykoellmann/cteXecutor',

    // IDE Plugin specific
    version: '2.0.1',
    downloads: 300,

    features,
    shortcuts,
};

export type CteXecutorData = typeof cteXecutorData;
