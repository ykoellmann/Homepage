import {cteXecutorPageMeta} from "./meta.ts";
import {ProjectHeader} from "../../../components/layout/ProjectHeader.tsx";
import {FeatureCard} from "../../../components/layout/Cards/FeatureCard.tsx";
import {ShortcutCard} from "../../../components/layout/Cards/ShortcutCard.tsx";

export default function CteXecutorPage() {
    const cteManagementFeatures = cteXecutorPageMeta.features.filter(f => f.category === 'cte-management');
    const executeFromHereFeatures = cteXecutorPageMeta.features.filter(f => f.category === 'execute-from-here');
    const productivityFeatures = cteXecutorPageMeta.features.filter(f => f.category === 'productivity');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Project Header */}
            <ProjectHeader
                name={cteXecutorPageMeta.name}
                icon={cteXecutorPageMeta.icon}
                description={cteXecutorPageMeta.description}
                version={cteXecutorPageMeta.version}
                downloads={cteXecutorPageMeta.downloads}
                githubUrl={cteXecutorPageMeta.debugUrl}
                marketplaceUrl={cteXecutorPageMeta.url}
            />

            {/* CTE Management Features */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    🎯 CTE Management
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                    {cteManagementFeatures.map((feature) => (
                        <FeatureCard
                            key={feature._searchableId}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </section>

            {/* Execute from Here Features */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    🚀 Execute from Here <span className="text-xs md:text-sm font-normal text-blue-600 dark:text-blue-400">(v2.0.0)</span>
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
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ⚡ Developer Productivity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                    {productivityFeatures.map((feature) => (
                        <FeatureCard
                            key={feature._searchableId}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </section>

            {/* Keyboard Shortcuts */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ⌨️ Keyboard Shortcuts
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                    {cteXecutorPageMeta.shortcuts.map((shortcut) => (
                        <ShortcutCard
                            key={shortcut._searchableId}
                            action={shortcut.action}
                            keys={shortcut.keys}
                            description={shortcut.description}
                        />
                    ))}
                </div>
            </section>

            {/* Installation */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    📦 Installation
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700">
                    <ol className="space-y-2 md:space-y-3 list-decimal list-inside text-sm md:text-base text-gray-700 dark:text-gray-300">
                        <li>Öffne IntelliJ IDEA / DataGrip</li>
                        <li>Gehe zu <span className="font-mono text-xs md:text-sm bg-gray-100 dark:bg-gray-900 px-2 py-0.5 md:py-1 rounded">Settings → Plugins → Marketplace</span></li>
                        <li>Suche nach <span className="font-semibold">"cteXecutor"</span></li>
                        <li>Klicke auf <span className="font-semibold">Install</span></li>
                        <li>Starte deine IDE neu</li>
                    </ol>
                </div>
            </section>

            {/* Support Section */}
            <section className="space-y-3 md:space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ❤️ Support
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-md p-4 md:p-6 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
                        Wenn dir dieses Plugin hilft, freue ich mich über:
                    </p>
                    <ul className="space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                        <li className="flex items-center gap-2">
                            <span>⭐</span>
                            <span>Einen Stern auf GitHub</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>📝</span>
                            <span>Eine Review im JetBrains Marketplace</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>🐛</span>
                            <span>Bug-Reports zur Verbesserung</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>💡</span>
                            <span>Ideen für neue Features</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}