import type {BasePageMeta, Searchable} from "../../../lib/basePage.ts";

export interface Feature extends Searchable {
    _searchableId: string;
    _searchWeight?: number;
    icon: string;
    title: string;
    description: string;
}

export interface TechStack extends Searchable {
    _searchableId: string;
    _searchWeight?: number;
    name: string;
    category: 'engine' | 'library' | 'tool' | 'assets';
}

export interface ProjectPageMeta extends BasePageMeta {
    features: Feature[];
    techStack: TechStack[];
    githubUrl?: string;
    demoUrl?: string;
}

export const cryptbornePageMeta: ProjectPageMeta = {
    // BasePageMeta
    name: "Cryptborne",
    slug: "cryptborne",
    description: "Top-down Dungeon Crawler im mittelalterlichen Fantasy-Setting - Kämpfe dich durch prozedural generierte Dungeons mit einzigartigen Waffen",
    keywords: ["Unity", "Dungeon Crawler", "Roguelike", "Top-Down", "Fantasy", "Procedural Generation", "Game Development"],
    category: "Projects",
    icon: "⚔️",

    // Project-spezifisch
    url: "https://jy-studios.github.io/cryptborne/",
    debugUrl: "https://github.com/JY-Studios/cryptborne",

    features: [
        {
            _searchableId: 'feature-procedural-dungeons',
            _searchWeight: 10,
            icon: '🏰',
            title: 'Prozedural generierte Dungeons',
            description: 'Jedes Spiel bietet neue, zufällig generierte Dungeon-Layouts für endlosen Wiederspielwert',
        },
        {
            _searchableId: 'feature-weapon-variety',
            _searchWeight: 9,
            icon: '⚔️',
            title: 'Vielfältige Waffensysteme',
            description: 'Verschiedene Waffen mit einzigartigen Schussmustern und Spielstilen',
        },
        {
            _searchableId: 'feature-enemy-ai',
            _searchWeight: 8,
            icon: '👾',
            title: 'Dynamische Gegner-KI',
            description: 'Intelligente Feinde mit anpassungsfähigem Verhalten und verschiedenen Angriffsmustern',
        },
        {
            _searchableId: 'feature-inventory',
            _searchWeight: 7,
            icon: '🎒',
            title: 'Waffen-Hotbar & Inventar',
            description: 'Intuitives Inventarsystem mit schnellem Waffenwechsel über Hotbar',
        },
        {
            _searchableId: 'feature-smooth-movement',
            _searchWeight: 8,
            icon: '🎮',
            title: 'Flüssige Charaktersteuerung',
            description: 'Responsive Bewegungsmechaniken und präzises Combat-System',
        },
        {
            _searchableId: 'feature-medieval-aesthetic',
            _searchWeight: 6,
            icon: '🎨',
            title: 'Medieval Fantasy Ästhetik',
            description: 'Kohärente visuelle Gestaltung mit KayKit Assets im Low-Poly-Stil',
        },
    ],

    techStack: [
        {
            _searchableId: 'tech-unity6',
            _searchWeight: 10,
            name: 'Unity 6',
            category: 'engine',
        },
        {
            _searchableId: 'tech-csharp',
            _searchWeight: 9,
            name: 'C#',
            category: 'engine',
        },
        {
            _searchableId: 'tech-kaykit',
            _searchWeight: 7,
            name: 'KayKit Assets',
            category: 'assets',
        },
        {
            _searchableId: 'tech-procedural-gen',
            _searchWeight: 8,
            name: 'Procedural Generation',
            category: 'library',
        },
    ],
};

export const runConfig = {
    name: cryptbornePageMeta.name,
    slug: cryptbornePageMeta.slug,
    description: cryptbornePageMeta.description,
    icon: cryptbornePageMeta.icon,
    url: cryptbornePageMeta.url,
    debugUrl: cryptbornePageMeta.debugUrl,
};