// text reveal animation — characters animate in one by one
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
    as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function TextReveal({
    text,
    className = "",
    delay = 0,
    stagger = 0.03,
    as: Tag = "span",
}: TextRevealProps) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // split text into individual span characters
        const chars = text.split("").map((char) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char;
            span.style.display = "inline-block";
            span.className = "text-reveal-char";
            return span;
        });

        el.innerHTML = "";
        chars.forEach((c) => el.appendChild(c));

        gsap.from(chars, {
            opacity: 0,
            y: 20,
            rotationX: -90,
            scale: 0.8,
            duration: 0.5,
            stagger,
            delay,
            ease: "back.out(1.5)",
        });

        return () => {
            el.textContent = text;
        };
    }, [text, delay, stagger]);

    return (
        // @ts-expect-error dynamic tag
        <Tag ref={containerRef} className={className}>
            {text}
        </Tag>
    );
}
