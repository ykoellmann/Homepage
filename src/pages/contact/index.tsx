import {contactPageMeta} from "./meta.ts";
import { Mail, MapPin } from 'lucide-react';
import { GithubIcon } from '../../components/icons/GithubIcon';
import { LinkedinIcon } from '../../components/icons/LinkedinIcon';
import { useComponentTranslations } from '../../hooks/useComponentTranslations';

interface ContactTranslations {
    title: string;
    subtitle: string;
}

const iconMap = {
    'Mail': Mail,
    'Github': GithubIcon,
    'Linkedin': LinkedinIcon,
    'MapPin': MapPin,
};

export default function ContactPage() {
    const t = useComponentTranslations<ContactTranslations>('pages.contact');

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-8">
            <div className="w-full max-w-2xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        {t.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t.subtitle}
                    </p>
                </div>

                {/* Contact Methods */}
                <div className="grid gap-4">
                    {contactPageMeta.contactMethods.map((method) => {
                        const IconComponent = iconMap[method.icon as keyof typeof iconMap];
                        return (
                            <a
                                key={method.id}
                                href={method.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-blue-600 dark:text-blue-400">
                                        <IconComponent size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            {method.label}
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {method.value}
                                        </p>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors group-hover:translate-x-1 transform duration-200"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
