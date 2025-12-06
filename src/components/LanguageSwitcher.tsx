import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { useComponentTranslations } from '../hooks/useComponentTranslations';

interface LanguageSwitcherTranslations {
    languages: {
        de: string;
        en: string;
    };
}

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const t = useComponentTranslations<LanguageSwitcherTranslations>('components.LanguageSwitcher');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'de', name: t.languages.de, flag: '🇩🇪' },
        { code: 'en', name: t.languages.en, flag: '🇬🇧' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105"
                aria-label="Change language"
                style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(30px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(120%)',
                    border: '1.5px solid var(--glass-border)',
                    color: 'var(--text-on-glass)',
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 4px 16px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                }}
            >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="hidden sm:inline">{currentLanguage.name}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 rounded-lg overflow-hidden z-50"
                    style={{
                        background: 'var(--glass-bg-hover)',
                        backdropFilter: 'blur(40px) saturate(120%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(120%)',
                        border: '1.5px solid var(--glass-border)',
                        boxShadow: '0 8px 32px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
                    }}
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all"
                            style={{
                                background: lang.code === i18n.language
                                    ? 'rgba(255, 255, 255, 0.15)'
                                    : 'transparent',
                                color: 'var(--text-on-glass)',
                                fontWeight: lang.code === i18n.language ? '600' : '400',
                                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                            }}
                            onMouseEnter={(e) => {
                                if (lang.code !== i18n.language) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (lang.code !== i18n.language) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                            {lang.code === i18n.language && (
                                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
