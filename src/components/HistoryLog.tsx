// material design 3 transaction history list with staggered entrance animations
"use client";

// import hooks for fetching data
import { useEffect, useState } from "react";

// import motion for staggered list animations
import { motion } from "framer-motion";

// import status icons
import { ShieldX, CheckCircle, FileText } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// m3 standard easing
const m3Ease = [0.2, 0, 0, 1] as const;

// stagger container for list items
const listStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const listItem = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: m3Ease } },
};

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
        <motion.div
            whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full transition-shadow hover:shadow-m3-2"
        >
            {/* title with ledger icon */}
            <div className="flex items-center gap-2.5 mb-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="p-1.5 rounded-m3-full bg-m3-primary-container"
                >
                    <FileText className="text-m3-on-primary-container" size={16} />
                </motion.div>
                <h2 className="text-base font-semibold text-m3-on-surface">Transaction Ledger</h2>
            </div>

            {/* empty state */}
            {transactions.length === 0 ? (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-m3-on-surface-variant text-sm text-center py-4"
                >
                    No recent transactions. Your vault is secure.
                </motion.p>
            ) : (
                // transaction list with staggered entrance
                <motion.div
                    variants={listStagger}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2 max-h-64 overflow-y-auto"
                >
                    {transactions.map((tx, index) => (
                        <motion.div
                            key={index}
                            variants={listItem}
                            whileHover={{ x: 3, transition: { duration: 0.15 } }}
                            className={`flex items-center justify-between p-3.5 rounded-m3-lg transition-shadow hover:shadow-m3-1 ${
                                tx.status === "BLOCKED"
                                    ? "bg-m3-error-container/40"
                                    : "bg-m3-surface-container"
                            }`}
                        >
                            {/* icon and item name */}
                            <div className="flex items-center gap-3">
                                {tx.status === "BLOCKED" ? (
                                    <motion.div
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <ShieldX className="text-m3-error" size={20} />
                                    </motion.div>
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
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
