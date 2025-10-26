/**
 * Basis-Interface für alle Pages
 * Jede Page MUSS diese Felder haben
 */
export interface BasePageMeta {
    // RunConfig (Pflichtfelder)
    name: string;
    slug: string;
    description: string;

    // Optional für bessere Suche
    keywords?: string[];
    category?: string;
    icon?: string;

    // Optional: URLs für Run-Konfigurationen
    url?: string;
    debugUrl?: string;
}

/**
 * Marker-Interface für durchsuchbare Objekte
 * Jedes Objekt das durchsucht werden soll, implementiert dieses Interface
 */
export interface Searchable {
    // Jedes durchsuchbare Objekt hat eine ID
    _searchableId: string;

    // Optional: Gewichtung für Suche (höher = wichtiger)
    _searchWeight?: number;

    // Alle anderen Felder werden automatisch durchsucht
    [key: string]: any;
}

/**
 * Type Guard um zu prüfen ob ein Objekt durchsuchbar ist
 */
export function isSearchable(obj: any): obj is Searchable {
    return obj && typeof obj === 'object' && '_searchableId' in obj;
}
