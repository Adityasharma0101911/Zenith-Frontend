// material design 3 pulse check stress slider
"use client";

// import useState to track the slider value and saved message
import { useState } from "react";

// import motion for button animations
import { motion } from "framer-motion";

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
        <div className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full">
            {/* title with activity icon in tonal container */}
            <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-m3-full bg-m3-secondary-container">
                    <Activity className="text-m3-on-secondary-container" size={18} />
                </div>
                <h2 className="text-base font-semibold text-m3-on-surface">Pulse Check</h2>
            </div>

            {/* stress level number with dynamic color */}
            <p className={`text-5xl font-bold mt-5 text-center transition-colors duration-300 ${getStressColor(stress)}`}>
                {stress}
            </p>

            {/* dynamic label */}
            <p className={`text-sm font-medium text-center mt-1 transition-colors duration-300 ${getStressColor(stress)}`}>
                {getStressLabel(stress)}
            </p>

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

            {/* log pulse button */}
            <motion.button
                onClick={handleUpdateStress}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="m3-btn-tonal w-full mt-5"
            >
                Log Pulse
            </motion.button>

            {/* success feedback */}
            {saved && (
                <p className="mt-3 text-center text-sm font-medium text-m3-primary flex items-center justify-center gap-1">
                    <Check size={14} /> Saved
                </p>
            )}

            {/* error feedback */}
            {error && (
                <p className="mt-3 text-center text-sm font-medium text-m3-error">{error}</p>
            )}
        </div>
    );
}
