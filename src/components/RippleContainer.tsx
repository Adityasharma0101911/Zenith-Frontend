// ripple effect — material design 3 press ripple
"use client";

import { useCallback, useRef } from "react";
import gsap from "gsap";

interface RippleContainerProps {
    children: React.ReactNode;
    className?: string;
    color?: string;
}

export default function RippleContainer({ children, className = "", color }: RippleContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClick = useCallback((e: React.MouseEvent) => {
        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const ripple = document.createElement("div");
        ripple.style.position = "absolute";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        ripple.style.borderRadius = "50%";
        ripple.style.background = color || "rgb(var(--m3-primary) / 0.15)";
        ripple.style.pointerEvents = "none";
        ripple.style.zIndex = "0";

        el.appendChild(ripple);

        gsap.fromTo(
            ripple,
            { scale: 0, opacity: 0.5 },
            {
                scale: 1,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => ripple.remove(),
            }
        );
    }, [color]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            onClick={handleClick}
        >
            {children}
        </div>
    );
}
