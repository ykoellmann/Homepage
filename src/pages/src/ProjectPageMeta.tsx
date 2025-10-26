import type {BasePageMeta} from "../../lib/basePage.ts";

export interface ProjectPageMeta extends BasePageMeta {
    // Zusätzliche Felder für Projekt-Seiten
    technologies?: string[];
    githubUrl?: string;
    liveUrl?: string;
}