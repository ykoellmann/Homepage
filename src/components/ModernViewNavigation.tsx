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
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{
      background: scrolled ? 'var(--glass-bg-hover)' : 'var(--glass-bg)',
      backdropFilter: 'blur(40px) saturate(120%)',
      WebkitBackdropFilter: 'blur(40px) saturate(120%)',
      borderBottom: `1.5px solid ${scrolled ? 'var(--glass-border-hover)' : 'var(--glass-border)'}`,
      boxShadow: scrolled ? '0 8px 32px var(--glass-shadow-hover), inset 0 -1px 0 rgba(255, 255, 255, 0.3)' : 'none'
    }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('home')}
          className="text-xl font-bold hover:scale-110 transition-transform drop-shadow-sm"
          style={{
            background: 'var(--gradient-accent-2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          YK
        </button>

        <div className="hidden md:flex items-center gap-1 relative bg-white/5 rounded-full p-1 backdrop-blur-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              ref={(el) => { navRefs.current[item.id] = el; }}
              onClick={() => onNavigate(item.id)}
              className="px-4 py-1.5 rounded-full transition-all relative z-10"
              style={{
                color: activeSection === item.id ? 'var(--text-on-glass)' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: activeSection === item.id ? '500' : '400'
              }}
            >
              {item.label}
            </button>
          ))}
          <div
            className="absolute rounded-full transition-all duration-500 ease-out"
            style={{
              width: indicatorStyle.width,
              left: indicatorStyle.left,
              top: '4px',
              height: 'calc(100% - 8px)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transform: 'translateZ(0)',
              willChange: 'transform, left, width',
              pointerEvents: 'none'
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={onViewModeToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 group font-medium relative overflow-hidden"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(30px) saturate(120%)',
              WebkitBackdropFilter: 'blur(30px) saturate(120%)',
              border: '1.5px solid var(--glass-border)',
              color: 'var(--text-on-glass)',
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 16px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            }}
          >
            <Monitor
              size={18}
              className="group-hover:rotate-12 transition-transform relative z-10"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))'
              }}
            />
            <span className="hidden sm:inline relative z-10">IDE View</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(124, 58, 237, 0.15))'
              }}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};
