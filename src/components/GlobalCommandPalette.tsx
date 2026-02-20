// global cmd+k command palette for Jarvis AI
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Loader2, Bot } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function GlobalCommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [asking, setAsking] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // listen for cmd+k or ctrl+k
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // auto-focus input when opened
    useEffect(() => {
        if (open) {
            setQuery("");
            setResponse(null);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim() || asking) return;

        setAsking(true);
        setResponse(null);

        try {
            const token = localStorage.getItem("token") || "";
            const res = await fetch(`${API_URL}/api/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ section: "guardian", message: query }),
            });
            const data = await res.json();
            setResponse(data.response || "No response.");
        } catch {
            setResponse("Could not reach the AI. Please try again.");
        } finally {
            setAsking(false);
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
                    {/* heavy blur backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    {/* palette container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-xl mx-4 bg-m3-surface-container-high rounded-m3-xl shadow-2xl border border-white/10 overflow-hidden"
                    >
                        {/* search input form */}
                        <form onSubmit={handleSubmit} className="relative flex items-center p-4 border-b border-m3-outline-variant/20">
                            <Sparkles size={20} className="text-m3-primary shrink-0 opacity-70" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask Jarvis anything... (Esc to close)"
                                className="w-full bg-transparent text-m3-on-surface text-lg px-4 outline-none placeholder:text-m3-on-surface-variant/50 z-10"
                            />
                            {asking ? (
                                <Loader2 size={20} className="animate-spin text-m3-primary shrink-0" />
                            ) : (
                                <button type="button" onClick={() => setOpen(false)} className="text-m3-on-surface-variant hover:text-m3-on-surface transition-colors p-1 z-10">
                                    <X size={20} />
                                </button>
                            )}
                        </form>

                        {/* response area (animated height) */}
                        <AnimatePresence mode="wait">
                            {response && (
                                <motion.div
                                    key="response"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-m3-surface-container-lowest"
                                >
                                    <div className="p-5 flex gap-3 items-start border-t border-m3-outline-variant/10">
                                        <div className="w-8 h-8 rounded-m3-full bg-m3-primary-container flex items-center justify-center shrink-0 mt-0.5">
                                            <Bot size={16} className="text-m3-on-primary-container" />
                                        </div>
                                        <p className="text-m3-body-large text-m3-on-surface leading-relaxed whitespace-pre-wrap">
                                            {response}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            {!response && !asking && (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4 text-center"
                                >
                                    <p className="text-m3-label-small text-m3-on-surface-variant">Press Enter to send. Powered by Zenith AI.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
