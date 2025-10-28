import {type RefObject} from 'react';
import {type TabSystemRef, type Tab} from '../components/tabs/TabSystem.tsx';
import {type PageEntry} from '../lib/buildFileTree';
import {pushHistoryState} from './useHistoryStatus';

interface UseNavigationProps {
    pages: Record<string, PageEntry>;
    tabSystemRef: RefObject<TabSystemRef | null>;
    setCurrentPage: (page: PageEntry | null) => void;
    setRoutePath: (path: string) => void;
}

export function useNavigation({
                                  pages,
                                  tabSystemRef,
                                  setCurrentPage,
                                  setRoutePath
                              }: UseNavigationProps) {


    function navigateTo(path: string, updateHistory: boolean = true) {
        const fullPath = normalizePath(path);
        if (updateHistory && window.location.pathname !== fullPath) {
            // Use our custom pushHistoryState instead of navigate
            // This way we control the history state tracking
            pushHistoryState(fullPath);
            setRoutePath(fullPath);
        } else if (!updateHistory) {
            setRoutePath(fullPath);
        }

        // Extract the actual page path (remove /ide prefix if present)
        const actualPath = fullPath.replace(/^\/ide/, '');
        const cleanedPath = actualPath.replace(/^\/+/, '').replace(/\/+$/, '');

        // Case-insensitive page lookup
        const pageEntry = findPageCaseInsensitive(cleanedPath);

        if (pageEntry) {
            setCurrentPage(pageEntry);

            const tab: Tab = {
                id: cleanedPath || 'home',
                title: getTabTitle(cleanedPath, pageEntry),
                path: fullPath,
                component: pageEntry.component,
                scrollPosition: 0
            };

            tabSystemRef.current?.openTab(tab);
        } else {
        }
    }

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

    function normalizePath(path: string): string {
        let fullPath = `${path.startsWith('/') ? path : '/' + path}`;
        fullPath = fullPath.replace(/^\/homepage/, '');

        // Always ensure /ide prefix for IDE view
        // Check if path already has /ide prefix
        if (!fullPath.startsWith('/ide')) {
            // Check if we're supposed to be in IDE mode by checking current location OR localStorage
            const currentPathIsIde = window.location.pathname.startsWith('/ide');
            const preferredMode = localStorage.getItem('preferred_view_mode');

            // If either condition is true, add /ide prefix
            if (currentPathIsIde || preferredMode === 'ide') {
                fullPath = fullPath === '/' ? '/ide' : `/ide${fullPath}`;
            }
        }

        return fullPath;
    }

    function getTabTitle(path: string, entry: PageEntry): string {
        if (!path) return 'Home';

        const parts = path.split('/').filter(Boolean);
        const lastName = parts[parts.length - 1];

        const formatted = lastName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        if (entry.component) {
            return `${formatted}`;
        }

        return formatted;
    }

    return {navigateTo, getTabTitle};
}