import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

export function useHistoryStatus() {
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const location = useLocation();

    // eigene History-Stack
    const [historyStack, setHistoryStack] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    console.log("hs", historyStack);

    useEffect(() => {
        setHistoryStack(prev => {
            if (prev[prev.length - 1] === location.pathname)
            {
                setCurrentIndex(currentIndex - 1);
                return prev;
            }
            const newStack = [...prev.slice(0, currentIndex + 1), location.pathname];
            setCurrentIndex(newStack.length - 1);
            return newStack;
        });
    }, [location]);

    useEffect(() => {
        setCanGoBack(currentIndex > 0);
        setCanGoForward(currentIndex < historyStack.length - 1);
    }, [historyStack, currentIndex]);

    return {canGoBack, canGoForward};
}