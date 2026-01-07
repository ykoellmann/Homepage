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
        <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b-2 border-blue-100 dark:border-slate-700">
                {title}
            </h2>
            <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {children}
            </div>
        </section>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900" style={{ position: 'fixed', inset: 0, overflow: 'auto', width: '100vw', height: '100vh' }}>
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-blue-100 dark:border-slate-700 shadow-sm">
                <div className="max-w-4xl mx-auto px-8 py-5 flex items-center gap-4">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:gap-3"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">{t('common:buttons.back', 'Zurück')}</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-8 py-16">
                {/* Title */}
                <div className="mb-16 text-center">
                    <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-slate-700 dark:from-blue-400 dark:to-slate-200 bg-clip-text text-transparent">
                        {t('pages.impressum.title')}
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        {t('pages.impressum.subtitle')}
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-blue-100/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 p-10 space-y-12">
                    {/* Angaben gemäß § 5 TMG */}
                    <Section title={t('pages.impressum.provider')}>
                        <div className="space-y-2">
                            <p className="font-semibold text-slate-900 dark:text-white">Yannik Köllmann</p>
                        </div>
                    </Section>

                    {/* Kontakt */}
                    <Section title={t('pages.impressum.contact')}>
                        <div>
                            <span className="font-medium">{t('pages.impressum.email')}:</span>{' '}
                            <a
                                href="mailto:contact@koellmann.dev"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium hover:underline decoration-2 underline-offset-2"
                            >
                                contact@koellmann.dev
                            </a>
                        </div>
                    </Section>

                    {/* Haftungsausschluss */}
                    <Section title={t('pages.impressum.disclaimer')}>
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-base">
                                    {t('pages.impressum.disclaimerTitle')}
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    {t('pages.impressum.disclaimerContent')}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-base">
                                    {t('pages.impressum.disclaimerExternal')}
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    {t('pages.impressum.disclaimerExternalContent')}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-base">
                                    {t('pages.impressum.disclaimerCopyright')}
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    {t('pages.impressum.disclaimerCopyrightContent')}
                                </p>
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Footer note */}
                <div className="mt-12 pt-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        {t('common:legal.tmgNote', 'Diese Seite entspricht den Anforderungen des § 5 TMG (Telemediengesetz)')}
                    </p>
                </div>
            </main>
        </div>
    );
};
