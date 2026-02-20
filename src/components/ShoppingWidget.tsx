// custom purchase widget with ai evaluation — gsap powered
"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ShoppingCart, ShieldAlert, ShieldCheck, X, Loader2, DollarSign, Package, MessageSquare } from "lucide-react";
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

    const cardRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const verdictRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLParagraphElement>(null);
    const errorRef = useRef<HTMLParagraphElement>(null);
    const modalOverlayRef = useRef<HTMLDivElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);

    // card hover
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const enter = () => gsap.to(el, { y: -3, duration: 0.25, ease: "power3.out" });
        const leave = () => gsap.to(el, { y: 0, duration: 0.25, ease: "power3.out" });
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
    }, []);

    // icon entrance
    useEffect(() => {
        if (!iconRef.current) return;
        gsap.from(iconRef.current, { scale: 0, duration: 0.5, ease: "back.out(2)" });
    }, []);

    // verdict entrance
    useEffect(() => {
        if (verdict && verdictRef.current) {
            gsap.from(verdictRef.current, { opacity: 0, y: 10, duration: 0.4, ease: "power3.out" });
        }
    }, [verdict]);

    // result/error animations
    useEffect(() => {
        if (result && resultRef.current) gsap.from(resultRef.current, { opacity: 0, y: 8, duration: 0.3 });
    }, [result]);
    useEffect(() => {
        if (error && errorRef.current) gsap.from(errorRef.current, { opacity: 0, duration: 0.3 });
    }, [error]);

    // modal animations
    useEffect(() => {
        if (showBlocked) {
            if (modalOverlayRef.current) gsap.from(modalOverlayRef.current, { opacity: 0, duration: 0.3 });
            if (modalContentRef.current) gsap.from(modalContentRef.current, { scale: 0.7, opacity: 0, y: 40, duration: 0.5, ease: "back.out(1.4)" });
        }
    }, [showBlocked]);

    function closeModal() {
        const tl = gsap.timeline({ onComplete: () => setShowBlocked(false) });
        if (modalContentRef.current) tl.to(modalContentRef.current, { scale: 0.85, opacity: 0, y: 20, duration: 0.25, ease: "power2.in" }, 0);
        if (modalOverlayRef.current) tl.to(modalOverlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0.05);
    }

    async function handleEvaluate(e: React.FormEvent) {
        e.preventDefault();
        if (!itemName.trim() || !amount.trim()) return;
        setEvaluating(true); setVerdict(null); setResult(""); setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/purchase/evaluate`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ item_name: itemName.trim(), amount: parseFloat(amount), reason: reason.trim() }),
            });
            const data = await res.json();
            if (data.error) setError(data.error); else setVerdict(data);
        } catch { setError("Could not reach AI for evaluation. Check your connection."); }
        finally { setEvaluating(false); }
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
            if (data.status === "BLOCKED") { setBlockedReason(data.reason); setShowBlocked(true); }
            else if (data.status === "ALLOWED") {
                setResult(`Purchase complete! New balance: $${data.new_balance.toFixed(2)}`);
                refreshData(); setItemName(""); setAmount(""); setReason(""); setVerdict(null);
            }
        } catch { setError("Could not process purchase."); }
        finally { setExecuting(false); }
    }

    function handleCancel() { setVerdict(null); setResult(""); setError(""); }



    return (
        <>
            <div ref={cardRef} className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full transition-shadow hover:shadow-m3-2">
                <div className="flex items-center gap-2.5 mb-4">
                    <div ref={iconRef} className="p-1.5 rounded-m3-full bg-m3-primary-container">
                        <ShoppingCart className="text-m3-on-primary-container" size={16} />
                    </div>
                    <h2 className="text-m3-title-medium text-m3-on-surface">Smart Purchase</h2>
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
                        <button type="submit" disabled={evaluating || !itemName.trim() || !amount.trim()} className="m3-btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-70 gsap-btn-hover">
                            {evaluating ? (<><Loader2 size={16} className="animate-spin" />AI Evaluating...</>) : (<><ShoppingCart size={16} />Evaluate Purchase</>)}
                        </button>
                    </form>
                ) : (
                    <div ref={verdictRef} className="space-y-3">
                        <div className={`rounded-m3-lg p-4 ${verdict.verdict === "approve" ? "bg-m3-primary-container/40" : "bg-m3-error-container/40"}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {verdict.verdict === "approve" ? <ShieldCheck size={18} className="text-m3-primary" /> : <ShieldAlert size={18} className="text-m3-error" />}
                                <span className={`text-m3-label-large ${verdict.verdict === "approve" ? "text-m3-primary" : "text-m3-error"}`}>
                                    {verdict.verdict === "approve" ? "AI Approved" : "AI Suggests Holding"}
                                </span>
                            </div>
                            <p className="text-m3-body-small text-m3-on-surface leading-relaxed">{verdict.analysis}</p>
                        </div>
                        <div className="flex gap-2">
                            {verdict.verdict === "approve" && (
                                <button onClick={handleExecute} disabled={executing} className="flex-1 m3-btn-filled flex items-center justify-center gap-2 disabled:opacity-70 gsap-btn-hover">
                                    {executing ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                                    {executing ? "Processing..." : `Buy $${verdict.amount.toFixed(2)}`}
                                </button>
                            )}
                            <button onClick={handleCancel} className={`${verdict.verdict === "approve" ? "" : "flex-1"} m3-btn-tonal flex items-center justify-center gap-2 gsap-btn-hover`}>
                                <X size={16} />{verdict.verdict === "approve" ? "Cancel" : "Go Back"}
                            </button>
                        </div>
                    </div>
                )}

                {result && <p ref={resultRef} className="mt-3 text-center text-sm font-medium text-m3-primary">{result}</p>}
                {error && <p ref={errorRef} className="mt-3 text-center text-sm font-medium text-m3-error">{error}</p>}
            </div>

            {showBlocked && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div ref={modalOverlayRef} className="absolute inset-0 bg-m3-error/20 backdrop-blur-md" onClick={closeModal} />
                    <div ref={modalContentRef} className="relative bg-m3-error-container rounded-m3-xl p-8 max-w-sm mx-4 text-center shadow-m3-5">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-m3-full bg-m3-error/15"><ShieldAlert className="text-m3-on-error-container" size={40} /></div>
                        </div>
                        <h2 className="text-m3-title-large text-m3-on-error-container">Transaction Blocked</h2>
                        <p className="text-m3-body-medium text-m3-on-error-container/80 mt-3">{blockedReason}</p>
                        <button onClick={closeModal} className="mt-6 px-8 py-3 rounded-m3-full bg-m3-error text-m3-on-error font-medium text-sm flex items-center gap-2 mx-auto gsap-btn-hover">
                            <X size={16} />Dismiss
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
