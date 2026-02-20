// magnetic hover effect — elements subtly follow cursor on hover
"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface MagneticProps {
    children: React.ReactNode;
    strength?: number;
    className?: string;
}

export default function Magnetic({ children, strength = 0.3, className = "" }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = useCallback((e: MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
            x: x * strength,
            y: y * strength,
            duration: 0.3,
            ease: "power3.out",
        });
    }, [strength]);

    const onLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
        });
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, [onMove, onLeave]);

    return (
        <div ref={ref} className={`inline-block ${className}`}>
            {children}
        </div>
    );
}
