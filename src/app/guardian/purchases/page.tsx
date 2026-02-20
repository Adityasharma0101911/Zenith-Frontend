// guardian purchases — gsap powered ai smart spending
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
    Wallet, ShoppingCart, ShieldCheck, ShieldAlert, Loader2, DollarSign,
    Package, MessageSquare, X, FileText, CheckCircle, ShieldX, Pencil,
    Plus, Briefcase, TrendingUp, Gift, Banknote,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import PageTransition from "@/components/PageTransition";

interface Transaction { item_name: string; amount: number; status: string; timestamp: string; }

export default function PurchasesPage() {
    const router = useRouter();
    const [balance, setBalance] = useState<number | null>(null);
    const [editingBalance, setEditingBalance] = useState(false);
    const [newBalance, setNewBalance] = useState("");
    const [itemName, setItemName] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [evaluating, setEvaluating] = useState(false);
    const [verdict, setVerdict] = useState<{ verdict: string; analysis: string; item_name: string; amount: number } | null>(null);
    const [executing, setExecuting] = useState(false);
    const [result, setResult] = useState("");
    const [error, setError] = useState("");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showBlocked, setShowBlocked] = useState(false);
    const [blockedReason, setBlockedReason] = useState("");
    const [incomeSource, setIncomeSource] = useState("Paycheck");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [addingIncome, setAddingIncome] = useState(false);
    const [incomeResult, setIncomeResult] = useState("");

    const headerRef = useRef<HTMLDivElement>(null);
    const balanceCardRef = useRef<HTMLDivElement>(null);
    const incomeRef = useRef<HTMLDivElement>(null);
    const purchaseRef = useRef<HTMLDivElement>(null);
    const ledgerRef = useRef<HTMLDivElement>(null);
    const editBtnRef = useRef<HTMLButtonElement>(null);
    const blockedModalRef = useRef<HTMLDivElement>(null);
    const blockedBackdropRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLParagraphElement>(null);
    const errorRef = useRef<HTMLParagraphElement>(null);
    const verdictRef = useRef<HTMLDivElement>(null);

    useEffect(() => { if (!localStorage.getItem("token")) router.push("/login"); }, [router]);

    const fetchBalance = useCallback(async () => {
        try { const token = localStorage.getItem("token"); const res = await fetch(`${API_URL}/api/user_data`, { headers: { Authorization: `Bearer ${token}` } }); if (!res.ok) throw new Error(); const data = await res.json(); if (data.balance !== undefined) setBalance(data.balance); } catch {}
    }, []);

    const fetchHistory = useCallback(async () => {
        try { const token = localStorage.getItem("token"); const res = await fetch(`${API_URL}/api/history`, { headers: { Authorization: `Bearer ${token}` } }); if (!res.ok) throw new Error(); const data = await res.json(); setTransactions(data.transactions || []); } catch {}
    }, []);

    useEffect(() => { fetchBalance(); fetchHistory(); }, [fetchBalance, fetchHistory]);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        intervalRef.current = setInterval(() => { fetchHistory(); fetchBalance(); }, 30000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [fetchHistory, fetchBalance]);

    // entrance stagger
    useEffect(() => {
        const sections = [headerRef, balanceCardRef, incomeRef, purchaseRef, ledgerRef];
        sections.forEach((ref, i) => {
            if (ref.current) gsap.from(ref.current, { opacity: 0, y: 12, duration: 0.4, delay: 0.05 * i + 0.1, ease: "power3.out" });
        });
    }, []);

    // transaction list stagger
    useEffect(() => {
        if (!ledgerRef.current || transactions.length === 0) return;
        gsap.from(ledgerRef.current.querySelectorAll(".tx-row"), { opacity: 0, x: -10, duration: 0.2, stagger: 0.03, ease: "power3.out" });
    }, [transactions]);

    // edit button hover
    useEffect(() => {
        const el = editBtnRef.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.1, duration: 0.15, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, duration: 0.15, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.9, duration: 0.1 });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); el.addEventListener("mousedown", down);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); };
    }, [editingBalance]);

    // verdict entrance
    useEffect(() => {
        if (verdict && verdictRef.current) gsap.from(verdictRef.current, { opacity: 0, y: 10, duration: 0.4, ease: "power3.out" });
    }, [verdict]);

    // result/error entrance
    useEffect(() => { if (result && resultRef.current) gsap.from(resultRef.current, { opacity: 0, y: 8, duration: 0.3, ease: "power3.out" }); }, [result]);
    useEffect(() => { if (error && errorRef.current) gsap.from(errorRef.current, { opacity: 0, duration: 0.3, ease: "power3.out" }); }, [error]);

    // blocked modal
    useEffect(() => {
        if (showBlocked) {
            if (blockedBackdropRef.current) gsap.from(blockedBackdropRef.current, { opacity: 0, duration: 0.3, ease: "power3.out" });
            if (blockedModalRef.current) gsap.from(blockedModalRef.current, { scale: 0.7, opacity: 0, y: 40, duration: 0.5, ease: "back.out(1.5)" });
        }
    }, [showBlocked]);

    function closeBlocked() {
        const tl = gsap.timeline({ onComplete: () => setShowBlocked(false) });
        if (blockedModalRef.current) tl.to(blockedModalRef.current, { scale: 0.8, opacity: 0, y: 20, duration: 0.25, ease: "power2.in" }, 0);
        if (blockedBackdropRef.current) tl.to(blockedBackdropRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.05);
    }

    async function saveBalance() {
        const val = parseFloat(newBalance); if (isNaN(val) || val < 0) return;
        try { const token = localStorage.getItem("token"); const res = await fetch(`${API_URL}/api/balance`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ balance: val }) }); if (!res.ok) throw new Error(); setBalance(val); setEditingBalance(false); } catch {}
    }

    async function handleEvaluate(e: React.FormEvent) {
        e.preventDefault(); if (!itemName.trim() || !amount.trim()) return;
        setEvaluating(true); setVerdict(null); setResult(""); setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/purchase/evaluate`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ item_name: itemName.trim(), amount: parseFloat(amount), reason: reason.trim() }) });
            if (!res.ok) throw new Error("Request failed");
            const data = await res.json(); if (data.error) setError(data.error); else setVerdict(data);
        } catch { setError("Could not reach AI for evaluation."); } finally { setEvaluating(false); }
    }

    async function handleExecute() {
        if (!verdict) return; setExecuting(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/purchase/execute`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ item_name: verdict.item_name, amount: verdict.amount }) });
            if (!res.ok) throw new Error("Request failed");
            const data = await res.json();
            if (data.status === "BLOCKED") { setBlockedReason(data.reason); setShowBlocked(true); }
            else if (data.status === "ALLOWED") { setResult(`Purchase complete! New balance: $${(data.new_balance ?? 0).toFixed(2)}`); setBalance(data.new_balance); fetchHistory(); setItemName(""); setAmount(""); setReason(""); setVerdict(null); }
        } catch { setError("Could not process purchase."); } finally { setExecuting(false); }
    }

    function handleCancel() { setVerdict(null); setResult(""); setError(""); }

    async function handleAddIncome(e: React.FormEvent) {
        e.preventDefault(); const val = parseFloat(incomeAmount); if (isNaN(val) || val <= 0) return;
        setAddingIncome(true); setIncomeResult("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/income`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ source: incomeSource, amount: val }) });
            if (!res.ok) throw new Error("Request failed");
            const data = await res.json(); if (data.balance !== undefined) { setBalance(data.balance); setIncomeResult(`+$${val.toFixed(2)} added from ${incomeSource}`); setIncomeAmount(""); fetchHistory(); }
        } catch { setIncomeResult("Failed to add income."); } finally { setAddingIncome(false); }
    }

    function formatTime(ts: string) { return new Date(ts).toLocaleString(); }

    return (
        <PageTransition>
            <main className="min-h-screen px-4 pt-16 pb-10 md:pl-[232px] md:pr-8 md:pt-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-5 mt-4">
                    <div ref={headerRef} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-m3-lg bg-m3-primary-container flex items-center justify-center"><ShoppingCart size={24} className="text-m3-on-primary-container" /></div>
                        <div><h1 className="text-m3-headline-small text-m3-on-surface">Purchases</h1><p className="text-m3-body-medium text-m3-on-surface-variant">AI-powered smart spending</p></div>
                    </div>

                    <div ref={balanceCardRef} className="bg-m3-primary-container rounded-m3-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-m3-label-small text-m3-on-primary-container/70">Current Balance</p>
                            {editingBalance ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl font-bold text-m3-on-primary-container">$</span>
                                    <input type="number" step="0.01" value={newBalance} onChange={e=>setNewBalance(e.target.value)} autoFocus className="w-32 bg-m3-surface/30 rounded-m3-lg px-3 py-1.5 text-xl font-bold text-m3-on-primary-container outline-none" onKeyDown={e=>e.key==="Enter" && saveBalance()} />
                                    <button onClick={saveBalance} className="text-xs bg-m3-primary text-m3-on-primary px-3 py-1.5 rounded-m3-full font-medium">Save</button>
                                    <button onClick={()=>setEditingBalance(false)} className="text-xs text-m3-on-primary-container/70">Cancel</button>
                                </div>
                            ) : <p className="text-m3-headline-small text-m3-on-primary-container">${balance !== null ? balance.toFixed(2) : "\u2014"}</p>}
                        </div>
                        {!editingBalance && (
                            <button ref={editBtnRef} onClick={()=>{ setNewBalance(String(balance||0)); setEditingBalance(true); }} className="p-2 rounded-m3-full hover:bg-black/10 text-m3-on-primary-container/70" title="Edit balance"><Pencil size={18} /></button>
                        )}
                    </div>

                    <div ref={incomeRef} className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-5">
                        <div className="flex items-center gap-2.5 mb-3"><div className="p-1.5 rounded-m3-full bg-m3-secondary-container"><Plus className="text-m3-on-secondary-container" size={16} /></div><h2 className="text-m3-title-medium text-m3-on-surface">Add Income</h2></div>
                        <form onSubmit={handleAddIncome} className="flex gap-2 items-end flex-wrap">
                            <div className="flex-shrink-0">
                                <label className="text-m3-label-small text-m3-on-surface-variant mb-1 block">Source</label>
                                <div className="flex gap-1.5">{[{id:"Paycheck",icon:Briefcase},{id:"Stocks",icon:TrendingUp},{id:"Freelance",icon:Banknote},{id:"Gift",icon:Gift}].map(s=>(
                                    <button key={s.id} type="button" onClick={()=>setIncomeSource(s.id)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-m3-full text-xs font-medium transition-colors ${incomeSource===s.id?"bg-m3-secondary-container text-m3-on-secondary-container":"bg-m3-surface-container text-m3-on-surface-variant hover:bg-m3-surface-container-high"}`}><s.icon size={12} />{s.id}</button>
                                ))}</div>
                            </div>
                            <div className="flex-1 min-w-[100px] relative">
                                <label className="text-m3-label-small text-m3-on-surface-variant mb-1 block">Amount</label>
                                <div className="relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/50" /><input type="number" step="0.01" min="0" value={incomeAmount} onChange={e=>setIncomeAmount(e.target.value)} placeholder="0.00" className="w-full pl-9 pr-3 py-2 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors" /></div>
                            </div>
                            <button type="submit" disabled={addingIncome||!incomeAmount.trim()} className="m3-btn-tonal flex items-center gap-1.5 !py-2 disabled:opacity-60">{addingIncome?<Loader2 size={14} className="animate-spin" />:<Plus size={14} />} Add</button>
                        </form>
                        {incomeResult && <p className={`mt-2 text-xs font-medium ${incomeResult.startsWith("+")?'text-m3-primary':'text-m3-error'}`}>{incomeResult}</p>}
                    </div>

                    <div ref={purchaseRef} className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6">
                        <div className="flex items-center gap-2.5 mb-4"><div className="p-1.5 rounded-m3-full bg-m3-primary-container"><Wallet className="text-m3-on-primary-container" size={16} /></div><h2 className="text-m3-title-medium text-m3-on-surface">Smart Purchase</h2></div>
                        {!verdict ? (
                            <form onSubmit={handleEvaluate} className="space-y-3">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative"><Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/50" /><input type="text" value={itemName} onChange={e=>setItemName(e.target.value)} placeholder="What do you want to buy?" className="w-full pl-9 pr-3 py-2.5 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors" /></div>
                                    <div className="w-28 relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant/50" /><input type="number" step="0.01" min="0" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Price" className="w-full pl-9 pr-3 py-2.5 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors" /></div>
                                </div>
                                <div className="relative"><MessageSquare size={14} className="absolute left-3 top-3 text-m3-on-surface-variant/50" /><input type="text" value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why do you need this? (helps AI decide)" className="w-full pl-9 pr-3 py-2.5 rounded-m3-lg bg-m3-surface-container text-m3-on-surface text-sm outline-none border border-m3-outline-variant/30 focus:border-m3-primary transition-colors" /></div>
                                <button type="submit" disabled={evaluating||!itemName.trim()||!amount.trim()} className="m3-btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-70">
                                    {evaluating?<><Loader2 size={16} className="animate-spin" />AI is evaluating...</>:<><ShoppingCart size={16} />Ask AI Before Buying</>}
                                </button>
                            </form>
                        ) : (
                            <div ref={verdictRef} className="space-y-3">
                                <div className={`rounded-m3-lg p-4 ${verdict.verdict==="approve"?"bg-m3-primary-container/40":"bg-m3-error-container/40"}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {verdict.verdict==="approve"?<ShieldCheck size={18} className="text-m3-primary" />:<ShieldAlert size={18} className="text-m3-error" />}
                                        <span className={`text-sm font-semibold ${verdict.verdict==="approve"?"text-m3-primary":"text-m3-error"}`}>{verdict.verdict==="approve"?"AI Approved":"AI Suggests Holding"}</span>
                                    </div>
                                    <p className="text-sm text-m3-on-surface leading-relaxed">{verdict.analysis}</p>
                                </div>
                                <div className="flex gap-2">
                                    {verdict.verdict==="approve" && (
                                        <button onClick={handleExecute} disabled={executing} className="flex-1 m3-btn-filled flex items-center justify-center gap-2 disabled:opacity-70">
                                            {executing?<Loader2 size={16} className="animate-spin" />:<ShoppingCart size={16} />} {executing?"Processing...":`Confirm Purchase $${verdict.amount.toFixed(2)}`}
                                        </button>
                                    )}
                                    <button onClick={handleCancel} className={`${verdict.verdict==="approve"?"":"flex-1"} m3-btn-tonal flex items-center justify-center gap-2`}><X size={16} /> {verdict.verdict==="approve"?"Cancel":"Go Back"}</button>
                                </div>
                            </div>
                        )}
                        {result && <p ref={resultRef} className="mt-3 text-center text-sm font-medium text-m3-primary">{result}</p>}
                        {error && <p ref={errorRef} className="mt-3 text-center text-sm font-medium text-m3-error">{error}</p>}
                    </div>

                    <div ref={ledgerRef} className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6">
                        <div className="flex items-center gap-2.5 mb-4"><div className="p-1.5 rounded-m3-full bg-m3-primary-container"><FileText className="text-m3-on-primary-container" size={16} /></div><h2 className="text-m3-title-medium text-m3-on-surface">Transaction Ledger</h2><span className="text-m3-label-small text-m3-on-surface-variant/50 ml-auto">Live</span><span className="w-2 h-2 rounded-full bg-m3-primary animate-pulse" /></div>
                        {transactions.length === 0 ? (
                            <p className="text-m3-on-surface-variant text-sm text-center py-4">No transactions yet.</p>
                        ) : (
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {transactions.map((tx, i) => (
                                    <div key={`${tx.timestamp}-${i}`} className={`tx-row flex items-center justify-between p-3.5 rounded-m3-lg ${tx.status==="BLOCKED"?"bg-m3-error-container/40":tx.status==="INCOME"?"bg-m3-secondary-container/40":"bg-m3-surface-container"}`}>
                                        <div className="flex items-center gap-3">
                                            {tx.status==="BLOCKED"?<ShieldX className="text-m3-error" size={20} />:tx.status==="INCOME"?<Plus className="text-m3-secondary" size={20} />:<CheckCircle className="text-m3-primary" size={20} />}
                                            <div><p className={`font-medium text-sm ${tx.status==="BLOCKED"?"text-m3-on-error-container":"text-m3-on-surface"}`}>{tx.item_name}</p><p className="text-xs text-m3-on-surface-variant">{formatTime(tx.timestamp)}</p></div>
                                        </div>
                                        <div className="text-right"><p className="font-semibold text-sm text-m3-on-surface">{tx.status==="INCOME"?"+":"-"}${(tx.amount ?? 0).toFixed(2)}</p><p className={`text-xs font-medium ${tx.status==="BLOCKED"?"text-m3-error":tx.status==="INCOME"?"text-m3-secondary":"text-m3-primary"}`}>{tx.status}</p></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {showBlocked && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div ref={blockedBackdropRef} className="absolute inset-0 bg-m3-error/20 backdrop-blur-md" onClick={closeBlocked} />
                    <div ref={blockedModalRef} className="relative bg-m3-error-container rounded-m3-xl p-8 max-w-sm mx-4 text-center shadow-m3-5">
                        <div className="flex justify-center mb-4"><div className="p-3 rounded-m3-full bg-m3-error/15"><ShieldAlert className="text-m3-on-error-container" size={40} /></div></div>
                        <h2 className="text-m3-title-large text-m3-on-error-container">Transaction Blocked</h2>
                        <p className="text-m3-body-medium text-m3-on-error-container/80 mt-3">{blockedReason}</p>
                        <button onClick={closeBlocked} className="mt-6 px-8 py-3 rounded-m3-full bg-m3-error text-m3-on-error font-medium text-sm flex items-center gap-2 mx-auto"><X size={16} /> Dismiss</button>
                    </div>
                </div>
            )}
        </PageTransition>
    );
}
