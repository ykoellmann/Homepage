import type {BasePageMeta} from "../../lib/basePage.ts";

export interface ContactMethod {
    id: string;
    icon: string;
    label: string;
    value: string;
    href: string;
    color: string;
}

export interface ContactPageMeta extends BasePageMeta {
    contactMethods: ContactMethod[];
}

export const contactPageMeta: ContactPageMeta = {
    name: "Contact",
    slug: "contact",
    description: "Lass uns in Kontakt treten",
    keywords: ["Contact", "Email", "GitHub", "LinkedIn"],
    category: "Contact",
    icon: "📬",

    contactMethods: [
        {
            id: 'email',
            icon: '📧',
            label: 'Email',
            value: 'ykoellmann@icloud.com',
            href: 'mailto:ykoellmann@icloud.com',
            color: 'blue',
        },
        {
            id: 'github',
            icon: '🐙',
            label: 'GitHub',
            value: '@ykoellmann',
            href: 'https://github.com/ykoellmann',
            color: 'gray',
        },
        {
            id: 'linkedin',
            icon: '💼',
            label: 'LinkedIn',
            value: 'Yannik Köllmann',
            href: 'https://linkedin.com/in/yannikkoellmann',
            color: 'indigo',
        },
    ],
};

export const runConfig = {
    name: contactPageMeta.name,
    slug: contactPageMeta.slug,
    description: contactPageMeta.description,
    icon: contactPageMeta.icon,
};