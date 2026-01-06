import {Folder} from "lucide-react";
import {HoverButton} from "../hover-button";

interface SidebarProps {
    onToggleExplorer: () => void;
    onToggleTerminal: () => void;
    terminalOpen: boolean;
}

export function Sidebar({onToggleExplorer}: SidebarProps) {
    return (
        <div className="sidebar">
            <div>
                <HoverButton
                    active
                    title="Project"
                    onClick={onToggleExplorer}
                >
                    <Folder className="icon"/>
                </HoverButton>
            </div>
        </div>
    );
}