import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Minus, Maximize2 } from 'lucide-react';
import { TerminalFileSystem } from '../lib/terminalFileSystem';
import { TerminalCommands } from '../lib/terminalCommands';
import type { PageEntry } from '../lib/buildFileTree';

interface TerminalProps {
    pages: PageEntry[];
    isOpen: boolean;
    height: number;
    onHeightChange: (height: number) => void;
    onResizeStart: () => void;
    onResizeEnd: () => void;
}

interface TerminalLine {
    type: 'input' | 'output' | 'error';
    content: string;
    prompt?: string;
}

export function Terminal({ pages, isOpen, height, onHeightChange, onResizeStart, onResizeEnd }: TerminalProps) {
    const [isResizing, setIsResizing] = useState(false);
    const [lines, setLines] = useState<TerminalLine[]>([
        {
            type: 'output',
            content: 'Welcome to the Portfolio Terminal! Type "help" for available commands.'
        }
    ]);
    const [currentInput, setCurrentInput] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const resizeRef = useRef<HTMLDivElement>(null);
    const inputLineRef = useRef<HTMLDivElement>(null);
    const commandsRef = useRef<TerminalCommands | null>(null);

    // Initialize file system and commands
    useEffect(() => {
        const fs = new TerminalFileSystem(pages);
        commandsRef.current = new TerminalCommands(fs);
    }, [pages]);

    // Handle resizing
    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            const mainElement = document.querySelector('.main');
            if (!mainElement) return;

            const mainRect = mainElement.getBoundingClientRect();
            const newHeight = mainRect.bottom - e.clientY;
            onHeightChange(Math.max(150, Math.min(newHeight, mainRect.height - 100)));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            onResizeEnd();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, onHeightChange, onResizeEnd]);

    // Auto-scroll to show input line
    useEffect(() => {
        if (inputLineRef.current) {
            inputLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [lines, currentInput]);

    // Focus input when terminal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const executeCommand = (cmd: string) => {
        if (!commandsRef.current) return;

        const prompt = commandsRef.current.getCurrentPath() || '~';

        // Add input to history
        setLines(prev => [...prev, {
            type: 'input',
            content: cmd,
            prompt: `user@portfolio:${prompt}$`
        }]);

        // Execute command
        const result = commandsRef.current.execute(cmd);

        if (result.output === '__CLEAR__') {
            setLines([]);
        } else {
            // Add output/error
            if (result.error) {
                setLines(prev => [...prev, {
                    type: 'error',
                    content: result.error!
                }]);
            } else if (result.output) {
                setLines(prev => [...prev, {
                    type: 'output',
                    content: result.output
                }]);
            }
        }

        setCurrentInput('');
        setHistoryIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentInput.trim()) {
                executeCommand(currentInput);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (!commandsRef.current) return;

            const matches = commandsRef.current.autocomplete(currentInput);
            if (matches.length === 1) {
                // Single match - complete it
                const parts = currentInput.trim().split(/\s+/);
                if (parts.length > 1) {
                    parts[parts.length - 1] = matches[0];
                    setCurrentInput(parts.join(' ') + (matches[0].endsWith('/') ? '' : ' '));
                } else {
                    setCurrentInput(currentInput);
                }
            } else if (matches.length > 1) {
                // Multiple matches - show them
                setLines(prev => [...prev, {
                    type: 'output',
                    content: matches.join('  ')
                }]);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!commandsRef.current) return;
            const history = commandsRef.current.getHistory();
            if (history.length > 0) {
                const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setCurrentInput(history[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!commandsRef.current) return;
            const history = commandsRef.current.getHistory();
            if (historyIndex !== -1) {
                const newIndex = Math.min(history.length - 1, historyIndex + 1);
                setHistoryIndex(newIndex);
                setCurrentInput(newIndex === history.length - 1 ? '' : history[newIndex]);
            }
        } else if (e.key === 'c' && e.ctrlKey) {
            e.preventDefault();
            setCurrentInput('');
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        }
    };

    const currentPrompt = commandsRef.current?.getCurrentPath() || '~';

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="flex flex-col bg-[#1e1e1e] border-t border-[#2d2d30] w-full"
            style={{ height: `${height}px`, flexShrink: 0 }}
        >
            {/* Resize Handle */}
            <div
                ref={resizeRef}
                onMouseDown={() => {
                    setIsResizing(true);
                    onResizeStart();
                }}
                className="h-1 bg-[#2d2d30] hover:bg-[#007acc] cursor-ns-resize transition-colors"
            />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#252526] border-b border-[#2d2d30]">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-[#cccccc]" />
                    <span className="text-xs font-medium text-[#cccccc] uppercase tracking-wide">Terminal</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onHeightChange(150)}
                        className="p-1 hover:bg-[#2d2d30] rounded transition-colors"
                        title="Minimize"
                    >
                        <Minus className="w-4 h-4 text-[#cccccc]" />
                    </button>
                    <button
                        onClick={() => {
                            const mainElement = document.querySelector('.main');
                            if (mainElement) {
                                onHeightChange(mainElement.clientHeight - 100);
                            }
                        }}
                        className="p-1 hover:bg-[#2d2d30] rounded transition-colors"
                        title="Maximize"
                    >
                        <Maximize2 className="w-4 h-4 text-[#cccccc]" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div
                ref={terminalRef}
                className="flex-1 overflow-y-auto p-3 font-mono text-sm"
                onClick={() => inputRef.current?.focus()}
            >
                {lines.map((line, index) => (
                    <div key={index} className="mb-1">
                        {line.type === 'input' && (
                            <div className="flex gap-2">
                                <span className="text-[#4EC9B0] flex-shrink-0">{line.prompt}</span>
                                <span className="text-[#cccccc] break-all">{line.content}</span>
                            </div>
                        )}
                        {line.type === 'output' && (
                            <pre className="text-[#cccccc] whitespace-pre-wrap break-words">{line.content}</pre>
                        )}
                        {line.type === 'error' && (
                            <pre className="text-[#f48771] whitespace-pre-wrap break-words">{line.content}</pre>
                        )}
                    </div>
                ))}

                {/* Input Line */}
                <div ref={inputLineRef} className="flex gap-2 items-start py-1">
                    <span className="text-[#4EC9B0] flex-shrink-0 pt-0.5">user@portfolio:{currentPrompt}$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none text-[#cccccc] caret-[#cccccc]"
                        spellCheck={false}
                        autoComplete="off"
                    />
                </div>
            </div>
        </div>
    );
}
