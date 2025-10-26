import type { ReactNode } from 'react';

interface InfoSectionProps {
    title: string;
    children: ReactNode;
    gradient?: 'purple' | 'blue' | 'green' | 'indigo';
}

export function InfoSection({
    title,
    children,
    gradient = 'blue'
}: InfoSectionProps) {
    // Map gradient colors to Tailwind classes
    const gradientClasses: Record<string, string> = {
        purple: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900',
        blue: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900',
        green: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900',
        indigo: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900'
    };

    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {title}
            </h2>
            <div className={`${gradientClasses[gradient]} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}>
                {children}
            </div>
        </section>
    );
}
