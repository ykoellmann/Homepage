import { satTrackPageMeta } from "./meta.ts";
import { ProjectHero } from "../../../components/layout/ProjectHero.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { TechStackGrid } from "../../../components/layout/TechStackGrid.tsx";
import { InfoSection } from "../../../components/layout/InfoSection.tsx";

export default function SatTrackPage() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <ProjectHero
                name={satTrackPageMeta.name}
                icon={satTrackPageMeta.icon}
                description={satTrackPageMeta.description}
                githubUrl={satTrackPageMeta.debugUrl || undefined}
            />

            {/* Features */}
            <FeaturesSection
                title="✨ Features"
                features={satTrackPageMeta.features}
                columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', xl: 'xl:grid-cols-3' }}
            />

            {/* Tech Stack */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    🛠️ Tech Stack
                </h2>
                <TechStackGrid
                    items={satTrackPageMeta.techStack}
                    columns={{ default: 'grid-cols-2', md: 'md:grid-cols-3', lg: 'lg:grid-cols-4' }}
                    hoverColor="blue"
                />
            </section>

            {/* Project Info */}
            <InfoSection title="📝 Über das Projekt" gradient="blue">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    SatTrak ist ein interaktives 3D-Satelliten-Visualisierungsprojekt, das im Rahmen eines Universitätsprojekts an der FSU Jena entwickelt wurde.
                    Mit Unity und Cesium for Unity ermöglicht es die Echtzeit-Verfolgung von über 5000 aktiven Satelliten auf einem virtuellen Globus.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Das Projekt nutzt TLE-Daten von CelesTrak und den SGP4-Algorithmus zur präzisen Orbit-Berechnung.
                    Benutzer können zwischen einer Weltraumansicht und einer First-Person-Erdansicht wechseln, Satelliten-Orbits visualisieren,
                    und die Satellitendichte über eine GPU-basierte Heatmap darstellen.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        5000+ Satelliten
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        Echtzeit-Tracking
                    </span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        Unity 2022 LTS
                    </span>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                        Universitätsprojekt
                    </span>
                </div>
            </InfoSection>

            {/* Team */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    👥 Team
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300">
                        Entwickelt von <span className="font-semibold">Jan Vogt</span>, <span className="font-semibold">Yannik Köllmann</span>,
                        <span className="font-semibold"> Leon Erdhütter</span> und <span className="font-semibold">Niklas Maximilian Becker-Klöster</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        FSU Jena • Universitätsprojekt
                    </p>
                </div>
            </section>
        </div>
    );
}