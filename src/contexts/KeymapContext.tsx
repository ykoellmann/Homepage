import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { keymapService, type KeymapAction } from '../lib/keymapService';

interface KeymapContextType {
    actions: KeymapAction[];
    refresh: () => void;
}

const KeymapContext = createContext<KeymapContextType | undefined>(undefined);

interface KeymapProviderProps {
    children: ReactNode;
}

export const KeymapProvider: React.FC<KeymapProviderProps> = ({ children }) => {
    const [actions, setActions] = useState<KeymapAction[]>([]);

    const refresh = () => {
        setActions(keymapService.getAllActions());
    };

    useEffect(() => {
        // Initial load
        refresh();

        // Subscribe to changes
        const unsubscribe = keymapService.subscribe((updatedActions) => {
            setActions(updatedActions);
        });

        // Start global keyboard listener
        keymapService.startListening();

        return () => {
            unsubscribe();
            keymapService.stopListening();
        };
    }, []);

    return (
        <KeymapContext.Provider value={{ actions, refresh }}>
            {children}
        </KeymapContext.Provider>
    );
};

export const useKeymap = () => {
    const context = useContext(KeymapContext);
    if (context === undefined) {
        throw new Error('useKeymap must be used within a KeymapProvider');
    }
    return context;
};
