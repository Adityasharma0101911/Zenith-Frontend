// material design 3 transaction history with gsap stagger animations
"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ShieldX, CheckCircle, FileText } from "lucide-react";
import { API_URL } from "@/utils/api";

interface Transaction {
    item_name: string;
    amount: number;
    status: string;
    timestamp: string;
}

export default function HistoryLog({ refreshTrigger }: { refreshTrigger: number }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const cardRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    async function fetchHistory() {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/history`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setTransactions(data.transactions || []);
        } catch { setTransactions([]); }
    }

    useEffect(() => { fetchHistory(); }, [refreshTrigger]);

    // poll every 30s
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        intervalRef.current = setInterval(fetchHistory, 30000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    // card hover
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const enter = () => gsap.to(el, { y: -2, duration: 0.25, ease: "power3.out" });
        const leave = () => gsap.to(el, { y: 0, duration: 0.25, ease: "power3.out" });
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
    }, []);

    // icon bounce
    useEffect(() => {
        if (!iconRef.current) return;
        gsap.from(iconRef.current, { scale: 0, duration: 0.5, ease: "back.out(2)" });
    }, []);

    // stagger list items on data change
    useEffect(() => {
        if (!listRef.current || transactions.length === 0) return;
        gsap.from(listRef.current.querySelectorAll(".tx-item"), {
            opacity: 0, x: -16, duration: 0.3, stagger: 0.06, ease: "power3.out",
        });
    }, [transactions]);

    function formatTime(timestamp: string) {
        return new Date(timestamp).toLocaleString();
    }

    return (
        <div ref={cardRef} className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full transition-shadow hover:shadow-m3-2">
            <div className="flex items-center gap-2.5 mb-4">
                <div ref={iconRef} className="p-1.5 rounded-m3-full bg-m3-primary-container">
                    <FileText className="text-m3-on-primary-container" size={16} />
                </div>
                <h2 className="text-m3-title-medium text-m3-on-surface">Transaction Ledger</h2>
            </div>

            {transactions.length === 0 ? (
                <p className="text-m3-on-surface-variant text-m3-body-medium text-center py-4">No recent transactions. Your vault is secure.</p>
            ) : (
                <div ref={listRef} className="space-y-2 max-h-64 overflow-y-auto">
                    {transactions.map((tx, index) => (
                        <div key={index} className={`tx-item flex items-center justify-between p-3.5 rounded-m3-lg transition-all hover:translate-x-[3px] hover:shadow-m3-1 ${tx.status === "BLOCKED" ? "bg-m3-error-container/40" : "bg-m3-surface-container"}`}>
                            <div className="flex items-center gap-3">
                                {tx.status === "BLOCKED" ? (
                                    <ShieldX className="text-m3-error" size={20} />
                                ) : (
                                    <CheckCircle className="text-m3-primary" size={20} />
                                )}
                                <div>
                                    <p className={`text-m3-label-large ${tx.status === "BLOCKED" ? "text-m3-on-error-container" : "text-m3-on-surface"}`}>{tx.item_name}</p>
                                    <p className="text-m3-label-small text-m3-on-surface-variant">{formatTime(tx.timestamp)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-m3-label-large text-m3-on-surface">${tx.amount.toFixed(2)}</p>
                                <p className={`text-m3-label-small ${tx.status === "BLOCKED" ? "text-m3-error" : "text-m3-primary"}`}>{tx.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
