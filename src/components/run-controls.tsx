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
    const canRun = !!(selected?.url || currentFileUrl);

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
                    <ChevronDown size={14}/>
                </HoverButton>

                {dropdownOpen && (
                    <div
                        className="absolute left-0 z-50 mt-1 w-56  rounded-lg shadow-lg overflow-hidden"
                        role="menu"
                    >
                        {/* Main configs */}
                        <div className="py-1">
                            {mainConfigs.map((cfg) => (
                                <div
                                    key={cfg.name}
                                    onClick={() => handleSelect(cfg)}
                                    className={`px-3 py-1.5 cursor-pointer text-sm hover:bg-zinc-700 `}
                                >
                                    {cfg.name}
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-zinc-700 my-1"/>

                        {/* Current File */}
                        <div
                            onClick={handleCurrentFileSelect}
                            className={`px-3 py-1.5 text-sm cursor-pointer ${
                                currentFileUrl
                                    ? "text-zinc-200 hover:bg-zinc-700"
                                    : "text-zinc-600 cursor-not-allowed"
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
                                    className="px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 cursor-pointer"
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
                title="Run"
            >
                <Play size={20}/>
            </HoverButton>

            <HoverButton
                disabled={!canRun}
                onClick={() => canRun && onDebug?.(selected!)}
                className={`p-1.5 ${!canRun ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Debug"
            >
                <Bug size={20}/>
            </HoverButton>

            {/* Stop — aktuell versteckt */}
            <HoverButton
                onClick={() => onStop?.()}
                className="p-1.5 hidden"
                title="Stop"
            >
                <Square size={20}/>
            </HoverButton>
        </div>
    );
}
