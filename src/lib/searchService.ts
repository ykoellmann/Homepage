import type {BasePageMeta, Searchable} from "./basePage.ts";
import {isSearchable} from "./basePage.ts";

export interface SearchResult {
    // Wo kommt das Ergebnis her?
    pageName: string;
    pageSlug: string;
    pageCategory?: string;
    pageIcon?: string;

    // Was wurde gefunden?
    item: Searchable;
    itemType: string; // z.B. "experiences", "projects", etc.

    // Für Anzeige
    title: string;
    subtitle?: string;
    description?: string;

    // Relevanz
    relevance: number;
    matchedFields: string[];
}

export class SearchService {
    private pages: Map<string, BasePageMeta> = new Map();

    registerPage(pageMeta: BasePageMeta) {
        this.pages.set(pageMeta.slug, pageMeta);
    }

    /**
     * Hauptsuche - durchsucht ALLE Felder ALLER Pages
     * Wie JetBrains "Search Everywhere"
     */
    searchEverywhere(query: string): SearchResult[] {
        if (!query.trim()) return [];

        const term = query.toLowerCase();
        const results: SearchResult[] = [];

        this.pages.forEach((pageMeta) => {
            // 1. Durchsuche die Page-Meta selbst
            const pageResult = this.searchInObject(
                pageMeta,
                term,
                pageMeta.slug,
                'page'
            );

            if (pageResult) {
                results.push({
                    pageName: pageMeta.name,
                    pageSlug: pageMeta.slug,
                    pageCategory: pageMeta.category,
                    pageIcon: pageMeta.icon,
                    item: { _searchableId: pageMeta.slug, ...pageMeta } as Searchable,
                    itemType: 'page',
                    title: pageMeta.name,
                    description: pageMeta.description,
                    relevance: pageResult.relevance,
                    matchedFields: pageResult.matchedFields,
                });
            }

            // 2. Durchsuche ALLE Properties der Page
            Object.entries(pageMeta).forEach(([key, value]) => {
                // Überspringe Base-Felder (werden oben schon durchsucht)
                if (['name', 'slug', 'description', 'keywords', 'category', 'icon'].includes(key)) {
                    return;
                }

                // Ist es ein Array von Searchables?
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        if (isSearchable(item)) {
                            const itemResult = this.searchInObject(
                                item,
                                term,
                                pageMeta.slug,
                                key
                            );

                            if (itemResult) {
                                // Versuche einen guten Titel zu finden
                                const title = this.extractTitle(item);
                                const subtitle = this.extractSubtitle(item);
                                const description = this.extractDescription(item);

                                results.push({
                                    pageName: pageMeta.name,
                                    pageSlug: pageMeta.slug,
                                    pageCategory: pageMeta.category,
                                    pageIcon: pageMeta.icon,
                                    item: item,
                                    itemType: key,
                                    title,
                                    subtitle,
                                    description,
                                    relevance: itemResult.relevance * (item._searchWeight || 1),
                                    matchedFields: itemResult.matchedFields,
                                });
                            }
                        }
                    });
                }
                // Ist es ein einzelnes Searchable?
                else if (isSearchable(value)) {
                    const itemResult = this.searchInObject(
                        value,
                        term,
                        pageMeta.slug,
                        key
                    );

                    if (itemResult) {
                        results.push({
                            pageName: pageMeta.name,
                            pageSlug: pageMeta.slug,
                            pageCategory: pageMeta.category,
                            pageIcon: pageMeta.icon,
                            item: value,
                            itemType: key,
                            title: this.extractTitle(value),
                            subtitle: this.extractSubtitle(value),
                            description: this.extractDescription(value),
                            relevance: itemResult.relevance * (value._searchWeight || 1),
                            matchedFields: itemResult.matchedFields,
                        });
                    }
                }
            });
        });

        // Sortiere nach Relevanz
        return results.sort((a, b) => b.relevance - a.relevance);
    }

    /**
     * Durchsucht ein einzelnes Objekt rekursiv
     */
    private searchInObject(
        obj: any,
        term: string,
        _pageSlug: string,
        _context: string
    ): { relevance: number; matchedFields: string[] } | null {
        let totalRelevance = 0;
        const matchedFields: string[] = [];

        const searchRecursive = (current: any, path: string = '') => {
            if (typeof current === 'string') {
                const relevance = this.calculateStringRelevance(current, term);
                if (relevance > 0) {
                    totalRelevance += relevance;
                    matchedFields.push(path || 'value');
                }
            } else if (Array.isArray(current)) {
                current.forEach((item, idx) => {
                    searchRecursive(item, path ? `${path}[${idx}]` : `[${idx}]`);
                });
            } else if (typeof current === 'object' && current !== null) {
                Object.entries(current).forEach(([key, value]) => {
                    // Überspringe interne Felder
                    if (key.startsWith('_')) return;

                    const newPath = path ? `${path}.${key}` : key;
                    searchRecursive(value, newPath);
                });
            } else if (typeof current === 'number') {
                if (current.toString().includes(term)) {
                    totalRelevance += 3;
                    matchedFields.push(path || 'value');
                }
            }
        };

        searchRecursive(obj);

        return totalRelevance > 0 ? { relevance: totalRelevance, matchedFields } : null;
    }

    /**
     * Berechnet Relevanz für einen String
     */
    private calculateStringRelevance(str: string, term: string): number {
        const lower = str.toLowerCase();

        if (lower === term) return 20; // Exakte Übereinstimmung
        if (lower.startsWith(term)) return 15; // Beginnt mit
        if (lower.endsWith(term)) return 12; // Endet mit
        if (lower.includes(` ${term} `)) return 10; // Ganzes Wort
        if (lower.includes(term)) return 7; // Enthält

        // Fuzzy: Wort-Teile
        const words = term.split(' ');
        if (words.length > 1 && words.every(w => lower.includes(w))) {
            return 5; // Alle Wörter enthalten
        }

        return 0;
    }

    /**
     * Versucht einen sinnvollen Titel aus dem Objekt zu extrahieren
     */
    private extractTitle(item: Searchable): string {
        // Typische Titel-Felder in Priorität
        const titleFields = ['title', 'name', 'position', 'company', 'heading'];

        for (const field of titleFields) {
            if (item[field] && typeof item[field] === 'string') {
                return item[field];
            }
        }

        // Kombiniere mehrere Felder
        if (item['position'] && item['company']) {
            return `${item['position']} bei ${item['company']}`;
        }

        return item._searchableId;
    }

    /**
     * Extrahiert einen Untertitel
     */
    private extractSubtitle(item: Searchable): string | undefined {
        // Typische Untertitel-Felder
        const subtitleFields = ['subtitle', 'location', 'date', 'category'];

        for (const field of subtitleFields) {
            if (item[field] && typeof item[field] === 'string') {
                return item[field];
            }
        }

        // Zeitraum zusammenstellen
        if (item['startMonth'] && item['endMonth']) {
            return `${item['startMonth']} - ${item['endMonth']}`;
        }

        return undefined;
    }

    /**
     * Extrahiert eine Beschreibung
     */
    private extractDescription(item: Searchable): string | undefined {
        const descFields = ['description', 'excerpt', 'summary', 'content'];

        for (const field of descFields) {
            if (item[field] && typeof item[field] === 'string') {
                const desc = item[field];
                return desc.length > 150 ? desc.substring(0, 150) + '...' : desc;
            }
        }

        return undefined;
    }

    getAllPages(): BasePageMeta[] {
        return Array.from(this.pages.values());
    }

    getPageBySlug(slug: string): BasePageMeta | undefined {
        return this.pages.get(slug);
    }
}

// Singleton
export const searchService = new SearchService();
