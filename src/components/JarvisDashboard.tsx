// jarvis-style ai dashboard — gsap powered animations
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import {
    Bot, Send, Loader2, Sparkles, CheckCircle2, ArrowRight, RefreshCw, RotateCcw,
    Wifi, WifiOff, type LucideIcon,
} from "lucide-react";
import { API_URL } from "@/utils/api";

// stagger containers
export interface StatDef { label: string; key: string; icon: LucideIcon; format?: (val: unknown) => string; }
export interface RingDef { label: string; key: string; color: string; score: (val: unknown) => number; }

interface JarvisDashboardProps {
    section: "scholar" | "guardian" | "vitals";
    title: string; subtitle: string; headerIcon: LucideIcon;
    accentContainer: string; accentText: string; accentBorder: string;
    stats: StatDef[]; rings: RingDef[]; placeholder?: string;
    utilities?: React.ReactNode;
}

function parseBrief(raw: string) {
    const lines = raw.split("\n").filter(l => l.trim());
    const greeting: string[] = []; const recs: string[] = []; const actions: string[] = []; let closing = "";
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("> ")) actions.push(trimmed.slice(2));
        else if (/^\d+[\.)\s]/.test(trimmed)) recs.push(trimmed.replace(/^\d+[\.)]\s*/, ""));
        else if (recs.length === 0 && actions.length === 0) greeting.push(trimmed);
        else closing = trimmed;
    }
    return { greeting: greeting.join(" "), recs, actions, closing };
}

// animated svg circular progress ring with gsap
function ProgressRing({ percent, label, color, delay = 0 }: { percent: number; label: string; color: string; delay?: number }) {
    const size = 80; const sw = 6; const r = (size - sw) / 2; const circ = 2 * Math.PI * r;
    const off = circ - (percent / 100) * circ;
    const containerRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        if (containerRef.current) gsap.from(containerRef.current, { opacity: 0, scale: 0.8, duration: 0.5, delay, ease: "back.out(1.5)" });
        if (circleRef.current) gsap.from(circleRef.current, { strokeDashoffset: circ, duration: 1.2, delay: delay + 0.2, ease: "power3.out" });
    }, [percent, delay, circ]);

    return (
        <div ref={containerRef} className="flex flex-col items-center gap-1.5">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} className="stroke-m3-surface-container-high" />
                    <circle ref={circleRef} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-m3-label-medium text-m3-on-surface">{Math.round(percent)}%</span>
                </div>
            </div>
            <span className="text-m3-label-small text-m3-on-surface-variant text-center leading-tight max-w-[72px]">{label}</span>
        </div>
    );
}

