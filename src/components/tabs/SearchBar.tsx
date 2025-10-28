import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Undo2, ArrowUp, ArrowDown, X } from 'lucide-react';

interface SearchBarProps {
  contentRef: React.RefObject<HTMLElement | null>;
}

export function SearchBar({ contentRef }: SearchBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWords, setWholeWords] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const matchElementsRef = useRef<HTMLElement[]>([]);

  // Handler für Cmd+F / Ctrl+F and ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+F (Mac) oder Ctrl+F (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        e.stopPropagation();
        if (isVisible) {
          // Already open - focus input
          inputRef.current?.focus();
          inputRef.current?.select();
        } else {
          // Open search bar
          setIsVisible(true);
        }
      }
    };

    // Use capture phase
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isVisible]);

  // Separate ESC handler that only runs when visible
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };

    // Use capture phase for ESC to have highest priority
    window.addEventListener('keydown', handleEscape, true);
    return () => window.removeEventListener('keydown', handleEscape, true);
  }, [isVisible]);

  // Focus auf Input wenn geöffnet
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isVisible]);

  // Suche durchführen
  const performSearch = useCallback(() => {
    if (!searchTerm || !contentRef.current) {
      clearHighlights();
      setTotalMatches(0);
      setCurrentMatch(0);
      return;
    }

    clearHighlights();

    const content = contentRef.current;
    const textNodes: Node[] = [];

    // Sammle alle Text-Nodes
    const walker = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT,
        null
    );

    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent?.trim()) {
        textNodes.push(node);
      }
    }

    const matches: HTMLElement[] = [];
    let flags = caseSensitive ? 'g' : 'gi';
    let pattern = searchTerm;

    if (!useRegex) {
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    if (wholeWords) {
      pattern = `\\b${pattern}\\b`;
    }

    const regex = new RegExp(pattern, flags);

    textNodes.forEach((node) => {
      const text = node.textContent || '';
      const matchResults = [...text.matchAll(regex)];

      if (matchResults.length > 0 && node.parentElement) {
        const parent = node.parentElement;
        const newHTML = text.replace(regex, (match) =>
            `<mark class="search-highlight" style="background-color: #4a9eff; color: white; padding: 0 2px; border-radius: 2px;">${match}</mark>`
        );

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newHTML;

        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          const child = tempDiv.firstChild;
          if (child.nodeName === 'MARK') {
            matches.push(child as HTMLElement);
          }
          fragment.appendChild(child);
        }

        parent.replaceChild(fragment, node);
      }
    });

    matchElementsRef.current = matches;
    setTotalMatches(matches.length);

    if (matches.length > 0) {
      setCurrentMatch(1);
      highlightCurrentMatch(0);
    } else {
      setCurrentMatch(0);
    }
  }, [searchTerm, caseSensitive, wholeWords, useRegex, contentRef]);

  // Suche bei Änderungen
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const clearHighlights = () => {
    if (!contentRef.current) return;

    const highlights = contentRef.current.querySelectorAll('.search-highlight');
    highlights.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize();
      }
    });

    matchElementsRef.current = [];
  };

  const highlightCurrentMatch = (index: number) => {
    const matches = matchElementsRef.current;

    matches.forEach((match, i) => {
      if (i === index) {
        match.style.backgroundColor = '#ff9800';
        match.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        match.style.backgroundColor = '#4a9eff';
      }
    });
  };

  const findNext = () => {
    if (totalMatches === 0) return;

    const nextIndex = currentMatch < totalMatches ? currentMatch : 0;
    setCurrentMatch(nextIndex + 1);
    highlightCurrentMatch(nextIndex);
  };

  const findPrevious = () => {
    if (totalMatches === 0) return;

    const prevIndex = currentMatch > 1 ? currentMatch - 2 : totalMatches - 1;
    setCurrentMatch(prevIndex + 1);
    highlightCurrentMatch(prevIndex);
  };

  const handleClose = () => {
    setIsVisible(false);
    clearHighlights();
    setSearchTerm('');
  };

  if (!isVisible) return null;

  return (
      <div className="bg-[#1E1F22] border-b border-[#393B40] px-2 py-1.5 flex items-center gap-2 z-10">
        {/* Search Icon */}
        <div className="text-[#6C707E] flex-shrink-0">
          <Search className="w-5 h-5" />
        </div>

        {/* Input Field - max 300px */}
        <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.shiftKey) {
                  findPrevious();
                } else {
                  findNext();
                }
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                findNext();
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                findPrevious();
              }
            }}
            className="bg-transparent text-[#BCBEC4] text-sm outline-none py-1 placeholder-[#6C707E] w-full max-w-[360px]"
            placeholder="Search"
        />

        {/* Clear Button - always takes space, only visible when there's text */}
        <button
            onClick={() => {
              setSearchTerm('');
              clearHighlights();
              setTotalMatches(0);
              setCurrentMatch(0);
            }}
            className={`p-0.5 text-[#6C707E] hover:bg-[#3C3F41] rounded transition-colors flex-shrink-0 ${
                searchTerm ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            title="Clear"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* New Line Icon (undo-2 rotated 180deg) */}
        <button
            className="p-1 text-[#6C707E] hover:bg-[#3C3F41] rounded transition-colors flex-shrink-0"
            title="New Line in Search"
        >
          <Undo2 className="w-5 h-5 rotate-180" />
        </button>

        {/* Match Case Icon - cC */}
        <button
            onClick={() => setCaseSensitive(!caseSensitive)}
            className={`px-2 py-1 rounded transition-colors flex-shrink-0 text-sm font-semibold ${
                caseSensitive
                    ? 'bg-[#3574F0] text-white'
                    : 'text-[#6C707E] hover:bg-[#3C3F41]'
            }`}
            title="Match Case (Alt+C)"
        >
          cC
        </button>

        {/* Whole Words Icon - W */}
        <button
            onClick={() => setWholeWords(!wholeWords)}
            className={`px-2 py-1 rounded transition-colors flex-shrink-0 text-sm font-bold ${
                wholeWords
                    ? 'bg-[#3574F0] text-white'
                    : 'text-[#6C707E] hover:bg-[#3C3F41]'
            }`}
            title="Match Whole Words (Alt+W)"
        >
          W
        </button>

        {/* Regex Icon - .* */}
        <button
            onClick={() => setUseRegex(!useRegex)}
            className={`px-2 py-1 rounded transition-colors flex-shrink-0 text-sm font-mono ${
                useRegex
                    ? 'bg-[#3574F0] text-white'
                    : 'text-[#6C707E] hover:bg-[#3C3F41]'
            }`}
            title="Use Regular Expression (Alt+X)"
        >
          .*
        </button>

        {/* Divider - extends beyond padding */}
        <div className="w-px bg-[#393B40] flex-shrink-0 -my-1.5 self-stretch" />

        {/* Match Counter */}
        <div className="text-xs flex-shrink-0 min-w-[80px] text-center px-3">
          {searchTerm ? (
              <span className={totalMatches === 0 ? 'text-red-400' : 'text-[#6C707E]'}>
            {totalMatches > 0 ? `${currentMatch} of ${totalMatches}` : '0 results'}
          </span>
          ) : (
              <span className="text-[#6C707E]">0 results</span>
          )}
        </div>

        {/* Navigation Buttons - arrow-up and arrow-down */}
        <div className="flex items-center flex-shrink-0">
          <button
              onClick={findPrevious}
              disabled={totalMatches === 0}
              className="p-1 hover:bg-[#3C3F41] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
              title="Previous Occurrence (Shift+F3)"
          >
            <ArrowUp className="w-5 h-5 text-[#6C707E]" />
          </button>
          <button
              onClick={findNext}
              disabled={totalMatches === 0}
              className="p-1 hover:bg-[#3C3F41] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
              title="Next Occurrence (F3)"
          >
            <ArrowDown className="w-5 h-5 text-[#6C707E]" />
          </button>
        </div>

        {/* Spacer to push close button to the end */}
        <div className="flex-1" />

        {/* Close Button */}
        <button
            onClick={handleClose}
            className="p-1 hover:bg-[#3C3F41] transition-colors rounded flex-shrink-0"
            title="Close (Escape)"
        >
          <X className="w-5 h-5 text-[#6C707E]" />
        </button>
      </div>
  );
}