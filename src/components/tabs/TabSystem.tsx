import {useState, useEffect, useImperativeHandle, forwardRef} from 'react';
import {type Tab, type LayoutNode, type TabGroup as TabGroupType} from './types';
import {TabGroup} from "./TabGroup.tsx";
import {pushHistoryState} from '../../hooks/useHistoryStatus';

export type {Tab, TabGroup as TabGroupType} from './types';

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

const STORAGE_KEY = 'tabs_state';

function saveToStorage(tabs: { id: string; title: string; path: string; scrollPosition?: number }[], activeTabId: string | null) {
    try {
        const data = {tabs, activeTabId};
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save tabs to storage:', e);
    }
}

const TabSystem = forwardRef<TabSystemRef, TabSystemProps>(({onTabChange}, ref) => {
    const [layout, setLayout] = useState<LayoutNode>(() => ({
        type: 'group',
        id: 'root',
        group: {
            id: 'group-1',
            tabs: [],
            activeTabId: null
        }
    }));

    const [draggedTab, setDraggedTab] = useState<{ tab: Tab; groupId: string } | null>(null);
    const [dropZone, setDropZone] = useState<{ groupId: string; position: number } | null>(null);
    const [componentMap, setComponentMap] = useState<Map<string, React.ComponentType>>(new Map());

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
            const newLayout = {...prev};

            setComponentMap(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(tab.id, tab.component);
                return newMap;
            });

            updateGroup(newLayout, groupId, (group) => {
                const existingIndex = group.tabs.findIndex(t => t.id === tab.id);
                if (existingIndex >= 0) {
                    group.activeTabId = tab.id;
                    group.tabs[existingIndex] = {...tab};
                } else {
                    group.tabs.push(tab);
                    group.activeTabId = tab.id;
                }
            });

            return newLayout;
        });

        // Call onTabChange after state update
        queueMicrotask(() => {
            onTabChange?.(tab);
        });
    }

    function closeTab(tabId: string, groupId: string = 'group-1') {
        const result = { newActiveTab: null as Tab | null };

        setLayout(prev => {
            const newLayout = {...prev};

            updateGroup(newLayout, groupId, (group) => {
                const index = group.tabs.findIndex(t => t.id === tabId);
                if (index >= 0) {
                    group.tabs.splice(index, 1);

                    setComponentMap(prevMap => {
                        const newMap = new Map(prevMap);
                        newMap.delete(tabId);
                        return newMap;
                    });

                    if (group.activeTabId === tabId) {
                        result.newActiveTab = group.tabs[Math.max(0, index - 1)] || null;
                        group.activeTabId = result.newActiveTab?.id || null;

                        if (result.newActiveTab?.path) {
                            pushHistoryState(result.newActiveTab.path);
                        }
                    }
                }
            });

            return newLayout;
        });

        // Call onTabChange after state update
        queueMicrotask(() => {
            onTabChange?.(result.newActiveTab);
        });
    }

    function setActiveTab(tabId: string, groupId: string = 'group-1', updateHistory: boolean = false) {
        const result = { changedTab: null as Tab | null };

        setLayout(prev => {
            const newLayout = {...prev};
            updateGroup(newLayout, groupId, (group) => {
                group.activeTabId = tabId;
                const tab = group.tabs.find(t => t.id === tabId);
                if (tab) {
                    result.changedTab = tab;
                    if (updateHistory && tab.path && window.location.pathname !== tab.path) {
                        pushHistoryState(tab.path);
                    }
                }
            });
            return newLayout;
        });

        // Call onTabChange after state update
        if (result.changedTab) {
            queueMicrotask(() => {
                onTabChange?.(result.changedTab);
            });
        }
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

    function updateGroup(node: LayoutNode, groupId: string, fn: (group: TabGroupType) => void) {
        if (node.type === 'group' && node.group?.id === groupId) {
            fn(node.group);
        } else if (node.type === 'split' && node.children) {
            node.children.forEach(child => updateGroup(child, groupId, fn));
        }
    }

    function moveTab(tab: Tab, fromGroupId: string, toGroupId: string, position: number) {
        const tabToMove: Tab = {...tab};
        const result = { wasActiveInFromGroup: false, newActiveTab: null as Tab | null };

        setLayout(prev => {
            const newLayout = {...prev};

            updateGroup(newLayout, fromGroupId, (group) => {
                const index = group.tabs.findIndex(t => t.id === tabToMove.id);
                if (index >= 0) {
                    result.wasActiveInFromGroup = group.activeTabId === tabToMove.id;
                    group.tabs.splice(index, 1);

                    if (result.wasActiveInFromGroup && fromGroupId !== toGroupId) {
                        result.newActiveTab = group.tabs[0] || null;
                        group.activeTabId = result.newActiveTab?.id || null;
                    }
                }
            });

            updateGroup(newLayout, toGroupId, (group) => {
                group.tabs.splice(position, 0, tabToMove);

                if (fromGroupId === toGroupId && result.wasActiveInFromGroup) {
                    group.activeTabId = tabToMove.id;
                }
            });

            return newLayout;
        });

        if (result.wasActiveInFromGroup && fromGroupId === toGroupId) {
            pushHistoryState(tabToMove.path);
        }

        // Call onTabChange after state update
        if (result.newActiveTab) {
            queueMicrotask(() => {
                onTabChange?.(result.newActiveTab);
            });
        }
    }

    useImperativeHandle(ref, () => ({
        openTab,
        closeTab,
        getActiveTab,
        activateTabByPath,
        getAllTabs
    }));

    function renderLayout(node: LayoutNode): React.ReactElement {
        if (node.type === 'group' && node.group) {
            return (
                <TabGroup
                    group={node.group}
                    componentMap={componentMap}
                    onClose={closeTab}
                    onSetActive={setActiveTab}
                    onDragStart={(tab) => setDraggedTab({tab, groupId: node.group!.id})}
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
                    onDropZoneChange={(pos) => setDropZone(pos !== null ? {
                        groupId: node.group!.id,
                        position: pos
                    } : null)}
                />
            );
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