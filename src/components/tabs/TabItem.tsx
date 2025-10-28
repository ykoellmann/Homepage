import {X} from 'lucide-react';
import {type Tab} from './types';

interface TabItemProps {
    tab: Tab;
    isActive: boolean;
    onClick: () => void;
    onClose: (e: React.MouseEvent) => void;
    onMiddleClick: () => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
    showDropIndicator: boolean;
}

export function TabItem({
                            tab,
                            isActive,
                            onClick,
                            onClose,
                            onMiddleClick,
                            onDragStart,
                            onDragEnd,
                            onDragOver,
                            onDrop,
                            showDropIndicator
                        }: TabItemProps) {

    function handleMouseDown(e: React.MouseEvent) {
        if (e.button === 1) {
            e.preventDefault();
            onMiddleClick();
        }
    }

    function handleDragStart(e: React.DragEvent) {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart();
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        onDrop();
    }

    const baseClasses = "flex items-center gap-2 px-4 py-2 min-w-[120px] max-w-[200px] cursor-pointer border-r border-[#1E1F22] select-none relative bg-[#1E1F22] text-white hover:bg-[#2b2d30]";

    return (
        <div className="relative group">
            {showDropIndicator && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 z-10"/>
            )}
            <div
                draggable
                onDragStart={handleDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                onDrop={handleDrop}
                onClick={onClick}
                onMouseDown={handleMouseDown}
                className={baseClasses}
            >
                <span className="truncate flex-1 text-sm">{tab.title}</span>
                <button
                    onClick={onClose}
                    className="opacity-0 group-hover:opacity-100 hover:bg-[#3a3d41] rounded p-0.5 transition-opacity"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <X size={14}/>
                </button>
                {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4a9eff] rounded-t-sm"/>
                )}
            </div>
        </div>
    );
}