import { FeatureCard } from "./Cards/FeatureCard.tsx";

interface Feature {
    _searchableId: string;
    icon: string;
    title: string;
    description: string;
}

interface FeaturesSectionProps {
    title: string;
    features: Feature[];
    columns?: {
        default?: string;
        md?: string;
        lg?: string;
        xl?: string;
    };
    spacing?: 'space-y-3 md:space-y-4' | 'space-y-4';
}

export function FeaturesSection({
    title,
    features,
    columns = { default: 'grid-cols-1', md: 'md:grid-cols-2', lg: 'lg:grid-cols-3' },
    spacing = 'space-y-4'
}: FeaturesSectionProps) {
    // Build the grid classes from the columns prop
    const gridClasses = [
        columns.default || 'grid-cols-1',
        columns.md,
        columns.lg,
        columns.xl
    ].filter(Boolean).join(' ');

    return (
        <section className={spacing}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {title}
            </h2>
            <div className={`grid ${gridClasses} gap-3 md:gap-4`}>
                {features.map((feature) => (
                    <FeatureCard
                        key={feature._searchableId}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
}
