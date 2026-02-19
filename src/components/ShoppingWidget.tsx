// material design 3 shopping widget with interceptor modal and rich animations
"use client";

// import useState to track the response message
import { useState } from "react";

// import motion and AnimatePresence for the blocked modal and micro-interactions
import { motion, AnimatePresence } from "framer-motion";

// import icons for the widget
import { ShoppingCart, ShieldAlert, X, Headphones } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// m3 standard easing
const m3Ease = [0.2, 0, 0, 1] as const;

// this takes a refreshData function so the dashboard can update the balance
export default function ShoppingWidget({ refreshData }: { refreshData: () => void }) {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [blockedReason, setBlockedReason] = useState("");
    const [showBlocked, setShowBlocked] = useState(false);
    const [buying, setBuying] = useState(false);

    // this sends the buy request to the interceptor
    async function handleBuy() {
        const token = localStorage.getItem("token");
        setBuying(true);

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
            setBuying(false);

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
            setBuying(false);
            setError("Could not connect to server.");
        }
    }

    return (
        <>
            <motion.div
                whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full transition-shadow hover:shadow-m3-2"
            >
                {/* product image placeholder with animated icon */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-m3-surface-container-highest rounded-m3-lg h-36 flex items-center justify-center mb-4 overflow-hidden"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    >
                        <Headphones className="text-m3-on-surface-variant/40" size={56} />
                    </motion.div>
                </motion.div>

                {/* product name */}
                <h2 className="text-base font-semibold text-m3-on-surface">Noise Cancelling Headphones</h2>

                {/* product price with scale entrance */}
                <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                    className="text-2xl text-m3-primary font-semibold mt-1"
                >
                    $150.00
                </motion.p>

                {/* product description */}
                <p className="text-m3-on-surface-variant text-sm mt-1">Premium wireless headphones with ANC</p>

                {/* buy button with spring hover */}
                <motion.button
                    onClick={handleBuy}
                    disabled={buying}
                    whileHover={{ scale: buying ? 1 : 1.03, y: buying ? 0 : -1 }}
                    whileTap={{ scale: buying ? 1 : 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="m3-btn-filled w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    <ShoppingCart size={16} />
                    {buying ? "Processing..." : "Buy Now"}
                </motion.button>

                {/* animated success message */}
                <AnimatePresence>
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: m3Ease }}
                            className="mt-3 text-center text-sm font-medium text-m3-primary"
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* error message */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-3 text-center text-sm font-medium text-m3-error"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* m3 full-screen error modal when transaction is blocked - dramatic entrance */}
            <AnimatePresence>
                {showBlocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        {/* m3 scrim overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-m3-error/20 backdrop-blur-md"
                            onClick={() => setShowBlocked(false)}
                        />

                        {/* blocked modal card with container transform */}
                        <motion.div
                            initial={{ scale: 0.7, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 22, stiffness: 300 }}
                            className="relative bg-m3-error-container rounded-m3-xl p-8 max-w-sm mx-4 text-center shadow-m3-5"
                        >
                            {/* shield icon with shake animation */}
                            <div className="flex justify-center mb-4">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.15 }}
                                    className="p-3 rounded-m3-full bg-m3-error/15"
                                >
                                    <motion.div
                                        animate={{ x: [0, -3, 3, -3, 3, 0] }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        <ShieldAlert className="text-m3-on-error-container" size={40} />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* blocked title */}
                            <motion.h2
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, ease: m3Ease }}
                                className="text-xl font-semibold text-m3-on-error-container"
                            >
                                Transaction Blocked
                            </motion.h2>

                            {/* blocked reason */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.35 }}
                                className="text-m3-on-error-container/80 mt-3 text-sm"
                            >
                                {blockedReason}
                            </motion.p>

                            {/* dismiss button with spring */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, ease: m3Ease }}
                                onClick={() => setShowBlocked(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.93 }}
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
