/**
 * TypeScript interface for common translations
 * Defines the structure of common.json translation files
 */
export interface CommonTranslations {
    nav: {
        about: string;
        projects: string;
        contact: string;
    };
    sections: {
        features: string;
        techStack: string;
        about: string;
        aboutGame: string;
        gameplayHighlights: string;
        team: string;
        installation: string;
        support: string;
        keyboardShortcuts: string;
    };
    buttons: {
        githubRepository: string;
        github: string;
        marketplace: string;
    };
    languages: {
        de: string;
        en: string;
    };
    emptyState: {
        shortcuts: {
            search: string;
            navigationBar: string;
            settings: string;
        };
        runControls: {
            title: string;
            description: string;
        };
        info: string;
    };
}
