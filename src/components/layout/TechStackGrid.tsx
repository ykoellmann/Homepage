interface TechStackItem {
    _searchableId: string;
    name: string;
    category: string;
}

interface TechStackGridProps {
    items: TechStackItem[];
    columns?: {
        default?: string;
        md?: string;
        lg?: string;
    };
    hoverColor?: 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'indigo';
}

export function TechStackGrid({
    items,
    columns = { default: 'grid-cols-2', md: 'md:grid-cols-3', lg: 'lg:grid-cols-4' },
    hoverColor = 'blue'
}: TechStackGridProps) {
    // Build the grid classes from the columns prop
    const gridClasses = [
        columns.default || 'grid-cols-2',
        columns.md || 'md:grid-cols-3',
        columns.lg || 'lg:grid-cols-4'
    ].join(' ');

    // Map hover colors to Tailwind classes
    const hoverColorClasses: Record<string, string> = {
        purple: 'hover:border-purple-300 dark:hover:border-purple-600',
        blue: 'hover:border-blue-300 dark:hover:border-blue-600',
        green: 'hover:border-green-300 dark:hover:border-green-600',
        red: 'hover:border-red-300 dark:hover:border-red-600',
        yellow: 'hover:border-yellow-300 dark:hover:border-yellow-600',
        indigo: 'hover:border-indigo-300 dark:hover:border-indigo-600'
    };

    return (
        <div className={`grid ${gridClasses} gap-3`}>
            {items.map((tech) => (
                <div
                    key={tech._searchableId}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${hoverColorClasses[hoverColor]} transition-colors`}
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
    );
}
