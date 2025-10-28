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

    // Track shift key presses for double-shift detection
    const shiftTimerRef = React.useRef<NodeJS.Timeout | null>(null);
    const shiftPressCountRef = React.useRef(0);

    // Global keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+Shift+A for search (existing)
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'a') {
                e.preventDefault();
                setSearchOpen(true);
            }
            // Ctrl+Alt+S for settings
            else if (e.ctrlKey && e.altKey && e.key === 's') {
                e.preventDefault();
                setSettingsOpen(true);
            }
            // Shift+Shift for search everywhere
            else if (e.key === 'Shift') {
                shiftPressCountRef.current++;

                if (shiftPressCountRef.current === 1) {
                    // First shift press - start timer
                    shiftTimerRef.current = setTimeout(() => {
                        // Reset if second shift wasn't pressed within 500ms
                        shiftPressCountRef.current = 0;
                    }, 500);
                } else if (shiftPressCountRef.current === 2) {
                    // Second shift press - open search
                    e.preventDefault();
                    setSearchOpen(true);
                    shiftPressCountRef.current = 0;
                    if (shiftTimerRef.current) {
                        clearTimeout(shiftTimerRef.current);
                    }
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            // Reset shift counter if any other key is pressed
            if (e.key !== 'Shift' && shiftPressCountRef.current > 0) {
                shiftPressCountRef.current = 0;
                if (shiftTimerRef.current) {
                    clearTimeout(shiftTimerRef.current);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (shiftTimerRef.current) {
                clearTimeout(shiftTimerRef.current);
            }
        };
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
                <HoverButton onClick={() => setSearchOpen(true)} title="Search Everywhere (Shift Shift)">
                    <Search className="icon"/>
                </HoverButton>
                <HoverButton onClick={() => setSettingsOpen(true)} title="Settings (Ctrl+Alt+S)">
                    <Settings className="icon"/>
                </HoverButton>
                <SearchEverywhere isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
                <SettingsDialog isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
            </div>
        </div>
    );
}