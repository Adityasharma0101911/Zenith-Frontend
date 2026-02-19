// jarvis-style ai dashboard — proactive insights, stats, and command bar
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot,
    Send,
    Loader2,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    RefreshCw,
    RotateCcw,
    Wifi,
    WifiOff,
    type LucideIcon,
} from "lucide-react";
import { API_URL } from "@/utils/api";

const m3Ease = [0.2, 0, 0, 1] as const;

// stagger container for metric cards
const gridStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
};
const gridItem = {
    hidden: { opacity: 0, y: 16, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: m3Ease },
    },
};

// single stat definition passed from each page
export interface StatDef {
    label: string;
    key: string;
    icon: LucideIcon;
    format?: (val: unknown) => string;
}

// circular progress ring definition
export interface RingDef {
    label: string;
    key: string;
    color: string;
    score: (val: unknown) => number;
}

interface JarvisDashboardProps {
    section: "scholar" | "guardian" | "vitals";
    title: string;
    subtitle: string;
    headerIcon: LucideIcon;
    accentContainer: string; // e.g. "bg-m3-primary-container"
    accentText: string; // e.g. "text-m3-on-primary-container"
    accentBorder: string; // e.g. "border-m3-primary"
    stats: StatDef[];
    rings: RingDef[];
    placeholder?: string;
}

// parse ai brief into greeting, recommendations, and actions
function parseBrief(raw: string) {
    const lines = raw.split("\n").filter((l) => l.trim());
    const greeting: string[] = [];
    const recs: string[] = [];
    const actions: string[] = [];
    let closing = "";

    for (const line of lines) {
        const trimmed = line.trim();
        // action items start with "> "
        if (trimmed.startsWith("> ")) {
            actions.push(trimmed.slice(2));
        // numbered items are recommendations
        } else if (/^\d+[\.\)]\s/.test(trimmed)) {
            recs.push(trimmed.replace(/^\d+[\.\)]\s*/, ""));
        // first non-list lines are greeting, last is closing
        } else if (recs.length === 0 && actions.length === 0) {
            greeting.push(trimmed);
        } else {
            closing = trimmed;
        }
    }

    return { greeting: greeting.join(" "), recs, actions, closing };
}

// animated svg circular progress ring
function ProgressRing({ percent, label, color, delay = 0 }: { percent: number; label: string; color: string; delay?: number }) {
    const size = 80;
    const sw = 6;
    const r = (size - sw) / 2;
    const circ = 2 * Math.PI * r;
    const off = circ - (percent / 100) * circ;

    return (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay, ease: m3Ease }} className="flex flex-col items-center gap-1.5">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} className="stroke-m3-surface-container-high" />
                    <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: off }} transition={{ duration: 1.2, ease: [0.2, 0, 0, 1], delay: delay + 0.2 }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-m3-label-medium text-m3-on-surface">{Math.round(percent)}%</span>
                </div>
            </div>
            <span className="text-m3-label-small text-m3-on-surface-variant text-center leading-tight max-w-[72px]">{label}</span>
        </motion.div>
    );
}

