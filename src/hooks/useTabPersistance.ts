import {useEffect, type RefObject} from 'react';
import {type PageEntry} from '../lib/buildFileTree';
import type {Tab} from "../components/tabs/types.ts";
import type {TabSystemRef} from "../components/tabs/TabSystem.tsx";

interface UseTabPersistenceProps {
    pages: Record<string, PageEntry>;
    tabSystemRef: RefObject<TabSystemRef | null>;
    navigateTo: (path: string, updateHistory?: boolean) => void;
    setCurrentPage: (page: PageEntry | null) => void;
}

interface SavedTab {
    id: string;
    title: string;
    path: string;
    scrollPosition?: number;
}

interface SavedTabsState {
    tabs: SavedTab[];
    activeTabId: string | null;
}

const STORAGE_KEY = 'tabs_state';

export function useTabPersistence({
                                      pages,
                                      tabSystemRef,
                                      navigateTo,
                                      setCurrentPage
                                  }: UseTabPersistenceProps) {

    // Helper function for case-insensitive page lookup
    function findPageCaseInsensitive(path: string): PageEntry | undefined {
        // First try exact match
        if (pages[path]) {
            return pages[path];
        }

        // Then try case-insensitive match
        const lowerPath = path.toLowerCase();
        const matchingKey = Object.keys(pages).find(
            key => key.toLowerCase() === lowerPath
        );

        return matchingKey ? pages[matchingKey] : undefined;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentPath = window.location.pathname;
            // Remove /ide prefix to get actual page path
            const actualPath = currentPath.replace(/^\/ide/, '');
            const cleanedPath = actualPath.replace(/^\/+/, '').replace(/\/+$/, '');

            const stored = sessionStorage.getItem(STORAGE_KEY);

            if (stored) {
                restoreSavedTabs(stored, currentPath, cleanedPath);
            } else {
                openInitialTab(cleanedPath, currentPath);
            }
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    function restoreSavedTabs(stored: string, currentPath: string, cleanedPath: string) {
        try {
            const {tabs: savedTabs, activeTabId}: SavedTabsState = JSON.parse(stored);

            // Open all saved tabs
            for (const savedTab of savedTabs) {
                const pageEntry = findPageCaseInsensitive(savedTab.id);
                if (pageEntry) {
                    const tab: Tab = {
                        id: savedTab.id,
                        title: savedTab.title,
                        path: savedTab.path,
                        component: pageEntry.component,
                        scrollPosition: savedTab.scrollPosition
                    };
                    tabSystemRef.current?.openTab(tab);
                }
            }

            // Handle current route - case-insensitive path comparison
            const currentTab = savedTabs.find((t) =>
                t.path.toLowerCase() === currentPath.toLowerCase()
            );
            if (currentTab) {
                activateTab(currentTab.id, currentPath);
            } else if (cleanedPath && findPageCaseInsensitive(cleanedPath)) {
                navigateTo(currentPath, false);
            } else {
                activateLastActiveTab(savedTabs, activeTabId);
            }
        } catch (e) {
            console.warn('Failed to restore tabs:', e);
            openInitialTab(cleanedPath, currentPath);
        }
    }

    function activateTab(tabId: string, path: string) {
        tabSystemRef.current?.activateTabByPath(path);
        const pageEntry = findPageCaseInsensitive(tabId);
        if (pageEntry) {
            setCurrentPage(pageEntry);
        }
    }

    function activateLastActiveTab(savedTabs: SavedTab[], activeTabId: string | null) {
        const activeTab = savedTabs.find((t) => t.id === activeTabId);
        if (activeTab) {
            window.history.replaceState({}, '', activeTab.path);
            tabSystemRef.current?.activateTabByPath(activeTab.path);
            const pageEntry = findPageCaseInsensitive(activeTab.id);
            if (pageEntry) {
                setCurrentPage(pageEntry);
            }
        }
    }

    function openInitialTab(cleanedPath: string, currentPath: string) {
        if (findPageCaseInsensitive(cleanedPath)) {
            navigateTo(currentPath, false);
        } else if (findPageCaseInsensitive('')) {
            navigateTo('/', false);
        }
    }
}