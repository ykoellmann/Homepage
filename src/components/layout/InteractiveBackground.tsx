import React from "react";

interface InteractiveBackgroundProps {
    children: React.ReactNode;
    attract?: boolean;
}

export function InteractiveBackground({ children }: InteractiveBackgroundProps) {
    return (
        <div className="relative w-full min-h-full bg-[#1E1F22]">
            <div className="relative z-10 p-8 text-gray-200">
                {children}
            </div>
        </div>
    );
}