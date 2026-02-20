// animated number counter that smoothly rolls between values
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function AnimatedCounter({
    value,
    prefix = "",
    suffix = "",
    decimals = 2,
    className = "",
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    className?: string;
}) {
    const [text, setText] = useState<string>(value.toFixed(decimals));

    useEffect(() => {
        setText(value.toFixed(decimals));
    }, [value, decimals]);

    // Odometer effect: split the formatted string and animate digits
    return (
        <span className={`inline-flex items-center space-x-[1px] ${className}`}>
            {prefix && <span>{prefix}</span>}
            {text.split('').map((char, i) => {
                if (isNaN(parseInt(char))) {
                    // Render non-digits (like dots or commas) statically
                    return <span key={`${char}-${i}`} className="opacity-80">{char}</span>;
                }

                // Animate individual digits (Idea #10: Odometer)
                return (
                    <span key={i} className="relative inline-flex flex-col h-[1em] overflow-hidden leading-none">
                        <motion.span
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            key={`${char}-${value}`} // Forces re-render on value change to trigger bounce
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                mass: 0.8,
                                delay: i * 0.05 // Stagger digit rolls
                            }}
                            className="absolute top-0"
                        >
                            {char}
                        </motion.span>
                        {/* Invisible spacer to hold width */}
                        <span className="invisible">{char}</span>
                    </span>
                );
            })}
            {suffix && <span>{suffix}</span>}
        </span>
    );
}
