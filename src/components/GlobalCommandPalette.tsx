// global cmd+k command palette — gsap powered
"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles, X, Loader2, Bot } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function GlobalCommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [asking, setAsking] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const paletteRef = useRef<HTMLDivElement>(null);
    const responseRef = useRef<HTMLDivElement>(null);

    // listen for cmd+k and escape
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(o => !o); }
            if (e.key === "Escape" && open) { e.preventDefault(); handleClose(); }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // entrance animation when opened
    useEffect(() => {
        if (open) {
            setQuery(""); setResponse(null);
            setTimeout(() => inputRef.current?.focus(), 100);
            if (backdropRef.current) gsap.from(backdropRef.current, { opacity: 0, duration: 0.3, ease: "power3.out" });
            if (paletteRef.current) gsap.from(paletteRef.current, { opacity: 0, scale: 0.95, y: -20, duration: 0.45, ease: "back.out(1.4)" });
        }
    }, [open]);

    // response entrance
    useEffect(() => {
        if (response && responseRef.current) {
            gsap.from(responseRef.current, { opacity: 0, height: 0, duration: 0.4, ease: "power3.out" });
        }
    }, [response]);

    function handleClose() {
        const tl = gsap.timeline({ onComplete: () => setOpen(false) });
        if (paletteRef.current) tl.to(paletteRef.current, { opacity: 0, scale: 0.95, y: -20, duration: 0.25, ease: "power2.in" }, 0);
        if (backdropRef.current) tl.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.05);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim() || asking) return;
        setAsking(true); setResponse(null);
        try {
            const token = localStorage.getItem("token") || "";
            const res = await fetch(`${API_URL}/api/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ section: "guardian", message: query }),
            });
            if (!res.ok) throw new Error("Request failed");
            const data = await res.json();
            setResponse(data.response || "No response.");
        } catch { setResponse("Could not reach the AI. Please try again."); }
        finally { setAsking(false); }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <div ref={backdropRef} className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={handleClose} />
            <div ref={paletteRef} className="relative w-full max-w-xl mx-4 bg-m3-surface-container-high rounded-m3-xl shadow-2xl border border-white/10 overflow-hidden">
                <form onSubmit={handleSubmit} className="relative flex items-center p-4 border-b border-m3-outline-variant/20">
                    <Sparkles size={20} className="text-m3-primary shrink-0 opacity-70" />
                    <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask Jarvis anything... (Esc to close)" className="w-full bg-transparent text-m3-on-surface text-lg px-4 outline-none placeholder:text-m3-on-surface-variant/50 z-10" />
                    {asking ? (
                        <Loader2 size={20} className="animate-spin text-m3-primary shrink-0" />
                    ) : (
                        <button type="button" onClick={handleClose} className="text-m3-on-surface-variant hover:text-m3-on-surface transition-colors p-1 z-10"><X size={20} /></button>
                    )}
                </form>
                {response ? (
                    <div ref={responseRef} className="bg-m3-surface-container-lowest">
                        <div className="p-5 flex gap-3 items-start border-t border-m3-outline-variant/10">
                            <div className="w-8 h-8 rounded-m3-full bg-m3-primary-container flex items-center justify-center shrink-0 mt-0.5">
                                <Bot size={16} className="text-m3-on-primary-container" />
                            </div>
                            <p className="text-m3-body-large text-m3-on-surface leading-relaxed whitespace-pre-wrap">{response}</p>
                        </div>
                    </div>
                ) : !asking ? (
                    <div className="p-4 text-center"><p className="text-m3-label-small text-m3-on-surface-variant">Press Enter to send. Powered by Zenith AI.</p></div>
                ) : null}
            </div>
        </div>
    );
}
