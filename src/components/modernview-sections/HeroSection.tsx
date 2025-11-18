import React from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  name: string;
  title: string;
  description: string;
  buttonText: string;
  onNavigate: (section: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  name,
  title,
  description,
  buttonText,
  onNavigate
}) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative px-6" style={{ position: 'relative', zIndex: 1 }}>
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up drop-shadow-2xl">
          <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 bg-clip-text text-transparent animate-gradient">
            {name}
          </span>
        </h1>
        <p className="text-2xl md:text-4xl text-slate-800 dark:text-slate-200 mb-8 animate-slide-up-delayed font-bold">
          {title}
        </p>
        <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-12 animate-fade-in-up font-medium">
          {description}
        </p>
        <button
          onClick={() => onNavigate('projects')}
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full transition-all hover:scale-110 shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/70 animate-fade-in-up font-bold"
        >
          <span>{buttonText}</span>
          <ChevronDown className="group-hover:translate-y-1 transition-transform animate-bounce-subtle" size={20} />
        </button>
      </div>
    </section>
  );
};
