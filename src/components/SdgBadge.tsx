// material design 3 sdg chip badge with subtle glow animation
"use client";

import { motion } from "framer-motion";

export default function SdgBadge() {
    return (
        // m3 assist chip style with ambient glow pulse
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="bg-m3-tertiary-container text-m3-on-tertiary-container rounded-m3-sm px-3 py-1 flex items-center gap-1.5 text-xs font-medium animate-glow-pulse"
        >
            <span>🌍</span>
            <span>UN SDG #3: Good Health & Well-being</span>
        </motion.div>
    );
}
