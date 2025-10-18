export interface RunConfigMeta {
    name: string;
    slug?: string;       // optional: Pfad/ID, z.B. "cryptborne"
    url?: string;
    debugUrl?: string;
    description?: string;
    icon?: string;       // optional, z.B. für Anzeige
}