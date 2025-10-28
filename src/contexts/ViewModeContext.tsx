import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type ViewMode = 'ide' | 'modern';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

const VIEW_MODE_KEY = 'preferred_view_mode';

interface ViewModeProviderProps {
  children: ReactNode;
}

export const ViewModeProvider: React.FC<ViewModeProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine view mode from route
  const isIdePath = location.pathname.startsWith('/ide');
  const currentViewMode: ViewMode = isIdePath ? 'ide' : 'modern';

  const [viewMode, setViewModeState] = useState<ViewMode>(currentViewMode);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Redirect to preferred view on initial load
  useEffect(() => {
    if (hasInitialized) return;

    // Check if there's a pending SPA redirect from GitHub Pages
    const hasSpaRedirect = sessionStorage.getItem('spa_redirect');

    // If there's a SPA redirect pending, don't interfere - let App.tsx handle it
    if (hasSpaRedirect) {
      setHasInitialized(true);
      return;
    }

    const preferredMode = localStorage.getItem(VIEW_MODE_KEY) as ViewMode | null;
    const isRootPath = location.pathname === '/' || location.pathname === '';
    const isProjectPath = location.pathname.startsWith('/src/') ||
                          location.pathname.startsWith('/about') ||
                          location.pathname.startsWith('/contact');

    // If at root and user prefers IDE mode, redirect to /ide
    if (isRootPath && preferredMode === 'ide') {
      navigate('/ide', { replace: true });
    }
    // If accessing a project route directly without /ide prefix, redirect to IDE view
    else if (isProjectPath && !location.pathname.startsWith('/ide')) {
      navigate(`/ide${location.pathname}`, { replace: true });
    }

    setHasInitialized(true);
  }, [hasInitialized, location.pathname, navigate]);

  // Sync view mode with route changes
  useEffect(() => {
    setViewModeState(currentViewMode);
  }, [currentViewMode]);

  const setViewMode = (mode: ViewMode) => {
    const currentPath = location.pathname;
    let newPath: string;

    if (mode === 'ide') {
      // Switch to IDE view - add /ide prefix
      if (!currentPath.startsWith('/ide')) {
        newPath = currentPath === '/' ? '/ide' : `/ide${currentPath}`;
        navigate(newPath);
      }
    } else {
      // Switch to Modern view - always go to root
      if (currentPath.startsWith('/ide')) {
        newPath = '/';
        navigate(newPath);
        // Clear tab state from sessionStorage to prevent restore on reload
        sessionStorage.removeItem('tabs_state');
      }
    }

    localStorage.setItem(VIEW_MODE_KEY, mode);
    setViewModeState(mode);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'ide' ? 'modern' : 'ide');
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};
