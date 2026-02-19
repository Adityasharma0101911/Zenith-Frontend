// this creates the history list layout
"use client";

// import hooks for fetching data
import { useEffect, useState } from "react";

// this adds status colors and icons to the log
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
    // this stores the list of transactions
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // this fetches the history from the backend
    async function fetchHistory() {
        // get the token from localStorage
        const token = localStorage.getItem("token");

        try {
            // send a get request with the auth token
            const res = await fetch(`${API_URL}/api/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // parse the response
            const data = await res.json();

            // set the transactions list
            setTransactions(data.transactions || []);
        } catch {
            // silently fail if the server is down
            setTransactions([]);
        }
    }

    // this runs the fetch on load and when refreshTrigger changes
    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);

    // this formats the timestamp to be readable
    function formatTime(timestamp: string) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-lg p-6 w-full">
            {/* title */}
            <h2 className="text-xl font-bold mb-4">Transaction Ledger</h2>

            {/* this handles the case when the user has no history */}
            {transactions.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                    No recent transactions. Your vault is secure.
                </p>
            ) : (
                // list of transactions
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {transactions.map((tx, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                        >
                            {/* icon and item name */}
                            <div className="flex items-center gap-3">
                                {/* red icon for blocked, green for allowed */}
                                {tx.status === "BLOCKED" ? (
                                    <ShieldX className="text-red-500" size={20} />
                                ) : (
                                    <CheckCircle className="text-green-500" size={20} />
                                )}
                                <div>
                                    {/* item name with status color */}
                                    <p className={`font-medium text-sm ${tx.status === "BLOCKED" ? "text-red-600" : "text-green-600"}`}>
                                        {tx.item_name}
                                    </p>
                                    {/* readable timestamp */}
                                    <p className="text-xs text-gray-400">{formatTime(tx.timestamp)}</p>
                                </div>
                            </div>

                            {/* amount and status */}
                            <div className="text-right">
                                <p className="font-semibold text-sm">${tx.amount.toFixed(2)}</p>
                                <p className={`text-xs font-medium ${tx.status === "BLOCKED" ? "text-red-500" : "text-green-500"}`}>
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
