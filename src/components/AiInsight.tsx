// material design 3 ai insight card with typing reveal animation
"use client";

// import hooks for fetching data and typing effect
import { useEffect, useState, useRef } from "react";

// import motion for the floating animation and content transitions
import { motion, AnimatePresence } from "framer-motion";

// import sparkles icon for the ai branding
import { Sparkles } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// this tells the ai to rethink when data changes
export default function AiInsight({ refreshTrigger }: { refreshTrigger: number }) {
    // this stores the full ai advice text
    const [advice, setAdvice] = useState("");

    // this stores the currently displayed (typed) text
    const [displayedText, setDisplayedText] = useState("");

    // this tracks if we are loading new advice
    const [isLoading, setIsLoading] = useState(true);

    // ref to track typing animation
    const typingRef = useRef<NodeJS.Timeout | null>(null);

    // typing effect: reveal characters one by one
    function typeText(fullText: string) {
        // clear any previous typing animation
        if (typingRef.current) clearInterval(typingRef.current);

        setDisplayedText("");
        let i = 0;

        typingRef.current = setInterval(() => {
            if (i < fullText.length) {
                setDisplayedText(fullText.slice(0, i + 1));
                i++;
            } else {
                if (typingRef.current) clearInterval(typingRef.current);
            }
        }, 20);
    }

    // this fetches the ai advice from the backend
    async function fetchAdvice() {
        // get the token from localStorage
        const token = localStorage.getItem("token");
        setIsLoading(true);

        // try to fetch the advice from the backend
        try {
            const res = await fetch(`${API_URL}/api/ai/insights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setAdvice(data.advice);
            setIsLoading(false);
            typeText(data.advice);
        } catch {
            const fallback = "Zenith AI is currently offline. Please try again later.";
            setAdvice(fallback);
            setIsLoading(false);
            typeText(fallback);
        }
    }

    // this runs the fetch when the page loads or when refreshTrigger changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchAdvice();

        // cleanup typing interval
        return () => {
            if (typingRef.current) clearInterval(typingRef.current);
        };
    }, [refreshTrigger]);

    return (
        // m3 inverse surface card with gentle floating animation
        <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" as const }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className="bg-m3-inverse-surface rounded-m3-xl p-6 w-full shadow-m3-3 transition-shadow hover:shadow-m3-4"
        >
            {/* ai sparkles icon and title with entrance animation */}
            <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] as const }}
                className="flex items-center gap-2.5 mb-3"
            >
                <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" as const }}
                    className="p-2 rounded-m3-full bg-m3-primary-container"
                >
                    <Sparkles className="text-m3-on-primary-container" size={18} />
                </motion.div>
                <h2 className="text-base font-semibold text-m3-inverse-on-surface">Zenith AI Insight</h2>
            </motion.div>

            {/* the ai advice text with typing reveal */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                    className="w-1.5 h-1.5 rounded-full bg-m3-primary-container"
                                />
                            ))}
                        </div>
                        <span className="text-m3-inverse-on-surface/50 text-sm">Analyzing your vault...</span>
                    </motion.div>
                ) : (
                    <motion.p
                        key="advice"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-m3-inverse-on-surface/75 text-sm leading-relaxed"
                    >
                        {displayedText}
                        {displayedText.length < advice.length && (
                            <motion.span
                                animate={{ opacity: [0, 1] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className="inline-block w-0.5 h-4 bg-m3-primary-container ml-0.5 align-text-bottom"
                            />
                        )}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
