import {type RunConfig} from "./RunControls.tsx";
import {type PageEntry} from "../../lib/buildFileTree";
import {Popup, type PopupSection} from "../Popup";

interface RunConfigDropdownProps {
    mainConfigs: RunConfig[];
    specialConfigs: RunConfig[];
    currentPage?: PageEntry | null;
    isOpen: boolean;
    onClose: () => void;
    onSelectConfig: (cfg: RunConfig) => void;
    onSelectCurrentFile: () => void;
}

export function RunConfigDropdown({
                                      mainConfigs,
                                      specialConfigs,
                                      currentPage,
                                      isOpen,
                                      onClose,
                                      onSelectConfig,
                                      onSelectCurrentFile
                                  }: RunConfigDropdownProps) {
    const otherSpecialConfigs = specialConfigs.filter((s) => s.name !== "Current File");

    const sections: PopupSection[] = [
        // Main configs section
        {
            items: mainConfigs.map((cfg) => ({
                id: cfg.name,
                label: cfg.name,
                onClick: () => onSelectConfig(cfg)
            }))
        },
        // Special configs section (Current File + others)
        {
            items: [
                {
                    id: "current-file",
                    label: "Current File",
                    disabled: !currentPage,
                    onClick: () => onSelectCurrentFile()
                },
                ...otherSpecialConfigs.map((cfg) => ({
                    id: cfg.name,
                    label: cfg.name,
                    onClick: () => onSelectConfig(cfg)
                }))
            ]
        }
    ];

    return (
        <Popup
            isOpen={isOpen}
            onClose={onClose}
            sections={sections}
            position="bottom"
            align="start"
            width="14rem"
        />
    );
}