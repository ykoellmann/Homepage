import React from "react";
import { InteractiveCard } from "./InteractiveCard";

interface ExperienceCardProps {
    company: string;
    logoUrl?: string;
    startMonth: string;
    endMonth?: string;
    position: string;
    location?: string;
    employmentType?: string;
    description?: string;
    skills?: string[];
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
                                                                  company,
                                                                  logoUrl,
                                                                  startMonth,
                                                                  endMonth = "Heute",
                                                                  position,
                                                                  location,
                                                                  employmentType,
                                                                  description,
                                                                  skills = [],
                                                              }) => {
    return (
        <InteractiveCard className="w-full max-w-xl">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt={`${company} Logo`}
                            className="w-10 h-10 object-contain rounded"
                        />
                    )}
                    <div>
                        <h3 className="text-gray-200 font-semibold">{company}</h3>
                        <p className="text-gray-400 text-sm">
                            {position} {employmentType && `· ${employmentType}`}{" "}
                            {location && `· ${location}`}
                        </p>
                    </div>
                </div>
                <span className="text-gray-400 text-sm">
          {startMonth} – {endMonth}
        </span>
            </div>

            {description && (
                <p className="mt-2 text-gray-300 text-sm leading-relaxed">{description}</p>
            )}

            {skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-sm"
                        >
              {skill}
            </span>
                    ))}
                </div>
            )}
        </InteractiveCard>
    );
};
