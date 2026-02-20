// material design 3 shared axis page transition — gsap powered
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        gsap.from(ref.current, {
            opacity: 0,
            y: 24,
            scale: 0.97,
            duration: 0.45,
            ease: "power3.out",
        });
    }, []);

    return <div ref={ref}>{children}</div>;
}
