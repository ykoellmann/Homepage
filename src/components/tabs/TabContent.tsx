import { useRef } from 'react';
import {InteractiveBackground} from "../layout/InteractiveBackground.tsx";
import {SearchBar} from './SearchBar';

interface TabContentProps {
    activeComponent: React.ComponentType | null | undefined;
    hasNoTabs: boolean;
}

export function TabContent({activeComponent: ActiveComponent, hasNoTabs}: TabContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <SearchBar contentRef={contentRef} />
            <div ref={contentRef} className="flex-1 overflow-auto bg-[#1E1F22]">
                <InteractiveBackground>
                    {ActiveComponent && <ActiveComponent/>}
                    {!ActiveComponent && hasNoTabs && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No tabs open
                        </div>
                    )}
                </InteractiveBackground>
            </div>
        </div>
    );
}