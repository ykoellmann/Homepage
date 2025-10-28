import { useState, useEffect } from 'react';
import { keymapService, type KeymapAction, type KeyBinding } from '../lib/keymapService';
import { Search, RotateCcw, X } from 'lucide-react';

interface KeymapSettingsProps {
    className?: string;
}

export function KeymapSettings({ className = '' }: KeymapSettingsProps) {
    const [actions, setActions] = useState<KeymapAction[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [editingAction, setEditingAction] = useState<string | null>(null);
    const [recordingBinding, setRecordingBinding] = useState<KeyBinding | null>(null);

    useEffect(() => {
        const updateActions = () => {
            setActions(keymapService.getAllActions());
        };

        updateActions();
        const unsubscribe = keymapService.subscribe(updateActions);

        return () => {
            unsubscribe();
        };
    }, []);

    const categories = ['all', ...keymapService.getCategories()];

    const filteredActions = actions.filter(action => {
        const matchesSearch = searchQuery === '' ||
            action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            action.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleRecordShortcut = (action: KeymapAction) => {
        if (!action.allowRebind) return;

        setEditingAction(action.id);
        setRecordingBinding(null);

        let capturedBinding: KeyBinding | null = null;

        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            e.stopPropagation();

            // Ignore modifier-only presses
            if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
                return;
            }

            // Ignore Escape - cancel recording
            if (e.key === 'Escape') {
                cleanup();
                return;
            }

            const newBinding: KeyBinding = {
                key: e.key,
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey,
                meta: e.metaKey,
                code: e.code.startsWith('F') ? e.code : undefined
            };

            capturedBinding = newBinding;
            setRecordingBinding(newBinding);
        };

        const handleKeyUp = () => {
            if (capturedBinding) {
                // Save the binding
                keymapService.setCustomBinding(action.id, capturedBinding);
                cleanup();
            }
        };

        const handleBlur = () => {
            cleanup();
        };

        const cleanup = () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('keyup', handleKeyUp, true);
            window.removeEventListener('blur', handleBlur);
            setEditingAction(null);
            setRecordingBinding(null);
            capturedBinding = null;
        };

        window.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('keyup', handleKeyUp, true);
        window.addEventListener('blur', handleBlur);
    };

    const handleReset = (actionId: string) => {
        keymapService.resetBinding(actionId);
    };

    const handleResetAll = () => {
        if (confirm('Reset all keybindings to default?')) {
            keymapService.resetAllBindings();
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Keyboard Shortcuts
                </h3>
                <button
                    onClick={handleResetAll}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset All
                </button>
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search shortcuts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 text-sm font-medium rounded whitespace-nowrap transition-colors ${
                                selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Shortcuts List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredActions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No shortcuts found
                    </div>
                ) : (
                    filteredActions.map(action => {
                        const activeBinding = keymapService.getActiveBinding(action.id);
                        const isCustom = !!action.customBinding;
                        const isEditing = editingAction === action.id;

                        return (
                            <div
                                key={action.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {action.name}
                                        </h4>
                                        {isCustom && (
                                            <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                                Custom
                                            </span>
                                        )}
                                        {!action.allowRebind && (
                                            <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                                System
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {action.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    {isEditing ? (
                                        <div className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
                                            {recordingBinding
                                                ? keymapService.formatBinding(recordingBinding)
                                                : 'Press keys...'}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleRecordShortcut(action)}
                                            disabled={!action.allowRebind}
                                            className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
                                                action.allowRebind
                                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {activeBinding ? keymapService.formatBinding(activeBinding) : 'None'}
                                        </button>
                                    )}

                                    {isCustom && (
                                        <button
                                            onClick={() => handleReset(action.id)}
                                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                            title="Reset to default"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>• Click on a shortcut to record a new key combination</p>
                <p>• Press ESC or click outside to cancel recording</p>
                <p>• System shortcuts cannot be changed</p>
            </div>
        </div>
    );
}
