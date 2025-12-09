import { usePageData } from "../../../hooks/usePageData.ts";
import { ProjectHero } from "../../../components/layout/ProjectHero.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { TechStackGrid } from "../../../components/layout/TechStackGrid.tsx";
import { InfoSection } from "../../../components/layout/InfoSection.tsx";
import {satTrackData, type SatTrackTranslations} from "./meta.ts";

export default function SatTrackPage() {
    const pageData = usePageData<typeof satTrackData, SatTrackTranslations>(
        satTrackData,
        'sattrack',
        'projects'
    );

    // Convert features object to array (all data now from translations)
    const featuresArray = Object.entries(pageData.features)
        .filter(([key]) => key !== 'title')
        .map(([key, value]: [string, any]) => ({
            _searchableId: key,
            icon: value.icon || '📦',
            title: value.title,
            description: value.description,
            searchWeight: value.searchWeight,
        }));

    // Tech stack array (all data from translations)
    const techStackArray = pageData.techStack.items.map((item: any, index: number) => ({
        _searchableId: `tech-${index}`,
        name: item.name,
        category: item.category,
        searchWeight: item.searchWeight,
    }));

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <ProjectHero
                name={pageData.name}
                icon={pageData.icon}
                description={pageData.description}
            />

            {/* Features */}
            <FeaturesSection
                title={pageData.features.title}
                features={featuresArray as any}
                columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', xl: 'xl:grid-cols-3' }}
            />

            {/* Tech Stack */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pageData.techStack.title}
                </h2>
                <TechStackGrid
                    items={techStackArray as any}
                    columns={{ default: 'grid-cols-2', md: 'md:grid-cols-3', lg: 'lg:grid-cols-4' }}
                    hoverColor="blue"
                />
            </section>

            {/* Project Info */}
            <InfoSection title={pageData.about.title} gradient="blue">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {pageData.about.paragraph1}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {pageData.about.paragraph2}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        {pageData.about.badges.satellites}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        {pageData.about.badges.realtime}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        {pageData.about.badges.unity}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                        {pageData.about.badges.university}
                    </span>
                </div>
            </InfoSection>

            {/* Team */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pageData.team.title}
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300">
                        {pageData.team.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {pageData.team.university}
                    </p>
                </div>
            </section>
        </div>
    );
}