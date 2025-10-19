import {TabItem} from './TabItem';
import {type Tab} from './types';

interface TabBarProps {
    tabs: Tab[];
    activeTabId: string | null;
    onTabClick: (tab: Tab) => void;
    onTabClose: (tab: Tab, e: React.MouseEvent) => void;
    onDragStart: (tab: Tab) => void;
    onDragEnd: () => void;
    onDrop: (position: number) => void;
    dropZone: number | null;
    onDropZoneChange: (position: number | null) => void;
}

export function TabBar({
                           tabs,
                           activeTabId,
                           onTabClick,
                           onTabClose,
                           onDragStart,
                           onDragEnd,
                           onDrop,
                           dropZone,
                           onDropZoneChange
                       }: TabBarProps) {

    function handleMiddleClick(tab: Tab) {
        // Create a synthetic event for middle click
        const syntheticEvent = {
            stopPropagation: () => {},
            preventDefault: () => {}
        } as React.MouseEvent;
        onTabClose(tab, syntheticEvent);
    }

    return (
        <div className="flex bg-[#3c3f41] border-b border-[#2b2b2b] overflow-x-auto scrollbar-thin">
            {tabs.map((tab, index) => (
                <TabItem
                    key={tab.id}
                    tab={tab}
                    isActive={tab.id === activeTabId}
                    onClick={() => onTabClick(tab)}
                    onClose={(e) => onTabClose(tab, e)}
                    onMiddleClick={() => handleMiddleClick(tab)}
                    onDragStart={() => onDragStart(tab)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e) => {
                        e.preventDefault();
                        onDropZoneChange(index);
                    }}
                    onDrop={() => onDrop(index)}
                    showDropIndicator={dropZone === index}
                />
            ))}
            <div
                className="flex-1"
                onDragOver={(e) => {
                    e.preventDefault();
                    onDropZoneChange(tabs.length);
                }}
                onDrop={() => onDrop(tabs.length)}
            />
        </div>
    );
}