import {ExperienceCard} from "../../components/layout/ExperienceCard.tsx";

export default function AboutPage() {
    return (
        <div className="p-10 space-y-6">

            <ExperienceCard
                company="monari GmbH"
                logoUrl="/logos/monari.png"
                startMonth="Okt. 2024"
                endMonth="Heute"
                position="Aushilfe im Bereich IT"
                location="Remote"
                skills={["C#", "ASP.NET Core", "API-Entwicklung", "Entity Framework Core", "SQL"]}
            />

            <ExperienceCard
                company="monari GmbH"
                logoUrl="/logos/monari.png"
                startMonth="Jan. 2024"
                endMonth="Okt. 2024"
                position="IT-Entwickler"
                location="Gronau"
                employmentType="Vollzeit"
                skills={["C#", "ASP.NET Core", "API-Entwicklung", "Entity Framework Core", "SQL", "TypeScript", "HTML5", "Angular"]}
            />

            <ExperienceCard
                company="monari GmbH"
                logoUrl="/logos/monari.png"
                startMonth="Aug. 2021"
                endMonth="Jan. 2024"
                position="Fachinformatiker Fachrichtung Anwendungsentwicklung"
                location="Gronau (Westfalen)"
                employmentType="Azubi"
                skills={["ASP.NET Core", "API-Entwicklung", "Entity Framework Core", "SQL"]}
            />

            <ExperienceCard
                company="Friedrich-Schiller-Universität Jena"
                startMonth="Okt. 2024"
                endMonth="Sept. 2027"
                position="Bachelor of Science - BS, Informatik"
                skills={["OpenGL", "Bash", "C++", "C", "C#", "Unity", "Java"]}
            />

            <ExperienceCard
                company="Hermann-Emanuel-Berufskolleg des Kreises Steinfurt"
                startMonth="Aug. 2018"
                endMonth="Aug. 2021"
                position="Abitur"
                location="Gronau (Westfalen), Nordrhein-Westfalen, Deutschland"
                skills={[]}
            />
        </div>
    );
}