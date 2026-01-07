/**
 * Contact Page Data
 *
 * This file contains:
 * - Static data (contact methods)
 * - Translation interface (title, subtitle)
 */

import type { BasePageData, BasePageTranslations } from "../../lib/pageTypes";

// ============================================================================
// Translation Interface (loaded from common.json -> pages.contact)
// ============================================================================

export interface ContactPageTranslations extends BasePageTranslations {
    title: string;
    subtitle: string;
}

// ============================================================================
// Static Data (NOT translated)
// ============================================================================

interface ContactMethod {
    id: string;
    icon: string;
    label: string;
    value: string;
    href: string;
}

/**
 * Contact page data.
 * Extends BasePageData (includes RunConfig).
 *
 * No url/debugUrl, so this page is NOT runnable in IDE controls.
 */
export const contactPageData: BasePageData & {
    readonly contactMethods: readonly ContactMethod[];
} = {
    slug: 'contact',
    category: 'Pages',
    icon: '📧',
    keywords: ['Email', 'LinkedIn', 'GitHub', 'Contact', 'Reach out'],

    contactMethods: [
        {
            id: 'email',
            icon: 'Mail',
            label: 'Email',
            value: 'contact@koellmann.dev',
            href: 'mailto:contact@koellmann.dev',
        },
        {
            id: 'location',
            icon: 'MapPin',
            label: 'Standort',
            value: '07747 Jena, Deutschland',
            href: 'https://www.google.com/maps/place/07747+Jena',
        },
        {
            id: 'github',
            icon: 'Github',
            label: 'GitHub',
            value: 'ykoellmann',
            href: 'https://github.com/ykoellmann',
        },
        {
            id: 'linkedin',
            icon: 'Linkedin',
            label: 'LinkedIn',
            value: 'yannikkoellmann',
            href: 'https://www.linkedin.com/in/yannikkoellmann/',
        },
    ],
};

export type ContactPageData = typeof contactPageData;

// For backward compatibility
export const contactPageMeta = {
    ...contactPageData,
    name: "Contact",  // Default fallback
    description: "Get in touch with me",
};
