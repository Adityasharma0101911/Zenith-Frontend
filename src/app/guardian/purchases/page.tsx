// guardian purchases sub-section — ai-powered custom purchase decisions
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    ShoppingCart,
    ShieldCheck,
    ShieldAlert,
    Loader2,
    DollarSign,
    Package,
    MessageSquare,
    X,
    FileText,
    CheckCircle,
    ShieldX,
    Pencil,
    Plus,
    Briefcase,
    TrendingUp,
    Gift,
    Banknote,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import PageTransition from "@/components/PageTransition";

const m3Ease = [0.2, 0, 0, 1] as const;

interface Transaction {
    item_name: string;
    amount: number;
    status: string;
    timestamp: string;
}

export default function PurchasesPage() {
    const router = useRouter();

    // balance state
    const [balance, setBalance] = useState<number | null>(null);
    const [editingBalance, setEditingBalance] = useState(false);
    const [newBalance, setNewBalance] = useState("");

    // purchase form
    const [itemName, setItemName] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [evaluating, setEvaluating] = useState(false);
    const [verdict, setVerdict] = useState<{
        verdict: string;
        analysis: string;
        item_name: string;
        amount: number;
    } | null>(null);
    const [executing, setExecuting] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    // transaction history
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // blocked modal
    const [showBlocked, setShowBlocked] = useState(false);
    const [blockedReason, setBlockedReason] = useState("");

    // income form
    const [incomeSource, setIncomeSource] = useState("Paycheck");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [addingIncome, setAddingIncome] = useState(false);
    const [incomeResult, setIncomeResult] = useState("");

    // redirect if not logged in
    useEffect(() => {
        if (!localStorage.getItem("token")) router.push("/login");
    }, [router]);

    // fetch balance
    const fetchBalance = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/user_data`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.balance !== undefined) setBalance(data.balance);
        } catch { /* silent */ }
    }, []);

    // fetch transactions
    const fetchHistory = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTransactions(data.transactions || []);
        } catch { /* silent */ }
    }, []);

    useEffect(() => {
        fetchBalance();
        fetchHistory();
    }, [fetchBalance, fetchHistory]);

    // poll every 30s to save bandwidth
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            fetchHistory();
            fetchBalance();
        }, 30000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchHistory, fetchBalance]);

    // save edited balance
    async function saveBalance() {
        const val = parseFloat(newBalance);
        if (isNaN(val) || val < 0) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_URL}/api/balance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ balance: val }),
            });
            setBalance(val);
            setEditingBalance(false);
        } catch { /* silent */ }
    }

    // ai evaluation
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
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    item_name: itemName.trim(),
                    amount: parseFloat(amount),
                    reason: reason.trim(),
                }),
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

    // execute purchase
    async function handleExecute() {
        if (!verdict) return;
        setExecuting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/purchase/execute`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    item_name: verdict.item_name,
                    amount: verdict.amount,
                }),
            });
            const data = await res.json();
            if (data.status === "BLOCKED") {
                setBlockedReason(data.reason);
                setShowBlocked(true);
            } else if (data.status === "ALLOWED") {
                setResult(`Purchase complete! New balance: $${data.new_balance.toFixed(2)}`);
                setBalance(data.new_balance);
                fetchHistory();
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

    // add income
    async function handleAddIncome(e: React.FormEvent) {
        e.preventDefault();
        const val = parseFloat(incomeAmount);
        if (isNaN(val) || val <= 0) return;
        setAddingIncome(true);
        setIncomeResult("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/income`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ source: incomeSource, amount: val }),
            });
            const data = await res.json();
            if (data.balance !== undefined) {
                setBalance(data.balance);
                setIncomeResult(`+$${val.toFixed(2)} added from ${incomeSource}`);
                setIncomeAmount("");
                fetchHistory();
            }
        } catch {
            setIncomeResult("Failed to add income.");
        } finally {
            setAddingIncome(false);
        }
    }

    function formatTime(ts: string) {
        return new Date(ts).toLocaleString();
    }

    return (
        <PageTransition>
            <main className="min-h-screen px-4 pt-16 pb-10 md:pl-[232px] md:pr-8 md:pt-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-5 mt-4">
                    {/* header */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: m3Ease }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-12 h-12 rounded-m3-lg bg-m3-primary-container flex items-center justify-center">
                            <ShoppingCart size={24} className="text-m3-on-primary-container" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-m3-on-surface">Purchases</h1>
                            <p className="text-sm text-m3-on-surface-variant">AI-powered smart spending</p>
                        </div>
                    </motion.div>

                    {/* balance card */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1, ease: m3Ease }}
                        className="bg-m3-primary-container rounded-m3-xl p-5 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-xs text-m3-on-primary-container/70 font-medium">Current Balance</p>
                            {editingBalance ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl font-bold text-m3-on-primary-container">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newBalance}
                                        onChange={(e) => setNewBalance(e.target.value)}
                                        autoFocus
                                        className="w-32 bg-m3-surface/30 rounded-m3-lg px-3 py-1.5 text-xl font-bold text-m3-on-primary-container outline-none"
                                        onKeyDown={(e) => e.key === "Enter" && saveBalance()}
                                    />
                                    <button onClick={saveBalance} className="text-xs bg-m3-primary text-m3-on-primary px-3 py-1.5 rounded-m3-full font-medium">Save</button>
                                    <button onClick={() => setEditingBalance(false)} className="text-xs text-m3-on-primary-container/70">Cancel</button>
                                </div>
                            ) : (
                                <p className="text-2xl font-bold text-m3-on-primary-container">
                                    ${balance !== null ? balance.toFixed(2) : "—"}
                                </p>
                            )}
                        </div>
                        {!editingBalance && (
                            <motion.button
                                onClick={() => { setNewBalance(String(balance || 0)); setEditingBalance(true); }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-m3-full hover:bg-black/10 text-m3-on-primary-container/70"
                                title="Edit balance"
                            >
                                <Pencil size={18} />
                            </motion.button>
                        )}
                    </motion.div>

                    {/* add income section */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15, ease: m3Ease }}
                        className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-5"
                    >
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="p-1.5 rounded-m3-full bg-m3-secondary-container">
                                <Plus className="text-m3-on-secondary-container" size={16} />
                            </div>
                            <h2 className="text-base font-semibold text-m3-on-surface">Add Income</h2>
                        </div>
                        <form onSubmit={handleAddIncome} className="flex gap-2 items-end flex-wrap">
                            <div className="flex-shrink-0">
                                <label className="text-[10px] text-m3-on-surface-variant font-medium mb-1 block">Source</label>
                                <div className="flex gap-1.5">
                                    {[
                                        { id: "Paycheck", icon: Briefcase },
                                        { id: "Stocks", icon: TrendingUp },
                                        { id: "Freelance", icon: Banknote },
                                        { id: "Gift", icon: Gift },
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setIncomeSource(s.id)}
                                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-m3-full text-xs font-medium transition-colors ${
                                                incomeSource === s.id
                                                    ? "bg-m3-secondary-container text-m3-on-secondary-container"
                                                    : "bg-m3-surface-container text-m3-on-surface-variant hover:bg-m3-surface-container-high"
                                            }`}
                                        >
                                            <s.icon size={12} />
                                            {s.id}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 min-w-[100px] relative">
                                <label className="text-[10px] text-m3-on-surface-variant font-medium mb-1 block">Amount</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/50" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={incomeAmount}
                                        onChange={(e) => setIncomeAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-9 pr-3 py-2 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors"
                                    />
                                </div>
                            </div>
                            <motion.button
                                type="submit"
                                disabled={addingIncome || !incomeAmount.trim()}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                                className="m3-btn-tonal flex items-center gap-1.5 !py-2 disabled:opacity-60"
                            >
                                {addingIncome ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                Add
                            </motion.button>
                        </form>
                        {incomeResult && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`mt-2 text-xs font-medium ${incomeResult.startsWith("+") ? "text-m3-primary" : "text-m3-error"}`}
                            >
                                {incomeResult}
                            </motion.p>
                        )}
                    </motion.div>

                    {/* smart purchase form */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: m3Ease }}
                        className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6"
                    >
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-1.5 rounded-m3-full bg-m3-primary-container">
                                <Wallet className="text-m3-on-primary-container" size={16} />
                            </div>
                            <h2 className="text-base font-semibold text-m3-on-surface">Smart Purchase</h2>
                        </div>

                        {!verdict ? (
                            <form onSubmit={handleEvaluate} className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/50" />
                                        <input
                                            type="text"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            placeholder="What do you want to buy?"
                                            className="w-full pl-9 pr-3 py-2.5 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors"
                                        />
                                    </div>
                                    <div className="w-28 relative">
                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/50" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Price"
                                            className="w-full pl-9 pr-3 py-2.5 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <MessageSquare size={14} className="absolute left-3 top-3 text-m3-on-surface-variant/50" />
                                    <input
                                        type="text"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Why do you need this? (helps AI decide)"
                                        className="w-full pl-9 pr-3 py-2.5 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors"
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={evaluating || !itemName.trim() || !amount.trim()}
                                    whileHover={{ scale: evaluating ? 1 : 1.03 }}
                                    whileTap={{ scale: evaluating ? 1 : 0.95 }}
                                    className="m3-btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {evaluating ? (
                                        <><Loader2 size={16} className="animate-spin" />AI is evaluating...</>
                                    ) : (
                                        <><ShoppingCart size={16} />Ask AI Before Buying</>
                                    )}
                                </motion.button>
                            </form>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                <div className={`rounded-m3-lg p-4 ${verdict.verdict === "approve" ? "bg-m3-primary-container/40" : "bg-m3-error-container/40"}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {verdict.verdict === "approve" ? (
                                            <ShieldCheck size={18} className="text-m3-primary" />
                                        ) : (
                                            <ShieldAlert size={18} className="text-m3-error" />
                                        )}
                                        <span className={`text-sm font-semibold ${verdict.verdict === "approve" ? "text-m3-primary" : "text-m3-error"}`}>
                                            {verdict.verdict === "approve" ? "AI Approved" : "AI Suggests Holding"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-m3-on-surface leading-relaxed">{verdict.analysis}</p>
                                </div>
                                <div className="flex gap-2">
                                    {verdict.verdict === "approve" && (
                                        <motion.button
                                            onClick={handleExecute}
                                            disabled={executing}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1 m3-btn-filled flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {executing ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                                            {executing ? "Processing..." : `Confirm Purchase $${verdict.amount.toFixed(2)}`}
                                        </motion.button>
                                    )}
                                    <motion.button
                                        onClick={handleCancel}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`${verdict.verdict === "approve" ? "" : "flex-1"} m3-btn-tonal flex items-center justify-center gap-2`}
                                    >
                                        <X size={16} />
                                        {verdict.verdict === "approve" ? "Cancel" : "Go Back"}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {result && (
                                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-3 text-center text-sm font-medium text-m3-primary">
                                    {result}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {error && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-center text-sm font-medium text-m3-error">
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* transaction ledger */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3, ease: m3Ease }}
                        className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6"
                    >
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-1.5 rounded-m3-full bg-m3-primary-container">
                                <FileText className="text-m3-on-primary-container" size={16} />
                            </div>
                            <h2 className="text-base font-semibold text-m3-on-surface">Transaction Ledger</h2>
                            <span className="text-[10px] text-m3-on-surface-variant/50 ml-auto">Live</span>
                            <span className="w-2 h-2 rounded-full bg-m3-primary animate-pulse" />
                        </div>

                        {transactions.length === 0 ? (
                            <p className="text-m3-on-surface-variant text-sm text-center py-4">No transactions yet.</p>
                        ) : (
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {transactions.map((tx, i) => (
                                    <motion.div
                                        key={`${tx.timestamp}-${i}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2, delay: i * 0.03 }}
                                        className={`flex items-center justify-between p-3.5 rounded-m3-lg ${tx.status === "BLOCKED" ? "bg-m3-error-container/40" : tx.status === "INCOME" ? "bg-m3-secondary-container/40" : "bg-m3-surface-container"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {tx.status === "BLOCKED" ? (
                                                <ShieldX className="text-m3-error" size={20} />
                                            ) : tx.status === "INCOME" ? (
                                                <Plus className="text-m3-secondary" size={20} />
                                            ) : (
                                                <CheckCircle className="text-m3-primary" size={20} />
                                            )}
                                            <div>
                                                <p className={`font-medium text-sm ${tx.status === "BLOCKED" ? "text-m3-on-error-container" : "text-m3-on-surface"}`}>{tx.item_name}</p>
                                                <p className="text-xs text-m3-on-surface-variant">{formatTime(tx.timestamp)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-sm text-m3-on-surface">{tx.status === "INCOME" ? "+" : "-"}${tx.amount.toFixed(2)}</p>
                                            <p className={`text-xs font-medium ${tx.status === "BLOCKED" ? "text-m3-error" : tx.status === "INCOME" ? "text-m3-secondary" : "text-m3-primary"}`}>{tx.status}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* blocked modal */}
            <AnimatePresence>
                {showBlocked && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
                        <motion.div className="absolute inset-0 bg-m3-error/20 backdrop-blur-md" onClick={() => setShowBlocked(false)} />
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 22, stiffness: 300 }}
                            className="relative bg-m3-error-container rounded-m3-xl p-8 max-w-sm mx-4 text-center shadow-m3-5"
                        >
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-m3-full bg-m3-error/15">
                                    <ShieldAlert className="text-m3-on-error-container" size={40} />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold text-m3-on-error-container">Transaction Blocked</h2>
                            <p className="text-m3-on-error-container/80 mt-3 text-sm">{blockedReason}</p>
                            <motion.button
                                onClick={() => setShowBlocked(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.93 }}
                                className="mt-6 px-8 py-3 rounded-m3-full bg-m3-error text-m3-on-error font-medium text-sm flex items-center gap-2 mx-auto"
                            >
                                <X size={16} />
                                Dismiss
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
