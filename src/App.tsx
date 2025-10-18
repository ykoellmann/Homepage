import './App.css'
import { ArrowLeft, ArrowRight, Folder, Search, Settings, Tally4 } from "lucide-react";
import { HoverButton } from "./components/hover-button.tsx";
import logo from './assets/logo.svg'
import { ProjectIcon } from "./components/project-icon.tsx";
import {type RunConfig, RunControls} from './components/run-controls.tsx';
import {FileExplorer, type FileNode} from './components/file-explorer.tsx';
import {useEffect, useRef, useState} from 'react';
import {BreadcrumbFooter} from "./components/breadcrumb-footer.tsx";

function App() {

    const [showExplorer, setShowExplorer] = useState(true);
    const [explorerWidth, setExplorerWidth] = useState<number>(260);
    const resizingRef = useRef(false);

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

    const runConfigs: RunConfig[] = [
        {
            name: "cryptborne",
            url: "https://jy-studios.github.io/cryptborne/",
            debugUrl: "https://github.com/JY-Studios/cryptborne",
        },
        {
            name: "SatTrak",
            debugUrl: "https://github.com/JanVogt06/SatTrak-SatelliteVisualization",
        },
        {
            name: "cteXecutor",
            url: "https://plugins.jetbrains.com/plugin/27835-ctexecutor/",
            debugUrl: "https://github.com/ykoellmann/cteXecutor",
        }
    ];

    // Simulierter Zustand für "current file"
    const currentFileUrl = "https://jy-studios.github.io/cryptborne/";

    // Simple client-side routing to support subpages like /about
    const [routePath, setRoutePath] = useState<string>(window.location.pathname);
    useEffect(() => {
        const onPop = () => setRoutePath(window.location.pathname);
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    function navigateTo(path: string) {
        const fullPath = `/homepage${path.startsWith('/') ? path : '/' + path}`;
        if (window.location.pathname !== fullPath) {
            window.history.pushState({}, '', fullPath);
            setRoutePath(fullPath);
        }
    }

    // Project tree state loaded from JSON
    const [projectTree, setProjectTree] = useState<FileNode[]>([]);

    useEffect(() => {
        fetch('/files.json')
            .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
            .then((data: FileNode[]) => setProjectTree(data))
            .catch(() => {
                // Fallback sample if fetch fails (e.g., local file not served)
                setProjectTree([
                    {
                        name: "homepage",
                        type: "folder",
                        children: [
                            { name: "index.html", type: "file", path: "/index.html" },
                            { name: "README.md", type: "file", path: "/README.md" },
                            { name: "src", type: "folder", children: [
                                { name: "App.tsx", type: "file", path: "/src/App.tsx" },
                                { name: "index.css", type: "file", path: "/src/index.css" },
                                { name: "App.css", type: "file", path: "/src/App.css" },
                            ]}
                        ]
                    }
                ]);
            });
    }, []);

    function handleRun(cfg: RunConfig) {
        const target = cfg?.url || currentFileUrl;
        if (target) window.open(target, "_blank");
    }

    function handleDebug(cfg: RunConfig) {
        const target = cfg?.debugUrl || cfg?.url || currentFileUrl;
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
                        currentFileUrl={currentFileUrl}
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
                tree={projectTree}
                onNavigate={(p) => navigateTo(p)}
            />
            <div className="main">
                {showExplorer && (
                    <div
                        className="explorer"
                        style={{ width: explorerWidth }}
                    >
                        <div className="explorer-content">
                            <FileExplorer
                                data={projectTree}
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
                                    const target = currentFileUrl;
                                    if (target) window.open(target, "_blank");
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
                    {routePath === '/' ? (
                        <div className="text-[#c2c3c7]">Wähle eine Datei im Explorer aus…</div>
                    ) : (
                        <div>
                            <div className="text-[#9aa0a6] mb-2">Page</div>
                            <div className="text-[#e5e7eb] font-mono">{routePath}</div>
                            <div className="mt-4 text-[#c2c3c7]">Diese Seite wurde dynamisch über den Dateinamen geöffnet. Füge neue Dateien zur files.json hinzu, um neue Routen zu bekommen.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default App
