import './App.css'
import { ArrowLeft, ArrowRight, Folder, Search, Settings, Tally4 } from "lucide-react";
import { HoverButton } from "./components/hover-button.tsx";
import logo from './assets/logo.svg'
import { ProjectIcon } from "./components/project-icon.tsx";
import {type RunConfig, RunControls} from './components/run-controls.tsx';

function App() {

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
            <div className="sidebar">
                <HoverButton><Folder className="icon" /></HoverButton>
            </div>
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
            {/* Main content area spacing under header and right of sidebar */}
            <div className="content"></div>
        </div>
    )
}

export default App
