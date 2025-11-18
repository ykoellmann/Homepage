import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useViewMode } from '../contexts/ViewModeContext';

export const ImpressumPage = () => {
    const { t } = useTranslation();
    const { viewMode } = useViewMode();

    const handleGoBack = () => {
        if (viewMode === 'modern') {
            window.location.href = '/';
        } else {
            window.location.href = '/ide';
        }
    };

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-300 dark:border-gray-700 pb-2">
                {title}
            </h2>
            <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {children}
            </div>
        </section>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900" style={{ position: 'fixed', inset: 0, overflow: 'auto', width: '100vw', height: '100vh' }}>
            {/* Header */}
            <header className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="px-8 py-4 flex items-center gap-4">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>{t('common:buttons.back', 'Zurück')}</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="px-8 py-12">
                {/* Title */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('pages.impressum.title')}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('pages.impressum.subtitle')}
                    </p>
                </div>

                {/* Angaben gemäß § 5 TMG */}
                <Section title={t('pages.impressum.provider')}>
                    <div className="space-y-1">
                        <p>Yannik Köllmann</p>
                        <p>{'{STRASSE_UND_HAUSNUMMER}'}</p>
                        <p>{'{PLZ_UND_ORT}'}</p>
                    </div>
                </Section>

                {/* Kontakt */}
                <Section title={t('pages.impressum.contact')}>
                    <div>
                        <span className="font-medium">{t('pages.impressum.email')}:</span>{' '}
                        <a
                            href="mailto:ykoellmann@icloud.com"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            ykoellmann@icloud.com
                        </a>
                    </div>
                </Section>

                {/* Haftungsausschluss */}
                <Section title={t('pages.impressum.disclaimer')}>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                {t('pages.impressum.disclaimerTitle')}
                            </h3>
                            <p className="text-sm">
                                {t('pages.impressum.disclaimerContent')}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                {t('pages.impressum.disclaimerExternal')}
                            </h3>
                            <p className="text-sm">
                                {t('pages.impressum.disclaimerExternalContent')}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                {t('pages.impressum.disclaimerCopyright')}
                            </h3>
                            <p className="text-sm">
                                {t('pages.impressum.disclaimerCopyrightContent')}
                            </p>
                        </div>
                    </div>
                </Section>

                {/* Footer note */}
                <div className="mt-12 pt-6 border-t border-gray-300 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {t('common:legal.tmgNote', 'Diese Seite entspricht den Anforderungen des § 5 TMG (Telemediengesetz)')}
                    </p>
                </div>
            </main>
        </div>
    );
};
