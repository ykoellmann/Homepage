import { X } from 'lucide-react';
import {useState, useEffect, useImperativeHandle, forwardRef} from 'react';

// Types
export interface Tab {
    id: string;
    title: string;
    path: string;
    component: React.ComponentType;
    scrollPosition?: number;
}

export interface TabGroup {
    id: string;
    tabs: Tab[];
    activeTabId: string | null;
}

export interface LayoutNode {
    type: 'group' | 'split';
    id: string;
    group?: TabGroup;
    direction?: 'horizontal' | 'vertical';
    children?: LayoutNode[];
    size?: number;
}

export interface TabSystemRef {
    openTab: (tab: Tab, groupId?: string) => void;
    closeTab: (tabId: string, groupId?: string) => void;
    getActiveTab: () => Tab | null;
    activateTabByPath: (path: string) => void;
    getAllTabs: () => Tab[];
}

interface TabSystemProps {
    onTabChange?: (tab: Tab | null) => void;
}

// Storage helper
const STORAGE_KEY = 'tabs_state';

function saveToStorage(tabs: { id: string; title: string; path: string; scrollPosition?: number }[], activeTabId: string | null) {
    try {
        const data = { tabs, activeTabId };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save tabs to storage:', e);
    }
}

const TabSystem = forwardRef<TabSystemRef, TabSystemProps>(({ onTabChange }, ref) => {
    const [layout, setLayout] = useState<LayoutNode>(() => {
        return {
            type: 'group',
            id: 'root',
            group: {
                id: 'group-1',
                tabs: [],
                activeTabId: null
            }
        };
    });

    const [draggedTab, setDraggedTab] = useState<{ tab: Tab; groupId: string } | null>(null);
    const [dropZone, setDropZone] = useState<{ groupId: string; position: number } | null>(null);
    const [componentMap, setComponentMap] = useState<Map<string, React.ComponentType>>(new Map());

    // Save to storage whenever layout changes
    useEffect(() => {
        if (layout.group && layout.group.tabs.length > 0) {
            const simplifiedTabs = layout.group.tabs.map(t => ({
                id: t.id,
                title: t.title,
                path: t.path,
                scrollPosition: t.scrollPosition
            }));
            saveToStorage(simplifiedTabs, layout.group.activeTabId);
        }
    }, [layout]);

    function openTab(tab: Tab, groupId: string = 'group-1') {
        setLayout(prev => {
            const newLayout = { ...prev };

            // Speichere Component separat
            setComponentMap(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(tab.id, tab.component);
                return newMap;
            });

            updateGroup(newLayout, groupId, (group) => {
                const existingIndex = group.tabs.findIndex(t => t.id === tab.id);
                if (existingIndex >= 0) {
                    // Tab existiert bereits, nur aktivieren
                    group.activeTabId = tab.id;
                    // Component aktualisieren falls anders
                    group.tabs[existingIndex] = { ...tab };
                } else {
                    // Neuen Tab hinzufügen
                    group.tabs.push(tab);
                    group.activeTabId = tab.id;
                }
            });

            return newLayout;
        });

        if (onTabChange) {
            onTabChange(tab);
        }
    }

    function closeTab(tabId: string, groupId: string = 'group-1') {
        setLayout(prev => {
            const newLayout = { ...prev };
            let newActiveTab: Tab | null = null;

            updateGroup(newLayout, groupId, (group) => {
                const index = group.tabs.findIndex(t => t.id === tabId);
                if (index >= 0) {
                    group.tabs.splice(index, 1);

                    // Component aus Map entfernen
                    setComponentMap(prevMap => {
                        const newMap = new Map(prevMap);
                        newMap.delete(tabId);
                        return newMap;
                    });

                    if (group.activeTabId === tabId) {
                        // Aktiviere den vorherigen Tab oder den nächsten
                        newActiveTab = group.tabs[Math.max(0, index - 1)] || null;
                        group.activeTabId = newActiveTab?.id || null;

                        // Browser-Route aktualisieren
                        if (newActiveTab && newActiveTab.path) {
                            window.history.pushState({}, '', newActiveTab.path);
                        }
                    }
                }
            });

            if (onTabChange) {
                onTabChange(newActiveTab);
            }

            return newLayout;
        });
    }

    function setActiveTab(tabId: string, groupId: string = 'group-1', updateHistory: boolean = false) {
        setLayout(prev => {
            const newLayout = { ...prev };
            updateGroup(newLayout, groupId, (group) => {
                group.activeTabId = tabId;
                const tab = group.tabs.find(t => t.id === tabId);
                if (tab) {
                    if (updateHistory && tab.path && window.location.pathname !== tab.path) {
                        window.history.pushState({}, '', tab.path);
                    }
                    if (onTabChange) {
                        onTabChange(tab);
                    }
                }
            });
            return newLayout;
        });
    }

    function getActiveTab(): Tab | null {
        if (layout.group) {
            const activeId = layout.group.activeTabId;
            return layout.group.tabs.find(t => t.id === activeId) || null;
        }
        return null;
    }

    function activateTabByPath(path: string): void {
        if (layout.group) {
            const tab = layout.group.tabs.find(t => t.path === path);
            if (tab) {
                setActiveTab(tab.id, layout.group.id, false);
            }
        }
    }

    function getAllTabs(): Tab[] {
        return layout.group?.tabs || [];
    }

    function updateGroup(node: LayoutNode, groupId: string, fn: (group: TabGroup) => void) {
        if (node.type === 'group' && node.group?.id === groupId) {
            fn(node.group);
        } else if (node.type === 'split' && node.children) {
            node.children.forEach(child => updateGroup(child, groupId, fn));
        }
    }

    function moveTab(tab: Tab, fromGroupId: string, toGroupId: string, position: number) {
        // Speichere den Tab vor der Änderung
        const tabToMove: Tab = { ...tab };
        let wasActiveInFromGroup = false;

        setLayout(prev => {
            const newLayout = { ...prev };

            // Entferne Tab aus der Quellgruppe
            updateGroup(newLayout, fromGroupId, (group) => {
                const index = group.tabs.findIndex(t => t.id === tabToMove.id);
                if (index >= 0) {
                    wasActiveInFromGroup = group.activeTabId === tabToMove.id;
                    group.tabs.splice(index, 1);

                    // Wenn der aktive Tab entfernt wird, wähle einen neuen aktiven Tab
                    if (wasActiveInFromGroup && fromGroupId !== toGroupId) {
                        const newActiveTab = group.tabs[0] || null;
                        group.activeTabId = newActiveTab?.id || null;

                        if (newActiveTab && onTabChange) {
                            onTabChange(newActiveTab);
                        }
                    }
                }
            });

            // Füge Tab in die Zielgruppe ein
            updateGroup(newLayout, toGroupId, (group) => {
                group.tabs.splice(position, 0, tabToMove);

                // Tab behält seinen aktiven Status nur innerhalb derselben Gruppe
                if (fromGroupId === toGroupId && wasActiveInFromGroup) {
                    group.activeTabId = tabToMove.id;
                }
                // Bei unterschiedlichen Gruppen: Tab wird NICHT aktiviert
            });

            return newLayout;
        });

        // Route nur aktualisieren wenn der Tab aktiv war und in derselben Gruppe bleibt
        if (wasActiveInFromGroup && fromGroupId === toGroupId) {
            window.history.pushState({}, '', tabToMove.path);
        }
    }

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        openTab,
        closeTab,
        getActiveTab,
        activateTabByPath,
        getAllTabs
    }));

    function renderLayout(node: LayoutNode): React.ReactElement {
        if (node.type === 'group' && node.group) {
            return <TabGroupComponent
                group={node.group}
                componentMap={componentMap}
                onClose={closeTab}
                onSetActive={setActiveTab}
                onDragStart={(tab) => setDraggedTab({ tab, groupId: node.group!.id })}
                onDragEnd={() => {
                    setDraggedTab(null);
                    setDropZone(null);
                }}
                onDrop={(position) => {
                    if (draggedTab) {
                        moveTab(draggedTab.tab, draggedTab.groupId, node.group!.id, position);
                    }
                }}
                dropZone={dropZone?.groupId === node.group.id ? dropZone.position : null}
                onDropZoneChange={(pos) => setDropZone(pos !== null ? { groupId: node.group!.id, position: pos } : null)}
            />;
        }

        if (node.type === 'split' && node.children) {
            return (
                <div className={`flex ${node.direction === 'vertical' ? 'flex-col' : 'flex-row'} h-full`}>
                    {node.children.map((child) => (
                        <div key={child.id} className="flex-1">
                            {renderLayout(child)}
                        </div>
                    ))}
                </div>
            );
        }

        return <div>Invalid layout</div>;
    }

    return (
        <div className="w-full h-full bg-[#2b2b2b] text-gray-200">
            {renderLayout(layout)}
        </div>
    );
});

