import { cryptbornePageMeta } from "./meta.ts";
import { ProjectHero } from "../../../components/layout/ProjectHero.tsx";
import { FeaturesSection } from "../../../components/layout/FeaturesSection.tsx";
import { TechStackGrid } from "../../../components/layout/TechStackGrid.tsx";
import { InfoSection } from "../../../components/layout/InfoSection.tsx";

export default function CryptbornePage() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <ProjectHero
                name={cryptbornePageMeta.name}
                icon={cryptbornePageMeta.icon}
                description={cryptbornePageMeta.description}
                githubUrl={cryptbornePageMeta.githubUrl || undefined}
            />

            {/* About */}
            <InfoSection title="📖 Über das Spiel" gradient="purple">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Cryptborne ist ein Top-Down Dungeon Crawler im mittelalterlichen Fantasy-Setting, entwickelt mit Unity 6.
                    Erkunde prozedural generierte Dungeons voller Feinde und Herausforderungen.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Kämpfe dich durch Wellen von Gegnern mit verschiedenen Waffen, die jeweils einzigartige Schussmuster und Spielstile bieten.
                    Das Spiel bietet flüssige Charakterbewegung, responsive Combat-Mechaniken und modulare Dungeon-Layouts,
                    die sicherstellen, dass jeder Durchlauf anders ist.
                </p>
            </InfoSection>

            {/* Features */}
            <FeaturesSection
                title="✨ Features"
                features={cryptbornePageMeta.features}
                columns={{ default: 'grid-cols-1', md: 'md:grid-cols-2', lg: 'lg:grid-cols-3' }}
            />

            {/* Tech Stack */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    🛠️ Tech Stack
                </h2>
                <TechStackGrid
                    items={cryptbornePageMeta.techStack}
                    columns={{ default: 'grid-cols-2', md: 'md:grid-cols-4' }}
                    hoverColor="purple"
                />
            </section>

            {/* Gameplay Highlights */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    🎮 Gameplay Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🗺️</span>
                            Modulare Dungeons
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Jeder Dungeon wird prozedural aus modularen Räumen generiert.
                            Entdecke neue Layouts, Fallen und Geheimnisse bei jedem Durchlauf.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>⚔️</span>
                            Waffenvielfalt
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Verschiedene Waffen mit einzigartigen Eigenschaften - von schnellen Dolchen
                            bis zu mächtigen Bögen mit speziellen Schussmustern.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🎯</span>
                            Combat System
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Präzise Steuerung trifft auf dynamisches Combat. Weiche Angriffen aus,
                            positioniere dich clever und nutze die Stärken deiner Waffen.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <span>🎨</span>
                            Low-Poly Aesthetic
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Stilvolle mittelalterliche Fantasy-Welt im charmanten Low-Poly-Look
                            mit kohärentem Art-Style durch KayKit Assets.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}