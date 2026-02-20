"use client";

import { useEffect, useRef } from "react";

export default function ContextualSpotlight() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let rafId: number;
        let mx = -1000;
        let my = -1000;

        const handleMouseMove = (e: MouseEvent) => {
            mx = e.clientX;
            my = e.clientY;
        };

        // update DOM directly via rAF — no React re-renders
        function tick() {
            if (divRef.current) {
                divRef.current.style.background = `radial-gradient(1200px circle at ${mx}px ${my}px, rgba(var(--m3-primary), 0.05), transparent 45%)`;
            }
            rafId = requestAnimationFrame(tick);
        }

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        rafId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div
            ref={divRef}
            className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-500"
        />
    );
}
