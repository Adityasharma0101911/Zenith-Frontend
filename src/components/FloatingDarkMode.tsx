// floating dark mode toggle — shows on pages where sidebar is hidden
"use client";

import { usePathname } from "next/navigation";
import DarkModeToggle from "@/components/DarkModeToggle";

// pages that don't have the sidebar (and therefore no built-in dark mode toggle)
const SHOW_ON = ["/", "/login", "/register", "/survey", "/onboarding"];

export default function FloatingDarkMode() {
    const pathname = usePathname();
    if (!SHOW_ON.includes(pathname)) return null;

    return (
        <div className="fixed top-4 right-4 z-[200] bg-m3-surface-container-high/80 backdrop-blur-md rounded-m3-full shadow-m3-2 border border-m3-outline-variant/20">
            <DarkModeToggle expanded={false} />
        </div>
    );
}
