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
    features: {
        cteManagement: {
            title: string;
            cteDetection: { title: string; description: string; searchWeight: number; icon: string };
            visualHighlighting: { title: string; description: string; searchWeight: number; icon: string };
            smartExecution: { title: string; description: string; searchWeight: number; icon: string };
            copyClipboard: { title: string; description: string; searchWeight: number; icon: string };
        };
        executeFromHere: {
            title: string;
            badge: string;
            executeFromHere: { title: string; description: string; searchWeight: number; icon: string };
            dependencyResolution: { title: string; description: string; searchWeight: number; icon: string };
            smartDetection: { title: string; description: string; searchWeight: number; icon: string };
        };
        productivity: {
            title: string;
            keyboardShortcuts: { title: string; description: string; searchWeight: number; icon: string };
            minimalUi: { title: string; description: string; searchWeight: number; icon: string };
            autoCleanup: { title: string; description: string; searchWeight: number; icon: string };
            lightweight: { title: string; description: string; searchWeight: number; icon: string };
        };
    };
    shortcuts: {
        title: string;
        runCtQuery: { action: string; keys: string; description: string; searchWeight: number };
        executeFromHere: { action: string; keys: string; description: string; searchWeight: number };
        copySql: { action: string; keys: string; description: string; searchWeight: number };
        editAndRun: { action: string; keys: string; description: string; searchWeight: number };
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
// Static Data (NOT translated)
// ============================================================================

/**
 * Static page data for cteXecutor project.
 * Extends BasePageData which includes RunConfig.
 *
 * All feature/shortcuts data is now in translation files (projects.json)
 */
export const cteXecutorData: BasePageData & {
    readonly version: string;
    readonly downloads: number;
} = {
    slug: 'ctexecutor',
    category: 'Projects',
    icon: '⚡',

    // RunConfig
    url: 'https://plugins.jetbrains.com/plugin/27835-ctexecutor',
    debugUrl: 'https://github.com/ykoellmann/cteXecutor',

    // IDE Plugin specific
    version: '2.0.1',
    downloads: 300,
};

export type CteXecutorData = typeof cteXecutorData;
