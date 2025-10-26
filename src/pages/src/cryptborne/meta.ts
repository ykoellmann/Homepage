import type {ProjectPageMeta} from "../ProjectPageMeta.tsx";

export const cryptbornePageMeta: ProjectPageMeta = {
    name: "Cryptborne",
    slug: "cryptborne",
    description: "Roguelike Game, Unity WebGL demo",
    keywords: ["Unity", "Game", "Roguelike", "WebGL"],
    category: "Projects",
    icon: "🎮",
    url: "https://jy-studios.github.io/cryptborne/",
    debugUrl: "https://github.com/JY-Studios/cryptborne",
    technologies: ["Unity", "C#", "WebGL"],
    githubUrl: "https://github.com/JY-Studios/cryptborne",
    liveUrl: "https://jy-studios.github.io/cryptborne/",
};

// Export for backward compatibility with existing runConfig usage
export const runConfig = {
    name: cryptbornePageMeta.name,
    slug: cryptbornePageMeta.slug,
    url: cryptbornePageMeta.url,
    debugUrl: cryptbornePageMeta.debugUrl,
    description: cryptbornePageMeta.description,
    icon: cryptbornePageMeta.icon,
};
