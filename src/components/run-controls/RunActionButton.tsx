import {HoverButton} from "../hover-button";
import {Play, Bug, Square} from "lucide-react";
import {type RunConfig} from "./RunControls.tsx";

interface RunActionButtonsProps {
    canRun: boolean;
    canDebug: boolean;
    selected: RunConfig | null;
    onRun?: (cfg: RunConfig) => void;
    onDebug?: (cfg: RunConfig) => void;
    onStop?: () => void;
}

export function RunActionButtons({
                                     canRun,
                                     canDebug,
                                     selected,
                                     onRun,
                                     onDebug,
                                     onStop
                                 }: RunActionButtonsProps) {

    function handleRun() {
        if (canRun && selected) {
            onRun?.(selected);
        }
    }

    function handleDebug() {
        if (canDebug && selected) {
            onDebug?.(selected);
        }
    }

    return (
        <>
            <HoverButton
                disabled={!canRun}
                onClick={handleRun}
                className={`p-1.5 ${!canRun ? "opacity-50 cursor-not-allowed" : ""}`}
                title={!canRun ? "Diese Datei ist nicht runnable" : "Run"}
            >
                <Play className={`icon ${!canRun ? "" : "text-green-500"}`}/>
            </HoverButton>

            <HoverButton
                disabled={!canDebug}
                onClick={handleDebug}
                className={`p-1.5 ${!canDebug ? "opacity-50 cursor-not-allowed" : ""}`}
                title={!canDebug ? "Diese Datei ist nicht debuggable" : "Debug"}
            >
                <Bug className={`icon ${!canDebug ? "" : "text-green-500"}`}/>
            </HoverButton>

            <HoverButton
                onClick={() => onStop?.()}
                className="p-1.5 hidden"
                title="Stop"
            >
                <Square className="icon"/>
            </HoverButton>
        </>
    );
}