import {aboutPageMeta} from "./meta.ts";
import {ExperienceCard} from "../../components/layout/ExperienceCard.tsx";

export default function AboutPage() {
    return (
        <div className="p-10 space-y-6">
            {aboutPageMeta.experiences.map((exp) => (
                <ExperienceCard
                    key={exp._searchableId}
                    company={exp.company}
                    logoUrl={exp.logoUrl}
                    startMonth={exp.startMonth}
                    endMonth={exp.endMonth}
                    position={exp.position}
                    location={exp.location}
                    employmentType={exp.employmentType}
                    skills={exp.skills}
                    description={exp.description}
                    // achievements={exp.achievements}
                />
            ))}
        </div>
    );
}