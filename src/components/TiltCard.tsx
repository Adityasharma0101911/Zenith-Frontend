// 3D tilt card — interactive depth perspective on hover
"use client";

import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    maxTilt?: number;
    glare?: boolean;
}

export default function TiltCard({ children, className = "", maxTilt = 8, glare = true }: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const onMove = useCallback((e: MouseEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const tiltX = (y - 0.5) * maxTilt * -1;
        const tiltY = (x - 0.5) * maxTilt;

        gsap.to(el, {
            rotationX: tiltX,
            rotationY: tiltY,
            transformPerspective: 800,
            duration: 0.4,
            ease: "power2.out",
        });

        if (glare && glareRef.current) {
            gsap.to(glareRef.current, {
                opacity: 0.15,
                background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgb(var(--m3-primary) / 0.25), transparent 60%)`,
                duration: 0.3,
            });
        }
    }, [maxTilt, glare]);

    const onLeave = useCallback(() => {
        const el = cardRef.current;
        if (!el) return;
        gsap.to(el, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
        });
        if (glare && glareRef.current) {
            gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
        }
    }, [glare]);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        return () => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, [onMove, onLeave]);

    return (
        <div ref={cardRef} className={`relative ${className}`} style={{ transformStyle: "preserve-3d" }}>
            {children}
            {glare && (
                <div
                    ref={glareRef}
                    className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{ opacity: 0 }}
                />
            )}
        </div>
    );
}
