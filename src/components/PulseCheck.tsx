// material design 3 pulse check stress slider with animated feedback
"use client";

// import useState to track the slider value and saved message
import { useState } from "react";

// import motion for button and number animations
import { motion, AnimatePresence } from "framer-motion";

// import activity icon for the pulse branding
import { Activity, Check } from "lucide-react";

// import custom interactive components
import InteractiveCard from "./InteractiveCard";
import MotionButton from "./MotionButton";

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
        <InteractiveCard
            className="p-6 w-full"
            glowColor="rgba(var(--m3-primary), 0.15)"
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
                <h2 className="text-m3-title-medium text-m3-on-surface">Pulse Check</h2>
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
                        className={`text-m3-label-large text-center mt-1 ${getStressColor(stress)}`}
                    >
                        {getStressLabel(stress)}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* dynamic stroke color based on stress */}
            <motion.div
                className="flex flex-col items-center gap-3 mt-6 mb-4"
                animate={{ color: getStressColor(stress) }}
                transition={{ duration: 0.3 }}
            >
                <div className="text-5xl font-bold tracking-tighter">
                    {stress}
                    <span className="text-xl text-m3-on-surface-variant font-normal">/10</span>
                </div>

                <div className="w-full h-16 relative flex items-center mb-6">
                    <motion.svg
                        viewBox="0 0 100 20"
                        className="w-full h-full overflow-visible drop-shadow-md"
                        preserveAspectRatio="none"
                    >
                        <motion.path
                            d={`M 0 10 Q 20 ${10 - (stress * 1.5)} 30 10 T 50 10 Q 70 ${10 + (stress * 1.5)} 80 10 T 100 10`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                        {/* Animated dot following path */}
                        <motion.circle
                            r="2.5"
                            fill="currentColor"
                            animate={{
                                cx: [0, 30, 50, 80, 100],
                                cy: [10, 10 - (stress * 1.5), 10, 10 + (stress * 1.5), 10]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: Math.max(0.5, 2 - (stress * 0.15)),
                                ease: "linear"
                            }}
                        />
                    </motion.svg>

                    {/* the invisible range input overlay */}
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={stress}
                        onChange={(e) => setStress(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                </div>
            </motion.div>

            {/* log pulse button with spring hover and magnetic pull */}
            <MotionButton
                onClick={handleUpdateStress}
                variant="tonal"
                className="w-full mt-5"
            >
                Log Pulse
            </MotionButton>

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
        </InteractiveCard>
    );
}
