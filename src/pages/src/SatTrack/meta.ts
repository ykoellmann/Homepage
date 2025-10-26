import type { ProjectWithTechStackMeta } from "../shared/types.ts";

export const satTrackPageMeta: ProjectWithTechStackMeta = {
    // BasePageMeta
    name: "SatTrak",
    slug: "sattrack",
    description: "Interaktive 3D-Satelliten-Visualisierung mit Unity und Cesium - Verfolge über 5000 Satelliten in Echtzeit auf einem virtuellen Globus",
    keywords: ["Unity", "Cesium", "Satelliten", "3D", "Visualisierung", "Echtzeit", "GPS", "Orbit", "Space"],
    category: "Projects",
    icon: "🚀",

    // Project-spezifisch
    debugUrl: "https://github.com/JanVogt06/SatTrak-SatelliteVisualization",

    features: [
        {
            _searchableId: 'feature-realtime-tracking',
            _searchWeight: 10,
            icon: '🛰️',
            title: 'Echtzeit-Satellitenverfolgung',
            description: 'Visualisierung von über 5000 aktiven Satelliten mit TLE-Daten von Celestrak',
        },
        {
            _searchableId: 'feature-interactive-camera',
            _searchWeight: 9,
            icon: '📹',
            title: 'Interaktive Kamerasteuerung',
            description: 'Nahtloser Übergang zwischen Weltraum- und Erdansicht mit Zoom-Slider',
        },
        {
            _searchableId: 'feature-famous-satellites',
            _searchWeight: 8,
            icon: '⭐',
            title: 'Famous Satellites',
            description: 'Spezielle 3D-Modelle für berühmte Satelliten wie ISS, Hubble Teleskop',
        },
        {
            _searchableId: 'feature-orbit-visualization',
            _searchWeight: 9,
            icon: '🌍',
            title: 'Orbit-Visualisierung',
            description: 'Darstellung von Satelliten-Orbits mit verschiedenen Farben (bis zu 9 gleichzeitig)',
        },
        {
            _searchableId: 'feature-heatmap',
            _searchWeight: 7,
            icon: '🔥',
            title: 'Heatmap-Visualisierung',
            description: 'GPU-basierte Darstellung der Satellitendichte auf der Erdoberfläche',
        },
        {
            _searchableId: 'feature-day-night',
            _searchWeight: 8,
            icon: '🌓',
            title: 'Tag/Nacht-System',
            description: 'Realistische Beleuchtung mit dynamischem Tag/Nacht-Zyklus',
        },
        {
            _searchableId: 'feature-location-search',
            _searchWeight: 7,
            icon: '🔍',
            title: 'Ortssuche',
            description: 'Schnelle Navigation zu über 1000 Städten weltweit mit GeoNames-Datenbank',
        },
        {
            _searchableId: 'feature-time-control',
            _searchWeight: 8,
            icon: '⏱️',
            title: 'Zeitsteuerung',
            description: 'Zeitraffer (0x - 1000x) mit Zeit-Slider und Zoom-Funktion',
        },
        {
            _searchableId: 'feature-performance',
            _searchWeight: 7,
            icon: '⚡',
            title: 'Performance-optimiert',
            description: 'GPU-Instancing und Unity Job-System für flüssige Darstellung',
        },
    ],

    techStack: [
        {
            _searchableId: 'tech-unity',
            _searchWeight: 10,
            name: 'Unity 2022.3 LTS',
            category: 'engine',
        },
        {
            _searchableId: 'tech-cesium',
            _searchWeight: 10,
            name: 'Cesium for Unity',
            category: 'library',
        },
        {
            _searchableId: 'tech-urp',
            _searchWeight: 7,
            name: 'Universal Render Pipeline',
            category: 'engine',
        },
        {
            _searchableId: 'tech-sgp4',
            _searchWeight: 9,
            name: 'SGP4 Orbit Propagation',
            category: 'library',
        },
        {
            _searchableId: 'tech-job-system',
            _searchWeight: 8,
            name: 'Unity Job System',
            category: 'engine',
        },
        {
            _searchableId: 'tech-celestrak',
            _searchWeight: 8,
            name: 'CelesTrak TLE Data',
            category: 'data',
        },
        {
            _searchableId: 'tech-geonames',
            _searchWeight: 6,
            name: 'GeoNames Database',
            category: 'data',
        },
        {
            _searchableId: 'tech-git-lfs',
            _searchWeight: 5,
            name: 'Git LFS',
            category: 'tool',
        },
    ],
};

export const runConfig = {
    name: satTrackPageMeta.name,
    slug: satTrackPageMeta.slug,
    description: satTrackPageMeta.description,
    icon: satTrackPageMeta.icon,
    debugUrl: satTrackPageMeta.debugUrl,
};