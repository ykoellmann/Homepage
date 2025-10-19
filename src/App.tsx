import './App.css'
import {ArrowLeft, ArrowRight, Folder, Search, Settings, Tally4} from "lucide-react";
import {HoverButton} from "./components/hover-button.tsx";
import logo from './assets/logo.svg'
import {ProjectIcon} from "./components/project-icon.tsx";
import {type RunConfig, RunControls} from './components/run-controls.tsx';
import {FileExplorer} from './components/file-explorer.tsx';
import {useEffect, useRef, useState} from 'react';
import {BreadcrumbFooter} from "./components/breadcrumb-footer.tsx";
import {buildFileTreeFromGlob, type PageEntry} from "./lib/buildFileTree.ts";
import TabSystem, {type Tab, type TabSystemRef} from "./components/tab-system.tsx";

function App() {
    const [showExplorer, setShowExplorer] = useState(true);
    const [explorerWidth, setExplorerWidth] = useState<number>(260);
    const resizingRef = useRef(false);
    const {tree, pages} = buildFileTreeFromGlob();
    const runConfigs = Object.values(pages)
        .map(p => p.meta?.runConfig)
        .filter((cfg): cfg is RunConfig => cfg !== undefined
            && (cfg.url !== undefined
                || cfg?.debugUrl !== undefined));
    const [currentPage, setCurrentPage] = useState<PageEntry | null>(null);
    const [, setCurrentPath] = useState<PageEntry | null>(null);

    // Tab system reference
    const tabSystemRef = useRef<TabSystemRef>(null);

    function onResizeStart(e: React.MouseEvent) {
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

    // Simple client-side routing to support subpages like /about
    const [routePath, setRoutePath] = useState<string>(window.location.pathname);

    useEffect(() => {
        const onPop = () => {
            const newPath = window.location.pathname;
            setRoutePath(newPath);

            // Aktiviere den Tab für diese Route, falls vorhanden
            const tabs = tabSystemRef.current?.getAllTabs() || [];
            const existingTab = tabs.find((t: Tab) => t.path === newPath);

            if (existingTab) {
                // Tab existiert bereits, aktiviere ihn
                tabSystemRef.current?.activateTabByPath(newPath);
            } else {
                // Tab existiert nicht, öffne ihn
                const cleanedPath = newPath.replace(/^\/+/, '').replace(/\/+$/, '');
                const pageEntry = pages[cleanedPath];
                if (pageEntry) {
                    navigateTo(newPath, false); // false = don't update history
                }
            }
        };

        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, [pages]);

    function navigateTo(path: string, updateHistory: boolean = true) {
        let fullPath = `${path.startsWith('/') ? path : '/' + path}`;
        fullPath = fullPath.replace(/^\/homepage/, '');
        console.log(`Navigate to ${fullPath}`);

        // Browser History aktualisieren (nur wenn gewünscht)
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
            setCurrentPath(pageEntry);

            // Tab öffnen über Ref
            const tab: Tab = {
                id: cleanedPath || 'home',
                title: getTabTitle(cleanedPath, pageEntry),
                path: fullPath,
                component: pageEntry.component,
                scrollPosition: 0
            };

            // Verwende die ref um Tab zu öffnen
            tabSystemRef.current?.openTab(tab);
        } else {
            console.warn('Page not found:', cleanedPath);
        }
    }

    // Hilfsfunktion um einen schönen Tab-Titel zu erstellen
    function getTabTitle(path: string, entry: PageEntry): string {
        if (!path) return 'Home';

        // Nimm den letzten Teil des Pfads
        const parts = path.split('/').filter(Boolean);
        const lastName = parts[parts.length - 1];

        // Formatiere: "some-page" -> "Some Page"
        const formatted = lastName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Füge passende Dateierweiterung hinzu
        if (entry.component) {
            return `${formatted}.tsx`;
        }

        return formatted;
    }

    const handleOpenFolder = (newPath: string) => {
        setRoutePath(newPath);
    };

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

    // Lade initiale Seite beim Start
    useEffect(() => {
        // Warte bis TabSystem gemounted ist
        const timer = setTimeout(() => {
            const currentPath = window.location.pathname;
            const cleanedPath = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');

            // Lade gespeicherte Tabs aus sessionStorage
            const stored = sessionStorage.getItem('tabs_state');
            if (stored) {
                try {
                    const {tabs: savedTabs, activeTabId} = JSON.parse(stored);

                    // Öffne alle gespeicherten Tabs
                    for (const savedTab of savedTabs) {
                        const pageEntry = pages[savedTab.id];
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

                    // Wenn aktuelle Route einen Tab hat, aktiviere ihn
                    const currentTab = savedTabs.find((t: any) => t.path === currentPath);
                    if (currentTab) {
                        tabSystemRef.current?.activateTabByPath(currentPath);
                        const pageEntry = pages[currentTab.id];
                        if (pageEntry) {
                            setCurrentPage(pageEntry);
                        }
                    } else if (cleanedPath && pages[cleanedPath]) {
                        // Route hat keinen gespeicherten Tab, öffne ihn
                        navigateTo(currentPath, false);
                    } else {
                        // Aktiviere den zuletzt aktiven Tab
                        const activeTab = savedTabs.find((t: any) => t.id === activeTabId);
                        if (activeTab) {
                            window.history.replaceState({}, '', activeTab.path);
                            tabSystemRef.current?.activateTabByPath(activeTab.path);
                            const pageEntry = pages[activeTab.id];
                            if (pageEntry) {
                                setCurrentPage(pageEntry);
                            }
                        }
                    }

                    return;
                } catch (e) {
                    console.warn('Failed to restore tabs:', e);
                }
            }

            // Keine gespeicherten Tabs: öffne aktuelle Route oder Home
            if (pages[cleanedPath]) {
                navigateTo(currentPath, false);
            } else if (pages['']) {
                navigateTo('/', false);
            }
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="app-root">
            <div className="header gap-2">
                <div className="flex items-center gap-2">
                    <img src={logo} height="70%"/>
                    <HoverButton><Tally4 className="rotate-90 icon"/></HoverButton>
                    <HoverButton><ArrowLeft className="icon"/></HoverButton>
                    <HoverButton><ArrowRight className="icon"/></HoverButton>

                    <HoverButton className="flex items-center gap-2">
                        <ProjectIcon/>
                        Homepage
                    </HoverButton>
                </div>
                <div className="sidebar">
                    <HoverButton active title="Project" onClick={() => setShowExplorer(v => !v)}>
                        <Folder className="icon"/>
                    </HoverButton>
                </div>

                <div className="flex items-center gap-2">
                    <RunControls
                        configs={runConfigs}
                        currentConfig="cryptborne"
                        currentPage={currentPage}
                        onRun={handleRun}
                        onDebug={handleDebug}
                        onStop={handleStop}
                    />
                    <div className="p-3"></div>
                    <HoverButton><Search className="icon"/></HoverButton>
                    <HoverButton><Settings className="icon"/></HoverButton>
                </div>
            </div>
            <BreadcrumbFooter
                path={routePath}
                onNavigate={(p) => navigateTo(p)}
                onOpenFolder={handleOpenFolder}
                tree={tree}
            />
            <div className="main">
                {showExplorer && (
                    <div
                        className="explorer"
                        style={{width: explorerWidth}}
                    >
                        <div className="explorer-content">
                            <FileExplorer
                                data={tree}
                                onOpenFile={(node) => {
                                    const isTxt = node.name.toLowerCase().endsWith('.txt');
                                    if (node.path) {
                                        const path = node.path.replace(/\.(txt|md|html|tsx|ts|js)$/i, '').replace(/^\/+/, '');
                                        navigateTo(`/${path}`);
                                        return;
                                    }
                                    if (isTxt) {
                                        const base = node.name.replace(/\.[^.]+$/, '');
                                        navigateTo(`/${base}`);
                                        return;
                                    }
                                }}
                            />
                        </div>
                        <div
                            onMouseDown={onResizeStart}
                            className="resize-handle"
                            title="Resize"
                        />
                    </div>
                )}

                {/* Tab System ersetzt den alten Content-Bereich */}
                <div className="content">
                    <TabSystem
                        ref={tabSystemRef}
                        onTabChange={(tab) => {
                            if (tab) {
                                setCurrentPage(pages[tab.id] || null);
                                // Update route path state (history is already updated in TabSystem)
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