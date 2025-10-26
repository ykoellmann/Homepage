import type {BasePageMeta, Searchable} from "../../lib/basePage.ts";

// Experience ist durchsuchbar
export interface Experience extends Searchable {
    _searchableId: string;
    _searchWeight?: number;

    // Deine eigenen Felder - komplett frei!
    type: 'work' | 'education';
    company: string;
    logoUrl?: string;
    startMonth: string;
    endMonth: string;
    position: string;
    location?: string;
    employmentType?: string;
    skills: string[];
    description?: string;
    achievements?: string[];
}

// About Page Meta - erweitert BasePageMeta
export interface AboutPageMeta extends BasePageMeta {
    // Deine eigenen durchsuchbaren Collections
    experiences: Experience[];
}

export const aboutPageMeta: AboutPageMeta = {
    // BasePageMeta Pflichtfelder
    name: "About Me",
    slug: "about",
    description: "Mein beruflicher Werdegang als Fachinformatiker und Informatik-Student",
    keywords: ["Lebenslauf", "CV", "Karriere", "Ausbildung", "Entwickler"],
    category: "About",
    icon: "👤",

    // Deine Experiences
    experiences: [
        {
            _searchableId: 'exp-monari-aushilfe-2024',
            _searchWeight: 10, // Aktueller Job = wichtiger
            type: 'work',
            company: 'monari GmbH',
            logoUrl: '/logos/monari.png',
            startMonth: 'Okt. 2024',
            endMonth: 'Heute',
            position: 'Aushilfe im Bereich IT',
            location: 'Remote',
            skills: ['C#', 'ASP.NET Core', 'API-Entwicklung', 'Entity Framework Core', 'SQL'],
            description: 'Unterstützung bei der Entwicklung und Wartung von Backend-Systemen',
        },
        {
            _searchableId: 'exp-monari-entwickler-2024',
            _searchWeight: 9,
            type: 'work',
            company: 'monari GmbH',
            logoUrl: '/logos/monari.png',
            startMonth: 'Jan. 2024',
            endMonth: 'Okt. 2024',
            position: 'IT-Entwickler',
            location: 'Gronau',
            employmentType: 'Vollzeit',
            skills: ['C#', 'ASP.NET Core', 'API-Entwicklung', 'Entity Framework Core', 'SQL', 'TypeScript', 'HTML5', 'Angular'],
            description: 'Full-Stack Entwicklung mit Fokus auf Backend-APIs und Frontend-Integration',
        },
        {
            _searchableId: 'exp-monari-ausbildung-2021',
            _searchWeight: 8,
            type: 'work',
            company: 'monari GmbH',
            logoUrl: '/logos/monari.png',
            startMonth: 'Aug. 2021',
            endMonth: 'Jan. 2024',
            position: 'Fachinformatiker Fachrichtung Anwendungsentwicklung',
            location: 'Gronau (Westfalen)',
            employmentType: 'Azubi',
            skills: ['ASP.NET Core', 'API-Entwicklung', 'Entity Framework Core', 'SQL'],
            description: 'Ausbildung zum Fachinformatiker mit Schwerpunkt auf Backend-Entwicklung',
        },
        {
            _searchableId: 'exp-uni-jena-2024',
            _searchWeight: 10,
            type: 'education',
            company: 'Friedrich-Schiller-Universität Jena',
            startMonth: 'Okt. 2024',
            endMonth: 'Sept. 2027',
            position: 'Bachelor of Science - BS, Informatik',
            skills: ['OpenGL', 'Bash', 'C++', 'C', 'C#', 'Unity', 'Java'],
            description: 'Studium der Informatik mit Fokus auf Computergrafik und Softwareentwicklung',
        },
        {
            _searchableId: 'exp-hermann-emanuel-2018',
            _searchWeight: 5,
            type: 'education',
            company: 'Hermann-Emanuel-Berufskolleg des Kreises Steinfurt',
            startMonth: 'Aug. 2018',
            endMonth: 'Aug. 2021',
            position: 'Abitur',
            location: 'Gronau (Westfalen), Nordrhein-Westfalen, Deutschland',
            skills: [],
            description: 'Allgemeine Hochschulreife',
        },
    ],
};

// Export for backward compatibility with existing runConfig usage
export const runConfig = {
    name: aboutPageMeta.name,
    slug: aboutPageMeta.slug,
    description: aboutPageMeta.description,
    icon: aboutPageMeta.icon,
};
