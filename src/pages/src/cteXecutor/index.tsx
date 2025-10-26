import { useTranslation } from 'react-i18next';
import { getCteXecutorMeta } from "../../../lib/i18nMetaHelpers.ts";
import { ProjectHeader } from "../../../components/layout/ProjectHeader.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { FeatureCard } from "../../../components/layout/Cards/FeatureCard.tsx";
import { ShortcutCard } from "../../../components/layout/Cards/ShortcutCard.tsx";

export default function CteXecutorPage() {
    const { t } = useTranslation();
    const meta = getCteXecutorMeta(t);

    const cteManagementFeatures = meta.features.filter(f => f.category === 'cte-management');
    const executeFromHereFeatures = meta.features.filter(f => f.category === 'execute-from-here');
    const productivityFeatures = meta.features.filter(f => f.category === 'productivity');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Project Header */}
            <ProjectHeader
                name={meta.name}
                icon={meta.icon}
                description={meta.description}
                version={meta.version}
                downloads={meta.downloads}
                githubUrl={meta.debugUrl}
                marketplaceUrl={meta.url}
            />

            {/* CTE Management Features */}
            <FeaturesSection
                title={t('projects:ctexecutor.features.cteManagement.title')}
                features={cteManagementFeatures}
                columns={{ default: 'grid-cols-1', lg: 'lg:grid-cols-2' }}
                spacing="space-y-3 md:space-y-4"
            />

            {/* Execute from Here Features */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('projects:ctexecutor.features.executeFromHere.title')} <span className="text-xs md:text-sm font-normal text-blue-600 dark:text-blue-400">{t('projects:ctexecutor.features.executeFromHere.badge')}</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                    {executeFromHereFeatures.map((feature) => (
                        <FeatureCard
                            key={feature._searchableId}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </section>

            {/* Productivity Features */}
            <FeaturesSection
                title={t('projects:ctexecutor.features.productivity.title')}
                features={productivityFeatures}
                columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', xl: 'xl:grid-cols-3' }}
                spacing="space-y-3 md:space-y-4"
            />

            {/* Keyboard Shortcuts */}
            {meta.shortcuts && (
                <section className="space-y-3 md:space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {t('projects:ctexecutor.shortcuts.title')}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {meta.shortcuts.map((shortcut) => (
                            <ShortcutCard
                                key={shortcut._searchableId}
                                action={shortcut.action}
                                keys={shortcut.keys}
                                description={shortcut.description}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Installation */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('projects:ctexecutor.installation.title')}
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                    <ol className="space-y-2 md:space-y-3 list-decimal list-inside text-sm md:text-base text-gray-700 dark:text-gray-300">
                        <li>{t('projects:ctexecutor.installation.step1')}</li>
                        <li>{t('projects:ctexecutor.installation.step2')}</li>
                        <li>{t('projects:ctexecutor.installation.step3')}</li>
                        <li>{t('projects:ctexecutor.installation.step4')}</li>
                        <li>{t('projects:ctexecutor.installation.step5')}</li>
                    </ol>
                </div>
            </section>

            {/* Support Section */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('projects:ctexecutor.support.title')}
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-md p-4 md:p-6 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
                        {t('projects:ctexecutor.support.intro')}
                    </p>
                    <ul className="space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                        <li className="flex items-center gap-2">
                            <span>⭐</span>
                            <span>{t('projects:ctexecutor.support.githubStar')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>📝</span>
                            <span>{t('projects:ctexecutor.support.marketplaceReview')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>🐛</span>
                            <span>{t('projects:ctexecutor.support.bugReports')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>💡</span>
                            <span>{t('projects:ctexecutor.support.featureIdeas')}</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}