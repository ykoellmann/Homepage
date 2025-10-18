import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, Folder, FileCode } from "lucide-react";
import type { FileNode } from "./file-explorer.tsx";

interface BreadcrumbFooterProps {
    path: string;
    onNavigate?: (newPath: string) => void;       // Öffentliche Navigation (nur für Dateien)
    onOpenFolder?: (newPath: string) => void;     // Breadcrumb-Update ohne Navigation (für Ordner)
    tree?: FileNode[];
}

export function BreadcrumbFooter({ path, onNavigate, onOpenFolder, tree }: BreadcrumbFooterProps) {
    const pathParts = path.replace(/^\/+/, "").split("/").filter(Boolean);
    const parts = ["homepage", ...pathParts];
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
                setOpenIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function getNode(pathParts: string[]): FileNode | null {
        if (!tree || tree.length === 0) return null;

        // Ignore "homepage" beim Suchen
        const relevantParts = pathParts[0] === "homepage" ? pathParts.slice(1) : pathParts;

        let currentLevel = tree;
        let currentNode: FileNode | null = null;

        for (const part of relevantParts) {
            currentNode = currentLevel.find((n) => n.name === part) || null;
            if (!currentNode) return null;
            currentLevel = currentNode.children || [];
        }

        // Wenn keine Teile übrig sind, geben wir das Root-Objekt zurück (für Homepage-Dropdown)
        return currentNode ?? { name: "homepage", type: "folder", children: tree };
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
                                    if (hasChildren) {
                                        setOpenIndex(openIndex === i ? null : i);
                                    } else {
                                        // Nur bei Datei: echte Navigation
                                        onNavigate?.(currentPath);
                                    }
                                }}
                            >
                                {part}
                            </span>

                            {openIndex === i && hasChildren && (
                                <div className="breadcrumb-dropdown">
                                    {entries.map((entry) => (
                                        <div
                                            key={entry.name}
                                            className="breadcrumb-dropdown-item"
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                // neuer Pfad (ohne "homepage" am Anfang)
                                                const newPath = "/" + [...parts.slice(1, i + 1), entry.name].join("/");

                                                if (entry.type === "folder") {
                                                    // KEINE Navigation! Nur Breadcrumb aktualisieren und neues Dropdown öffnen
                                                    onOpenFolder?.(newPath);
                                                    // openIndex auf die neue Ebene setzen, damit neues Dropdown sich öffnet
                                                    setOpenIndex(i + 1);
                                                } else {
                                                    // Datei -> echte Navigation und Dropdown schließen
                                                    onNavigate?.(newPath);
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

                        {i < parts.length - 1 && <ChevronRight size={14} className="footer-chevron" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
