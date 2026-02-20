// floating ambient particles — gsap animated background decorations
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Particle {
    el: HTMLDivElement;
    x: number;
    y: number;
    size: number;
    speed: number;
    drift: number;
}

export default function FloatingParticles({ count = 20 }: { count?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const particles: Particle[] = [];
        const w = container.offsetWidth;
        const h = container.offsetHeight;

        for (let i = 0; i < count; i++) {
            const el = document.createElement("div");
            const size = gsap.utils.random(2, 6);
            const x = gsap.utils.random(0, w);
            const y = gsap.utils.random(0, h);

            el.className = "absolute rounded-full pointer-events-none";
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.background = `rgb(var(--m3-primary) / ${gsap.utils.random(0.06, 0.15)})`;

            container.appendChild(el);
            particles.push({
                el,
                x,
                y,
                size,
                speed: gsap.utils.random(20, 60),
                drift: gsap.utils.random(-30, 30),
            });
        }

        // animate each particle with random float paths
        const tweens: gsap.core.Tween[] = [];
        particles.forEach((p) => {
            // vertical float
            const tween = gsap.to(p.el, {
                y: `-=${p.speed}`,
                x: `+=${p.drift}`,
                opacity: 0,
                duration: gsap.utils.random(6, 14),
                repeat: -1,
                ease: "none",
                onRepeat: function () {
                    gsap.set(p.el, {
                        x: gsap.utils.random(0, w),
                        y: h + 10,
                        opacity: gsap.utils.random(0.3, 0.8),
                    });
                },
            });
            tweens.push(tween);

            // gentle scale pulse
            const pulse = gsap.to(p.el, {
                scale: gsap.utils.random(1.2, 1.8),
                duration: gsap.utils.random(2, 5),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
            tweens.push(pulse);
        });

        // fade in whole container
        gsap.from(container, { opacity: 0, duration: 2, ease: "power2.out" });

        return () => {
            tweens.forEach((t) => t.kill());
            particles.forEach((p) => p.el.remove());
        };
    }, [count]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}
