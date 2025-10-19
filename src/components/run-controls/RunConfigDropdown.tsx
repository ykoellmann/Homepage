import {type RunConfig} from "./RunControls.tsx";
import {type PageEntry} from "../../lib/buildFileTree";

interface RunConfigDropdownProps {
    mainConfigs: RunConfig[];
    specialConfigs: RunConfig[];
    currentPage?: PageEntry | null;
    onSelectConfig: (cfg: RunConfig) => void;
    onSelectCurrentFile: () => void;
}

export function RunConfigDropdown({
                                      mainConfigs,
                                      specialConfigs,
                                      currentPage,
                                      onSelectConfig,
                                      onSelectCurrentFile
                                  }: RunConfigDropdownProps) {
    const otherSpecialConfigs = specialConfigs.filter((s) => s.name !== "Current File");

    return (
        <div
            className="absolute left-0 z-50 mt-1 w-56 rounded-lg shadow-lg overflow-hidden menu-panel"
            role="menu"
        >
            {/* Main configs */}
            <div className="menu-section">
                {mainConfigs.map((cfg) => (
                    <div
                        key={cfg.name}
                        onClick={() => onSelectConfig(cfg)}
                        className="menu-item cursor-pointer hover:bg-blue-700 hover:text-white transition-colors"
                    >
                        {cfg.name}
                    </div>
                ))}
            </div>

            <div className="menu-separator"/>

            {/* Current File */}
            <div
                onClick={currentPage ? onSelectCurrentFile : undefined}
                title={currentPage?.meta?.title ? undefined : "Aktuell keine Projektdatei ausgewählt"}
                className={`menu-item ${
                    currentPage
                        ? "cursor-pointer hover:bg-blue-700 hover:text-white"
                        : "disabled"
                }`}
            >
                Current File
            </div>

            {/* Other special configs */}
            {otherSpecialConfigs.map((cfg) => (
                <div
                    key={cfg.name}
                    onClick={() => onSelectConfig(cfg)}
                    className="menu-item cursor-pointer hover:bg-blue-700 hover:text-white transition-colors"
                >
                    {cfg.name}
                </div>
            ))}
        </div>
    );
}