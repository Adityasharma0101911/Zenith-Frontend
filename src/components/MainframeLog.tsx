// material design 3 styled terminal log with typewriter animations
"use client";

// import hooks for managing the log entries
import { useEffect, useState, useRef } from "react";

// import motion for log line entrance animations
import { motion } from "framer-motion";

// m3 standard easing
const m3Ease = [0.2, 0, 0, 1] as const;

// this simulates backend processing logs
export default function MainframeLog({ refreshTrigger }: { refreshTrigger: number }) {
    const [logs, setLogs] = useState<string[]>([
        "[SYS_Z_ENCLAVE] Zenith Mainframe Online.",
        "[SYS_Z_ENCLAVE] Encrypted channel established.",
    ]);

    const bottomRef = useRef<HTMLDivElement>(null);

    // append a new log every time refreshTrigger changes
    useEffect(() => {
        if (refreshTrigger === 0) return;
        const now = new Date().toLocaleTimeString();
        setLogs(prev => [
            ...prev,
            `[${now}] [SYS_Z_ENCLAVE] Transaction Intercepted. Evaluating Policy...`,
        ]);
    }, [refreshTrigger]);

    // auto-scroll to bottom when new logs arrive
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <motion.div
            whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="bg-m3-inverse-surface text-m3-primary-container font-mono text-xs p-5 rounded-m3-xl shadow-m3-2 h-36 overflow-y-auto w-full transition-shadow hover:shadow-m3-3"
        >
            {/* render each log line with slide-in animation */}
            {logs.map((line, i) => (
                <motion.p
                    key={`${i}-${line}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 0.85, x: 0 }}
                    transition={{ duration: 0.3, ease: m3Ease, delay: i === logs.length - 1 ? 0.1 : 0 }}
                    className="leading-relaxed"
                >
                    {line}
                </motion.p>
            ))}

            {/* blinking cursor at the end */}
            <motion.span
                animate={{ opacity: [0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-1.5 h-3 bg-m3-primary-container/60 ml-0.5"
            />

            {/* invisible div to auto-scroll to */}
            <div ref={bottomRef} />
        </motion.div>
    );
}
