import React, { type ReactNode } from "react";

interface InteractiveCardProps {
    children: ReactNode;
    className?: string;
    hoverDistance?: number;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
                                                                    children,
                                                                    className,
                                                                }) => {
    return (
        <div
            className={`relative rounded-xl p-6 shadow-md border border-gray-700 hover:border-gray-500 transition-colors duration-200 ${className}`}
            style={{ backgroundColor: "#171717" }}
        >
            {children}
        </div>
    );
};