export default function JarvisDashboard({
    section, title, subtitle, headerIcon: HeaderIcon,
    accentContainer, accentText, accentBorder, stats, rings, placeholder = "Ask me anything...",
    utilities,
}: JarvisDashboardProps) {
    const [survey, setSurvey] = useState<Record<string, unknown> | null>(null);
    const [brief, setBrief] = useState<string | null>(null);
    const [briefLoading, setBriefLoading] = useState(true);
    const [briefCached, setBriefCached] = useState(false);
    const [query, setQuery] = useState("");
    const [asking, setAsking] = useState(false);
    const [responses, setResponses] = useState<{ q: string; a: string }[]>([]);
    const [serverOnline, setServerOnline] = useState<boolean | null>(null);
    const [aiOnline, setAiOnline] = useState<boolean | null>(null);

    // refs for animations
    const headerRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const ringsRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const briefCardRef = useRef<HTMLDivElement>(null);
    const briefBodyRef = useRef<HTMLDivElement>(null);
    const responsesRef = useRef<HTMLDivElement>(null);
    const sendBtnRef = useRef<HTMLButtonElement>(null);
    const resetBtnRef = useRef<HTMLButtonElement>(null);
    const refreshBtnRef = useRef<HTMLButtonElement>(null);

    // entrance animations
    useEffect(() => {
        if (headerRef.current) gsap.from(headerRef.current, { opacity: 0, y: -12, duration: 0.5, ease: "power3.out" });
        if (statusRef.current) gsap.from(statusRef.current, { opacity: 0, scale: 0.9, duration: 0.5, delay: 0.3, ease: "power3.out" });
    }, []);

    // rings entrance
    useEffect(() => {
        if (ringsRef.current && survey) gsap.from(ringsRef.current, { opacity: 0, y: 12, duration: 0.5, delay: 0.15, ease: "power3.out" });
    }, [survey]);

    // grid stagger
    useEffect(() => {
        if (!gridRef.current || !survey) return;
        gsap.from(gridRef.current.querySelectorAll(".stat-card"), {
            opacity: 0, y: 16, scale: 0.95, duration: 0.4, stagger: 0.08, delay: 0.2, ease: "power3.out",
        });
    }, [survey]);

    // brief card entrance
    useEffect(() => {
        if (briefCardRef.current) gsap.from(briefCardRef.current, { opacity: 0, y: 16, duration: 0.5, delay: 0.3, ease: "power3.out" });
    }, []);

    // brief body content animation
    useEffect(() => {
        if (!briefBodyRef.current || briefLoading) return;
        gsap.from(briefBodyRef.current.querySelectorAll(".brief-line"), {
            opacity: 0, x: -10, duration: 0.3, stagger: 0.08, ease: "power3.out",
        });
    }, [brief, briefLoading]);

    // new response animation
    useEffect(() => {
        if (!responsesRef.current || responses.length === 0) return;
        const items = responsesRef.current.querySelectorAll(".resp-item");
        const first = items[0];
        if (first) gsap.from(first, { opacity: 0, y: 16, scale: 0.96, duration: 0.4, ease: "power3.out" });
    }, [responses]);

    // button hovers
    useEffect(() => {
        const btns = [sendBtnRef, resetBtnRef, refreshBtnRef];
        const cleanups: (() => void)[] = [];
        btns.forEach(ref => {
            const el = ref.current;
            if (!el) return;
            const enter = () => gsap.to(el, { scale: 1.1, duration: 0.15, ease: "power3.out" });
            const leave = () => gsap.to(el, { scale: 1, rotation: 0, duration: 0.15, ease: "power3.out" });
            const down = () => gsap.to(el, { scale: 0.9, duration: 0.1 });
            el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); el.addEventListener("mousedown", down);
            cleanups.push(() => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); });
        });
        return () => cleanups.forEach(fn => fn());
    }, [briefLoading]);

    // stat card hover
    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.querySelectorAll(".stat-card");
        const cleanups: (() => void)[] = [];
        cards.forEach(card => {
            const enter = () => gsap.to(card, { y: -3, duration: 0.2, ease: "power3.out" });
            const leave = () => gsap.to(card, { y: 0, duration: 0.2, ease: "power3.out" });
            card.addEventListener("mouseenter", enter); card.addEventListener("mouseleave", leave);
            cleanups.push(() => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave); });
        });
        return () => cleanups.forEach(fn => fn());
    }, [survey]);

    // health check
    useEffect(() => {
        let mounted = true;
        async function checkHealth() {
            try {
                const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(8000) });
                const data = await res.json();
                if (mounted) { setServerOnline(data.server ?? false); setAiOnline(data.ai ?? false); }
            } catch { if (mounted) { setServerOnline(false); setAiOnline(false); } }
        }
        checkHealth();
        return () => { mounted = false; };
    }, []);

    const fetchSurvey = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const [surveyRes, userRes] = await Promise.all([
                fetch(`${API_URL}/api/survey`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_URL}/api/user_data`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            if (!surveyRes.ok || !userRes.ok) throw new Error("Request failed");
            const surveyData = await surveyRes.json(); const userData = await userRes.json();
            if (surveyData.completed && surveyData.data) {
                const merged = { ...surveyData.data };
                if (userData.balance !== undefined) merged.balance = userData.balance;
                setSurvey(merged);
            }
        } catch {}
    }, []);

    const fetchBrief = useCallback(async (force = false) => {
        const cacheKey = `zenith_brief_${section}`;
        if (!force) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) { setBrief(cached); setBriefCached(true); setBriefLoading(false); return; }
        }
        setBriefLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/ai/brief`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ section, force }),
            });
            if (!res.ok) throw new Error("Request failed");
            const data = await res.json();
            const text = data.brief || "Unable to generate brief.";
            setBrief(text); setBriefCached(!!data.cached); localStorage.setItem(cacheKey, text);
        } catch { setBrief(prev => prev || "AI is temporarily unavailable. Please try again later."); }
        finally { setBriefLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section]);

    useEffect(() => { fetchSurvey(); fetchBrief(); }, [fetchSurvey, fetchBrief]);

    async function handleResetAI() {
        try { const token = localStorage.getItem("token"); await fetch(`${API_URL}/api/ai/reset`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }); } catch {}
        fetchBrief(true);
    }

    async function handleAsk(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim() || asking) return;
        const q = query.trim(); setQuery(""); setAsking(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ section, message: q }),
            });
            if (!res.ok) throw new Error("Request failed");
            const data = await res.json();
            setResponses(prev => [{ q, a: data.response || "No response." }, ...prev]);
        } catch { setResponses(prev => [{ q, a: "Could not reach the AI. Please try again." }, ...prev]); }
        finally { setAsking(false); }
    }

    function getStatValue(key: string): unknown {
        if (!survey) return "—";
        const val = survey[key];
        if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "—";
        return val ?? "—";
    }

    const parsed = brief ? parseBrief(brief) : null;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto min-h-0 px-4 md:px-6 pt-16 md:pt-6 pb-4 space-y-5">

                {/* header */}
                <div ref={headerRef} className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-m3-lg ${accentContainer} flex items-center justify-center`}>
                        <HeaderIcon size={24} className={accentText} />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-m3-headline-small text-m3-on-surface">{title}</h1>
                        <p className="text-m3-body-medium text-m3-on-surface-variant">{subtitle}</p>
                    </div>
                    <div ref={statusRef} className="flex items-center gap-3 ml-auto">
                        <div className="flex items-center gap-1.5" title={serverOnline ? "Server online" : serverOnline === false ? "Server offline" : "Checking..."}>
                            {serverOnline === null ? <Loader2 size={13} className="animate-spin text-m3-on-surface-variant" /> : serverOnline ? <Wifi size={13} className="text-green-500" /> : <WifiOff size={13} className="text-red-400" />}
                            <span className={`text-m3-label-small ${serverOnline === null ? "text-m3-on-surface-variant" : serverOnline ? "text-green-500" : "text-red-400"}`}>Server {serverOnline === null ? "..." : serverOnline ? "Online" : "Offline"}</span>
                        </div>
                        <div className="w-px h-3.5 bg-m3-outline-variant" />
                        <div className="flex items-center gap-1.5" title={aiOnline ? "AI service online" : aiOnline === false ? "AI service offline" : "Checking..."}>
                            {aiOnline === null ? <Loader2 size={13} className="animate-spin text-m3-on-surface-variant" /> : aiOnline ? <Sparkles size={13} className="text-green-500" /> : <Sparkles size={13} className="text-red-400" />}
                            <span className={`text-m3-label-small ${aiOnline === null ? "text-m3-on-surface-variant" : aiOnline ? "text-green-500" : "text-red-400"}`}>AI {aiOnline === null ? "..." : aiOnline ? "Online" : "Offline"}</span>
                        </div>
                    </div>
                </div>

                {/* progress rings */}
                {survey && rings.length > 0 && (
                    <div ref={ringsRef} className="flex justify-center gap-5 flex-wrap">
                        {rings.map((ring, i) => {
                            const pct = ring.score(survey[ring.key]);
                            return <ProgressRing key={ring.key} percent={pct} label={ring.label} color={ring.color} delay={0.2 + i * 0.15} />;
                        })}
                    </div>
                )}

                {/* stat cards */}
                {survey && (
                    <div ref={gridRef} className="grid grid-cols-2 gap-3">
                        {stats.map(s => {
                            const raw = getStatValue(s.key);
                            const display = s.format ? s.format(raw) : String(raw);
                            return (
                                <div key={s.key} className="stat-card bg-m3-surface-container-low rounded-m3-lg p-4 border border-m3-outline-variant/20 hover:shadow-m3-1 transition-shadow">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <s.icon size={14} className="text-m3-on-surface-variant" />
                                        <span className="text-m3-label-small text-m3-on-surface-variant">{s.label}</span>
                                    </div>
                                    <p className="text-m3-title-small text-m3-on-surface truncate">{display}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ai briefing */}
                <div ref={briefCardRef} className={`rounded-m3-xl border-2 ${accentBorder}/30 overflow-hidden`}>
                    <div className={`${accentContainer}/60 px-5 py-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className={accentText} />
                            <span className={`text-m3-label-large ${accentText}`}>AI Briefing</span>
                            {briefCached && <span className="text-m3-label-small text-m3-on-surface-variant/50 ml-1">(cached)</span>}
                        </div>
                        {!briefLoading && (
                            <div className="flex items-center gap-1">
                                <button ref={resetBtnRef} onClick={handleResetAI} className="p-1.5 rounded-m3-full hover:bg-black/5 text-m3-on-surface-variant" title="Reset AI"><RotateCcw size={13} /></button>
                                <button ref={refreshBtnRef} onClick={() => fetchBrief(true)} className={`p-1.5 rounded-m3-full hover:bg-black/5 ${accentText}`} title="Refresh"><RefreshCw size={14} /></button>
                            </div>
                        )}
                    </div>
                    <div ref={briefBodyRef} className="bg-m3-surface-container-lowest px-5 py-4">
                        {briefLoading ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Loader2 size={16} className={`animate-spin ${accentText}`} />
                                    <span className="text-m3-body-medium text-m3-on-surface-variant">Analyzing your profile...</span>
                                </div>
                                {[1, 2, 3].map(i => <div key={i} className="h-4 rounded-m3-full bg-m3-surface-container-high m3-shimmer" style={{ width: `${85 - i * 12}%` }} />)}
                            </div>
                        ) : parsed ? (
                            <div className="space-y-4">
                                {parsed.greeting && <p className="brief-line text-m3-body-medium text-m3-on-surface leading-relaxed">{parsed.greeting}</p>}
                                {parsed.recs.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="brief-line text-m3-label-small text-m3-on-surface-variant uppercase tracking-wider">Recommendations</p>
                                        {parsed.recs.map((rec, i) => (
                                            <div key={i} className="brief-line flex gap-2.5 items-start">
                                                <ArrowRight size={14} className={`${accentText} mt-0.5 shrink-0`} />
                                                <p className="text-m3-body-medium text-m3-on-surface leading-relaxed">{rec}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {parsed.actions.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="brief-line text-m3-label-small text-m3-on-surface-variant uppercase tracking-wider">This Week</p>
                                        {parsed.actions.map((act, i) => (
                                            <div key={i} className="brief-line flex gap-2.5 items-start">
                                                <CheckCircle2 size={14} className="text-m3-primary mt-0.5 shrink-0" />
                                                <p className="text-m3-body-medium text-m3-on-surface leading-relaxed">{act}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {parsed.closing && <p className={`brief-line text-xs italic ${accentText} pt-1`}>{parsed.closing}</p>}
                                {!parsed.greeting && parsed.recs.length === 0 && parsed.actions.length === 0 && (
                                    <p className="text-sm text-m3-on-surface leading-relaxed whitespace-pre-wrap">{brief}</p>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* utility tools */}
                {utilities}

                {/* responses */}
                <div ref={responsesRef}>
                    {asking && (
                        <div className="rounded-m3-lg bg-m3-surface-container-high p-4 flex items-center gap-3 mb-3">
                            <Loader2 size={16} className={`animate-spin ${accentText}`} />
                            <span className="text-m3-body-medium text-m3-on-surface-variant">Thinking...</span>
                        </div>
                    )}
                    {responses.map((r, i) => (
                        <div key={`resp-${i}`} className={`resp-item rounded-m3-xl border ${accentBorder}/20 overflow-hidden mb-3`}>
                            <div className="px-4 py-2.5 bg-m3-surface-container-high">
                                <p className="text-m3-label-small text-m3-on-surface-variant">You asked</p>
                                <p className="text-m3-body-medium text-m3-on-surface">{r.q}</p>
                            </div>
                            <div className="px-4 py-3 bg-m3-surface-container-lowest">
                                <div className="flex gap-2.5 items-start">
                                    <div className={`w-6 h-6 rounded-m3-full ${accentContainer} flex items-center justify-center shrink-0 mt-0.5`}>
                                        <Bot size={12} className={accentText} />
                                    </div>
                                    <p className="text-m3-body-medium text-m3-on-surface leading-relaxed whitespace-pre-wrap">{r.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* command bar */}
            <div className="shrink-0 px-4 md:px-6 pb-4 pt-3 bg-m3-surface border-t border-m3-outline-variant/20">
                <form onSubmit={handleAsk}>
                    <div className="flex gap-2 items-center bg-m3-surface-container-high rounded-m3-full px-4 py-2.5 border border-m3-outline-variant/30 focus-within:border-m3-primary transition-colors shadow-m3-2">
                        <Bot size={18} className={`${accentText} opacity-60`} />
                        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder={placeholder} disabled={asking} className="flex-1 bg-transparent text-m3-on-surface text-m3-body-medium outline-none placeholder:text-m3-on-surface-variant/60" />
                        <button ref={sendBtnRef} type="submit" disabled={!query.trim() || asking} className={`p-2 rounded-m3-full ${accentContainer} ${accentText} disabled:opacity-40 transition-opacity`}>
                            {asking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
