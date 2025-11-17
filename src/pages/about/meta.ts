/**
 * About Page Data
 *
 * This file contains:
 * - Static data (experiences, config)
 * - Translation interface (name, description)
 */

import type { Searchable } from "../../lib/basePage.ts";
import type { BasePageData } from "../../lib/pageTypes.ts";

// ============================================================================
// Translation Interface (loaded from JSON)
// ============================================================================

export interface AboutPageTranslations {
    name: string;
    description: string;
}

// ============================================================================
// Static Data (not translated)
// ============================================================================

export interface Experience extends Searchable {
    _searchableId: string;
    _searchWeight?: number;
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

export const aboutPageData: BasePageData & {
    readonly experiences: readonly Experience[];
} = {
    slug: 'about',
    category: 'About',
    icon: '👤',
    keywords: ['Lebenslauf', 'CV', 'Karriere', 'Ausbildung', 'Entwickler'],

    experiences: [
        {
            _searchableId: 'exp-monari-aushilfe-2024',
            _searchWeight: 10,
            type: 'work' as const,
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
            type: 'work' as const,
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
            type: 'work' as const,
            company: 'monari GmbH',
            logoUrl: '/logos/monari.png',
            startMonth: 'Aug. 2021',
            endMonth: 'Jan. 2024',
            position: 'Fachinformatiker Fachrichtung Anwendungsentwicklung',
            location: 'Gronau (Westfalen)',
            employmentType: 'Azubi',
            skills: ['C#', 'ASP.NET Core', 'API-Entwicklung', 'Entity Framework Core', 'SQL'],
            description: 'Ausbildung zum Fachinformatiker mit Schwerpunkt auf Backend-Entwicklung',
        },
        {
            _searchableId: 'exp-uni-jena-2024',
            _searchWeight: 10,
            type: 'education' as const,
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
            type: 'education' as const,
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

export type AboutPageData = typeof aboutPageData;

// For backward compatibility
export interface AboutPageMeta extends AboutPageData, AboutPageTranslations {
    name: string;
    description: string;
}

export const aboutPageMeta: AboutPageMeta = {
    ...aboutPageData,
    name: "About Me",  // Default fallback
    description: "Mein beruflicher Werdegang als Fachinformatiker und Informatik-Student",
};
