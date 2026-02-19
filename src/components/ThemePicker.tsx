// matte theme picker — row of colored dots
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const THEMES = [
    { id: "teal", label: "Teal", color: "#006B5E" },
    { id: "charcoal", label: "Charcoal", color: "#585858" },
    { id: "timber", label: "Timber", color: "#6D4C2E" },
    { id: "forest", label: "Forest", color: "#3B6B3B" },
    { id: "crimson", label: "Crimson", color: "#8C3A3A" },
    { id: "slate", label: "Slate", color: "#465A8C" },
];

export default function ThemePicker({ expanded = true }: { expanded?: boolean }) {
    const [active, setActive] = useState("teal");

    // read saved theme on mount
    useEffect(() => {
        const saved = localStorage.getItem("zenith-theme") || "teal";
        setActive(saved);
    }, []);

    function switchTheme(id: string) {
        setActive(id);
        localStorage.setItem("zenith-theme", id);
        document.documentElement.setAttribute("data-theme", id);
    }

    return (
        <div className="px-2 py-1.5">
            {expanded && (
                <p className="text-m3-label-small text-m3-on-surface-variant/60 uppercase tracking-wider mb-1.5">
                    Theme
                </p>
            )}
            <div className="flex items-center gap-1.5 flex-wrap">
                {THEMES.map((theme) => (
                    <motion.button
                        key={theme.id}
                        onClick={() => switchTheme(theme.id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        title={theme.label}
                        className="relative flex items-center justify-center"
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
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
