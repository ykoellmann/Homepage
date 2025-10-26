interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 group">
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="text-2xl md:text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1 md:space-y-2 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}