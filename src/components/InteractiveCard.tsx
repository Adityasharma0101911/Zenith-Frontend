// interactive card wrapper for dynamic soft shadows and neumorphic elevation
"use client";

import { motion } from "framer-motion";
import { useRef, useState, ReactNode } from "react";

interface InteractiveCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: string; // allows custom breathing border glow
}

export default function InteractiveCard({ children, className = "", glowColor = "rgba(var(--m3-primary), 0.15)" }: InteractiveCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
    }

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className={`relative overflow-hidden group rounded-m3-xl bg-m3-surface-container-low border border-white/5 shadow-m3-2 hover:shadow-m3-4 transition-all duration-300 ${className}`}
        >
            {/* Dynamic Mouse Glare Layer (Idea #3: Dynamic Soft Shadow) */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)`
                }}
            />

            {/* Breathing Ambient Edge Glow (Idea #4) */}
            <div
                className="absolute inset-0 pointer-events-none z-0 opacity-50 transition-opacity group-hover:opacity-100"
                style={{
                    boxShadow: `inset 0 0 20px ${glowColor}`
                }}
            />

            {/* Content Layer */}
            <div className="relative z-20 h-full">
                {children}
            </div>
        </motion.div>
    );
}
