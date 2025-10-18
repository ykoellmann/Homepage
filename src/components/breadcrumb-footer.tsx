import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, Folder, FileCode } from "lucide-react";
import type { FileNode } from "./file-explorer.tsx";

interface BreadcrumbFooterProps {
    path: string;
    onNavigate?: (newPath: string) => void;
    tree?: FileNode[];
}

export function BreadcrumbFooter({ path, onNavigate, tree }: BreadcrumbFooterProps) {
    const parts = path.replace(/^\/+/, "").split("/").filter(Boolean);
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    // Klick außerhalb schließt Dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
                setOpenIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Pfad → FileNode ermitteln
    function getNode(pathParts: string[]): FileNode | null {
        if (!tree || tree.length === 0) return null;
        let currentLevel = tree;
        let currentNode: FileNode | null = null;

        for (const part of pathParts) {
            currentNode = currentLevel.find((n) => n.name === part) || null;
            if (!currentNode) return null;
            currentLevel = currentNode.children || [];
        }
        return currentNode;
    }

    return (
        <div className="footer-breadcrumb" ref={footerRef}>
            {parts.map((part, i) => {
                const currentPath = "/" + parts.slice(0, i + 1).join("/");
                const node = getNode(parts.slice(0, i + 1));
                const entries = node?.children || [];

                const hasChildren = entries.length > 0;

                return (
                    <React.Fragment key={i}>
                        <div className="footer-breadcrumb-item-wrapper">
                            <span
                                className="footer-breadcrumb-item clickable"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Wenn Ordner mit Inhalten → Dropdown toggeln
                                    if (hasChildren) {
                                        setOpenIndex(openIndex === i ? null : i);
                                    } else {
                                        // sonst einfach navigieren
                                        onNavigate?.(currentPath);
                                    }
                                }}
                            >
                                {part}
                            </span>

                            {/* Dropdown öffnen */}
                            {openIndex === i && hasChildren && (
                                <div className="breadcrumb-dropdown">
                                    {entries.map((entry) => (
                                        <div
                                            key={entry.name}
                                            className="breadcrumb-dropdown-item"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newPath = currentPath + "/" + entry.name;
                                                onNavigate?.(newPath);
                                                if (entry.type === "folder") {
                                                    // Ordner offen lassen
                                                    setOpenIndex(i);
                                                } else {
                                                    // Bei Datei schließen
                                                    setOpenIndex(null);
                                                }
                                            }}
                                        >
                                            {entry.type === "folder" ? (
                                                <Folder size={14} className="icon-folder" />
                                            ) : (
                                                <FileCode size={14} className="icon-file" />
                                            )}
                                            <span>{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {i < parts.length - 1 && (
                            <ChevronRight size={14} className="footer-chevron" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
