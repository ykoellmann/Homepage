import React from 'react';

interface ShortcutCardProps {
    action: string;
    keys: string;
    description: string;
}

export function ShortcutCard({ action, keys, description }: ShortcutCardProps) {
    // Split keys by → and spaces to create individual key elements
    const keyParts = keys.split(/\s*→\s*|\s+/);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-5 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
            <div className="space-y-2 md:space-y-3">
                {/* Action */}
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
                    {action}
                </h3>

                {/* Keys */}
                <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    {keyParts.map((key, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && key !== '→' && (
                                <span className="text-gray-400 dark:text-gray-600 text-sm">→</span>
                            )}
                            {key !== '→' && (
                                <kbd
                                    className="px-2 md:px-3 py-1 md:py-1.5 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded font-mono text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm"
                                >
                                    {key}
                                </kbd>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                    {description}
                </p>
            </div>
        </div>
    );
}