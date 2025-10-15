import './App.css'
import { ArrowLeft, ArrowRight, Search, Settings, Tally4 } from "lucide-react";
import { HoverButton } from "./components/hover-button.tsx";
import logo from './assets/logo.svg'
import { ProjectIcon } from "./components/project-icon.tsx";
import {type RunConfig, RunControls} from './components/run-controls.tsx';

function App() {

    const runConfigs: RunConfig[] = [
        {
            name: "debug-protocol",
            url: "https://jy-studios.github.io/debug-protocol/",
            debugUrl: "https://github.com/JY-Studios/debug-protocol",
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
    const currentFileUrl = "https://jy-studios.github.io/debug-protocol/";

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
        <>
            <div className="header gap-2">
                <div className="flex items-center gap-2">
                    <img src={logo} height="80%" />
                    <HoverButton><Tally4 size={20} className="rotate-90 aspect-square" /></HoverButton>
                    <HoverButton><ArrowLeft size={20} className="aspect-square" /></HoverButton>
                    <HoverButton><ArrowRight size={20} className="aspect-square" /></HoverButton>

                    <HoverButton className="flex items-center gap-2">
                        <ProjectIcon />
                        Homepage
                    </HoverButton>
                </div>

                <div className="flex items-center gap-2">
                    <RunControls
                        configs={runConfigs}
                        currentConfig="debug-protocol"
                        currentFileUrl={currentFileUrl}
                        onRun={handleRun}
                        onDebug={handleDebug}
                        onStop={handleStop}
                    />
                    <div className="p-3"></div>
                    <HoverButton><Settings /></HoverButton>
                    <HoverButton><Search /></HoverButton>
                </div>
            </div>
        </>
    )
}

export default App
