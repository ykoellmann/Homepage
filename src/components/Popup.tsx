import React, {useRef, useEffect} from "react";
import {useClickOutside} from "../hooks/useClickOutside";

export interface PopupItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
}

export interface PopupSection {
    items: PopupItem[];
}

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    sections: PopupSection[];
    position?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    className?: string;
    width?: string;
    maxHeight?: string;
    itemSpacing?: "compact" | "normal" | "relaxed";
}

/**
 * Generic Popup component styled after JetBrains IDEs (Rider/WebStorm)
 *
 * Features:
 * - Multiple sections with visual separators
 * - Keyboard navigation (Arrow Up/Down, Enter, Escape)
 * - Click outside to close
 * - Flexible positioning
 * - Hover highlighting with blue accent
 */
export function Popup({
                          isOpen,
                          onClose,
                          sections,
                          position = "bottom",
                          align = "start",
                          className = "",
                          width = "14rem",
                          maxHeight = "24rem",
                          itemSpacing = "normal"
                      }: PopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    useClickOutside(popupRef as React.RefObject<HTMLElement>, () => {
        if (isOpen) onClose();
    });

    // Flatten all items for keyboard navigation
    const allItems = sections.flatMap(section => section.items);
    const enabledItems = allItems.filter(item => !item.disabled);

    useEffect(() => {
        if (!isOpen) {
            setSelectedIndex(0);
            return;
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (!isOpen) return;

            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => {
                    const nextIndex = prev + 1;
                    return nextIndex >= enabledItems.length ? 0 : nextIndex;
                });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => {
                    const nextIndex = prev - 1;
                    return nextIndex < 0 ? enabledItems.length - 1 : nextIndex;
                });
            } else if (e.key === "Enter") {
                e.preventDefault();
                const selectedItem = enabledItems[selectedIndex];
                if (selectedItem && !selectedItem.disabled) {
                    selectedItem.onClick?.();
                    onClose();
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, selectedIndex, enabledItems, onClose]);

    if (!isOpen) return null;

    const positionClasses = {
        top: "bottom-full mb-1",
        bottom: "top-full mt-1",
        left: "right-full mr-1",
        right: "left-full ml-1"
    };

    const alignClasses = {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0"
    };

    const spacingClasses = {
        compact: "py-1 px-2",
        normal: "py-2 px-3",
        relaxed: "py-3 px-4"
    };

    return (
        <div
            ref={popupRef}
            className={`absolute ${positionClasses[position]} ${alignClasses[align]} z-50 rounded-lg shadow-lg overflow-hidden menu-panel ${className}`}
            style={{width, maxHeight}}
            role="menu"
            onMouseLeave={() => setSelectedIndex(-1)}
        >
            <div className="overflow-y-auto max-h-full">
                {sections.map((section, sectionIdx) => (
                    <React.Fragment key={sectionIdx}>
                        {sectionIdx > 0 && <div className="menu-separator"/>}
                        <div className="menu-section">
                            {section.items.map((item) => {
                                const isSelected = selectedIndex >= 0 && !item.disabled && enabledItems[selectedIndex]?.id === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            if (!item.disabled) {
                                                item.onClick?.();
                                                onClose();
                                            }
                                        }}
                                        onMouseEnter={() => {
                                            if (!item.disabled) {
                                                const enabledIndex = enabledItems.findIndex(i => i.id === item.id);
                                                if (enabledIndex !== -1) {
                                                    setSelectedIndex(enabledIndex);
                                                }
                                            }
                                        }}
                                        className={`menu-item flex items-center gap-2 ${spacingClasses[itemSpacing]} ${
                                            item.disabled
                                                ? "disabled cursor-not-allowed opacity-50"
                                                : "cursor-pointer hover:bg-blue-700 hover:text-white"
                                        } ${
                                            isSelected ? "bg-blue-700 text-white" : ""
                                        } ${item.className || ""}`}
                                        title={item.disabled ? "Not available" : undefined}
                                    >
                                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                                        <span className="flex-1 truncate">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}