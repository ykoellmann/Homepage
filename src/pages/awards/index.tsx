import { useTranslation } from "react-i18next";

interface Award {
    title: string;
    organization: string;
    date: string;
    description: string;
}

export default function AwardsPage() {
    const { t } = useTranslation('modernView');

    const awards = t('awards.items', { returnObjects: true }) as Award[];
    const title = t('awards.title');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    🏆 {title}
                </h1>
            </div>

            {/* Awards Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {awards.map((award, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {award.title}
                            </h2>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {award.organization}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {award.date}
                                </p>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {award.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
