/**
 * SatTrack Project Meta
 *
 * This file defines:
 * 1. TypeScript interfaces for JSON translation structure
 * 2. Non-translatable metadata (URLs, search weights, icons)
 */

// ============================================================================
// Translation Structure (matches projects.json structure)
// ============================================================================

export interface SatTrackTranslations {
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
        realtimeTracking: {
            title: string;
            description: string;
        };
        interactiveCamera: {
            title: string;
            description: string;
        };
        famousSatellites: {
            title: string;
            description: string;
        };
        orbitVisualization: {
            title: string;
            description: string;
        };
        heatmap: {
            title: string;
            description: string;
        };
        dayNight: {
            title: string;
            description: string;
        };
        locationSearch: {
            title: string;
            description: string;
        };
        timeControl: {
            title: string;
            description: string;
        };
        performance: {
            title: string;
            description: string;
        };
    };
    team: {
        title: string;
        description: string;
        university: string;
    };
    techStack: {
        title: string;
    };
}

// ============================================================================
// Non-Translatable Metadata
// ============================================================================

export const satTrackMeta = {
    slug: 'sattrack' as const,
    category: 'Projects' as const,
    icon: '🚀',
    debugUrl: 'https://github.com/JanVogt06/SatTrak-SatelliteVisualization',

    // Feature search configuration
    features: {
        realtimeTracking: { searchWeight: 10, icon: '🛰️' },
        interactiveCamera: { searchWeight: 9, icon: '📹' },
        famousSatellites: { searchWeight: 8, icon: '⭐' },
        orbitVisualization: { searchWeight: 9, icon: '🌍' },
        heatmap: { searchWeight: 7, icon: '🔥' },
        dayNight: { searchWeight: 8, icon: '🌓' },
        locationSearch: { searchWeight: 7, icon: '🔍' },
        timeControl: { searchWeight: 8, icon: '⏱️' },
        performance: { searchWeight: 7, icon: '⚡' },
    },

    // Tech stack (no translation needed)
    techStack: [
        { name: 'Unity 2022.3 LTS', searchWeight: 10, category: 'engine' as const },
        { name: 'Cesium for Unity', searchWeight: 10, category: 'library' as const },
        { name: 'Universal Render Pipeline', searchWeight: 7, category: 'engine' as const },
        { name: 'SGP4 Orbit Propagation', searchWeight: 9, category: 'library' as const },
        { name: 'Unity Job System', searchWeight: 8, category: 'engine' as const },
        { name: 'CelesTrak TLE Data', searchWeight: 8, category: 'data' as const },
        { name: 'GeoNames Database', searchWeight: 6, category: 'data' as const },
        { name: 'Git LFS', searchWeight: 5, category: 'tool' as const },
    ],
} as const;

export type SatTrackMeta = typeof satTrackMeta;

// Export for runConfig compatibility
export const runConfig = {
    name: 'SatTrack',
    debugUrl: satTrackMeta.debugUrl,
};
