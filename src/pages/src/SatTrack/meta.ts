/**
 * SatTrack Project Data
 *
 * This file contains:
 * - Static data (features, tech stack configuration)
 * - Translation interface (names, descriptions)
 * - RunConfig automatically included via BasePageData
 */

import type { BasePageData, BasePageTranslations } from '../../../lib/pageTypes';

// ============================================================================
// Translation Interface (loaded from projects.json -> sattrack)
// ============================================================================

export interface SatTrackTranslations extends BasePageTranslations {
    name: string;
    description: string;
    keywords: string[];
    about: {
        title: string;
        paragraph1: string;
        paragraph2: string;
        badges: {
            satellites: string;
            realtime: string;
            unity: string;
            university: string;
        };
    };
    features: {
        title: string;
        realtimeTracking: { title: string; description: string; searchWeight: number; icon: string };
        interactiveCamera: { title: string; description: string; searchWeight: number; icon: string };
        famousSatellites: { title: string; description: string; searchWeight: number; icon: string };
        orbitVisualization: { title: string; description: string; searchWeight: number; icon: string };
        heatmap: { title: string; description: string; searchWeight: number; icon: string };
        dayNight: { title: string; description: string; searchWeight: number; icon: string };
        locationSearch: { title: string; description: string; searchWeight: number; icon: string };
        timeControl: { title: string; description: string; searchWeight: number; icon: string };
        performance: { title: string; description: string; searchWeight: number; icon: string };
    };
    team: {
        title: string;
        description: string;
        university: string;
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
 * Static page data for SatTrack project.
 * Extends BasePageData which includes RunConfig.
 *
 * All feature/techStack data is now in translation files (projects.json)
 */
export const satTrackData: BasePageData = {
    slug: 'sattrack',
    category: 'Projects',
    icon: '🚀',

    // RunConfig
    debugUrl: 'https://github.com/JanVogt06/SatTrak-SatelliteVisualization',
};

export type SatTrackData = typeof satTrackData;
