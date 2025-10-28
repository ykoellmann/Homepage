import { useProjectPage } from "../../../hooks/useProjectPage.ts";
import { ProjectHero } from "../../../components/layout/ProjectHero.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { TechStackGrid } from "../../../components/layout/TechStackGrid.tsx";
import { InfoSection } from "../../../components/layout/InfoSection.tsx";

export default function SatTrackPage() {
    const { meta, translations } = useProjectPage('sattrack');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <ProjectHero
                name={meta.name}
                icon={meta.icon}
                description={meta.description}
            />

            {/* Features */}
            <FeaturesSection
                title={translations.features.title}
                features={meta.features}
                columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', xl: 'xl:grid-cols-3' }}
            />

            {/* Tech Stack */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {translations.techStack.title}
                </h2>
                <TechStackGrid
                    items={meta.techStack}
                    columns={{ default: 'grid-cols-2', md: 'md:grid-cols-3', lg: 'lg:grid-cols-4' }}
                    hoverColor="blue"
                />
            </section>

            {/* Project Info */}
            <InfoSection title={translations.about.title} gradient="blue">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {translations.about.paragraph1}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {translations.about.paragraph2}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        {translations.about.badges.satellites}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        {translations.about.badges.realtime}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        {translations.about.badges.unity}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                        {translations.about.badges.university}
                    </span>
                </div>
            </InfoSection>

            {/* Team */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {translations.team.title}
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300">
                        {translations.team.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {translations.team.university}
                    </p>
                </div>
            </section>
        </div>
    );
}