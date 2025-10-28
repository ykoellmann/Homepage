import { useRef } from 'react';
import {InteractiveBackground} from "../layout/InteractiveBackground.tsx";
import {SearchBar} from './SearchBar';
import { keymapService } from '../../lib/keymapService';
import { useCommonTranslations } from '../../hooks/useCommonTranslations';

interface TabContentProps {
    activeComponent: React.ComponentType | null | undefined;
    hasNoTabs: boolean;
}

export function TabContent({activeComponent: ActiveComponent, hasNoTabs}: TabContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const translations = useCommonTranslations();

    // Get current shortcuts dynamically
    const getShortcut = (actionId: string): string => {
        const binding = keymapService.getActiveBinding(actionId);
        return binding ? keymapService.formatBinding(binding) : '';
    };

    const searchShortcut = getShortcut('search.everywhere');
    const navigationBarShortcut = getShortcut('breadcrumb.open');
    const settingsShortcut = getShortcut('settings.open');

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <SearchBar contentRef={contentRef} />
            <div ref={contentRef} className="flex-1 overflow-auto bg-[#1E1F22]">
                <InteractiveBackground>
                    {ActiveComponent && <ActiveComponent/>}
                    {!ActiveComponent && hasNoTabs && (
                        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] text-gray-400 -m-8">
                            <div className="text-left space-y-6 max-w-2xl px-6">
                                <div className="space-y-2">
                                    <p className="font-mono text-sm">
                                        {translations.emptyState.shortcuts.search}: {searchShortcut}
                                    </p>
                                    <p className="font-mono text-sm">
                                        {translations.emptyState.shortcuts.navigationBar}: {navigationBarShortcut}
                                    </p>
                                    <p className="font-mono text-sm">
                                        {translations.emptyState.shortcuts.settings}: {settingsShortcut}
                                    </p>
                                </div>
                                <div className="border-t border-gray-700 pt-4">
                                    <p className="font-semibold text-gray-300 mb-2">
                                        {translations.emptyState.runControls.title}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {translations.emptyState.runControls.description}
                                    </p>
                                </div>
                                <p className="text-sm leading-relaxed border-t border-gray-700 pt-4">
                                    {translations.emptyState.info}
                                </p>
                            </div>
                        </div>
                    )}
                </InteractiveBackground>
            </div>
        </div>
    );
}