import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe, Palette, Keyboard } from 'lucide-react';
import { useViewMode } from '../contexts/ViewModeContext';
import { KeymapSettings } from './KeymapSettings';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

type SettingsCategory = 'appearance' | 'language' | 'keymap';

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
    const { i18n } = useTranslation('common');
    const { viewMode, setViewMode } = useViewMode();
    const [selectedCategory, setSelectedCategory] = useState<SettingsCategory>('appearance');
    const [tempLanguage, setTempLanguage] = useState(i18n.language);
    const [tempViewMode, setTempViewMode] = useState(viewMode);

    const categories = [
        { id: 'appearance' as const, label: 'Appearance & Behavior', icon: Palette },
        { id: 'language' as const, label: 'Language', icon: Globe },
        { id: 'keymap' as const, label: 'Keymap', icon: Keyboard },
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
                e.preventDefault();
                e.stopPropagation();
                handleCancel();
            }
        };
        // Use capture phase for higher priority
        window.addEventListener('keydown', handleEscape, true);
        return () => window.removeEventListener('keydown', handleEscape, true);
    }, [isOpen, i18n.language]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-5xl h-[600px] rounded-lg shadow-2xl flex flex-col overflow-hidden border" style={{ background: '#2B2D30', borderColor: '#393B40' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: '#393B40' }}>
                    <h2 className="text-lg font-semibold" style={{ color: '#BCBEC4' }}>
                        Settings
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-1 rounded transition-colors"
                        style={{ color: '#6C707E' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#3C3F41'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        aria-label="Close settings"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 border-r overflow-y-auto" style={{ borderColor: '#393B40', background: '#2B2D30' }}>
                        <div className="p-2">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors"
                                        style={{
                                            background: selectedCategory === category.id ? '#1d4ed8' : 'transparent',
                                            color: selectedCategory === category.id ? 'white' : '#BCBEC4'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedCategory !== category.id) {
                                                e.currentTarget.style.background = '#3C3F41';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedCategory !== category.id) {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {category.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-6" style={{ background: '#2B2D30' }}>
                        {selectedCategory === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-base font-semibold mb-4" style={{ color: '#BCBEC4' }}>
                                        View Mode
                                    </h3>
                                    <p className="text-sm mb-4" style={{ color: '#808080' }}>
                                        Choose how you want to view the portfolio.
                                    </p>

                                    <div className="space-y-2">
                                        <label
                                            className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors"
                                            style={{
                                                borderColor: tempViewMode === 'ide' ? '#1d4ed8' : '#393B40',
                                                background: tempViewMode === 'ide' ? '#1d4ed8/20' : 'transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (tempViewMode !== 'ide') {
                                                    e.currentTarget.style.background = '#3C3F41';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (tempViewMode !== 'ide') {
                                                    e.currentTarget.style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="viewMode"
                                                value="ide"
                                                checked={tempViewMode === 'ide'}
                                                onChange={(e) => setTempViewMode(e.target.value as 'ide')}
                                                className="w-4 h-4 mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium mb-1" style={{ color: '#BCBEC4' }}>
                                                    IDE View
                                                </div>
                                                <div className="text-xs" style={{ color: '#808080' }}>
                                                    VS Code-inspired interface with file explorer and tabs. Perfect for developers.
                                                </div>
                                            </div>
                                            {tempViewMode === 'ide' && (
                                                <svg className="w-5 h-5 mt-1" style={{ color: '#1d4ed8' }} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </label>

                                        <label
                                            className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors"
                                            style={{
                                                borderColor: tempViewMode === 'modern' ? '#1d4ed8' : '#393B40',
                                                background: tempViewMode === 'modern' ? '#1d4ed8/20' : 'transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (tempViewMode !== 'modern') {
                                                    e.currentTarget.style.background = '#3C3F41';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (tempViewMode !== 'modern') {
                                                    e.currentTarget.style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="viewMode"
                                                value="modern"
                                                checked={tempViewMode === 'modern'}
                                                onChange={(e) => setTempViewMode(e.target.value as 'modern')}
                                                className="w-4 h-4 mt-1"
                                            />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium mb-1" style={{ color: '#BCBEC4' }}>
                                                    Modern View
                                                </div>
                                                <div className="text-xs" style={{ color: '#808080' }}>
                                                    Traditional portfolio layout with hero section. Mobile-friendly and accessible.
                                                </div>
                                            </div>
                                            {tempViewMode === 'modern' && (
                                                <svg className="w-5 h-5 mt-1" style={{ color: '#1d4ed8' }} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </label>
                                    </div>

                                    {tempViewMode !== viewMode && (
                                        <div className="mt-4 p-3 border rounded-lg" style={{ background: '#3C3F41', borderColor: '#6B7280' }}>
                                            <p className="text-sm" style={{ color: '#FCD34D' }}>
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
                                    <h3 className="text-base font-semibold mb-4" style={{ color: '#BCBEC4' }}>
                                        Language Settings
                                    </h3>
                                    <p className="text-sm mb-4" style={{ color: '#808080' }}>
                                        Select the language for the application interface.
                                    </p>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" style={{ color: '#BCBEC4' }}>
                                            Interface Language
                                        </label>
                                        <div className="space-y-2">
                                            {languages.map((lang) => (
                                                <label
                                                    key={lang.code}
                                                    className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                                                    style={{
                                                        borderColor: tempLanguage === lang.code ? '#1d4ed8' : '#393B40',
                                                        background: tempLanguage === lang.code ? '#1d4ed8/20' : 'transparent'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (tempLanguage !== lang.code) {
                                                            e.currentTarget.style.background = '#3C3F41';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (tempLanguage !== lang.code) {
                                                            e.currentTarget.style.background = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="language"
                                                        value={lang.code}
                                                        checked={tempLanguage === lang.code}
                                                        onChange={(e) => setTempLanguage(e.target.value)}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-2xl">{lang.flag}</span>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium" style={{ color: '#BCBEC4' }}>
                                                            {lang.name}
                                                        </div>
                                                    </div>
                                                    {tempLanguage === lang.code && (
                                                        <svg className="w-5 h-5" style={{ color: '#1d4ed8' }} fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {tempLanguage !== i18n.language && (
                                        <div className="mt-4 p-3 border rounded-lg" style={{ background: '#3C3F41', borderColor: '#6B7280' }}>
                                            <p className="text-sm" style={{ color: '#FCD34D' }}>
                                                Click "Apply" or "OK" to change the language.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedCategory === 'keymap' && (
                            <KeymapSettings />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-2 border-t" style={{ borderColor: '#393B40', background: '#2B2D30' }}>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-1.5 text-sm font-medium rounded transition-colors"
                        style={{ color: '#BCBEC4' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#3C3F41'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-4 py-1.5 text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ color: '#BCBEC4' }}
                        onMouseEnter={(e) => {
                            if (!e.currentTarget.disabled) {
                                e.currentTarget.style.background = '#3C3F41';
                            }
                        }}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        disabled={tempLanguage === i18n.language && tempViewMode === viewMode}
                    >
                        Apply
                    </button>
                    <button
                        onClick={handleOk}
                        className="px-4 py-1.5 text-sm font-medium text-white rounded transition-colors"
                        style={{ background: '#1d4ed8' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#1d4ed8'}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
