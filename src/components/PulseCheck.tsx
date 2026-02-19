// material design 3 pulse check stress slider with animated feedback
"use client";

// import useState to track the slider value and saved message
import { useState } from "react";

// import motion for button and number animations
import { motion, AnimatePresence } from "framer-motion";

// import activity icon for the pulse branding
import { Activity, Check } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// dynamic colors based on stress level using m3 tokens
function getStressColor(level: number) {
    if (level <= 4) return "text-m3-primary";
    if (level <= 7) return "text-m3-tertiary";
    return "text-m3-error";
}

// dynamic background glow based on stress
function getStressBg(level: number) {
    if (level <= 4) return "bg-m3-primary/5";
    if (level <= 7) return "bg-m3-tertiary/5";
    return "bg-m3-error/5";
}

// label for the stress level
function getStressLabel(level: number) {
    if (level <= 4) return "Calm";
    if (level <= 7) return "Moderate";
    return "High Stress";
}

// this accepts triggerRefresh so it can tell the ai to update
export default function PulseCheck({ triggerRefresh }: { triggerRefresh: () => void }) {
    // this stores the current stress level from the slider
    const [stress, setStress] = useState(5);

    // this stores the saved message
    const [saved, setSaved] = useState(false);

    // this stores the error message if something goes wrong
    const [error, setError] = useState("");

    // this sends the new stress level to the backend
    async function handleUpdateStress() {
        const token = localStorage.getItem("token");

        try {
            await fetch(`${API_URL}/api/update_stress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ new_stress_level: stress }),
            });

            setError("");
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            triggerRefresh();
        } catch {
            setError("Could not connect to server.");
        }
    }

    return (
        <motion.div
            whileHover={{ y: -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full transition-shadow hover:shadow-m3-2"
        >
            {/* title with activity icon in tonal container and bounce entrance */}
            <div className="flex items-center gap-2.5">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                    className="p-1.5 rounded-m3-full bg-m3-secondary-container"
                >
                    <Activity className="text-m3-on-secondary-container" size={18} />
                </motion.div>
                <h2 className="text-base font-semibold text-m3-on-surface">Pulse Check</h2>
            </div>

            {/* stress level number with animated transitions between values */}
            <div className={`rounded-m3-lg p-3 mt-4 transition-colors duration-500 ${getStressBg(stress)}`}>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={stress}
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`text-5xl font-bold text-center ${getStressColor(stress)}`}
                    >
                        {stress}
                    </motion.p>
                </AnimatePresence>

                {/* dynamic label with smooth swap */}
                <AnimatePresence mode="wait">
                    <motion.p
                        key={getStressLabel(stress)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`text-sm font-medium text-center mt-1 ${getStressColor(stress)}`}
                    >
                        {getStressLabel(stress)}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* range slider with m3 styling */}
            <input
                type="range"
                min={1}
                max={10}
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full mt-5 accent-m3-primary h-1.5 rounded-full bg-m3-surface-container-highest"
            />

            {/* slider endpoint labels */}
            <div className="flex justify-between text-xs text-m3-on-surface-variant mt-1">
                <span>1</span>
                <span>10</span>
            </div>

            {/* log pulse button with spring hover */}
            <motion.button
                onClick={handleUpdateStress}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="m3-btn-tonal w-full mt-5"
            >
                Log Pulse
            </motion.button>

            {/* animated success feedback */}
            <AnimatePresence>
                {saved && (
                    <motion.p
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="mt-3 text-center text-sm font-medium text-m3-primary flex items-center justify-center gap-1"
                    >
                        <Check size={14} /> Saved
                    </motion.p>
                )}
            </AnimatePresence>

            {/* error feedback */}
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
    );
}
