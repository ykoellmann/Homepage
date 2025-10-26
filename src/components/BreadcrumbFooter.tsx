import React, {useState, useRef} from "react";
import {ChevronRight, Folder, FileCode} from "lucide-react";
import type {FileNode} from "./file-explorer.tsx";
import {Popup, type PopupSection} from "./Popup";
import {useClickOutside} from "../hooks/useClickOutside.ts";

interface BreadcrumbFooterProps {
    path: string;
    onNavigate?: (newPath: string) => void;
    onOpenFolder?: (newPath: string) => void;
    tree?: FileNode[];
}

export function BreadcrumbFooter({
                                     path,
                                     onNavigate,
                                     onOpenFolder,
                                     tree
                                 }: BreadcrumbFooterProps) {
    const pathParts = path.replace(/^\/+/, "").split("/").filter(Boolean);
    const parts = ["homepage", ...pathParts];
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useClickOutside(footerRef as React.RefObject<HTMLElement>, () => setOpenIndex(null));

    return (
        <div className="footer-breadcrumb" ref={footerRef}>
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
    );
}

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