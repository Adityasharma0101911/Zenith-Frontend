// reusable ai chat interface for scholar, guardian, and vitals sections
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot, User } from "lucide-react";
import { API_URL } from "@/utils/api";

const m3Ease = [0.2, 0, 0, 1] as const;

// single chat message type
interface Message {
    role: "user" | "ai";
    content: string;
}

interface ChatInterfaceProps {
    section: "scholar" | "guardian" | "vitals";
    placeholder?: string;
    accentColor?: string;
    accentBg?: string;
}

export default function ChatInterface({
    section,
    placeholder = "Type a message...",
    accentColor = "text-m3-primary",
    accentBg = "bg-m3-primary-container",
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // send message to the backend ai
    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ section, message: userMsg }),
            });
            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: data.response || "No response received." },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Could not reach the AI. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* messages area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            >
                {/* empty state */}
                {messages.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-m3-on-surface-variant text-sm mt-12"
                    >
                        <Bot size={40} className={`mx-auto mb-3 ${accentColor} opacity-40`} />
                        <p>Start a conversation with your AI assistant.</p>
                        <p className="text-xs mt-1 opacity-60">Your profile data helps personalize responses.</p>
                    </motion.div>
                )}

                {/* message bubbles */}
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: m3Ease }}
                            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {/* ai avatar */}
                            {msg.role === "ai" && (
                                <div className={`w-8 h-8 rounded-m3-full ${accentBg} flex items-center justify-center shrink-0`}>
                                    <Bot size={16} className={accentColor} />
                                </div>
                            )}

                            {/* message bubble */}
                            <div
                                className={`max-w-[75%] px-4 py-3 rounded-m3-xl text-sm leading-relaxed ${
                                    msg.role === "user"
                                        ? "bg-m3-primary text-m3-on-primary rounded-br-m3-xs"
                                        : "bg-m3-surface-container-high text-m3-on-surface rounded-bl-m3-xs"
                                }`}
                            >
                                {msg.content}
                            </div>

                            {/* user avatar */}
                            {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-m3-full bg-m3-secondary-container flex items-center justify-center shrink-0">
                                    <User size={16} className="text-m3-on-secondary-container" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* loading indicator */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2.5 items-center"
                    >
                        <div className={`w-8 h-8 rounded-m3-full ${accentBg} flex items-center justify-center`}>
                            <Bot size={16} className={accentColor} />
                        </div>
                        <div className="flex gap-1.5 px-4 py-3 rounded-m3-xl bg-m3-surface-container-high">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                    className="w-2 h-2 rounded-full bg-m3-on-surface-variant"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* input area */}
            <form onSubmit={handleSend} className="px-4 pb-4 pt-2">
                <div className="flex gap-2 items-center bg-m3-surface-container-high rounded-m3-full px-4 py-2 border border-m3-outline-variant/30 focus-within:border-m3-primary transition-colors">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder}
                        disabled={loading}
                        className="flex-1 bg-transparent text-m3-on-surface text-sm outline-none placeholder:text-m3-on-surface-variant/60"
                    />
                    <motion.button
                        type="submit"
                        disabled={!input.trim() || loading}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-m3-full ${accentBg} ${accentColor} disabled:opacity-40 transition-opacity`}
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
