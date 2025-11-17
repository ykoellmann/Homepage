import { usePageData } from "../../../hooks/usePageData.ts";
import { cryptborneData, type CryptborneTranslations } from "./meta.ts";
import { ProjectHero } from "../../../components/layout/ProjectHero.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { TechStackGrid } from "../../../components/layout/TechStackGrid.tsx";
import { InfoSection } from "../../../components/layout/InfoSection.tsx";

export default function CryptbornePage() {
    const pageData = usePageData<typeof cryptborneData, CryptborneTranslations>(
        cryptborneData,
        'cryptborne',
        'projects'
    );

    // Convert features object to array (from translations)
    const featuresArray = Object.entries(pageData.features)
        .filter(([key]) => key !== 'title')
        .map(([key, value]: [string, any]) => ({
            _searchableId: key,
            icon: cryptborneData.features[key as keyof typeof cryptborneData.features]?.icon || '📦',
            title: value.title,
            description: value.description,
        }));

    // Convert tech stack object to array (from translations)
    // Tech stack in translations is an object like: { unity6: "Unity 6", csharp: "C#", ... }
    const techStackArray = Object.entries(pageData.techStack)
        .filter(([key]) => key !== 'title')
        .map(([key, value]: [string, any]) => ({
            _searchableId: key,
            name: value,
            category: cryptborneData.techStack[key as keyof typeof cryptborneData.techStack]?.category || 'other',
        }));

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <ProjectHero
                name={pageData.name}
                icon={pageData.icon}
                description={pageData.description}
            />

            {/* About */}
            <InfoSection title={pageData.about.title} gradient="purple">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {pageData.about.paragraph1}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {pageData.about.paragraph2}
                </p>
            </InfoSection>

            {/* Features */}
            <FeaturesSection
                title={pageData.features.title}
                features={featuresArray as any}
                columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', lg: 'lg:grid-cols-3' }}
            />

            {/* Tech Stack */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pageData.techStack.title}
                </h2>
                <TechStackGrid
                    items={techStackArray as any}
                    columns={{ default: 'grid-cols-2', md: 'md:grid-cols-4' }}
                    hoverColor="purple"
                />
            </section>

            {/* Gameplay Highlights */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pageData.gameplayHighlights.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🗺️</span>
                            {pageData.gameplayHighlights.modularDungeons.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pageData.gameplayHighlights.modularDungeons.description}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>⚔️</span>
                            {pageData.gameplayHighlights.weaponVariety.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pageData.gameplayHighlights.weaponVariety.description}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🎯</span>
                            {pageData.gameplayHighlights.combatSystem.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pageData.gameplayHighlights.combatSystem.description}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🎨</span>
                            {pageData.gameplayHighlights.lowPolyAesthetic.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {pageData.gameplayHighlights.lowPolyAesthetic.description}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}