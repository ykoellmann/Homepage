import {Folder, Terminal} from "lucide-react";
import {HoverButton} from "../hover-button";

interface SidebarProps {
    onToggleExplorer: () => void;
    onToggleTerminal: () => void;
    terminalOpen: boolean;
}

export function Sidebar({onToggleExplorer, onToggleTerminal, terminalOpen}: SidebarProps) {
    return (
        <div className="sidebar">
            <HoverButton
                active
                title="Project"
                onClick={onToggleExplorer}
            >
                <Folder className="icon"/>
            </HoverButton>
            <HoverButton
                active={terminalOpen}
                title="Terminal"
                onClick={onToggleTerminal}
            >
                <Terminal className="icon"/>
            </HoverButton>
        </div>
    );
}