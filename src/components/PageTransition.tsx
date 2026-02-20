// material design 3 shared axis page transition — gsap powered with cinematic reveal
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const curtainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const tl = gsap.timeline();

        // curtain wipe reveal
        if (curtainRef.current) {
            tl.fromTo(curtainRef.current,
                { scaleY: 1 },
                { scaleY: 0, duration: 0.5, ease: "power3.inOut", transformOrigin: "top" },
                0
            );
        }

        // content entrance
        tl.from(ref.current, {
            opacity: 0,
            y: 20,
            scale: 0.98,
            duration: 0.45,
            ease: "power3.out",
        }, 0.15);
    }, []);

    return (
        <div className="relative">
            <div
                ref={curtainRef}
                className="fixed inset-0 z-[100] pointer-events-none"
                style={{ background: "rgb(var(--m3-primary) / 0.06)", transformOrigin: "top" }}
            />
            <div ref={ref}>{children}</div>
        </div>
    );
}
