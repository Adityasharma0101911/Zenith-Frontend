// this makes the ai box look like a glowing smart terminal
"use client";

// this fetches the custom ai advice from the backend
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
            // send a get request with the auth token
            const res = await fetch(`${API_URL}/api/ai/insights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // parse the response
            const data = await res.json();

            // set the advice text from the backend
            setAdvice(data.advice);
        } catch {
            // if the fetch fails, show a fallback message
            setAdvice("Zenith AI is currently offline. Please try again later.");
        }
    }

    // this runs the fetch when the page loads or when refreshTrigger changes
    useEffect(() => {
        fetchAdvice();
    }, [refreshTrigger]);

    return (
        // this floats the card gently up and down like it's alive
        <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bg-slate-800 border border-teal-500/30 rounded-2xl shadow-[0_0_15px_rgba(20,184,166,0.15)] p-6 w-full"
        >
            {/* ai sparkles icon and title */}
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-teal-400" size={22} />
                <h2 className="text-lg font-bold text-white">Zenith AI Insight</h2>
            </div>

            {/* the ai advice text */}
            <p className="text-teal-100/80 text-sm leading-relaxed">{advice}</p>
        </motion.div>
    );
}
