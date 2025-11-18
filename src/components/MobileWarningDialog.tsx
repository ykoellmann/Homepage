import React from 'react';

interface MobileWarningDialogProps {
  show: boolean;
  onClose: () => void;
  language: string;
}

export const MobileWarningDialog: React.FC<MobileWarningDialogProps> = ({ show, onClose, language }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md mx-4 border border-slate-200 dark:border-slate-700 shadow-2xl animate-scale-in">
        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          {language === 'de' ? 'Mobile Ansicht' : 'Mobile View'}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {language === 'de'
            ? 'Die IDE-Ansicht ist für Desktop optimiert. Bitte verwende einen Desktop-Browser für die beste Erfahrung.'
            : 'The IDE view is optimized for desktop. Please use a desktop browser for the best experience.'}
        </p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-md"
        >
          {language === 'de' ? 'Verstanden' : 'Got it'}
        </button>
      </div>
    </div>
  );
};
