import {useState, useMemo, useEffect, useRef} from "react";
import {searchService} from "../lib/searchService.ts";

interface SearchEverywhereProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchEverywhere({ isOpen, onClose }: SearchEverywhereProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const results = useMemo(() => {
        return searchService.searchEverywhere(query);
    }, [query]);

    // Keyboard Shortcuts wie JetBrains
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ESC -> Close
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                setQuery('');
                onClose();
            }

            // Arrow Navigation
            if (isOpen && results.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < results.length - 1 ? prev + 1 : 0
                    );
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev > 0 ? prev - 1 : results.length - 1
                    );
                } else if (e.key === 'Enter' && results[selectedIndex]) {
                    e.preventDefault();
                    window.location.href = `/${results[selectedIndex].pageSlug}`;
                    onClose();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, onClose]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-20"
            style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden"
                style={{
                    background: 'var(--panel-bg)',
                    border: '1px solid var(--panel-border)',
                    maxHeight: '600px'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="p-3" style={{ borderBottom: '1px solid var(--panel-border)' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search everywhere..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        className="w-full px-3 py-2 rounded focus:outline-none"
                        style={{
                            background: '#2B2B2B',
                            border: '1px solid #3c3f41',
                            color: 'var(--text)',
                            fontSize: '13px'
                        }}
                        autoFocus
                    />
                </div>

                {/* Results */}
                <div
                    className="overflow-y-auto"
                    style={{ maxHeight: '500px' }}
                    onMouseLeave={() => setSelectedIndex(-1)}
                >
                    {results.length === 0 && query && (
                        <div className="p-8 text-center" style={{ color: '#6b7280' }}>
                            No results found
                        </div>
                    )}

                    {results.length === 0 && !query && (
                        <div className="p-8 text-center" style={{ color: '#6b7280' }}>
                            <p className="text-base mb-2">Search Everywhere</p>
                            <p className="text-xs opacity-75">Start typing to search through all pages, experiences, projects, and more...</p>
                        </div>
                    )}

                    {results.map((result, idx) => {
                        const isSelected = selectedIndex >= 0 && idx === selectedIndex;

                        return (
                            <a
                                key={`${result.pageSlug}-${result.item._searchableId}`}
                                href={`/${result.pageSlug}`}
                                className="block px-4 py-3 transition-colors no-underline"
                                style={{
                                    borderBottom: '1px solid var(--panel-border)',
                                    background: isSelected ? '#1d4ed8' : 'transparent',
                                    color: isSelected ? 'white' : 'var(--text)',
                                    cursor: 'pointer'
                                }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onClick={() => onClose()}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span style={{ fontSize: '16px' }}>{result.pageIcon || '📄'}</span>
                                        <span className="font-semibold truncate" style={{ fontSize: '13px' }}>
                                            {result.title}
                                        </span>
                                    </div>
                                    {result.subtitle && (
                                        <div
                                            className="text-xs mb-1 truncate"
                                            style={{
                                                color: isSelected ? 'rgba(255,255,255,0.8)' : '#9ca3af',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {result.subtitle}
                                        </div>
                                    )}
                                    {result.description && (
                                        <div
                                            className="text-xs mb-2 truncate"
                                            style={{
                                                color: isSelected ? 'rgba(255,255,255,0.7)' : '#6b7280',
                                                fontSize: '11px'
                                            }}
                                        >
                                            {result.description}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span
                                            className="text-xs px-2 py-0.5 rounded"
                                            style={{
                                                background: isSelected ? 'rgba(255,255,255,0.2)' : '#3c3f41',
                                                fontSize: '11px'
                                            }}
                                        >
                                            {result.itemType}
                                        </span>
                                        <span
                                            className="text-xs"
                                            style={{
                                                color: isSelected ? 'rgba(255,255,255,0.6)' : '#6b7280',
                                                fontSize: '11px'
                                            }}
                                        >
                                            in {result.pageName}
                                        </span>
                                        {result.matchedFields.length > 0 && (
                                            <span
                                                className="text-xs"
                                                style={{
                                                    color: isSelected ? 'rgba(255,255,255,0.6)' : '#6b7280',
                                                    fontSize: '11px'
                                                }}
                                            >
                                                • {result.matchedFields.slice(0, 2).join(', ')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
