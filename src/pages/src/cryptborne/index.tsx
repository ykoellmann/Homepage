import {cryptbornePageMeta} from "./meta.ts";
import {FeatureCard} from "../../../components/layout/Cards/FeatureCard.tsx";

export default function CryptbornePage() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-4">
                    <span className="text-6xl">{cryptbornePageMeta.icon}</span>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {cryptbornePageMeta.name}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            {cryptbornePageMeta.description}
                        </p>
                    </div>
                </div>

                {cryptbornePageMeta.githubUrl && (
                    <div className="flex gap-3">
                        <a
                            href={cryptbornePageMeta.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                            </svg>
                            GitHub Repository
                        </a>
                    </div>
                )}
            </section>

            {/* About */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    📖 Über das Spiel
                </h2>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Cryptborne ist ein Top-Down Dungeon Crawler im mittelalterlichen Fantasy-Setting, entwickelt mit Unity 6.
                        Erkunde prozedural generierte Dungeons voller Feinde und Herausforderungen.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Kämpfe dich durch Wellen von Gegnern mit verschiedenen Waffen, die jeweils einzigartige Schussmuster und Spielstile bieten.
                        Das Spiel bietet flüssige Charakterbewegung, responsive Combat-Mechaniken und modulare Dungeon-Layouts,
                        die sicherstellen, dass jeder Durchlauf anders ist.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ✨ Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cryptbornePageMeta.features.map((feature) => (
                        <FeatureCard
                            key={feature._searchableId}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    🛠️ Tech Stack
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {cryptbornePageMeta.techStack.map((tech) => (
                        <div
                            key={tech._searchableId}
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                        >
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                {tech.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                                {tech.category}
                            </p>
                        </div>
                    ))}
                </div>
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