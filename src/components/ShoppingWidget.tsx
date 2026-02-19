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
            setVerdict(data);
        } catch {
            setError("Could not reach AI for evaluation.");
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
            <motion.div
                whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full transition-shadow hover:shadow-m3-2"
            >
                <div className="flex items-center gap-2.5 mb-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} className="p-1.5 rounded-m3-full bg-m3-primary-container">
                        <ShoppingCart className="text-m3-on-primary-container" size={16} />
                    </motion.div>
                    <h2 className="text-base font-semibold text-m3-on-surface">Smart Purchase</h2>
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
                        <motion.button type="submit" disabled={evaluating || !itemName.trim() || !amount.trim()} whileHover={{ scale: evaluating ? 1 : 1.03 }} whileTap={{ scale: evaluating ? 1 : 0.95 }} className="m3-btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-70">
                            {evaluating ? (<><Loader2 size={16} className="animate-spin" />AI Evaluating...</>) : (<><ShoppingCart size={16} />Evaluate Purchase</>)}
                        </motion.button>
                    </form>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className={`rounded-m3-lg p-4 ${verdict.verdict === "approve" ? "bg-m3-primary-container/40" : "bg-m3-error-container/40"}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {verdict.verdict === "approve" ? <ShieldCheck size={18} className="text-m3-primary" /> : <ShieldAlert size={18} className="text-m3-error" />}
                                <span className={`text-sm font-semibold ${verdict.verdict === "approve" ? "text-m3-primary" : "text-m3-error"}`}>
                                    {verdict.verdict === "approve" ? "AI Approved" : "AI Suggests Holding"}
                                </span>
                            </div>
                            <p className="text-xs text-m3-on-surface leading-relaxed">{verdict.analysis}</p>
                        </div>
                        <div className="flex gap-2">
                            {verdict.verdict === "approve" && (
                                <motion.button onClick={handleExecute} disabled={executing} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} className="flex-1 m3-btn-filled flex items-center justify-center gap-2 disabled:opacity-70">
                                    {executing ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                                    {executing ? "Processing..." : `Buy $${verdict.amount.toFixed(2)}`}
                                </motion.button>
                            )}
                            <motion.button onClick={handleCancel} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} className={`${verdict.verdict === "approve" ? "" : "flex-1"} m3-btn-tonal flex items-center justify-center gap-2`}>
                                <X size={16} />{verdict.verdict === "approve" ? "Cancel" : "Go Back"}
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {result && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-3 text-center text-sm font-medium text-m3-primary">{result}</motion.p>}
                </AnimatePresence>
                <AnimatePresence>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-center text-sm font-medium text-m3-error">{error}</motion.p>}
                </AnimatePresence>
            </motion.div>

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
                            <h2 className="text-xl font-semibold text-m3-on-error-container">Transaction Blocked</h2>
                            <p className="text-m3-on-error-container/80 mt-3 text-sm">{blockedReason}</p>
                            <motion.button onClick={() => setShowBlocked(false)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }} className="mt-6 px-8 py-3 rounded-m3-full bg-m3-error text-m3-on-error font-medium text-sm flex items-center gap-2 mx-auto">
                                <X size={16} />Dismiss
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
