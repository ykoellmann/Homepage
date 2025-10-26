import {useState} from "react";
import { HoverButton } from "../hover-button";
import {ChevronDown} from "lucide-react";
import { RunConfigDropdown } from "./RunConfigDropdown";
import {RunActionButtons} from "./RunActionButton.tsx";
import type {PageEntry} from "../../lib/buildFileTree.ts";

export type RunConfig = {
    name: string;
    url?: string;
    debugUrl?: string;
    type?: "config" | "special";
};

interface RunControlsProps {
    configs: RunConfig[];
    currentConfig?: string;
    currentPage?: PageEntry | undefined | null;
    onSelect?: (cfg: RunConfig) => void;
    onRun?: (cfg: RunConfig) => void;
    onDebug?: (cfg: RunConfig) => void;
    onStop?: () => void;
}

export function RunControls({
                                configs,
                                currentConfig,
                                currentPage = null,
                                onSelect,
                                onRun,
                                onDebug,
                                onStop,
                            }: RunControlsProps) {
    const initial = configs.find((c) => c.name === currentConfig) || configs[0] || null;
    const [selected, setSelected] = useState<RunConfig | null>(initial);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const mainConfigs = configs.filter((c) => c.type !== "special");
    const specialConfigs = configs.filter((c) => c.type === "special");

    function handleSelect(cfg: RunConfig) {
        setSelected(cfg);
        setDropdownOpen(false);
        onSelect?.(cfg);
    }

    function handleCurrentFileSelect() {
        const cfg: RunConfig = {
            name: "Current File",
            url: currentPage?.meta?.runConfig?.url,
            debugUrl: currentPage?.meta?.runConfig?.debugUrl,
            type: "special"
        };
        setSelected(cfg);
        setDropdownOpen(false);
        onSelect?.(cfg);
    }

    const canRun = !!(
        selected?.url ??
        (selected?.name === "Current File" ? currentPage?.meta?.runConfig?.url : undefined)
    );

    const canDebug = !!(
        selected?.debugUrl ??
        selected?.url ??
        (selected?.name === "Current File" ? currentPage?.meta?.runConfig?.debugUrl : undefined)
    );

    return (
        <div className="relative flex items-center gap-1 text-left">
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

                <RunConfigDropdown
                    mainConfigs={mainConfigs}
                    specialConfigs={specialConfigs}
                    currentPage={currentPage}
                    isOpen={dropdownOpen}
                    onClose={() => setDropdownOpen(false)}
                    onSelectConfig={handleSelect}
                    onSelectCurrentFile={handleCurrentFileSelect}
                />
            </div>

            <RunActionButtons
                canRun={canRun}
                canDebug={canDebug}
                selected={selected}
                onRun={onRun}
                onDebug={onDebug}
                onStop={onStop}
            />
        </div>
    );
}