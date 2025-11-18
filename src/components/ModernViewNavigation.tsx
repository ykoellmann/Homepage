import React from 'react';
import { Monitor } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavItem {
  id: string;
  label: string;
}

interface ModernViewNavigationProps {
  scrolled: boolean;
  activeSection: string;
  navItems: NavItem[];
  indicatorStyle: { width: string; left: string };
  navRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  onNavigate: (id: string) => void;
  onViewModeToggle: () => void;
}

export const ModernViewNavigation: React.FC<ModernViewNavigationProps> = ({
  scrolled,
  activeSection,
  navItems,
  indicatorStyle,
  navRefs,
  onNavigate,
  onViewModeToggle,
}) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-900/98 backdrop-blur-xl shadow-xl shadow-blue-500/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('home')}
          className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent hover:scale-110 transition-transform drop-shadow-sm"
        >
          YK
        </button>

        <div className="hidden md:flex items-center gap-1 relative">
          {navItems.map((item) => (
            <button
              key={item.id}
              ref={(el) => { navRefs.current[item.id] = el; }}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-lg transition-all relative z-10 font-semibold ${
                activeSection === item.id
                  ? 'text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div
            className="absolute h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-300 shadow-xl shadow-blue-500/50 -z-10"
            style={{
              width: indicatorStyle.width,
              left: indicatorStyle.left,
              top: '0px'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/30 to-blue-400/0 animate-pulse-slow" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={onViewModeToggle}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 group font-medium"
          >
            <Monitor size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">IDE View</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
