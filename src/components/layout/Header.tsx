import React from "react";
import {ArrowLeft, ArrowRight, Settings, Tally4, Search} from "lucide-react";
import {HoverButton} from "../hover-button";
import {ProjectIcon} from "../project-icon";
import {type PageEntry} from "../../lib/buildFileTree";
import logo from '../../assets/logo.svg';
import {type RunConfig, RunControls} from "../run-controls/RunControls.tsx";
import {useHistoryStatus} from "../../hooks/useHistoryStatus.ts";
import {SearchEverywhere} from "../SearchEverywhere.tsx";
import {SettingsDialog} from "../SettingsDialog.tsx";

interface HeaderProps {
    runConfigs: RunConfig[];
    currentPage: PageEntry | null;
    onRun: (cfg: RunConfig) => void;
    onDebug: (cfg: RunConfig) => void;
    onStop: () => void;
}

export function Header({
                           runConfigs,
                           currentPage,
                           onRun,
                           onDebug,
                           onStop
                       }: HeaderProps) {
    const {canGoBack, canGoForward} = useHistoryStatus();
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);

    // Global keyboard shortcut for search
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'a') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="header gap-2">
            <div className="flex items-center gap-2">
                <img src={logo} height="70%" alt="Logo" />
                <HoverButton>
                    <Tally4 className="rotate-90 icon"/>
                </HoverButton>
                <HoverButton disabled={!canGoBack} onClick={() => window.history.back()}>
                    <ArrowLeft className={`icon ${!canGoBack ? 'opacity-30' : ''}`} />
                </HoverButton>

                <HoverButton disabled={!canGoForward} onClick={() => window.history.forward()}>
                    <ArrowRight className={`icon ${!canGoForward ? 'opacity-30' : ''}`} />
                </HoverButton>

                <HoverButton className="flex items-center gap-2">
                    <ProjectIcon/>
                    Homepage
                </HoverButton>
            </div>

            <div className="flex items-center gap-2">
                <RunControls
                    configs={runConfigs}
                    currentConfig="cryptborne"
                    currentPage={currentPage}
                    onRun={onRun}
                    onDebug={onDebug}
                    onStop={onStop}
                />
                <div className="p-3"></div>
                <HoverButton onClick={() => setSearchOpen(true)} title="Search Everywhere (⇧⌘A)">
                    <Search className="icon"/>
                </HoverButton>
                <HoverButton onClick={() => setSettingsOpen(true)} title="Settings">
                    <Settings className="icon"/>
                </HoverButton>
                <SearchEverywhere isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
                <SettingsDialog isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
            </div>
        </div>
    );
}