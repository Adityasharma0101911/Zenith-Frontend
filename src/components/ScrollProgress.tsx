// scroll progress indicator — thin animated bar at top of page
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollProgress() {
    const barRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!barRef.current) return;

        // entrance
        gsap.from(barRef.current.parentElement!, {
            opacity: 0,
            y: -4,
            duration: 0.5,
            delay: 0.5,
            ease: "power3.out",
        });

        const trigger = ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                if (barRef.current) {
                    gsap.to(barRef.current, {
                        scaleX: self.progress,
                        duration: 0.15,
                        ease: "power2.out",
                        overwrite: true,
                    });
                }
                if (glowRef.current) {
                    gsap.set(glowRef.current, {
                        left: `${self.progress * 100}%`,
                    });
                }
            },
        });

        return () => {
            trigger.kill();
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
            <div
                ref={barRef}
                className="h-full origin-left"
                style={{
                    transform: "scaleX(0)",
                    background: "linear-gradient(90deg, rgb(var(--m3-primary)), rgb(var(--m3-tertiary)))",
                }}
            />
            <div
                ref={glowRef}
                className="absolute top-0 w-8 h-full -translate-x-1/2 pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgb(var(--m3-primary) / 0.6), transparent)",
                    filter: "blur(4px)",
                }}
            />
        </div>
    );
}
