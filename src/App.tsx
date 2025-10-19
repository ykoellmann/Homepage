import './App.css'
import {useState, useRef, useEffect} from 'react';
import {Header} from './components/layout/Header';
import {Sidebar} from './components/layout/Sidebar';
import {Explorer} from './components/layout/Explorer';
import {BreadcrumbFooter} from './components/BreadcrumbFooter.tsx';
import TabSystem, {type Tab, type TabSystemRef} from './components/tabs/TabSystem.tsx';
import {buildFileTreeFromGlob, type PageEntry} from './lib/buildFileTree';
import {type RunConfig} from './components/run-controls/RunControls.tsx';
import {useNavigation} from './hooks/useNavigation';
import {useTabPersistence} from './hooks/useTabPersistance.ts';

function App() {
    const [showExplorer, setShowExplorer] = useState(true);
    const [explorerWidth, setExplorerWidth] = useState<number>(260);
    const resizingRef = useRef(false);
    const tabSystemRef = useRef<TabSystemRef | null>(null);

    const {tree, pages} = buildFileTreeFromGlob();
    const [currentPage, setCurrentPage] = useState<PageEntry | null>(null);
    const [routePath, setRoutePath] = useState<string>(window.location.pathname);

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

    // Browser back/forward navigation
    useEffect(() => {
        const onPopState = () => {
            const newPath = window.location.pathname;
            setRoutePath(newPath);

            const tabs = tabSystemRef.current?.getAllTabs() || [];
            const existingTab = tabs.find((t: Tab) => t.path === newPath);

            if (existingTab) {
                tabSystemRef.current?.activateTabByPath(newPath);
            } else {
                const cleanedPath = newPath.replace(/^\/+/, '').replace(/\/+$/, '');
                const pageEntry = pages[cleanedPath];
                if (pageEntry) {
                    navigateTo(newPath, false);
                }
            }
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [pages, navigateTo]);

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
        console.log("Stop clicked");
    }

    function handleFileOpen(path: string) {
        const cleanPath = path.replace(/\.(txt|md|html|tsx|ts|js)$/i, '').replace(/^\/+/, '');
        navigateTo(`/${cleanPath}`);
    }

    return (
        <div className="app-root">
            <Header
                runConfigs={runConfigs}
                currentPage={currentPage}
                onRun={handleRun}
                onDebug={handleDebug}
                onStop={handleStop}
            />

            <Sidebar onToggleExplorer={() => setShowExplorer(v => !v)} />

            <BreadcrumbFooter
                path={routePath}
                onNavigate={navigateTo}
                onOpenFolder={handleOpenFolder}
                tree={tree}
            />

            <div className="main">
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
        </div>
    )
}

export default App