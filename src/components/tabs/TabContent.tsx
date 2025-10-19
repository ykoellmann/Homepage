import {InteractiveBackground} from "../layout/InteractiveBackground.tsx";

interface TabContentProps {
    activeComponent: React.ComponentType | null | undefined;
    hasNoTabs: boolean;
}

export function TabContent({activeComponent: ActiveComponent, hasNoTabs}: TabContentProps) {
    return (
        <div className="flex-1 overflow-auto bg-[#2b2b2b]">
            <InteractiveBackground>
                {ActiveComponent && <ActiveComponent/>}
                {!ActiveComponent && hasNoTabs && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No tabs open
                    </div>
                )}
            </InteractiveBackground>
        </div>
    );
}