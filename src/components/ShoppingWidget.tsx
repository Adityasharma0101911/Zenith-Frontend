// custom purchase widget with ai evaluation — replaces hardcoded headphones
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    ShieldAlert,
    ShieldCheck,
    X,
    Loader2,
    DollarSign,
    Package,
    MessageSquare,
} from "lucide-react";
import InteractiveCard from "./InteractiveCard";
import MotionButton from "./MotionButton";
import { API_URL } from "@/utils/api";

export default function ShoppingWidget({ refreshData }: { refreshData: () => void }) {
    const [itemName, setItemName] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [evaluating, setEvaluating] = useState(false);
    const [verdict, setVerdict] = useState<{ verdict: string; analysis: string; item_name: string; amount: number } | null>(null);
    const [executing, setExecuting] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");
    const [showBlocked, setShowBlocked] = useState(false);
    const [blockedReason, setBlockedReason] = useState("");

    async function handleEvaluate(e: React.FormEvent) {
        e.preventDefault();
        if (!itemName.trim() || !amount.trim()) return;
        setEvaluating(true);
        setVerdict(null);
        setResult("");
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/purchase/evaluate`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ item_name: itemName.trim(), amount: parseFloat(amount), reason: reason.trim() }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setVerdict(data);
            }
        } catch {
            setError("Could not reach AI for evaluation. Check your connection.");
        } finally {
            setEvaluating(false);
        }
    }

    async function handleExecute() {
        if (!verdict) return;
        setExecuting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/purchase/execute`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ item_name: verdict.item_name, amount: verdict.amount }),
            });
            const data = await res.json();
            if (data.status === "BLOCKED") {
                setBlockedReason(data.reason);
                setShowBlocked(true);
            } else if (data.status === "ALLOWED") {
                setResult(`Purchase complete! New balance: $${data.new_balance.toFixed(2)}`);
                refreshData();
                setItemName("");
                setAmount("");
                setReason("");
                setVerdict(null);
            }
        } catch {
            setError("Could not process purchase.");
        } finally {
            setExecuting(false);
        }
    }

    function handleCancel() {
        setVerdict(null);
        setResult("");
        setError("");
    }

    return (
        <>
            <InteractiveCard
                className="p-6 w-full relative overflow-hidden"
                glowColor="rgba(var(--m3-primary), 0.15)"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        {/* Static track */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="20" cy="20" r="18" fill="none" className="stroke-m3-surface-container-high" strokeWidth="3" />
                        </svg>

                        {/* Animated Gamified Progress Ring (Idea #13) */}
                        <motion.svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_4px_rgba(var(--m3-primary),0.5)]">
                            <motion.circle
                                cx="20" cy="20" r="18" fill="none"
                                className="stroke-m3-primary" strokeWidth="3" strokeLinecap="round"
                                initial={{ strokeDasharray: "0 113" }}
                                animate={{ strokeDasharray: "113 113" }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            />
                        </motion.svg>

                        {/* Inner Icon */}
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.8 }} className="relative z-10 w-7 h-7 flex items-center justify-center rounded-full bg-m3-surface">
                            <ShoppingCart className="text-m3-primary" size={14} />
                        </motion.div>
                    </div>
                    <div>
                        <h2 className="text-m3-title-medium text-m3-on-surface leading-tight">Smart Purchase</h2>
                        <p className="text-[10px] text-m3-on-surface-variant font-medium uppercase tracking-wider">AI Guardrail</p>
                    </div>
                </div>

                {!verdict ? (
                    <form onSubmit={handleEvaluate} className="space-y-3">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/50" />
                                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item name" className="w-full pl-9 pr-3 py-2.5 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors" />
                            </div>
                            <div className="w-28 relative">
                                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/50" />
                                <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Price" className="w-full pl-9 pr-3 py-2.5 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors" />
                            </div>
                        </div>
                        <div className="relative">
                            <MessageSquare size={14} className="absolute left-3 top-3 text-m3-on-surface-variant/50" />
                            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why do you need this? (optional)" className="w-full pl-9 pr-3 py-2.5 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors" />
                        </div>
                        <MotionButton type="submit" disabled={evaluating || !itemName.trim() || !amount.trim()} className="w-full mt-4">
                            {evaluating ? (<><Loader2 size={16} className="animate-spin" />AI Evaluating...</>) : (<><ShoppingCart size={16} />Evaluate Purchase</>)}
                        </MotionButton>
                    </form>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className={`rounded-m3-lg p-4 ${verdict.verdict === "approve" ? "bg-m3-primary-container/40" : "bg-m3-error-container/40"}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {verdict.verdict === "approve" ? <ShieldCheck size={18} className="text-m3-primary" /> : <ShieldAlert size={18} className="text-m3-error" />}
                                <span className={`text-m3-label-large ${verdict.verdict === "approve" ? "text-m3-primary" : "text-m3-error"}`}>
                                    {verdict.verdict === "approve" ? "AI Approved" : "AI Suggests Holding"}
                                </span>
                            </div>
                            <p className="text-m3-body-small text-m3-on-surface leading-relaxed">{verdict.analysis}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                            {verdict.verdict === "approve" && (
                                <MotionButton onClick={handleExecute} disabled={executing} className="flex-1 text-sm bg-m3-primary text-m3-on-primary">
                                    {executing ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                                    {executing ? "Processing..." : `Buy $${verdict.amount.toFixed(2)}`}
                                </MotionButton>
                            )}
                            <MotionButton onClick={handleCancel} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-m3-full text-sm font-medium transition-colors ${verdict.verdict === "approve" ? "bg-m3-surface-container-high text-m3-on-surface" : "flex-1 bg-m3-surface-container-high text-m3-on-surface"}`}>
                                <X size={16} />{verdict.verdict === "approve" ? "Cancel" : "Go Back"}
                            </MotionButton>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {result && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-3 text-center text-sm font-medium text-m3-primary">{result}</motion.p>}
                </AnimatePresence>
                <AnimatePresence>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-center text-sm font-medium text-m3-error">{error}</motion.p>}
                </AnimatePresence>
            </InteractiveCard>

            <AnimatePresence>
                {showBlocked && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
                        <motion.div className="absolute inset-0 bg-m3-error/20 backdrop-blur-md" onClick={() => setShowBlocked(false)} />
                        <motion.div initial={{ scale: 0.7, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 22, stiffness: 300 }} className="relative bg-m3-error-container rounded-m3-xl p-8 max-w-sm mx-4 text-center shadow-m3-5">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-m3-full bg-m3-error/15">
                                    <ShieldAlert className="text-m3-on-error-container" size={40} />
                                </div>
                            </div>
                            <h2 className="text-m3-title-large text-m3-on-error-container">Transaction Blocked</h2>
                            <p className="text-m3-body-medium text-m3-on-error-container/80 mt-3">{blockedReason}</p>
                            <MotionButton onClick={() => setShowBlocked(false)} className="mt-6 mx-auto bg-m3-error text-m3-on-error">
                                <X size={16} />Dismiss
                            </MotionButton>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
