import './App.css'
import {useState, useRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Header} from './components/layout/Header';
import {Sidebar} from './components/layout/Sidebar';
import {Explorer} from './components/layout/Explorer';
import {BreadcrumbFooter, type BreadcrumbFooterRef} from './components/BreadcrumbFooter.tsx';
import {Terminal} from './components/Terminal.tsx';
import TabSystem, {type Tab, type TabSystemRef} from './components/tabs/TabSystem.tsx';
import {buildFileTreeFromGlob, type PageEntry} from './lib/buildFileTree';
import {type RunConfig} from './components/run-controls/RunControls.tsx';
import {useNavigation} from './hooks/useNavigation';
import {useTabPersistence} from './hooks/useTabPersistance.ts';
import {handlePopState as syncHistoryState} from './hooks/useHistoryStatus';
import {registerAllPages} from './lib/registerPages.ts';
import {useViewMode} from './contexts/ViewModeContext';
import {ModernView} from './components/ModernView';
import {ImpressumPage} from './components/ImpressumPage';
import SplashScreen from "./components/Splashscreen.tsx";
import {registerAllShortcuts, unregisterAllShortcuts} from './lib/registerShortcuts.ts';
import i18n from './i18n';

function App() {
    const { t } = useTranslation();
    const {viewMode} = useViewMode();
    const [showExplorer, setShowExplorer] = useState(true);
    const [explorerWidth, setExplorerWidth] = useState<number>(260);
    const [showTerminal, setShowTerminal] = useState(false);
    const [terminalHeight, setTerminalHeight] = useState<number>(300);
    const [isResizingTerminal, setIsResizingTerminal] = useState(false);
    const resizingRef = useRef(false);
    const tabSystemRef = useRef<TabSystemRef | null>(null);
    const breadcrumbRef = useRef<BreadcrumbFooterRef | null>(null);

    const {tree, pages} = buildFileTreeFromGlob();

    // Register pages with search service and update on language change
    useEffect(() => {
        registerAllPages(t);

        // Re-register when language changes
        const handleLanguageChange = () => {
            registerAllPages(t);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [t]);
    const [currentPage, setCurrentPage] = useState<PageEntry | null>(null);
    const [routePath, setRoutePath] = useState<string>(window.location.pathname);
    const [searchOpen, setSearchOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const runConfigs = Object.values(pages)
        .map(p => p.meta?.runConfig)
        .filter((cfg): cfg is RunConfig => cfg !== undefined
            && (cfg.url !== undefined || cfg?.debugUrl !== undefined));

    const {navigateTo} = useNavigation({
        pages,
        tabSystemRef,
        setCurrentPage,
        setRoutePath
    });

    useTabPersistence({
        pages,
        tabSystemRef,
        navigateTo,
        setCurrentPage
    });

    // Handle GitHub Pages SPA redirect from 404.html
    useEffect(() => {
        const redirect = sessionStorage.getItem('spa_redirect');
        if (redirect) {
            sessionStorage.removeItem('spa_redirect');
            window.history.replaceState(null, '', redirect);
            navigateTo(redirect, false);
        }
    }, [navigateTo]);

    // Browser back/forward navigation
    useEffect(() => {
        const onNavigationPopState = (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log('🔙 Navigation popstate:', customEvent.detail);

            syncHistoryState();
            const newPath = customEvent.detail.pathname;
            setRoutePath(newPath);

            const actualPath = newPath.replace(/^\/ide/, '');
            const cleanedPath = actualPath.replace(/^\/+/, '').replace(/\/+$/, '');

            // Case-insensitive page lookup
            const pageEntry = findPageCaseInsensitive(cleanedPath, pages);

            if (!pageEntry) return;

            const tabs = tabSystemRef.current?.getAllTabs() || [];
            const existingTab = tabs.find((t: Tab) => {
                const tabActualPath = t.path.replace(/^\/ide/, '');
                return tabActualPath === actualPath;
            });

            if (existingTab) {
                setCurrentPage(pageEntry);
                tabSystemRef.current?.activateTabByPath(newPath);
            } else {
                navigateTo(newPath, false);
            }
        };

        window.addEventListener('navigation:popstate', onNavigationPopState);
        return () => window.removeEventListener('navigation:popstate', onNavigationPopState);
    }, [pages, navigateTo, setCurrentPage]);

    function findPageCaseInsensitive(path: string, pagesObj: Record<string, PageEntry>): PageEntry | undefined {
        // First try exact match
        if (pagesObj[path]) {
            return pagesObj[path];
        }

        // Then try case-insensitive match
        const lowerPath = path.toLowerCase();
        const matchingKey = Object.keys(pagesObj).find(
            key => key.toLowerCase() === lowerPath
        );

        return matchingKey ? pagesObj[matchingKey] : undefined;
    }

    // Register keyboard shortcuts
    useEffect(() => {
        registerAllShortcuts({
            onSearchOpen: () => setSearchOpen(true),
            onSettingsOpen: () => setSettingsOpen(true),
            onBreadcrumbOpen: () => breadcrumbRef.current?.openLowestFolder()
        });

        return () => {
            unregisterAllShortcuts();
        };
    }, []);

    function handleResizeStart(e: React.MouseEvent) {
        resizingRef.current = true;
        const startX = e.clientX;
        const startWidth = explorerWidth;

        const onMove = (ev: MouseEvent) => {
            if (!resizingRef.current) return;
            const dx = ev.clientX - startX;
            const next = Math.min(520, Math.max(180, startWidth + dx));
            setExplorerWidth(next);
        };

        const onUp = () => {
            resizingRef.current = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        e.preventDefault();
    }

    function handleOpenFolder(newPath: string) {
        setRoutePath(newPath);
    }

    function handleRun(cfg: RunConfig) {
        const target = cfg?.url || currentPage?.meta?.runConfig?.url;
        if (target) window.open(target, "_blank");
    }

    function handleDebug(cfg: RunConfig) {
        const target = cfg?.debugUrl || cfg?.url || currentPage?.meta?.runConfig?.debugUrl;
        if (target) window.open(target, "_blank");
    }

    function handleStop() {
    }

    function handleFileOpen(path: string) {
        const cleanPath = path.replace(/\.(txt|md|html|tsx|ts|js)$/i, '').replace(/^\/+/, '');
        navigateTo(`/${cleanPath}`);
    }

    // Check if we're on the impressum page
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath === '/impressum' || currentPath === '/imprint') {
        return <ImpressumPage />;
    }

    // If in modern view, render that instead (after all hooks)
    if (viewMode === 'modern') {
        return <ModernView/>;
    }

    return (
        <div className="app-root">
            <SplashScreen>

            </SplashScreen>
            <Header
                runConfigs={runConfigs}
                currentPage={currentPage}
                onRun={handleRun}
                onDebug={handleDebug}
                onStop={handleStop}
                searchOpen={searchOpen}
                setSearchOpen={setSearchOpen}
                settingsOpen={settingsOpen}
                setSettingsOpen={setSettingsOpen}
            />

            <Sidebar
                onToggleExplorer={() => setShowExplorer(v => !v)}
                onToggleTerminal={() => setShowTerminal(v => !v)}
                terminalOpen={showTerminal}
            />

            <BreadcrumbFooter
                ref={breadcrumbRef}
                path={routePath}
                onNavigate={navigateTo}
                onOpenFolder={handleOpenFolder}
                tree={tree}
            />

            <div className="main">
                <div
                    className="flex flex-col"
                    style={{
                        width: '100%',
                        height: '100%',
                        pointerEvents: isResizingTerminal ? 'none' : 'auto'
                    }}
                >
                    <div
                        className="flex flex-1 overflow-hidden"
                        style={{
                            width: '100%',
                            flex: showTerminal ? `0 0 calc(100% - ${terminalHeight}px)` : '1 1 100%'
                        }}
                    >
                        {showExplorer && (
                            <Explorer
                                tree={tree}
                                width={explorerWidth}
                                onResizeStart={handleResizeStart}
                                onFileOpen={handleFileOpen}
                            />
                        )}

                        <div className="content">
                            <TabSystem
                                ref={tabSystemRef}
                                onTabChange={(tab) => {
                                    if (tab) {
                                        setCurrentPage(pages[tab.id] || null);
                                        setRoutePath(tab.path);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {showTerminal && (
                        <Terminal
                            pages={Object.values(pages)}
                            isOpen={showTerminal}
                            height={terminalHeight}
                            onHeightChange={setTerminalHeight}
                            onResizeStart={() => setIsResizingTerminal(true)}
                            onResizeEnd={() => setIsResizingTerminal(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default App