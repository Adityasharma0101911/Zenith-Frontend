// animated sun/moon dark mode toggle — gsap powered celestial switch
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export default function DarkModeToggle({ expanded = true }: { expanded?: boolean }) {
    const [isDark, setIsDark] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const sunRef = useRef<SVGSVGElement>(null);
    const moonRef = useRef<SVGSVGElement>(null);
    const starsRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    // read initial mode
    useEffect(() => {
        const mode = localStorage.getItem("zenith-mode");
        setIsDark(mode === "dark");
    }, []);

    // entrance animation
    useEffect(() => {
        if (!toggleRef.current) return;
        gsap.from(toggleRef.current, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: 0.2,
            ease: "back.out(1.7)",
        });
    }, []);

    // animate state on change
    const animateToggle = useCallback((dark: boolean) => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.4 } });

        // thumb slide
        if (thumbRef.current) {
            tl.to(thumbRef.current, {
                x: dark ? 22 : 0,
                backgroundColor: dark ? "rgb(180, 210, 248)" : "rgb(255, 183, 77)",
                duration: 0.35,
                ease: "back.out(1.5)",
            }, 0);
        }

        // track color
        if (trackRef.current) {
            tl.to(trackRef.current, {
                backgroundColor: dark ? "rgba(80, 100, 140, 0.4)" : "rgba(255, 183, 77, 0.2)",
                borderColor: dark ? "rgba(180, 210, 248, 0.3)" : "rgba(255, 183, 77, 0.4)",
            }, 0);
        }

        // sun → shrink + rotate out
        if (sunRef.current) {
            tl.to(sunRef.current, {
                scale: dark ? 0 : 1,
                rotation: dark ? 180 : 0,
                opacity: dark ? 0 : 1,
                duration: 0.35,
            }, 0);
        }

        // moon → grow + rotate in
        if (moonRef.current) {
            tl.to(moonRef.current, {
                scale: dark ? 1 : 0,
                rotation: dark ? 0 : -180,
                opacity: dark ? 1 : 0,
                duration: 0.35,
            }, 0);
        }

        // stars twinkle
        if (starsRef.current) {
            const stars = starsRef.current.querySelectorAll(".toggle-star");
            tl.to(stars, {
                scale: dark ? 1 : 0,
                opacity: dark ? 1 : 0,
                duration: 0.3,
                stagger: 0.05,
                ease: "back.out(2)",
            }, dark ? 0.15 : 0);
        }

        // glow pulse
        if (glowRef.current) {
            tl.fromTo(glowRef.current, {
                scale: 0.5,
                opacity: 0.8,
            }, {
                scale: 2.5,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
            }, 0);
        }

        // label
        if (labelRef.current) {
            tl.fromTo(labelRef.current, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.3 }, 0.1);
        }
    }, []);

    function toggle() {
        const next = !isDark;
        setIsDark(next);
        localStorage.setItem("zenith-mode", next ? "dark" : "light");
        document.documentElement.setAttribute("data-mode", next ? "dark" : "light");
        animateToggle(next);
    }

    // set initial visual state (no animation)
    useEffect(() => {
        if (thumbRef.current) {
            gsap.set(thumbRef.current, {
                x: isDark ? 22 : 0,
                backgroundColor: isDark ? "rgb(180, 210, 248)" : "rgb(255, 183, 77)",
            });
        }
        if (trackRef.current) {
            gsap.set(trackRef.current, {
                backgroundColor: isDark ? "rgba(80, 100, 140, 0.4)" : "rgba(255, 183, 77, 0.2)",
                borderColor: isDark ? "rgba(180, 210, 248, 0.3)" : "rgba(255, 183, 77, 0.4)",
            });
        }
        if (sunRef.current) {
            gsap.set(sunRef.current, { scale: isDark ? 0 : 1, rotation: isDark ? 180 : 0, opacity: isDark ? 0 : 1 });
        }
        if (moonRef.current) {
            gsap.set(moonRef.current, { scale: isDark ? 1 : 0, rotation: isDark ? 0 : -180, opacity: isDark ? 1 : 0 });
        }
        if (starsRef.current) {
            const stars = starsRef.current.querySelectorAll(".toggle-star");
            gsap.set(stars, { scale: isDark ? 1 : 0, opacity: isDark ? 1 : 0 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // hover animation on toggle button
    const onEnter = useCallback(() => {
        if (toggleRef.current) gsap.to(toggleRef.current, { scale: 1.05, duration: 0.2, ease: "power3.out" });
    }, []);
    const onLeave = useCallback(() => {
        if (toggleRef.current) gsap.to(toggleRef.current, { scale: 1, duration: 0.2, ease: "power3.out" });
    }, []);
    const onDown = useCallback(() => {
        if (toggleRef.current) gsap.to(toggleRef.current, { scale: 0.92, duration: 0.1 });
    }, []);
    const onUp = useCallback(() => {
        if (toggleRef.current) gsap.to(toggleRef.current, { scale: 1.05, duration: 0.15, ease: "back.out(1.5)" });
    }, []);

    return (
        <div className="px-2 py-1.5">
            {expanded && (
                <p className="text-m3-label-small text-m3-on-surface-variant/60 uppercase tracking-wider mb-1.5">Mode</p>
            )}
            <div className="flex items-center gap-2.5">
                <button
                    ref={toggleRef}
                    onClick={toggle}
                    onMouseEnter={onEnter}
                    onMouseLeave={onLeave}
                    onMouseDown={onDown}
                    onMouseUp={onUp}
                    className="relative w-[52px] h-[28px] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-m3-primary"
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {/* glow burst on toggle */}
                    <div
                        ref={glowRef}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full pointer-events-none"
                        style={{ background: isDark ? "rgba(180,210,248,0.3)" : "rgba(255,183,77,0.3)", opacity: 0 }}
                    />

                    {/* track */}
                    <div
                        ref={trackRef}
                        className="absolute inset-0 rounded-full border transition-colors"
                        style={{
                            backgroundColor: isDark ? "rgba(80, 100, 140, 0.4)" : "rgba(255, 183, 77, 0.2)",
                            borderColor: isDark ? "rgba(180, 210, 248, 0.3)" : "rgba(255, 183, 77, 0.4)",
                        }}
                    />

                    {/* stars (visible in dark mode) */}
                    <div ref={starsRef} className="absolute inset-0 pointer-events-none">
                        <div className="toggle-star absolute w-1 h-1 rounded-full bg-blue-200" style={{ top: "5px", right: "10px" }} />
                        <div className="toggle-star absolute w-[3px] h-[3px] rounded-full bg-blue-100" style={{ top: "15px", right: "6px" }} />
                        <div className="toggle-star absolute w-1 h-1 rounded-full bg-indigo-200" style={{ top: "8px", right: "18px" }} />
                        <div className="toggle-star absolute w-[2px] h-[2px] rounded-full bg-blue-300" style={{ top: "18px", right: "14px" }} />
                    </div>

                    {/* thumb with sun/moon */}
                    <div
                        ref={thumbRef}
                        className="absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-md"
                        style={{
                            backgroundColor: isDark ? "rgb(180, 210, 248)" : "rgb(255, 183, 77)",
                        }}
                    >
                        {/* sun icon */}
                        <svg ref={sunRef} viewBox="0 0 24 24" className="absolute w-3.5 h-3.5" fill="none" stroke="rgb(120, 60, 0)" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="12" cy="12" r="4" />
                            <line x1="12" y1="2" x2="12" y2="5" />
                            <line x1="12" y1="19" x2="12" y2="22" />
                            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                            <line x1="2" y1="12" x2="5" y2="12" />
                            <line x1="19" y1="12" x2="22" y2="12" />
                            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                        </svg>

                        {/* moon icon */}
                        <svg ref={moonRef} viewBox="0 0 24 24" className="absolute w-3 h-3" fill="rgb(30, 40, 80)" stroke="none">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    </div>
                </button>

                {expanded && (
                    <span ref={labelRef} className="text-m3-label-medium text-m3-on-surface-variant">
                        {isDark ? "Dark" : "Light"}
                    </span>
                )}
            </div>
        </div>
    );
}
