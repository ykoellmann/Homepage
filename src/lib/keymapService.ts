export interface KeyBinding {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
    code?: string; // For function keys like F2
}

export interface KeymapAction {
    id: string;
    name: string;
    description: string;
    category: string;
    defaultBinding: KeyBinding;
    customBinding?: KeyBinding;
    allowRebind: boolean; // Some shortcuts should not be rebindable
    handler: (e: KeyboardEvent) => void;
}

export class KeymapService {
    private actions: Map<string, KeymapAction> = new Map();
    private listeners: Set<(actions: KeymapAction[]) => void> = new Set();
    private isListening = false;

    constructor() {
        this.loadCustomKeybindings();
    }

    registerAction(action: KeymapAction) {
        this.actions.set(action.id, action);
        this.notifyListeners();
    }

    unregisterAction(actionId: string) {
        this.actions.delete(actionId);
        this.notifyListeners();
    }

    getAction(actionId: string): KeymapAction | undefined {
        return this.actions.get(actionId);
    }

    getAllActions(): KeymapAction[] {
        return Array.from(this.actions.values());
    }

    getActionsByCategory(category: string): KeymapAction[] {
        return Array.from(this.actions.values()).filter(a => a.category === category);
    }

    getCategories(): string[] {
        const categories = new Set(Array.from(this.actions.values()).map(a => a.category));
        return Array.from(categories);
    }

    setCustomBinding(actionId: string, binding: KeyBinding) {
        const action = this.actions.get(actionId);
        if (action && action.allowRebind) {
            action.customBinding = binding;
            this.saveCustomKeybindings();
            this.notifyListeners();
        }
    }

    resetBinding(actionId: string) {
        const action = this.actions.get(actionId);
        if (action) {
            action.customBinding = undefined;
            this.saveCustomKeybindings();
            this.notifyListeners();
        }
    }

    resetAllBindings() {
        for (const action of this.actions.values()) {
            action.customBinding = undefined;
        }
        localStorage.removeItem('custom_keybindings');
        this.notifyListeners();
    }

    getActiveBinding(actionId: string): KeyBinding | undefined {
        const action = this.actions.get(actionId);
        if (!action) return undefined;
        return action.customBinding || action.defaultBinding;
    }

    matchesBinding(event: KeyboardEvent, binding: KeyBinding): boolean {
        const ctrlMatch = binding.ctrl ? event.ctrlKey : !event.ctrlKey;
        const altMatch = binding.alt ? event.altKey : !event.altKey;
        const shiftMatch = binding.shift ? event.shiftKey : !event.shiftKey;
        const metaMatch = binding.meta ? event.metaKey : !event.metaKey;

        // Check code first (for function keys)
        if (binding.code) {
            return ctrlMatch && altMatch && shiftMatch && metaMatch && event.code === binding.code;
        }

        // Otherwise check key
        const keyMatch = event.key.toLowerCase() === binding.key.toLowerCase();
        return ctrlMatch && altMatch && shiftMatch && metaMatch && keyMatch;
    }

    handleKeyDown(event: KeyboardEvent): boolean {
        for (const action of this.actions.values()) {
            const binding = this.getActiveBinding(action.id);
            if (binding && this.matchesBinding(event, binding)) {
                event.preventDefault();
                event.stopPropagation();
                action.handler(event);
                return true;
            }
        }
        return false;
    }

    startListening() {
        if (this.isListening) return;

        this.isListening = true;
        window.addEventListener('keydown', this.globalKeyHandler, true);
    }

    stopListening() {
        if (!this.isListening) return;

        this.isListening = false;
        window.removeEventListener('keydown', this.globalKeyHandler, true);
    }

    private globalKeyHandler = (event: KeyboardEvent) => {
        this.handleKeyDown(event);
    };

    subscribe(listener: (actions: KeymapAction[]) => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners() {
        const actions = this.getAllActions();
        this.listeners.forEach(listener => listener(actions));
    }

    private saveCustomKeybindings() {
        const customBindings: Record<string, KeyBinding> = {};
        for (const [id, action] of this.actions.entries()) {
            if (action.customBinding) {
                customBindings[id] = action.customBinding;
            }
        }
        localStorage.setItem('custom_keybindings', JSON.stringify(customBindings));
    }

    private loadCustomKeybindings() {
        try {
            const stored = localStorage.getItem('custom_keybindings');
            if (stored) {
                const customBindings: Record<string, KeyBinding> = JSON.parse(stored);
                for (const [id, binding] of Object.entries(customBindings)) {
                    const action = this.actions.get(id);
                    if (action && action.allowRebind) {
                        action.customBinding = binding;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load custom keybindings:', error);
        }
    }

    formatBinding(binding: KeyBinding): string {
        const parts: string[] = [];
        if (binding.ctrl) parts.push('Ctrl');
        if (binding.alt) parts.push('Alt');
        if (binding.shift) parts.push('Shift');
        if (binding.meta) parts.push('Meta');

        if (binding.code && binding.code.startsWith('F')) {
            parts.push(binding.code);
        } else {
            parts.push(binding.key.toUpperCase());
        }

        return parts.join('+');
    }

    // Special: Handle double shift detection
    private shiftPressCount = 0;
    private shiftTimer: number | null = null;

    handleShiftPress() {
        this.shiftPressCount++;

        if (this.shiftPressCount === 1) {
            this.shiftTimer = setTimeout(() => {
                this.shiftPressCount = 0;
            }, 500);
        } else if (this.shiftPressCount === 2) {
            this.shiftPressCount = 0;
            if (this.shiftTimer) {
                clearTimeout(this.shiftTimer);
            }
            return true; // Double shift detected
        }
        return false;
    }

    resetShiftCounter() {
        this.shiftPressCount = 0;
        if (this.shiftTimer) {
            clearTimeout(this.shiftTimer);
        }
    }
}

export const keymapService = new KeymapService();
