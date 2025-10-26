import {useEffect, useState} from "react";

interface HistoryState {
    navigationId: string;
}

// Global state for history tracking
const STORAGE_KEY = 'navigation_history_stack';

let navigationCounter = 0;
let historyStack: string[] = [];
let currentIndex = 0;
let initialized = false;

function saveStack() {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            stack: historyStack,
            counter: navigationCounter
        }));
    } catch (e) {
        console.warn('Failed to save history stack:', e);
    }
}

function loadStack() {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            historyStack = data.stack || [];
            navigationCounter = data.counter || 0;
        }
    } catch (e) {
        console.warn('Failed to load history stack:', e);
    }
}

function initializeHistory() {
    if (initialized) return;
    initialized = true;

    // Load from storage first
    loadStack();

    if (!window.history.state?.navigationId) {
        const initialId = `nav-${navigationCounter++}`;
        window.history.replaceState({navigationId: initialId}, '', window.location.pathname);
        historyStack = [initialId];
        currentIndex = 0;
        saveStack();
    } else {
        const currentId = window.history.state.navigationId;
        const index = historyStack.indexOf(currentId);

        if (index !== -1) {
            currentIndex = index;
        } else {
            // Unknown navigation ID, rebuild stack from current position
            historyStack = [currentId];
            currentIndex = 0;
            saveStack();
        }
    }
}

export function useHistoryStatus() {
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    const updateStatus = () => {
        setCanGoBack(currentIndex > 0);
        setCanGoForward(currentIndex < historyStack.length - 1);
    };

    useEffect(() => {
        initializeHistory();
        updateStatus();

        // Listen for popstate events (browser back/forward)
        const handlePopState = () => {
            const currentId = window.history.state?.navigationId;
            if (currentId) {
                const index = historyStack.indexOf(currentId);
                if (index !== -1) {
                    currentIndex = index;
                }
            }
            updateStatus();

            // 🔥 NEU: Dispatch custom event für andere Components
            window.dispatchEvent(new CustomEvent('navigation:popstate', {
                detail: {
                    pathname: window.location.pathname,
                    state: window.history.state
                }
            }));
        };

        // Listen for custom history change events
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

// Helper function to push state with proper tracking
export function pushHistoryState(path: string) {
    const navigationId = `nav-${navigationCounter++}`;
    const newState: HistoryState = {navigationId};

    // Remove any forward history when navigating to a new page
    historyStack = historyStack.slice(0, currentIndex + 1);
    historyStack.push(navigationId);
    currentIndex = historyStack.length - 1;

    window.history.pushState(newState, '', path);
    saveStack();

    // Dispatch custom event asynchronously to avoid setState during render
    queueMicrotask(() => {
        window.dispatchEvent(new Event('historychange'));
    });
}

// Helper function to handle popstate and update our tracking
export function handlePopState() {
    // This is now handled in the useEffect hook
}