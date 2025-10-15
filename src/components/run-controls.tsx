import {useState} from "react";
import {HoverButton} from "./hover-button";
import {ChevronDown, Play, Bug, Square} from "lucide-react";

export type RunConfig = {
    name: string;
    url?: string;
    debugUrl?: string;
    type?: "config" | "special";
};

interface RunControlsProps {
    configs: RunConfig[];
    currentConfig?: string;
    currentFileUrl?: string | null;
    onSelect?: (cfg: RunConfig) => void;
    onRun?: (cfg: RunConfig) => void;
    onDebug?: (cfg: RunConfig) => void;
    onStop?: () => void;
}

export function RunControls({
                                configs,
                                currentConfig,
                                currentFileUrl = null,
                                onSelect,
                                onRun,
                                onDebug,
                                onStop,
                            }: RunControlsProps) {
    const initial =
        configs.find((c) => c.name === currentConfig) || configs[0] || null;
    const [selected, setSelected] = useState<RunConfig | null>(initial);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const mainConfigs = configs.filter((c) => c.type !== "special");
    const specialConfigs = configs.filter((c) => c.type === "special");
    const canRun = !!(selected?.url ?? (selected?.name === "Current File" ? currentFileUrl : undefined));
    const canDebug = !!(selected?.debugUrl ?? selected?.url ?? (selected?.name === "Current File" ? currentFileUrl : undefined));

    function handleSelect(cfg: RunConfig) {
        setSelected(cfg);
        setDropdownOpen(false);
        onSelect?.(cfg);
    }

    function handleCurrentFileSelect() {
        const cfg: RunConfig = {name: "Current File", url: currentFileUrl || undefined, type: "special"};
        setSelected(cfg);
        setDropdownOpen(false);
        onSelect?.(cfg);
    }

    return (
        <div className="relative flex items-center gap-1 text-left">
            {/* Dropdown */}
            <div className="relative">
                <HoverButton
                    onClick={() => setDropdownOpen((s) => !s)}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-md min-w-[8rem]"
                >
          <span className="text-sm text-zinc-100 truncate">
            {selected?.name ?? "Select"}
          </span>
                    <ChevronDown className="icon"/>
                </HoverButton>

                {dropdownOpen && (
                    <div
                        className="absolute left-0 z-50 mt-1 w-56 rounded-lg shadow-lg overflow-hidden menu-panel"
                        role="menu"
                    >
                        {/* Main configs */}
                        <div className="menu-section">
                            {mainConfigs.map((cfg) => (
                                <div
                                    key={cfg.name}
                                    onClick={() => handleSelect(cfg)}
                                    className={`menu-item cursor-pointer hover:bg-blue-700 hover:text-white transition-colors`}
                                >
                                    {cfg.name}
                                </div>
                            ))}
                        </div>

                        <div className="menu-separator"/>

                        {/* Current File */}
                        <div
                            onClick={currentFileUrl ? handleCurrentFileSelect : undefined}
                            title={currentFileUrl ? undefined : "Aktuell keine Projektdatei ausgewählt"}
                            className={`menu-item ${
                                currentFileUrl
                                    ? "cursor-pointer hover:bg-blue-700 hover:text-white"
                                    : "disabled"
                            }`}
                        >
                            Current File
                        </div>

                        {/* Edit Configurations etc. */}
                        {specialConfigs
                            .filter((s) => s.name !== "Current File")
                            .map((cfg) => (
                                <div
                                    key={cfg.name}
                                    onClick={() => handleSelect(cfg)}
                                    className="menu-item cursor-pointer hover:bg-blue-700 hover:text-white transition-colors"
                                >
                                    {cfg.name}
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Run / Debug / Stop */}
            <HoverButton
                disabled={!canRun}
                onClick={() => canRun && onRun?.(selected!)}
                className={`p-1.5 ${!canRun ? "opacity-50 cursor-not-allowed" : ""}`}
                title={!canRun ? "Diese Datei ist nicht runnable" : "Run"}
            >
                <Play className={`icon ${!canRun ? "" : "text-green-500"}`} />
            </HoverButton>

            <HoverButton
                disabled={!canDebug}
                onClick={() => canDebug && onDebug?.(selected!)}
                className={`p-1.5 ${!canDebug ? "opacity-50 cursor-not-allowed" : ""}`}
                title={!canDebug ? "Diese Datei ist nicht debuggable" : "Debug"}
            >
                <Bug className={`icon ${!canDebug ? "" : "text-green-500"}`} />
            </HoverButton>

            {/* Stop — aktuell versteckt */}
            <HoverButton
                onClick={() => onStop?.()}
                className="p-1.5 hidden"
                title="Stop"
            >
                <Square className="icon"/>
            </HoverButton>
        </div>
    );
}
