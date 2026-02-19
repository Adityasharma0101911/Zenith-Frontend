// material design 3 styled terminal log
"use client";

// import hooks for managing the log entries
import { useEffect, useState, useRef } from "react";

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
        <div className="bg-m3-inverse-surface text-m3-primary-container font-mono text-xs p-5 rounded-m3-xl shadow-m3-2 h-36 overflow-y-auto w-full">
            {/* render each log line */}
            {logs.map((line, i) => (
                <p key={i} className="leading-relaxed opacity-85">{line}</p>
            ))}

            {/* invisible div to auto-scroll to */}
            <div ref={bottomRef} />
        </div>
    );
}
