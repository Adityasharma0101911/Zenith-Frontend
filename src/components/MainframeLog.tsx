// this creates a fake ibm z terminal window
"use client";

// import hooks for managing the log entries
import { useEffect, useState, useRef } from "react";

// this simulates backend processing logs
export default function MainframeLog({ refreshTrigger }: { refreshTrigger: number }) {
    // this stores the terminal log lines
    const [logs, setLogs] = useState<string[]>([
        "[SYS_Z_ENCLAVE] Zenith Mainframe Online.",
        "[SYS_Z_ENCLAVE] Encrypted channel established.",
    ]);

    // ref to auto-scroll to the bottom
    const bottomRef = useRef<HTMLDivElement>(null);

    // this appends a new log every time refreshTrigger changes
    useEffect(() => {
        // skip the first render
        if (refreshTrigger === 0) return;

        // get the current time for the log
        const now = new Date().toLocaleTimeString();

        // this simulates backend processing logs
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
        <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-xl shadow-inner h-32 overflow-y-auto w-full">
            {/* render each log line */}
            {logs.map((line, i) => (
                <p key={i} className="leading-relaxed">{line}</p>
            ))}

            {/* invisible div to auto-scroll to */}
            <div ref={bottomRef} />
        </div>
    );
}
