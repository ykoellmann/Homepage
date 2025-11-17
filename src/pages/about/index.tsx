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
            <div key={exp._searchableId} className="relative pl-8 pb-12 group">
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 dark:bg-blue-600 group-hover:w-1 transition-all duration-300" />

                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-4 h-4 -ml-[7px] rounded-full bg-blue-500 border-4 border-white dark:border-gray-900 group-hover:scale-125 transition-transform duration-300 shadow-lg" />

                <div className="grid md:grid-cols-12 gap-6">
                    {/* Left: Time Period */}
                    <div className="md:col-span-3">
                        <div className="sticky top-4">
                            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                {exp.startMonth} - {endMonth}
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="md:col-span-9">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300">
                            {/* Header: Position & Company */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                    {exp.position}
                                </h3>
                                <div className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">{exp.company}</span>
                                    {exp.employmentType && (
                                        <span className="text-sm ml-2 text-gray-500 dark:text-gray-500">
                                            • {exp.employmentType}
                                        </span>
                                    )}
                                </div>
                                {exp.location && (
                                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span>📍</span>
                                        <span>{exp.location}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {exp.description && (
                                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                                    {exp.description}
                                </p>
                            )}

                            {/* Skills Tags */}
                            {exp.skills && exp.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    💼 {t.workExperience}
                </h2>
                <div className="space-y-0">
                    {workExperiences.map(renderExperience)}
                </div>
            </section>

            {/* Education Section */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    🎓 {t.education}
                </h2>
                <div className="space-y-0">
                    {educationExperiences.map(renderExperience)}
                </div>
            </section>
        </div>
    );
}
