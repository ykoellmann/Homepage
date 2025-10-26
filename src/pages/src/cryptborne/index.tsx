import { useTranslation } from 'react-i18next';
import { getCryptborneMeta } from "../../../lib/i18nMetaHelpers.ts";
import { ProjectHero } from "../../../components/layout/ProjectHero.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { TechStackGrid } from "../../../components/layout/TechStackGrid.tsx";
import { InfoSection } from "../../../components/layout/InfoSection.tsx";

export default function CryptbornePage() {
    const { t } = useTranslation();
    const meta = getCryptborneMeta(t);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <ProjectHero
                name={meta.name}
                icon={meta.icon}
                description={meta.description}
                githubUrl={meta.githubUrl}
            />

            {/* About */}
            <InfoSection title={t('projects:cryptborne.about.title')} gradient="purple">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {t('projects:cryptborne.about.paragraph1')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('projects:cryptborne.about.paragraph2')}
                </p>
            </InfoSection>

            {/* Features */}
            <FeaturesSection
                title={t('projects:cryptborne.features.title')}
                features={meta.features}
                columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', lg: 'lg:grid-cols-3' }}
            />

            {/* Tech Stack */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('projects:cryptborne.techStack.title')}
                </h2>
                <TechStackGrid
                    items={meta.techStack}
                    columns={{ default: 'grid-cols-2', md: 'md:grid-cols-4' }}
                    hoverColor="purple"
                />
            </section>

            {/* Gameplay Highlights */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('projects:cryptborne.gameplayHighlights.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🗺️</span>
                            {t('projects:cryptborne.gameplayHighlights.modularDungeons.title')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('projects:cryptborne.gameplayHighlights.modularDungeons.description')}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>⚔️</span>
                            {t('projects:cryptborne.gameplayHighlights.weaponVariety.title')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('projects:cryptborne.gameplayHighlights.weaponVariety.description')}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🎯</span>
                            {t('projects:cryptborne.gameplayHighlights.combatSystem.title')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('projects:cryptborne.gameplayHighlights.combatSystem.description')}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🎨</span>
                            {t('projects:cryptborne.gameplayHighlights.lowPolyAesthetic.title')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('projects:cryptborne.gameplayHighlights.lowPolyAesthetic.description')}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}