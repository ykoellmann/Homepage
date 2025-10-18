import './App.css'
import { ArrowLeft, ArrowRight, Folder, Search, Settings, Tally4 } from "lucide-react";
import { HoverButton } from "./components/hover-button.tsx";
import logo from './assets/logo.svg'
import { ProjectIcon } from "./components/project-icon.tsx";
import {type RunConfig, RunControls} from './components/run-controls.tsx';
import {FileExplorer} from './components/file-explorer.tsx';
import {useEffect, useRef, useState} from 'react';
import {BreadcrumbFooter} from "./components/breadcrumb-footer.tsx";
import {buildFileTreeFromGlob, type PageEntry} from "./lib/buildFileTree.ts";

function App() {

    const [showExplorer, setShowExplorer] = useState(true);
    const [explorerWidth, setExplorerWidth] = useState<number>(260);
    const resizingRef = useRef(false);
    const { tree, pages } = buildFileTreeFromGlob();
    const runConfigs = Object.values(pages)
        .map(p => p.meta?.runConfig)
        .filter(Boolean);
    const [currentPage, setCurrentPage] = useState<PageEntry | null>(null);
    const [currentPath, setCurrentPath] = useState<PageEntry | null>(null);

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
        const onPop = () => setRoutePath(window.location.pathname);
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    function navigateTo(path: string) {
        let fullPath = `${path.startsWith('/') ? path : '/' + path}`;
        fullPath = fullPath.replace(/^\/homepage/, '');
        console.log(`Navigate to ${fullPath}`);
        if (window.location.pathname !== fullPath) {
            window.history.pushState({}, '', fullPath);
            setRoutePath(fullPath);

            const cleanedPath = fullPath.replace(/^\/+/, '').replace(/\/+$/, '');
            setCurrentPath(pages[cleanedPath]);
            console.log("pages",pages);
            if (pages[cleanedPath]) {
                setCurrentPage(pages[cleanedPath]);
            }
        }
    }
    const handleOpenFolder = (newPath: string) => {
        setRoutePath(newPath);
        // NICHT router.push
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
        // später: Lauf abbrechen, Simulation stoppen, o.ä.
    }

    return (
        <div className="app-root">
            <div className="header gap-2">
                <div className="flex items-center gap-2">
                    <img src={logo} height="70%" />
                    <HoverButton><Tally4 className="rotate-90 icon" /></HoverButton>
                    <HoverButton><ArrowLeft className="icon" /></HoverButton>
                    <HoverButton><ArrowRight className="icon" /></HoverButton>

                    <HoverButton className="flex items-center gap-2">
                        <ProjectIcon />
                        Homepage
                    </HoverButton>
                </div>
                <div className="sidebar">
                    <HoverButton active title="Project" onClick={() => setShowExplorer(v => !v)}>
                        <Folder className="icon" />
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
                    <HoverButton><Search className="icon" /></HoverButton>
                    <HoverButton><Settings className="icon" /></HoverButton>
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
                        style={{ width: explorerWidth }}
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
                <div className="content">
                    {(() => {
                        let cleanPath = routePath.replace(/^\/+/, '').replace(/\/+$/, '');

                        if (!currentPage) {
                            return <div className="text-[#f87171]">Seite nicht gefunden: {cleanPath}</div>;
                        }

                        const Component = currentPage.component;
                        return <Component />;
                    })()}
                </div>
            </div>
        </div>
    )
}

export default App
