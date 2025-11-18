import React, {useState, useRef, useEffect, useImperativeHandle, forwardRef} from "react";
import {ChevronRight, Folder, FileCode} from "lucide-react";
import type {FileNode} from "./file-explorer.tsx";
import {Popup, type PopupSection} from "./Popup";
import {useClickOutside} from "../hooks/useClickOutside.ts";
import {useTranslation} from "react-i18next";

interface BreadcrumbFooterProps {
    path: string;
    onNavigate?: (newPath: string) => void;
    onOpenFolder?: (newPath: string) => void;
    tree?: FileNode[];
}

export interface BreadcrumbFooterRef {
    openLowestFolder: () => void;
}

export const BreadcrumbFooter = forwardRef<BreadcrumbFooterRef, BreadcrumbFooterProps>(({
                                     path,
                                     onNavigate,
                                     onOpenFolder,
                                     tree
                                 }, ref) => {
    const { i18n } = useTranslation();

    // Remove /ide prefix for display purposes
    const displayPath = path.replace(/^\/ide/, '');
    const pathParts = displayPath.replace(/^\/+/, "").split("/").filter(Boolean);
    const parts = ["homepage", ...pathParts];
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useClickOutside(footerRef as React.RefObject<HTMLElement>, () => setOpenIndex(null));

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
        openLowestFolder: () => {
            // Open the lowest (rightmost) folder
            const lowestIndex = parts.length - 1;
            const node = getNode(parts.slice(0, lowestIndex + 1), tree);
            const hasChildren = (node?.children || []).length > 0;

            if (hasChildren) {
                setOpenIndex(lowestIndex);
            } else {
                // If current folder has no children, search backwards for a folder with children
                for (let i = lowestIndex - 1; i >= 0; i--) {
                    const checkNode = getNode(parts.slice(0, i + 1), tree);
                    if ((checkNode?.children || []).length > 0) {
                        setOpenIndex(i);
                        break;
                    }
                }
            }
        }
    }), [parts, tree]);

    // Arrow key navigation between breadcrumb levels
    useEffect(() => {
        if (openIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                // Go one level up (left)
                if (openIndex > 0) {
                    const newIndex = openIndex - 1;
                    const node = getNode(parts.slice(0, newIndex + 1), tree);
                    const hasChildren = (node?.children || []).length > 0;

                    if (hasChildren) {
                        setOpenIndex(newIndex);
                    } else {
                        // Keep searching left for a folder with children
                        for (let i = newIndex - 1; i >= 0; i--) {
                            const checkNode = getNode(parts.slice(0, i + 1), tree);
                            if ((checkNode?.children || []).length > 0) {
                                setOpenIndex(i);
                                break;
                            }
                        }
                    }
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                // Go one level down (right)
                if (openIndex < parts.length - 1) {
                    const newIndex = openIndex + 1;
                    const node = getNode(parts.slice(0, newIndex + 1), tree);
                    const hasChildren = (node?.children || []).length > 0;

                    if (hasChildren) {
                        setOpenIndex(newIndex);
                    } else {
                        // Keep searching right for a folder with children
                        for (let i = newIndex + 1; i < parts.length; i++) {
                            const checkNode = getNode(parts.slice(0, i + 1), tree);
                            if ((checkNode?.children || []).length > 0) {
                                setOpenIndex(i);
                                break;
                            }
                        }
                    }
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setOpenIndex(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [openIndex, parts, tree]);

    return (
        <div className="footer-breadcrumb" ref={footerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {parts.map((part, i) => {
                    const currentPath = "/" + parts.slice(0, i + 1).join("/");
                    const node = getNode(parts.slice(0, i + 1), tree);
                    const entries = node?.children || [];
                    const hasChildren = entries.length > 0;

                    return (
                        <React.Fragment key={i}>
                            <BreadcrumbItem
                                part={part}
                                index={i}
                                currentPath={currentPath}
                                hasChildren={hasChildren}
                                isOpen={openIndex === i}
                                entries={entries}
                                parts={parts}
                                onToggleDropdown={() => setOpenIndex(openIndex === i ? null : i)}
                                onNavigate={onNavigate}
                                onOpenFolder={onOpenFolder}
                                setOpenIndex={setOpenIndex}
                            />
                            {i < parts.length - 1 && (
                                <ChevronRight size={14} className="footer-chevron"/>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            <a
                href="/impressum"
                className="footer-breadcrumb-item clickable"
                style={{
                    marginLeft: 'auto',
                    paddingLeft: '16px',
                    paddingRight: '8px',
                    fontSize: '11px',
                    opacity: 0.7,
                    textDecoration: 'none',
                    color: 'inherit',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                }}
                onClick={(e) => {
                    e.preventDefault();
                    // Always navigate to /impressum (outside IDE view)
                    window.location.href = '/impressum';
                }}
            >
                {i18n.language === 'de' ? 'Impressum' : 'Legal Notice'}
            </a>
        </div>
    );
});

BreadcrumbFooter.displayName = 'BreadcrumbFooter';

interface BreadcrumbItemProps {
    part: string;
    index: number;
    currentPath: string;
    hasChildren: boolean;
    isOpen: boolean;
    entries: FileNode[];
    parts: string[];
    onToggleDropdown: () => void;
    onNavigate?: (path: string) => void;
    onOpenFolder?: (path: string) => void;
    setOpenIndex: (index: number | null) => void;
}

function BreadcrumbItem({
                            part,
                            index,
                            currentPath,
                            hasChildren,
                            isOpen,
                            entries,
                            parts,
                            onToggleDropdown,
                            onNavigate,
                            onOpenFolder,
                            setOpenIndex
                        }: BreadcrumbItemProps) {

    function handleClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (hasChildren) {
            onToggleDropdown();
        } else {
            onNavigate?.(currentPath);
        }
    }

    function handleEntryClick(entry: FileNode) {
        const newPath = "/" + [...parts.slice(1, index + 1), entry.name].join("/");

        if (entry.type === "folder") {
            onOpenFolder?.(newPath);
            // Keep popup open and shift to next level
            setTimeout(() => setOpenIndex(index + 1), 0);
        } else {
            onNavigate?.(newPath);
            setOpenIndex(null);
        }
    }

    const popupSections: PopupSection[] = [
        {
            items: entries.map(entry => {
                const Icon = entry.type === "folder" ? Folder : FileCode;
                const iconClass = entry.type === "folder" ? "icon-folder" : "icon-file";

                return {
                    id: entry.name,
                    label: entry.name,
                    icon: <Icon size={14} className={iconClass}/>,
                    onClick: () => handleEntryClick(entry)
                };
            })
        }
    ];

    return (
        <div className="footer-breadcrumb-item-wrapper">
            <span
                className="footer-breadcrumb-item clickable"
                onClick={handleClick}
            >
                {part}
            </span>

            <Popup
                isOpen={isOpen && hasChildren}
                onClose={() => setOpenIndex(null)}
                sections={popupSections}
                position="top"
                align="start"
                width="12rem"
                itemSpacing="compact"
            />
        </div>
    );
}

function getNode(pathParts: string[], tree?: FileNode[]): FileNode | null {
    if (!tree || tree.length === 0) return null;

    const relevantParts = pathParts[0] === "homepage" ? pathParts.slice(1) : pathParts;

    let currentLevel = tree;
    let currentNode: FileNode | null = null;

    for (const part of relevantParts) {
        currentNode = currentLevel.find((n) => n.name === part) || null;
        if (!currentNode) return null;
        currentLevel = currentNode.children || [];
    }

    return currentNode ?? {name: "homepage", type: "folder", children: tree};
}