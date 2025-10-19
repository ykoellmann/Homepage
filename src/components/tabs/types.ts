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