export default function JarvisDashboard({
    section,
    title,
    subtitle,
    headerIcon: HeaderIcon,
    accentContainer,
    accentText,
    accentBorder,
    stats,
    rings,
    placeholder = "Ask me anything...",
}: JarvisDashboardProps) {
    // survey data from backend
    const [survey, setSurvey] = useState<Record<string, unknown> | null>(null);
    // ai-generated brief
    const [brief, setBrief] = useState<string | null>(null);
    const [briefLoading, setBriefLoading] = useState(true);
    const [briefCached, setBriefCached] = useState(false);
    // command bar state
    const [query, setQuery] = useState("");
    const [asking, setAsking] = useState(false);
    // responses from ad-hoc questions
    const [responses, setResponses] = useState<{ q: string; a: string }[]>([]);
    // system status (no tokens spent)
    const [serverOnline, setServerOnline] = useState<boolean | null>(null);
    const [aiOnline, setAiOnline] = useState<boolean | null>(null);

    // check server + ai health on mount (zero cost)
    useEffect(() => {
        let mounted = true;
        async function checkHealth() {
            try {
                const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(8000) });
                const data = await res.json();
                if (mounted) {
                    setServerOnline(data.server ?? false);
                    setAiOnline(data.ai ?? false);
                }
            } catch {
                if (mounted) {
                    setServerOnline(false);
                    setAiOnline(false);
                }
            }
        }
        checkHealth();
        return () => { mounted = false; };
    }, []);

    // fetch survey data on mount
    const fetchSurvey = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            // fetch survey and live user data in parallel
            const [surveyRes, userRes] = await Promise.all([
                fetch(`${API_URL}/api/survey`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_URL}/api/user_data`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            const surveyData = await surveyRes.json();
            const userData = await userRes.json();
            if (surveyData.completed && surveyData.data) {
                // always use live balance from user_data
                const merged = { ...surveyData.data };
                if (userData.balance !== undefined) merged.balance = userData.balance;
                setSurvey(merged);
            }
        } catch {
            /* silent */
        }
    }, []);

    // fetch proactive ai brief (force=true skips cache entirely)
    const fetchBrief = useCallback(async (force = false) => {
        const cacheKey = `zenith_brief_${section}`;
        // show localStorage cache and skip server call unless forced
        if (!force) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                setBrief(cached);
                setBriefCached(true);
                setBriefLoading(false);
                return; // don't call server — use cached version
            }
        }
        setBriefLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/ai/brief`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ section, force }),
            });
            const data = await res.json();
            const text = data.brief || "Unable to generate brief.";
            setBrief(text);
            setBriefCached(!!data.cached);
            localStorage.setItem(cacheKey, text);
        } catch {
            setBrief((prev) => prev || "AI is temporarily unavailable. Please try again later.");
        } finally {
            setBriefLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section]);

    useEffect(() => {
        fetchSurvey();
        fetchBrief();
    }, [fetchSurvey, fetchBrief]);

    // reset cached ai assistants and threads then re-fetch brief
    async function handleResetAI() {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_URL}/api/ai/reset`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch { /* ignore */ }
        fetchBrief(true);
    }

    // handle ad-hoc question from the command bar
    async function handleAsk(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim() || asking) return;

        const q = query.trim();
        setQuery("");
        setAsking(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ section, message: q }),
            });
            const data = await res.json();
            setResponses((prev) => [
                { q, a: data.response || "No response." },
                ...prev,
            ]);
        } catch {
            setResponses((prev) => [
                { q, a: "Could not reach the AI. Please try again." },
                ...prev,
            ]);
        } finally {
            setAsking(false);
        }
    }

    // get a stat value from survey data
    function getStatValue(key: string): unknown {
        if (!survey) return "—";
        const val = survey[key];
        if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "—";
        return val ?? "—";
    }

    // parsed brief sections
    const parsed = brief ? parseBrief(brief) : null;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto min-h-0 px-4 md:px-6 pt-16 md:pt-6 pb-4 space-y-5">

                {/* header */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: m3Ease }}
                    className="flex items-center gap-3"
                >
                    <div className={`w-12 h-12 rounded-m3-lg ${accentContainer} flex items-center justify-center`}>
                        <HeaderIcon size={24} className={accentText} />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-m3-headline-small text-m3-on-surface">{title}</h1>
                        <p className="text-m3-body-medium text-m3-on-surface-variant">{subtitle}</p>
                    </div>
                    {/* system status indicators */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: m3Ease }}
                        className="flex items-center gap-3 ml-auto"
                    >
                        <div className="flex items-center gap-1.5" title={serverOnline ? "Server online" : serverOnline === false ? "Server offline" : "Checking..."}>
                            {serverOnline === null ? (
                                <Loader2 size={13} className="animate-spin text-m3-on-surface-variant" />
                            ) : serverOnline ? (
                                <Wifi size={13} className="text-green-500" />
                            ) : (
                                <WifiOff size={13} className="text-red-400" />
                            )}
                            <span className={`text-m3-label-small ${
                                serverOnline === null ? "text-m3-on-surface-variant" : serverOnline ? "text-green-500" : "text-red-400"
                            }`}>
                                Server {serverOnline === null ? "..." : serverOnline ? "Online" : "Offline"}
                            </span>
                        </div>
                        <div className="w-px h-3.5 bg-m3-outline-variant" />
                        <div className="flex items-center gap-1.5" title={aiOnline ? "AI service online" : aiOnline === false ? "AI service offline" : "Checking..."}>
                            {aiOnline === null ? (
                                <Loader2 size={13} className="animate-spin text-m3-on-surface-variant" />
                            ) : aiOnline ? (
                                <Sparkles size={13} className="text-green-500" />
                            ) : (
                                <Sparkles size={13} className="text-red-400" />
                            )}
                            <span className={`text-m3-label-small ${
                                aiOnline === null ? "text-m3-on-surface-variant" : aiOnline ? "text-green-500" : "text-red-400"
                            }`}>
                                AI {aiOnline === null ? "..." : aiOnline ? "Online" : "Offline"}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* wellness progress rings */}
                {survey && rings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: m3Ease }}
                        className="flex justify-center gap-5 flex-wrap"
                    >
                        {rings.map((ring, i) => {
                            const pct = ring.score(survey[ring.key]);
                            return <ProgressRing key={ring.key} percent={pct} label={ring.label} color={ring.color} delay={0.2 + i * 0.15} />;
                        })}
                    </motion.div>
                )}

                {/* stat metric cards */}
                {survey && (
                    <motion.div
                        variants={gridStagger}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 gap-3"
                    >
                        {stats.map((s) => {
                            const raw = getStatValue(s.key);
                            const display = s.format ? s.format(raw) : String(raw);
                            return (
                                <motion.div
                                    key={s.key}
                                    variants={gridItem}
                                    whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                                    className="bg-m3-surface-container-low rounded-m3-lg p-4 border border-m3-outline-variant/20 hover:shadow-m3-1 transition-shadow"
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <s.icon size={14} className="text-m3-on-surface-variant" />
                                        <span className="text-m3-label-small text-m3-on-surface-variant">{s.label}</span>
                                    </div>
                                    <p className="text-m3-title-small text-m3-on-surface truncate">{display}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* ai briefing card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: m3Ease }}
                    className={`rounded-m3-xl border-2 ${accentBorder}/30 overflow-hidden`}
                >
                    {/* briefing header */}
                    <div className={`${accentContainer}/60 px-5 py-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className={accentText} />
                            <span className={`text-m3-label-large ${accentText}`}>AI Briefing</span>
                            {briefCached && <span className="text-m3-label-small text-m3-on-surface-variant/50 ml-1">(cached)</span>}
                        </div>
                        {!briefLoading && (
                            <div className="flex items-center gap-1">
                                <motion.button
                                    onClick={handleResetAI}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-1.5 rounded-m3-full hover:bg-black/5 text-m3-on-surface-variant`}
                                    title="Reset AI (clear cache)"
                                >
                                    <RotateCcw size={13} />
                                </motion.button>
                                <motion.button
                                    onClick={() => fetchBrief(true)}
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.5 }}
                                    className={`p-1.5 rounded-m3-full hover:bg-black/5 ${accentText}`}
                                    title="Refresh briefing"
                                >
                                    <RefreshCw size={14} />
                                </motion.button>
                            </div>
                        )}
                    </div>

                    {/* briefing body */}
                    <div className="bg-m3-surface-container-lowest px-5 py-4">
                        {briefLoading ? (
                            // loading skeleton
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Loader2 size={16} className={`animate-spin ${accentText}`} />
                                    <span className="text-m3-body-medium text-m3-on-surface-variant">Analyzing your profile...</span>
                                </div>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-4 rounded-m3-full bg-m3-surface-container-high m3-shimmer" style={{ width: `${85 - i * 12}%` }} />
                                ))}
                            </div>
                        ) : parsed ? (
                            <div className="space-y-4">
                                {/* greeting */}
                                {parsed.greeting && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-m3-body-medium text-m3-on-surface leading-relaxed"
                                    >
                                        {parsed.greeting}
                                    </motion.p>
                                )}

                                {/* recommendations */}
                                {parsed.recs.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-m3-label-small text-m3-on-surface-variant uppercase tracking-wider">Recommendations</p>
                                        {parsed.recs.map((rec, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * i, ease: m3Ease }}
                                                className="flex gap-2.5 items-start"
                                            >
                                                <ArrowRight size={14} className={`${accentText} mt-0.5 shrink-0`} />
                                                <p className="text-m3-body-medium text-m3-on-surface leading-relaxed">{rec}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* action items */}
                                {parsed.actions.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-m3-label-small text-m3-on-surface-variant uppercase tracking-wider">This Week</p>
                                        {parsed.actions.map((act, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 + 0.1 * i, ease: m3Ease }}
                                                className="flex gap-2.5 items-start"
                                            >
                                                <CheckCircle2 size={14} className="text-m3-primary mt-0.5 shrink-0" />
                                                <p className="text-m3-body-medium text-m3-on-surface leading-relaxed">{act}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* closing motivational line */}
                                {parsed.closing && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className={`text-xs italic ${accentText} pt-1`}
                                    >
                                        {parsed.closing}
                                    </motion.p>
                                )}

                                {/* fallback: if parsing found nothing, show raw text */}
                                {!parsed.greeting && parsed.recs.length === 0 && parsed.actions.length === 0 && (
                                    <p className="text-sm text-m3-on-surface leading-relaxed whitespace-pre-wrap">{brief}</p>
                                )}
                            </div>
                        ) : null}
                    </div>
                </motion.div>

                {/* ad-hoc responses from the command bar */}
                <AnimatePresence>
                    {asking && (
                        <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="rounded-m3-lg bg-m3-surface-container-high p-4 flex items-center gap-3"
                        >
                            <Loader2 size={16} className={`animate-spin ${accentText}`} />
                            <span className="text-m3-body-medium text-m3-on-surface-variant">Thinking...</span>
                        </motion.div>
                    )}
                    {responses.map((r, i) => (
                        <motion.div
                            key={`resp-${i}`}
                            initial={{ opacity: 0, y: 16, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: m3Ease }}
                            className={`rounded-m3-xl border ${accentBorder}/20 overflow-hidden`}
                        >
                            {/* user question */}
                            <div className="px-4 py-2.5 bg-m3-surface-container-high">
                                <p className="text-m3-label-small text-m3-on-surface-variant">You asked</p>
                                <p className="text-m3-body-medium text-m3-on-surface">{r.q}</p>
                            </div>
                            {/* ai answer */}
                            <div className="px-4 py-3 bg-m3-surface-container-lowest">
                                <div className="flex gap-2.5 items-start">
                                    <div className={`w-6 h-6 rounded-m3-full ${accentContainer} flex items-center justify-center shrink-0 mt-0.5`}>
                                        <Bot size={12} className={accentText} />
                                    </div>
                                    <p className="text-m3-body-medium text-m3-on-surface leading-relaxed whitespace-pre-wrap">{r.a}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* command bar — flex child pinned to bottom */}
            <div className="shrink-0 px-4 md:px-6 pb-4 pt-3 bg-m3-surface border-t border-m3-outline-variant/20">
                <form onSubmit={handleAsk}>
                    <div className={`flex gap-2 items-center bg-m3-surface-container-high rounded-m3-full px-4 py-2.5 border border-m3-outline-variant/30 focus-within:border-m3-primary transition-colors shadow-m3-2`}>
                        <Bot size={18} className={`${accentText} opacity-60`} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder}
                            disabled={asking}
                            className="flex-1 bg-transparent text-m3-on-surface text-m3-body-medium outline-none placeholder:text-m3-on-surface-variant/60"
                        />
                        <motion.button
                            type="submit"
                            disabled={!query.trim() || asking}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 rounded-m3-full ${accentContainer} ${accentText} disabled:opacity-40 transition-opacity`}
                        >
                            {asking ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
}
