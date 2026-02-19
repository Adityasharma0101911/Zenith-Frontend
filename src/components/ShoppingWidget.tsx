// material design 3 shopping widget with interceptor modal
"use client";

// import useState to track the response message
import { useState } from "react";

// import motion and AnimatePresence for the blocked modal
import { motion, AnimatePresence } from "framer-motion";

// import icons for the widget
import { ShoppingCart, ShieldAlert, X } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// this takes a refreshData function so the dashboard can update the balance
export default function ShoppingWidget({ refreshData }: { refreshData: () => void }) {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [blockedReason, setBlockedReason] = useState("");
    const [showBlocked, setShowBlocked] = useState(false);

    // this sends the buy request to the interceptor
    async function handleBuy() {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/api/transaction/attempt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: 150, item_name: "Headphones" }),
            });

            const data = await res.json();
            setError("");

            if (data.status === "BLOCKED") {
                setBlockedReason(data.reason);
                setShowBlocked(true);
                setMessage("");
            } else if (data.status === "ALLOWED") {
                setMessage(`Purchase allowed! New balance: $${data.new_balance.toFixed(2)}`);
                refreshData();
            } else {
                setMessage("Something went wrong.");
            }
        } catch {
            setError("Could not connect to server.");
        }
    }

    return (
        <>
            <div className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full">
                {/* product image placeholder with m3 surface */}
                <div className="bg-m3-surface-container-highest rounded-m3-lg h-36 flex items-center justify-center mb-4">
                    <ShoppingCart className="text-m3-on-surface-variant/40" size={48} />
                </div>

                {/* product name */}
                <h2 className="text-base font-semibold text-m3-on-surface">Noise Cancelling Headphones</h2>

                {/* product price */}
                <p className="text-2xl text-m3-primary font-semibold mt-1">$150.00</p>

                {/* product description */}
                <p className="text-m3-on-surface-variant text-sm mt-1">Premium wireless headphones with ANC</p>

                {/* buy button */}
                <motion.button
                    onClick={handleBuy}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="m3-btn-filled w-full mt-4"
                >
                    Buy Now
                </motion.button>

                {/* success message */}
                {message && (
                    <p className="mt-3 text-center text-sm font-medium text-m3-primary">{message}</p>
                )}

                {/* error message */}
                {error && (
                    <p className="mt-3 text-center text-sm font-medium text-m3-error">{error}</p>
                )}
            </div>

            {/* m3 full-screen error modal when transaction is blocked */}
            <AnimatePresence>
                {showBlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        {/* m3 scrim overlay */}
                        <div className="absolute inset-0 bg-m3-error/20 backdrop-blur-md" />

                        {/* blocked modal card */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-m3-error-container rounded-m3-xl p-8 max-w-sm mx-4 text-center shadow-m3-5"
                        >
                            {/* shield icon in error surface */}
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-m3-full bg-m3-error/15">
                                    <ShieldAlert className="text-m3-on-error-container" size={40} />
                                </div>
                            </div>

                            {/* blocked title */}
                            <h2 className="text-xl font-semibold text-m3-on-error-container">Transaction Blocked</h2>

                            {/* blocked reason */}
                            <p className="text-m3-on-error-container/80 mt-3 text-sm">{blockedReason}</p>

                            {/* dismiss button */}
                            <motion.button
                                onClick={() => setShowBlocked(false)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-6 px-8 py-3 rounded-m3-full bg-m3-error text-m3-on-error font-medium text-sm flex items-center gap-2 mx-auto transition-colors"
                            >
                                <X size={16} />
                                Dismiss
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
