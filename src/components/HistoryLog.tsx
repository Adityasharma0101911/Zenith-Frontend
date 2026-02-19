// material design 3 transaction history list
"use client";

// import hooks for fetching data
import { useEffect, useState } from "react";

// import status icons
import { ShieldX, CheckCircle } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// define the shape of a transaction
interface Transaction {
    item_name: string;
    amount: number;
    status: string;
    timestamp: string;
}

// this makes the history update instantly via refreshTrigger
export default function HistoryLog({ refreshTrigger }: { refreshTrigger: number }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // fetch transaction history
    async function fetchHistory() {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/api/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTransactions(data.transactions || []);
        } catch {
            setTransactions([]);
        }
    }

    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);

    function formatTime(timestamp: string) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full">
            {/* title */}
            <h2 className="text-base font-semibold text-m3-on-surface mb-4">Transaction Ledger</h2>

            {/* empty state */}
            {transactions.length === 0 ? (
                <p className="text-m3-on-surface-variant text-sm text-center py-4">
                    No recent transactions. Your vault is secure.
                </p>
            ) : (
                // transaction list with m3 surface rows
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {transactions.map((tx, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3.5 rounded-m3-lg ${
                                tx.status === "BLOCKED"
                                    ? "bg-m3-error-container/40"
                                    : "bg-m3-surface-container"
                            }`}
                        >
                            {/* icon and item name */}
                            <div className="flex items-center gap-3">
                                {tx.status === "BLOCKED" ? (
                                    <ShieldX className="text-m3-error" size={20} />
                                ) : (
                                    <CheckCircle className="text-m3-primary" size={20} />
                                )}
                                <div>
                                    <p className={`font-medium text-sm ${
                                        tx.status === "BLOCKED" ? "text-m3-on-error-container" : "text-m3-on-surface"
                                    }`}>
                                        {tx.item_name}
                                    </p>
                                    <p className="text-xs text-m3-on-surface-variant">{formatTime(tx.timestamp)}</p>
                                </div>
                            </div>

                            {/* amount and status */}
                            <div className="text-right">
                                <p className="font-semibold text-sm text-m3-on-surface">${tx.amount.toFixed(2)}</p>
                                <p className={`text-xs font-medium ${
                                    tx.status === "BLOCKED" ? "text-m3-error" : "text-m3-primary"
                                }`}>
                                    {tx.status}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
