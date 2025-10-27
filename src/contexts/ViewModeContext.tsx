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
      // Switch to Modern view - remove /ide prefix
      if (currentPath.startsWith('/ide')) {
        newPath = currentPath.replace(/^\/ide/, '') || '/';
        navigate(newPath);
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
