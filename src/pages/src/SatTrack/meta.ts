import type {ProjectPageMeta} from "../ProjectPageMeta.tsx";


export const satTrackPageMeta: ProjectPageMeta = {
    name: "SatTrack",
    slug: "sattrack",
    description: "Satellite Visualization",
    keywords: ["Satellite", "Visualization", "3D", "Space"],
    category: "Projects",
    icon: "🛰️",
    debugUrl: "https://github.com/JanVogt06/SatTrak-SatelliteVisualization",
    githubUrl: "https://github.com/JanVogt06/SatTrak-SatelliteVisualization",
};

// Export for backward compatibility with existing runConfig usage
export const runConfig = {
    name: satTrackPageMeta.name,
    slug: satTrackPageMeta.slug,
    debugUrl: satTrackPageMeta.debugUrl,
    description: satTrackPageMeta.description,
    icon: satTrackPageMeta.icon,
};
