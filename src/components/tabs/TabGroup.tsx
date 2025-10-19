import {TabBar} from './TabBar';
import {TabContent} from './TabContent';
import {type Tab, type TabGroup as TabGroupType} from './types';

interface TabGroupProps {
    group: TabGroupType;
    componentMap: Map<string, React.ComponentType>;
    onClose: (tabId: string, groupId: string) => void;
    onSetActive: (tabId: string, groupId: string) => void;
    onDragStart: (tab: Tab) => void;
    onDragEnd: () => void;
    onDrop: (position: number) => void;
    dropZone: number | null;
    onDropZoneChange: (position: number | null) => void;
}

export function TabGroup({
                             group,
                             componentMap,
                             onClose,
                             onSetActive,
                             onDragStart,
                             onDragEnd,
                             onDrop,
                             dropZone,
                             onDropZoneChange
                         }: TabGroupProps) {
    const activeTab = group.tabs.find(t => t.id === group.activeTabId);
    const ActiveComponent = activeTab ? componentMap.get(activeTab.id) : null;

    function handleTabClick(tab: Tab) {
        onSetActive(tab.id, group.id);
        if (tab.path && window.location.pathname !== tab.path) {
            window.history.pushState({}, '', tab.path);
        }
    }

    function handleTabClose(tab: Tab, e: React.MouseEvent) {
        e.stopPropagation();
        onClose(tab.id, group.id);
    }

    return (
        <div className="flex flex-col h-full">
            <TabBar
                tabs={group.tabs}
                activeTabId={group.activeTabId}
                onTabClick={handleTabClick}
                onTabClose={handleTabClose}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                dropZone={dropZone}
                onDropZoneChange={onDropZoneChange}
            />

            <TabContent
                activeComponent={ActiveComponent}
                hasNoTabs={group.tabs.length === 0}
            />
        </div>
    );
}