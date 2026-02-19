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
    const spring = useSpring(0, { stiffness: 80, damping: 20 });
    const display = useTransform(spring, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);
    const ref = useRef<HTMLSpanElement>(null);
    const [text, setText] = useState(`${prefix}${value.toFixed(decimals)}${suffix}`);

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    useEffect(() => {
        const unsubscribe = display.on("change", (v) => setText(v));
        return unsubscribe;
    }, [display]);

    return (
        <motion.span ref={ref} className={className}>
            {text}
        </motion.span>
    );
}
