// matte theme picker — row of colored dots with gsap micro-interactions
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const THEMES = [
    { id: "teal", label: "Teal", color: "#006B5E" },
    { id: "charcoal", label: "Charcoal", color: "#585858" },
    { id: "timber", label: "Timber", color: "#6D4C2E" },
    { id: "forest", label: "Forest", color: "#3B6B3B" },
    { id: "crimson", label: "Crimson", color: "#8C3A3A" },
    { id: "slate", label: "Slate", color: "#465A8C" },
    { id: "midnight", label: "Midnight", color: "#0F3460" },
    { id: "emerald", label: "Emerald", color: "#0D4C3C" },
    { id: "golden", label: "Golden", color: "#E6D17B" },
    { id: "cherry", label: "Cherry", color: "#512C3A" },
];

export default function ThemePicker({ expanded = true }: { expanded?: boolean }) {
    const [active, setActive] = useState("teal");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem("zenith-theme") || "teal";
        setActive(saved);
        // ensure theme is applied on mount (in case inline script missed it)
        document.documentElement.setAttribute("data-theme", saved);
    }, []);

    // stagger entrance for dots
    useEffect(() => {
        if (!containerRef.current) return;
        gsap.from(containerRef.current.querySelectorAll(".theme-dot"), {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            stagger: 0.04,
            ease: "back.out(2)",
        });
    }, []);

    function switchTheme(id: string) {
        setActive(id);
        localStorage.setItem("zenith-theme", id);
        document.documentElement.setAttribute("data-theme", id);
    }

    // hover handlers for individual dots
    const onDotEnter = useCallback((e: React.MouseEvent) => {
        gsap.to(e.currentTarget, { scale: 1.2, duration: 0.2, ease: "back.out(2)" });
    }, []);
    const onDotLeave = useCallback((e: React.MouseEvent) => {
        gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power3.out" });
    }, []);
    const onDotDown = useCallback((e: React.MouseEvent) => {
        gsap.to(e.currentTarget, { scale: 0.85, duration: 0.1 });
    }, []);
    const onDotUp = useCallback((e: React.MouseEvent) => {
        gsap.to(e.currentTarget, { scale: 1.2, duration: 0.2, ease: "back.out(2)" });
    }, []);

    return (
        <div className="px-2 py-1.5">
            {expanded && (
                <p className="text-m3-label-small text-m3-on-surface-variant/60 uppercase tracking-wider mb-1.5">Theme</p>
            )}
            <div ref={containerRef} className="flex items-center gap-1.5 flex-wrap">
                {THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => switchTheme(theme.id)}
                        onMouseEnter={onDotEnter}
                        onMouseLeave={onDotLeave}
                        onMouseDown={onDotDown}
                        onMouseUp={onDotUp}
                        title={theme.label}
                        className="theme-dot relative flex items-center justify-center p-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-m3-primary"
                    >
                        <div
                            className="w-5 h-5 rounded-full transition-all duration-200"
                            style={{
                                backgroundColor: theme.color,
                                boxShadow: active === theme.id
                                    ? `0 0 0 2px rgb(var(--m3-surface)), 0 0 0 3.5px ${theme.color}`
                                    : "none",
                            }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
