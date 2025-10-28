import { keymapService } from './keymapService';

export interface ShortcutHandlers {
    onSearchOpen: () => void;
    onSettingsOpen: () => void;
    onBreadcrumbOpen: () => void;
}

export function registerAllShortcuts(handlers: ShortcutHandlers) {
    // Search Everywhere - Ctrl+Shift+A
    keymapService.registerAction({
        id: 'search.everywhere',
        name: 'Search Everywhere',
        description: 'Open global search dialog',
        category: 'navigation',
        defaultBinding: {
            key: 'a',
            ctrl: true,
            shift: true
        },
        allowRebind: true,
        handler: () => {
            handlers.onSearchOpen();
        }
    });

    // Search Everywhere - Ctrl+Shift+F (alternative)
    keymapService.registerAction({
        id: 'search.everywhere.alt',
        name: 'Search Everywhere (Alt)',
        description: 'Open global search dialog (alternative shortcut)',
        category: 'navigation',
        defaultBinding: {
            key: 'f',
            ctrl: true,
            shift: true
        },
        allowRebind: true,
        handler: () => {
            handlers.onSearchOpen();
        }
    });

    // Settings - Ctrl+Alt+S
    keymapService.registerAction({
        id: 'settings.open',
        name: 'Open Settings',
        description: 'Open settings dialog',
        category: 'general',
        defaultBinding: {
            key: 's',
            ctrl: true,
            alt: true
        },
        allowRebind: true,
        handler: () => {
            handlers.onSettingsOpen();
        }
    });

    // Breadcrumb Navigation - Ctrl+F2
    keymapService.registerAction({
        id: 'breadcrumb.open',
        name: 'Open Breadcrumb',
        description: 'Open breadcrumb navigation menu',
        category: 'navigation',
        defaultBinding: {
            key: 'F2',
            code: 'F2',
            ctrl: true
        },
        allowRebind: true,
        handler: () => {
            handlers.onBreadcrumbOpen();
        }
    });

    // System shortcuts (not rebindable)
    keymapService.registerAction({
        id: 'dialog.close',
        name: 'Close Dialog',
        description: 'Close the current dialog or popup',
        category: 'general',
        defaultBinding: {
            key: 'Escape'
        },
        allowRebind: false,
        handler: () => {
            // Handled by individual dialogs
        }
    });

    keymapService.registerAction({
        id: 'navigation.back',
        name: 'Navigate Back',
        description: 'Go back in history',
        category: 'navigation',
        defaultBinding: {
            key: 'ArrowLeft',
            alt: true
        },
        allowRebind: false,
        handler: () => {
            window.history.back();
        }
    });

    keymapService.registerAction({
        id: 'navigation.forward',
        name: 'Navigate Forward',
        description: 'Go forward in history',
        category: 'navigation',
        defaultBinding: {
            key: 'ArrowRight',
            alt: true
        },
        allowRebind: false,
        handler: () => {
            window.history.forward();
        }
    });
}

export function unregisterAllShortcuts() {
    keymapService.unregisterAction('search.everywhere');
    keymapService.unregisterAction('search.everywhere.alt');
    keymapService.unregisterAction('settings.open');
    keymapService.unregisterAction('breadcrumb.open');
    keymapService.unregisterAction('dialog.close');
    keymapService.unregisterAction('navigation.back');
    keymapService.unregisterAction('navigation.forward');
}
