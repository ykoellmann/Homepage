import type {BasePageMeta, Searchable} from "../../lib/basePage.ts";

// Contact information ist durchsuchbar
export interface ContactInfo extends Searchable {
    _searchableId: string;
    _searchWeight?: number;

    type: 'email' | 'phone' | 'social' | 'website';
    label: string;
    value: string;
    url?: string;
    icon?: string;
}

// Contact Page Meta - erweitert BasePageMeta
export interface ContactPageMeta extends BasePageMeta {
    // Durchsuchbare Kontakt-Infos
    contactInfo?: ContactInfo[];
}

export const contactPageMeta: ContactPageMeta = {
    // BasePageMeta Pflichtfelder
    name: "Contact",
    slug: "contact",
    description: "Kontaktiere mich",
    keywords: ["Kontakt", "Email", "Social Media"],
    category: "Contact",
    icon: "📧",

    // Kontakt-Informationen (optional - können später hinzugefügt werden)
    contactInfo: [
        // Beispiele:
        // {
        //     _searchableId: 'contact-email',
        //     _searchWeight: 10,
        //     type: 'email',
        //     label: 'Email',
        //     value: 'deine-email@example.com',
        //     url: 'mailto:deine-email@example.com',
        //     icon: '📧',
        // },
        // {
        //     _searchableId: 'contact-github',
        //     _searchWeight: 8,
        //     type: 'social',
        //     label: 'GitHub',
        //     value: 'github.com/username',
        //     url: 'https://github.com/username',
        //     icon: '💻',
        // },
    ],
};

// Export for backward compatibility with existing runConfig usage
export const runConfig = {
    name: contactPageMeta.name,
    slug: contactPageMeta.slug,
    description: contactPageMeta.description,
    icon: contactPageMeta.icon,
};
