import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe, Palette } from 'lucide-react';
import { useViewMode } from '../contexts/ViewModeContext';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

type SettingsCategory = 'appearance' | 'language';

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
    const { i18n } = useTranslation('common');
    const { viewMode, setViewMode } = useViewMode();
    const [selectedCategory, setSelectedCategory] = useState<SettingsCategory>('appearance');
    const [tempLanguage, setTempLanguage] = useState(i18n.language);
    const [tempViewMode, setTempViewMode] = useState(viewMode);

    const categories = [
        { id: 'appearance' as const, label: 'Appearance & Behavior', icon: Palette },
        { id: 'language' as const, label: 'Language', icon: Globe },
    ];

    const languages = [
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'en', name: 'English', flag: '🇬🇧' }
    ];

    const handleApply = () => {
        if (tempLanguage !== i18n.language) {
            i18n.changeLanguage(tempLanguage);
        }
        if (tempViewMode !== viewMode) {
            setViewMode(tempViewMode);
        }
    };

    const handleOk = () => {
        handleApply();
        onClose();
    };

    const handleCancel = () => {
        setTempLanguage(i18n.language);
        setTempViewMode(viewMode);
        onClose();
    };

    // Reset temp values when dialog opens
    useEffect(() => {
        if (isOpen) {
            setTempLanguage(i18n.language);
            setTempViewMode(viewMode);
        }
    }, [isOpen, i18n.language, viewMode]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, i18n.language]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-5xl h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-300 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Settings
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        aria-label="Close settings"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
                        <div className="p-2">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                                            selectedCategory === category.id
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {category.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {selectedCategory === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        View Mode
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Choose how you want to view the portfolio.
                                    </p>

                                    <div className="space-y-2">
                                        <label
                                            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                                tempViewMode === 'ide'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="viewMode"
                                                value="ide"
                                                checked={tempViewMode === 'ide'}
                                                onChange={(e) => setTempViewMode(e.target.value as 'ide')}
                                                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                    IDE View
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    VS Code-inspired interface with file explorer and tabs. Perfect for developers.
                                                </div>
                                            </div>
                                            {tempViewMode === 'ide' && (
                                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </label>

                                        <label
                                            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                                tempViewMode === 'modern'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="viewMode"
                                                value="modern"
                                                checked={tempViewMode === 'modern'}
                                                onChange={(e) => setTempViewMode(e.target.value as 'modern')}
                                                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                    Modern View
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    Traditional portfolio layout with hero section. Mobile-friendly and accessible.
                                                </div>
                                            </div>
                                            {tempViewMode === 'modern' && (
                                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </label>
                                    </div>

                                    {tempViewMode !== viewMode && (
                                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                Click "Apply" or "OK" to switch the view mode.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedCategory === 'language' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Language Settings
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Select the language for the application interface.
                                    </p>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Interface Language
                                        </label>
                                        <div className="space-y-2">
                                            {languages.map((lang) => (
                                                <label
                                                    key={lang.code}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                                        tempLanguage === lang.code
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                            : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="language"
                                                        value={lang.code}
                                                        checked={tempLanguage === lang.code}
                                                        onChange={(e) => setTempLanguage(e.target.value)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-2xl">{lang.flag}</span>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {lang.name}
                                                        </div>
                                                    </div>
                                                    {tempLanguage === lang.code && (
                                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {tempLanguage !== i18n.language && (
                                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                Click "Apply" or "OK" to change the language.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={tempLanguage === i18n.language && tempViewMode === viewMode}
                    >
                        Apply
                    </button>
                    <button
                        onClick={handleOk}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
