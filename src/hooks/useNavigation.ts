import {type RefObject} from 'react';
import {type TabSystemRef, type Tab} from '../components/tabs/TabSystem.tsx';
import {type PageEntry} from '../lib/buildFileTree';

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
        console.log(`Navigate to ${fullPath}`);

        if (updateHistory && window.location.pathname !== fullPath) {
            window.history.pushState({}, '', fullPath);
            setRoutePath(fullPath);
        } else if (!updateHistory) {
            setRoutePath(fullPath);
        }

        const cleanedPath = fullPath.replace(/^\/+/, '').replace(/\/+$/, '');
        const pageEntry = pages[cleanedPath];

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
            console.warn('Page not found:', cleanedPath);
        }
    }

    function normalizePath(path: string): string {
        let fullPath = `${path.startsWith('/') ? path : '/' + path}`;
        return fullPath.replace(/^\/homepage/, '');
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
            return `${formatted}.tsx`;
        }

        return formatted;
    }

    return {navigateTo, getTabTitle};
}