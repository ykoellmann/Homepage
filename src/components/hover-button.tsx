import React from "react";
import {cn} from "../lib/utils.ts";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
};

export const HoverButton: React.FC<Props> = ({ active, className, ...props }) => (
    <button
        className={cn(
            "px-1 py-1 rounded-md transition-colors text-sm",
            active ? "bg-[#3a3c3f] text-white" : "text-gray-300 hover:bg-[#3a3c3f] hover:text-white",
            className
        )}
        {...props}
    />
);