import { useProjectPage } from "../../../hooks/useProjectPage.ts";
import { ProjectHeader } from "../../../components/layout/ProjectHeader.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { FeatureCard } from "../../../components/layout/Cards/FeatureCard.tsx";
import { ShortcutCard } from "../../../components/layout/Cards/ShortcutCard.tsx";

export default function CteXecutorPage() {
    const { meta, translations } = useProjectPage('ctexecutor');

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
                title={translations.features.cteManagement.title}
                features={cteManagementFeatures}
                columns={{ default: 'grid-cols-1', lg: 'lg:grid-cols-2' }}
                spacing="space-y-3 md:space-y-4"
            />

            {/* Execute from Here Features */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {translations.features.executeFromHere.title} <span className="text-xs md:text-sm font-normal text-blue-600 dark:text-blue-400">{translations.features.executeFromHere.badge}</span>
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
                title={translations.features.productivity.title}
                features={productivityFeatures}
                columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', xl: 'xl:grid-cols-3' }}
                spacing="space-y-3 md:space-y-4"
            />

            {/* Keyboard Shortcuts */}
            {meta.shortcuts && (
                <section className="space-y-3 md:space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {translations.shortcuts.title}
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
                    {translations.installation.title}
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                    <ol className="space-y-2 md:space-y-3 list-decimal list-inside text-sm md:text-base text-gray-700 dark:text-gray-300">
                        <li>{translations.installation.step1}</li>
                        <li>{translations.installation.step2}</li>
                        <li>{translations.installation.step3}</li>
                        <li>{translations.installation.step4}</li>
                        <li>{translations.installation.step5}</li>
                    </ol>
                </div>
            </section>

            {/* Support Section */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {translations.support.title}
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-md p-4 md:p-6 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
                        {translations.support.intro}
                    </p>
                    <ul className="space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                        <li className="flex items-center gap-2">
                            <span>⭐</span>
                            <span>{translations.support.githubStar}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>📝</span>
                            <span>{translations.support.marketplaceReview}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>🐛</span>
                            <span>{translations.support.bugReports}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>💡</span>
                            <span>{translations.support.featureIdeas}</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}