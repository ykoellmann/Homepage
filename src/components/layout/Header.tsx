import {ArrowLeft, ArrowRight, Search, Settings, Tally4} from "lucide-react";
import {HoverButton} from "../hover-button";
import {ProjectIcon} from "../project-icon";
import {type PageEntry} from "../../lib/buildFileTree";
import logo from '../../assets/logo.svg';
import {type RunConfig, RunControls} from "../run-controls/RunControls.tsx";

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
    return (
        <div className="header gap-2">
            <div className="flex items-center gap-2">
                <img src={logo} height="70%" alt="Logo" />
                <HoverButton>
                    <Tally4 className="rotate-90 icon"/>
                </HoverButton>
                <HoverButton>
                    <ArrowLeft className="icon"/>
                </HoverButton>
                <HoverButton>
                    <ArrowRight className="icon"/>
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
                <HoverButton>
                    <Search className="icon"/>
                </HoverButton>
                <HoverButton>
                    <Settings className="icon"/>
                </HoverButton>
            </div>
        </div>
    );
}