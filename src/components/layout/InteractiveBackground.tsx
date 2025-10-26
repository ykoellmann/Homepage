import React, { useRef, useEffect } from "react";

interface InteractiveBackgroundProps {
    children: React.ReactNode;
    attract?: boolean;
}

interface Ripple {
    x: number;
    y: number;
    radius: number;
    strength: number;
}

export function InteractiveBackground({ children, attract = false }: InteractiveBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: 0, y: 0 });
    const ripples = useRef<Ripple[]>([]);
    const pointsRef = useRef<{ x: number; y: number }[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const container = containerRef.current!;
        const content = contentRef.current!;
        const ctx = canvas.getContext("2d")!;

        const spacing = 20;
        const radius = 0.9;
        const effectRadius = 100;
        const strengthFactor = 0.03;

        const updateCanvasSize = () => {
            // Get the full scrollable height from content
            const width = container.clientWidth;
            const height = Math.max(container.clientHeight, content.scrollHeight);

            canvas.width = width;
            canvas.height = height;

            // Regenerate points for new dimensions
            pointsRef.current = [];
            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    pointsRef.current.push({ x, y });
                }
            }
        };

        // Initial setup
        updateCanvasSize();

        // Use ResizeObserver to watch for content size changes
        const resizeObserver = new ResizeObserver(() => {
            updateCanvasSize();
        });

        resizeObserver.observe(content);

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            ctx.fillStyle = "#1E1F22";
            ctx.fillRect(0, 0, width, height);

            // Update ripple states
            for (let r of ripples.current) {
                r.radius += 3;
                r.strength *= 0.97;
            }
            ripples.current = ripples.current.filter(r => r.strength > 0.01);

            for (const p of pointsRef.current) {
                const dx = p.x - mouse.current.x;
                const dy = p.y - mouse.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let px = p.x;
                let py = p.y;
                let intensity = 0;

                // Mouse effect
                if (dist < effectRadius) {
                    const strength = (effectRadius - dist) * strengthFactor;
                    const angle = Math.atan2(dy, dx);
                    const dir = attract ? -1 : 1;
                    px += Math.cos(angle) * strength * dir;
                    py += Math.sin(angle) * strength * dir;
                    intensity += (effectRadius - dist) / effectRadius;
                }

                // Ripple effects
                for (const r of ripples.current) {
                    const dxr = p.x - r.x;
                    const dyr = p.y - r.y;
                    const dr = Math.sqrt(dxr * dxr + dyr * dyr);
                    const wave = Math.sin((dr - r.radius) * 0.15) * r.strength * 2.5;

                    if (dr < r.radius + 40 && dr > r.radius - 40) {
                        py += wave;
                        intensity += Math.max(0, 1 - Math.abs(dr - r.radius) / 50) * r.strength;
                    }
                }

                const v = 160 + intensity * 90;
                const alpha = 0.2 + intensity * 0.4;
                const color = `rgba(${v}, ${v}, ${v}, ${alpha})`;

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(px, py, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current.x = e.clientX - rect.left;
            mouse.current.y = e.clientY - rect.top + container.scrollTop;
        };

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top + container.scrollTop;
            ripples.current.push({ x, y, radius: 0, strength: 1 });
        };

        const handleResize = () => {
            updateCanvasSize();
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("click", handleClick);
        window.addEventListener("resize", handleResize);

        const animationId = requestAnimationFrame(draw);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("click", handleClick);
            window.removeEventListener("resize", handleResize);
            resizeObserver.disconnect();
            cancelAnimationFrame(animationId);
        };
    }, [attract]);

    return (
        <div
            ref={containerRef}
            className="relative w-full min-h-full"
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full pointer-events-none"
                style={{ zIndex: 0 }}
            />
            <div ref={contentRef} className="relative z-10 p-8 text-gray-200">
                {children}
            </div>
        </div>
    );
}