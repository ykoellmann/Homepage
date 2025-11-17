import { usePageData } from "../../../hooks/usePageData.ts";
import { cteXecutorData, type CteXecutorTranslations } from "./meta.ts";
import { ProjectHeader } from "../../../components/layout/ProjectHeader.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { FeatureCard } from "../../../components/layout/Cards/FeatureCard.tsx";
import { ShortcutCard } from "../../../components/layout/Cards/ShortcutCard.tsx";

export default function CteXecutorPage() {
    const pageData = usePageData<typeof cteXecutorData, CteXecutorTranslations>(
        cteXecutorData,
        'ctexecutor',
        'projects'
    );

    // The JSON structure has: features.cteManagement, features.executeFromHere, features.productivity
    // Each section contains nested feature objects
    const features = pageData.features as any;
    const shortcuts = pageData.shortcuts as any;
    const installation = pageData.installation as any;
    const support = (pageData as any).support;

    // Extract CTE Management features
    const cteManagementFeatures = features.cteManagement
        ? Object.entries(features.cteManagement)
            .filter(([key]) => key !== 'title' && key !== 'badge')
            .map(([key, value]: [string, any]) => ({
                _searchableId: `cte-${key}`,
                icon: '🎯',
                title: value.title,
                description: value.description,
            }))
        : [];

    // Extract Execute from Here features
    const executeFromHereFeatures = features.executeFromHere
        ? Object.entries(features.executeFromHere)
            .filter(([key]) => key !== 'title' && key !== 'badge')
            .map(([key, value]: [string, any]) => ({
                _searchableId: `exec-${key}`,
                icon: '🚀',
                title: value.title,
                description: value.description,
            }))
        : [];

    // Extract Productivity features
    const productivityFeatures = features.productivity
        ? Object.entries(features.productivity)
            .filter(([key]) => key !== 'title' && key !== 'badge')
            .map(([key, value]: [string, any]) => ({
                _searchableId: `prod-${key}`,
                icon: '⚡',
                title: value.title,
                description: value.description,
            }))
        : [];

    // Convert shortcuts object to array
    const shortcutsArray = shortcuts
        ? Object.entries(shortcuts)
            .filter(([key]) => key !== 'title')
            .map(([key, value]: [string, any]) => ({
                _searchableId: `shortcut-${key}`,
                action: value.action,
                keys: value.keys,
                description: value.description,
            }))
        : [];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Project Header */}
            <ProjectHeader
                name={pageData.name}
                icon={pageData.icon}
                description={pageData.description}
                version={pageData.version}
                downloads={`${pageData.downloads.toLocaleString()}+ downloads`}
                githubUrl={pageData.debugUrl}
                marketplaceUrl={pageData.url}
            />

            {/* CTE Management Features */}
            {features.cteManagement && (
                <FeaturesSection
                    title={features.cteManagement.title || 'CTE Management'}
                    features={cteManagementFeatures as any}
                    columns={{ default: 'grid-cols-1', lg: 'lg:grid-cols-2' }}
                    spacing="space-y-3 md:space-y-4"
                />
            )}

            {/* Execute from Here Features */}
            {features.executeFromHere && (
                <section className="space-y-3 md:space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {features.executeFromHere.title || 'Execute from Here'}
                        {features.executeFromHere.badge && (
                            <span className="text-xs md:text-sm font-normal text-blue-600 dark:text-blue-400 ml-2">
                                {features.executeFromHere.badge}
                            </span>
                        )}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {executeFromHereFeatures.map((feature: any) => (
                            <FeatureCard
                                key={feature._searchableId}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Productivity Features */}
            {features.productivity && (
                <FeaturesSection
                    title={features.productivity.title || 'Productivity'}
                    features={productivityFeatures as any}
                    columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', xl: 'xl:grid-cols-4' }}
                    spacing="space-y-3 md:space-y-4"
                />
            )}

            {/* Keyboard Shortcuts */}
            {shortcuts && shortcutsArray.length > 0 && (
                <section className="space-y-3 md:space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {shortcuts.title || 'Keyboard Shortcuts'}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                        {shortcutsArray.map((shortcut: any) => (
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
            {installation && (
                <section className="space-y-3 md:space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {installation.title}
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                        <ol className="space-y-2 md:space-y-3 list-decimal list-inside text-sm md:text-base text-gray-700 dark:text-gray-300">
                            {installation.step1 && <li>{installation.step1}</li>}
                            {installation.step2 && <li>{installation.step2}</li>}
                            {installation.step3 && <li>{installation.step3}</li>}
                            {installation.step4 && <li>{installation.step4}</li>}
                            {installation.step5 && <li>{installation.step5}</li>}
                        </ol>
                    </div>
                </section>
            )}

            {/* Support Section */}
            {support && (
                <section className="space-y-3 md:space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {support.title}
                    </h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-md p-4 md:p-6 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
                            {support.intro}
                        </p>
                        <ul className="space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                            {support.githubStar && (
                                <li className="flex items-center gap-2">
                                    <span>⭐</span>
                                    <span>{support.githubStar}</span>
                                </li>
                            )}
                            {support.marketplaceReview && (
                                <li className="flex items-center gap-2">
                                    <span>📝</span>
                                    <span>{support.marketplaceReview}</span>
                                </li>
                            )}
                            {support.bugReports && (
                                <li className="flex items-center gap-2">
                                    <span>🐛</span>
                                    <span>{support.bugReports}</span>
                                </li>
                            )}
                            {support.featureIdeas && (
                                <li className="flex items-center gap-2">
                                    <span>💡</span>
                                    <span>{support.featureIdeas}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </section>
            )}

        </div>
    );
}