// animated mesh gradient backdrop for glass processing
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MeshBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20 transition-opacity duration-1000">
            {/* Primary Blob */}
            <motion.div
                animate={{
                    x: ["-10%", "30%", "-10%"],
                    y: ["-20%", "40%", "-20%"],
                    scale: [1, 1.4, 1],
                }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute top-0 left-0 w-[60vw] h-[60vw] rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-[120px] bg-m3-primary-container"
            />
            {/* Secondary Blob */}
            <motion.div
                animate={{
                    x: ["40%", "-20%", "40%"],
                    y: ["30%", "-10%", "30%"],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-[140px] bg-m3-secondary-container"
            />
            {/* Tertiary Blob */}
            <motion.div
                animate={{
                    x: ["0%", "20%", "0%"],
                    y: ["40%", "10%", "40%"],
                    scale: [1, 1.5, 1],
                }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute bottom-[-10%] left-[20%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply dark:mix-blend-color-dodge filter blur-[160px] bg-m3-tertiary-container"
            />

            {/* Granular Dark Mode Texture Noise (Using base64 svg) layer */}
            <div
                className="absolute inset-0 mix-blend-overlay opacity-0 dark:opacity-40"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
