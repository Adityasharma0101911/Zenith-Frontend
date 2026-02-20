// reusable ai chat interface — gsap powered
"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Send, Loader2, Bot, User } from "lucide-react";
import { API_URL } from "@/utils/api";

interface Message { role: "user" | "ai"; content: string; }
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
    const messagesRef = useRef<HTMLDivElement>(null);
    const emptyRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    // auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, loading]);

    // animate new messages
    useEffect(() => {
        if (!messagesRef.current) return;
        const bubbles = messagesRef.current.querySelectorAll(".chat-bubble");
        const last = bubbles[bubbles.length - 1];
        if (last) gsap.from(last, { opacity: 0, y: 12, scale: 0.97, duration: 0.35, ease: "power3.out" });
    }, [messages]);

    // empty state entrance
    useEffect(() => {
        if (emptyRef.current && messages.length === 0 && !loading) {
            gsap.from(emptyRef.current, { opacity: 0, y: 10, duration: 0.4, ease: "power3.out" });
        }
    }, [messages.length, loading]);

    // loading dots
    useEffect(() => {
        if (!loadingRef.current || !loading) return;
        const dots = loadingRef.current.querySelectorAll(".chat-dot");
        dots.forEach((dot, i) => {
            gsap.to(dot, { opacity: 0.3, duration: 0.5, repeat: -1, yoyo: true, delay: i * 0.2, ease: "sine.inOut" });
        });
    }, [loading]);

    // send button hover
    useEffect(() => {
        const el = btnRef.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.1, duration: 0.15, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, duration: 0.15, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.9, duration: 0.1 });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); el.addEventListener("mousedown", down);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); };
    }, []);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ section, message: userMsg }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: "ai", content: data.response || "No response received." }]);
        } catch {
            setMessages(prev => [...prev, { role: "ai", content: "Could not reach the AI. Please try again." }]);
        } finally { setLoading(false); }
    }

    return (
        <div className="flex flex-col h-full">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && !loading && (
                    <div ref={emptyRef} className="text-center text-m3-on-surface-variant text-sm mt-12">
                        <Bot size={40} className={`mx-auto mb-3 ${accentColor} opacity-40`} />
                        <p>Start a conversation with your AI assistant.</p>
                        <p className="text-xs mt-1 opacity-60">Your profile data helps personalize responses.</p>
                    </div>
                )}
                <div ref={messagesRef}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-bubble flex gap-2.5 mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "ai" && (
                                <div className={`w-8 h-8 rounded-m3-full ${accentBg} flex items-center justify-center shrink-0`}>
                                    <Bot size={16} className={accentColor} />
                                </div>
                            )}
                            <div className={`max-w-[75%] px-4 py-3 rounded-m3-xl text-sm leading-relaxed ${
                                msg.role === "user" ? "bg-m3-primary text-m3-on-primary rounded-br-m3-xs" : "bg-m3-surface-container-high text-m3-on-surface rounded-bl-m3-xs"
                            }`}>{msg.content}</div>
                            {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-m3-full bg-m3-secondary-container flex items-center justify-center shrink-0">
                                    <User size={16} className="text-m3-on-secondary-container" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {loading && (
                    <div ref={loadingRef} className="flex gap-2.5 items-center">
                        <div className={`w-8 h-8 rounded-m3-full ${accentBg} flex items-center justify-center`}>
                            <Bot size={16} className={accentColor} />
                        </div>
                        <div className="flex gap-1.5 px-4 py-3 rounded-m3-xl bg-m3-surface-container-high">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="chat-dot w-2 h-2 rounded-full bg-m3-on-surface-variant" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSend} className="px-4 pb-4 pt-2">
                <div className="flex gap-2 items-center bg-m3-surface-container-high rounded-m3-full px-4 py-2 border border-m3-outline-variant/30 focus-within:border-m3-primary transition-colors">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} disabled={loading} className="flex-1 bg-transparent text-m3-on-surface text-sm outline-none placeholder:text-m3-on-surface-variant/60" />
                    <button ref={btnRef} type="submit" disabled={!input.trim() || loading} className={`p-2 rounded-m3-full ${accentBg} ${accentColor} disabled:opacity-40 transition-opacity`}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </form>
        </div>
    );
}
