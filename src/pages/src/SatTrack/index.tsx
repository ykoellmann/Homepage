import { runConfig } from "./meta.ts";

export default function SatTrackPage() {
    return (
        <div className="p-4">
            <h1>{runConfig.name}</h1>
            <p>{runConfig.description}</p>
            {/* Demo-Inhalt der Seite */}
        </div>
    );
}