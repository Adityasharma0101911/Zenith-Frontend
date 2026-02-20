"use client";

import { useEffect, useState } from "react";

export default function ContextualSpotlight() {
    const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-500"
            style={{
                background: `radial-gradient(1200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(var(--m3-primary), 0.05), transparent 45%)`
            }}
        />
    );
}
