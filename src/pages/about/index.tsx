import { aboutPageData, type Experience } from "./meta.ts";
import { useComponentTranslations } from "../../hooks/useComponentTranslations.ts";

interface AboutTranslations {
    name: string;
    description: string;
    title: string;
    subtitle: string;
    workExperience: string;
    education: string;
    present: string;
    skills: string;
}

export default function AboutPage() {
    const t = useComponentTranslations<AboutTranslations>('pages.about');

    // Separate work experience and education
    const workExperiences = aboutPageData.experiences.filter(exp => exp.type === 'work');
    const educationExperiences = aboutPageData.experiences.filter(exp => exp.type === 'education');

    const renderExperience = (exp: Experience) => {
        const endMonth = exp.endMonth.toLowerCase().includes('heute') || exp.endMonth.toLowerCase().includes('today')
            ? t.present
            : exp.endMonth;

        return (
            <div
                key={exp._searchableId}
                className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 group"
            >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

                <div className="relative z-10">
                    {/* Date Badge - Positioned Absolutely */}
                    <div className="absolute top-0 right-0 max-w-[45%]">
                        <span className="font-semibold whitespace-nowrap px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-sm">
                            {exp.startMonth} - {endMonth}
                        </span>
                    </div>

                    {/* Header: Position & Company - All Left Aligned */}
                    <div className="flex flex-col gap-2 mb-4 pr-[48%]">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                            {exp.position}
                        </h3>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 break-words">
                            {exp.company}
                        </p>
                        {exp.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <span>📍</span>
                                <span>{exp.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {exp.description && (
                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-left break-words">
                            {exp.description}
                        </p>
                    )}

                    {/* Skills Tags */}
                    {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {exp.skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-md border border-blue-200 dark:border-blue-800"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Header */}
            <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    {t.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    {t.subtitle}
                </p>
            </div>

            {/* Work Experience Section */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                    <span>💼</span>
                    <span>{t.workExperience}</span>
                </h2>
                <div className="space-y-6">
                    {workExperiences.map(renderExperience)}
                </div>
            </section>

            {/* Education Section */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
                    <span>🎓</span>
                    <span>{t.education}</span>
                </h2>
                <div className="space-y-6">
                    {educationExperiences.map(renderExperience)}
                </div>
            </section>
        </div>
    );
}