TabSystem.displayName = 'TabSystem';

export default TabSystem;

// TabGroup Component
interface TabGroupComponentProps {
    group: TabGroup;
    componentMap: Map<string, React.ComponentType>;
    onClose: (tabId: string, groupId: string) => void;
    onSetActive: (tabId: string, groupId: string) => void;
    onDragStart: (tab: Tab) => void;
    onDragEnd: () => void;
    onDrop: (position: number) => void;
    dropZone: number | null;
    onDropZoneChange: (position: number | null) => void;
}

function TabGroupComponent({
                               group,
                               componentMap,
                               onClose,
                               onSetActive,
                               onDragStart,
                               onDragEnd,
                               onDrop,
                               dropZone,
                               onDropZoneChange
                           }: TabGroupComponentProps) {
    const activeTab = group.tabs.find(t => t.id === group.activeTabId);
    const ActiveComponent = activeTab ? componentMap.get(activeTab.id) : null;

    return (
        <div className="flex flex-col h-full">
            <div className="flex bg-[#3c3f41] border-b border-[#2b2b2b] overflow-x-auto scrollbar-thin">
                {group.tabs.map((tab, index) => (
                    <TabComponent
                        key={tab.id}
                        tab={tab}
                        isActive={tab.id === group.activeTabId}
                        onClose={(e) => {
                            e.stopPropagation();
                            onClose(tab.id, group.id);
                        }}
                        onClick={() => {
                            onSetActive(tab.id, group.id);
                            // Update browser URL when clicking tab
                            if (tab.path && window.location.pathname !== tab.path) {
                                window.history.pushState({}, '', tab.path);
                            }
                        }}
                        onMiddleClick={() => onClose(tab.id, group.id)}
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
                        onDropZoneChange(group.tabs.length);
                    }}
                    onDrop={() => onDrop(group.tabs.length)}
                />
            </div>
            <div className="flex-1 overflow-auto bg-[#2b2b2b]">
                {ActiveComponent && <ActiveComponent />}
                {!ActiveComponent && group.tabs.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No tabs open
                    </div>
                )}
            </div>
        </div>
    );
}

