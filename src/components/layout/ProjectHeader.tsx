interface ProjectHeaderProps {
    name: string;
    icon: string;
    description: string;
    version: string;
    downloads?: string;
    githubUrl: string;
    marketplaceUrl: string;
}

export function ProjectHeader({
                                  name,
                                  icon,
                                  description,
                                  version,
                                  downloads,
                                  githubUrl,
                                  marketplaceUrl
                              }: ProjectHeaderProps) {
    return (
        <div className="bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-5 md:p-6 border border-blue-200/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 md:gap-5">
                {/* Icon */}
                <div className="text-4xl md:text-5xl flex-shrink-0">{icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title and Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {name}
                        </h1>
                        <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-md text-xs font-semibold border border-blue-500/30">
                            v{version}
                        </span>
                        {downloads && (
                            <span className="px-2.5 py-0.5 bg-green-500/20 text-green-700 dark:text-green-300 rounded-md text-xs font-semibold border border-green-500/30">
                                {downloads}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                        {description}
                    </p>

                    {/* Links */}
                    <div className="flex flex-wrap gap-2">
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                            </svg>
                            GitHub
                        </a>
                        <a
                            href={marketplaceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            JetBrains Marketplace
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}