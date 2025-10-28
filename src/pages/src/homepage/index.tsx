import { useProjectPage } from "../../../hooks/useProjectPage.ts";
import { ProjectHero } from "../../../components/layout/ProjectHero.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { TechStackGrid } from "../../../components/layout/TechStackGrid.tsx";
import { InfoSection } from "../../../components/layout/InfoSection.tsx";

export default function HomepagePage() {
    const { meta, translations } = useProjectPage('homepage');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <ProjectHero
                name={meta.name}
                icon={meta.icon}
                description={meta.description}
            />

            {/* About */}
            <InfoSection title={translations.about.title} gradient="blue">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {translations.about.paragraph1}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {translations.about.paragraph2}
                </p>
            </InfoSection>

            {/* Goals */}
            <InfoSection title={translations.goals.title} gradient="green">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>{translations.goals.goal1}</li>
                    <li>{translations.goals.goal2}</li>
                    <li>{translations.goals.goal3}</li>
                    <li>{translations.goals.goal4}</li>
                </ul>
            </InfoSection>

            {/* Features */}
            <FeaturesSection
                title={translations.features.title}
                features={meta.features}
                columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', lg: 'lg:grid-cols-3' }}
            />

            {/* Tech Stack */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {translations.techStack.title}
                </h2>
                <TechStackGrid
                    items={meta.techStack}
                    columns={{ default: 'grid-cols-2', md: 'md:grid-cols-4' }}
                    hoverColor="blue"
                />
            </section>

            {/* Architecture */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {translations.architecture.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>📁</span>
                            {translations.architecture.fileTree.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {translations.architecture.fileTree.description}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🔗</span>
                            {translations.architecture.routing.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {translations.architecture.routing.description}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>💾</span>
                            {translations.architecture.persistence.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {translations.architecture.persistence.description}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🔍</span>
                            {translations.architecture.search.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {translations.architecture.search.description}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
