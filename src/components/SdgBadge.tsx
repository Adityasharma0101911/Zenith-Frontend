// material design 3 sdg chip badge with gsap glow
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function SdgBadge() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        gsap.from(ref.current, { scale: 0.9, opacity: 0, duration: 0.4, ease: "back.out(1.5)" });
        const el = ref.current;
        const onEnter = () => gsap.to(el, { scale: 1.05, duration: 0.25, ease: "power3.out" });
        const onLeave = () => gsap.to(el, { scale: 1, duration: 0.25, ease: "power3.out" });
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        return () => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); };
    }, []);

    return (
        <div ref={ref} className="bg-m3-tertiary-container text-m3-on-tertiary-container rounded-m3-sm px-3 py-1 flex items-center gap-1.5 text-m3-label-medium animate-glow-pulse">
            <span>🌍</span>
            <span>UN SDG #3: Good Health & Well-being</span>
        </div>
    );
}
