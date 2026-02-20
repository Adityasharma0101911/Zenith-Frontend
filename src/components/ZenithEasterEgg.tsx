"use client";

import { useEffect, useState, useRef } from "react";
import SpendingParticles from "./SpendingParticles";

export default function ZenithEasterEgg() {
    const keys = useRef<string[]>([]);
    const [active, setActive] = useState(false);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keys.current = [...keys.current, e.key.toLowerCase()].slice(-6);
            if (keys.current.join('') === 'zenith') {
                setActive(true);
                setTrigger(Date.now());

                // override theme temporarily
                document.documentElement.setAttribute("data-theme", "slate");

                // neon colors injected via inline style block
                const style = document.createElement('style');
                style.id = "zenith-neon-theme";
                style.innerHTML = `
                        [data-theme="slate"] {
                            --m3-primary: 255 0 255 !important;
                            --m3-primary-container: 255 100 255 !important;
                            --m3-secondary: 0 255 255 !important;
                            --m3-surface: 10 0 20 !important;
                            --m3-surface-container-low: 20 0 40 !important;
                            --m3-surface-container: 30 0 60 !important;
                            --m3-surface-container-high: 50 0 100 !important;
                        }
                    `;
                document.head.appendChild(style);

                // audio chime (safe public domain bell)
                try {
                    const audio = new Audio("https://cdn.freesound.org/previews/411/411162_5121236-lq.mp3");
                    audio.volume = 0.5;
                    audio.play();
                } catch (e) {
                    console.log("Audio play failed", e);
                }

                // reset after 5 seconds
                setTimeout(() => {
                    const el = document.getElementById("zenith-neon-theme");
                    if (el) el.remove();
                    const preferredTheme = localStorage.getItem("theme") || "teal";
                    document.documentElement.setAttribute("data-theme", preferredTheme);
                    setActive(false);
                }, 5000);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!active) return null;

    // reuse spending particles but make them a massive burst
    return (
        <>
            <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
                <h1 className="text-6xl font-black text-white mix-blend-overlay animate-pulse tracking-widest drop-shadow-[0_0_20px_rgba(255,0,255,0.8)]">
                    ZENITH MODE
                </h1>
            </div>
            <SpendingParticles trigger={trigger} />
            <SpendingParticles trigger={trigger + 1} />
        </>
    );
}
