// animated number counter — counts up with gsap
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedCounterProps {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({
    value,
    prefix = "",
    suffix = "",
    decimals = 2,
    duration = 1.2,
    className = "",
}: AnimatedCounterProps) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const counterObj = useRef({ val: 0 });

    useEffect(() => {
        if (!spanRef.current) return;

        const tween = gsap.to(counterObj.current, {
            val: value,
            duration,
            ease: "power2.out",
            onUpdate: () => {
                if (spanRef.current) {
                    spanRef.current.textContent = `${prefix}${counterObj.current.val.toFixed(decimals)}${suffix}`;
                }
            },
            overwrite: true,
        });

        // scale pop on value change
        gsap.fromTo(spanRef.current, { scale: 0.85 }, { scale: 1, duration: 0.4, ease: "back.out(1.5)" });

        return () => {
            tween.kill();
        };
    }, [value, prefix, suffix, decimals, duration]);

    return (
        <span ref={spanRef} className={className}>
            {prefix}{value.toFixed(decimals)}{suffix}
        </span>
    );
}
