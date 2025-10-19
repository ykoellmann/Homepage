import {Folder} from "lucide-react";
import {HoverButton} from "../hover-button";

interface SidebarProps {
    onToggleExplorer: () => void;
}

export function Sidebar({onToggleExplorer}: SidebarProps) {
    return (
        <div className="sidebar">
            <HoverButton
                active
                title="Project"
                onClick={onToggleExplorer}
            >
                <Folder className="icon"/>
            </HoverButton>
        </div>
    );
}