// Tab Component
interface TabComponentProps {
    tab: Tab;
    isActive: boolean;
    onClose: (e: React.MouseEvent) => void;
    onClick: () => void;
    onMiddleClick: () => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
    showDropIndicator: boolean;
}

function TabComponent({
                          tab,
                          isActive,
                          onClose,
                          onClick,
                          onMiddleClick,
                          onDragStart,
                          onDragEnd,
                          onDragOver,
                          onDrop,
                          showDropIndicator
                      }: TabComponentProps) {
    return (
        <div className="relative group">
            {showDropIndicator && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 z-10" />
            )}
            <div
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    onDragStart();
                }}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                onDrop={(e) => {
                    e.preventDefault();
                    onDrop();
                }}
                onClick={onClick}
                onMouseDown={(e) => {
                    if (e.button === 1) {
                        e.preventDefault();
                        onMiddleClick();
                    }
                }}
                className={`
          flex items-center gap-2 px-4 py-2 min-w-[120px] max-w-[200px] cursor-pointer
          border-r border-[#2b2b2b] select-none relative
          ${isActive
                    ? 'bg-[#2b2b2b] text-white'
                    : 'bg-[#3c3f41] text-gray-400 hover:bg-[#4c4f51]'
                }
        `}
            >
                <span className="truncate flex-1 text-sm">{tab.title}</span>
                <button
                    onClick={onClose}
                    className="opacity-0 group-hover:opacity-100 hover:bg-[#515456] rounded p-0.5 transition-opacity"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}