import {useEffect, useState} from "react";

const HISTORY_STATE_KEY = 'navigation_history';

interface HistoryState {
    index: number;
    maxIndex: number;
}

function getHistoryState(): HistoryState {
    // Check if current history state has our data
    if (window.history.state && typeof window.history.state.index === 'number') {
        return {
            index: window.history.state.index,
            maxIndex: window.history.state.maxIndex || window.history.state.index
        };
    }

    // Try to get from sessionStorage as fallback
    const stored = sessionStorage.getItem(HISTORY_STATE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }

    // Default state
    return {index: 0, maxIndex: 0};
}

function saveHistoryState(state: HistoryState) {
    sessionStorage.setItem(HISTORY_STATE_KEY, JSON.stringify(state));
}

export function useHistoryStatus() {
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    const updateStatus = () => {
        const state = getHistoryState();
        setCanGoBack(state.index > 0);
        setCanGoForward(state.index < state.maxIndex);
    };

    useEffect(() => {
        // Initialize history state if not present
        const currentState = getHistoryState();
        if (!window.history.state || typeof window.history.state.index !== 'number') {
            window.history.replaceState(currentState, '', window.location.pathname);
            saveHistoryState(currentState);
        }

        // Initial check
        updateStatus();

        // Listen for popstate events (browser back/forward)
        const handlePopState = () => {
            updateStatus();
        };

        // Listen for pushstate/replacestate (custom event we'll dispatch)
        const handleHistoryChange = () => {
            updateStatus();
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('historychange', handleHistoryChange);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('historychange', handleHistoryChange);
        };
    }, []);

    return {canGoBack, canGoForward};
}

// Helper function to push state with proper index tracking
export function pushHistoryState(path: string) {
    const currentState = getHistoryState();
    const newState: HistoryState = {
        index: currentState.index + 1,
        maxIndex: currentState.index + 1
    };

    window.history.pushState(newState, '', path);
    saveHistoryState(newState);

    // Dispatch custom event to notify listeners
    window.dispatchEvent(new Event('historychange'));
}

// Helper function to handle popstate and update our tracking
export function handlePopState() {
    const state = getHistoryState();
    saveHistoryState(state);
}