import React, { useRef, useEffect, type ReactNode } from "react";

interface InteractiveCardProps {
    children: ReactNode;
    className?: string;
    hoverDistance?: number; // wie weit die Maus noch Einfluss auf den Rand hat
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
                                                                    children,
                                                                    className,
                                                                    hoverDistance = 100,
                                                                }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const card = cardRef.current!;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        let width = (canvas.width = card.offsetWidth);
        let height = (canvas.height = card.offsetHeight);

        const mouse = { x: 0, y: 0 };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleResize = () => {
            width = canvas.width = card.offsetWidth;
            height = canvas.height = card.offsetHeight;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            const borderWidth = 3;
            const steps = 2; // Abstand der Punkte entlang des Rands

            // linke und rechte Seite
            for (let y = 0; y <= height; y += steps) {
                // links
                const distLeft = Math.hypot(mouse.x, mouse.y - y);
                const influenceLeft = Math.max(0, Math.min(1, 1 - distLeft / hoverDistance));
                ctx.strokeStyle = `rgba(${150 + 100 * influenceLeft}, ${150 + 100 * influenceLeft}, ${150 + 100 * influenceLeft}, ${0.15 + 0.45 * influenceLeft})`;
                ctx.lineWidth = borderWidth;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(borderWidth, y);
                ctx.stroke();

                // rechts
                const distRight = Math.hypot(mouse.x - width, mouse.y - y);
                const influenceRight = Math.max(0, Math.min(1, 1 - distRight / hoverDistance));
                ctx.strokeStyle = `rgba(${150 + 100 * influenceRight}, ${150 + 100 * influenceRight}, ${150 + 100 * influenceRight}, ${0.15 + 0.45 * influenceRight})`;
                ctx.beginPath();
                ctx.moveTo(width - borderWidth, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // oben und unten
            for (let x = 0; x <= width; x += steps) {
                // oben
                const distTop = Math.hypot(mouse.x - x, mouse.y);
                const influenceTop = Math.max(0, Math.min(1, 1 - distTop / hoverDistance));
                ctx.strokeStyle = `rgba(${150 + 100 * influenceTop}, ${150 + 100 * influenceTop}, ${150 + 100 * influenceTop}, ${0.15 + 0.45 * influenceTop})`;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, borderWidth);
                ctx.stroke();

                // unten
                const distBottom = Math.hypot(mouse.x - x, mouse.y - height);
                const influenceBottom = Math.max(0, Math.min(1, 1 - distBottom / hoverDistance));
                ctx.strokeStyle = `rgba(${150 + 100 * influenceBottom}, ${150 + 100 * influenceBottom}, ${150 + 100 * influenceBottom}, ${0.15 + 0.45 * influenceBottom})`;
                ctx.beginPath();
                ctx.moveTo(x, height - borderWidth);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, [hoverDistance]);

    return (
        <div ref={cardRef} className={`relative rounded-xl overflow-hidden p-6 shadow-md ${className}`} style={{ backgroundColor: "#171717" }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
};
