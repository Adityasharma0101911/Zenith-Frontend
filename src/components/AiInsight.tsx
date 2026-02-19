// material design 3 ai insight card with floating animation
"use client";

// import hooks for fetching data
import { useEffect, useState } from "react";

// import motion for the floating animation
import { motion } from "framer-motion";

// import sparkles icon for the ai branding
import { Sparkles } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// this tells the ai to rethink when data changes
export default function AiInsight({ refreshTrigger }: { refreshTrigger: number }) {
    // this stores the ai advice text
    const [advice, setAdvice] = useState("Zenith AI is analyzing your vault...");

    // this fetches the ai advice from the backend
    async function fetchAdvice() {
        // get the token from localStorage
        const token = localStorage.getItem("token");

        // try to fetch the advice from the backend
        try {
            const res = await fetch(`${API_URL}/api/ai/insights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setAdvice(data.advice);
        } catch {
            setAdvice("Zenith AI is currently offline. Please try again later.");
        }
    }

    // this runs the fetch when the page loads or when refreshTrigger changes
    useEffect(() => {
        fetchAdvice();
    }, [refreshTrigger]);

    return (
        // m3 inverse surface card with floating animation
        <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bg-m3-inverse-surface rounded-m3-xl p-6 w-full shadow-m3-3"
        >
            {/* ai sparkles icon and title */}
            <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-m3-full bg-m3-primary-container">
                    <Sparkles className="text-m3-on-primary-container" size={18} />
                </div>
                <h2 className="text-base font-semibold text-m3-inverse-on-surface">Zenith AI Insight</h2>
            </div>

            {/* the ai advice text */}
            <p className="text-m3-inverse-on-surface/75 text-sm leading-relaxed">{advice}</p>
        </motion.div>
    );
}
