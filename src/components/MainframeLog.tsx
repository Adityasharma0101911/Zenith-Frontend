// material design 3 terminal log with gsap typewriter animations
"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function MainframeLog({ refreshTrigger }: { refreshTrigger: number }) {
    const [logs, setLogs] = useState<string[]>([
        "[SYS_Z_ENCLAVE] Zenith Mainframe Online.",
        "[SYS_Z_ENCLAVE] Encrypted channel established.",
    ]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);

    // append new log on trigger
    useEffect(() => {
        if (refreshTrigger === 0) return;
        const now = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${now}] [SYS_Z_ENCLAVE] Transaction Intercepted. Evaluating Policy...`]);
    }, [refreshTrigger]);

    // auto-scroll + animate new log line
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        if (containerRef.current) {
            const lines = containerRef.current.querySelectorAll(".log-line");
            const last = lines[lines.length - 1];
            if (last) gsap.from(last, { opacity: 0, x: -15, duration: 0.4, ease: "power3.out" });
        }
    }, [logs]);

    // blinking cursor
    useEffect(() => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true, ease: "steps(1)" });
    }, []);

    // hover lift
    const cardRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const onEnter = () => gsap.to(el, { y: -2, duration: 0.25, ease: "power3.out" });
        const onLeave = () => gsap.to(el, { y: 0, duration: 0.25, ease: "power3.out" });
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        return () => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); };
    }, []);

    return (
        <div ref={cardRef} className="bg-m3-inverse-surface text-m3-primary-container font-mono text-xs p-5 rounded-m3-xl shadow-m3-2 h-36 overflow-y-auto w-full transition-shadow hover:shadow-m3-3">
            <div ref={containerRef}>
                {logs.map((line, i) => (
                    <p key={`${i}-${line}`} className="log-line leading-relaxed" style={{ opacity: 0.85 }}>{line}</p>
                ))}
            </div>
            <span ref={cursorRef} className="inline-block w-1.5 h-3 bg-m3-primary-container/60 ml-0.5" />
            <div ref={bottomRef} />
        </div>
    );
}
