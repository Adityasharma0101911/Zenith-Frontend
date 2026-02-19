// material design 3 shared axis page transition wrapper
"use client";

import { motion } from "framer-motion";

// m3 shared axis forward transition: fade through + slight vertical shift
export default function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{
                duration: 0.35,
                ease: [0.2, 0, 0, 1], // m3 standard easing
            }}
        >
            {children}
        </motion.div>
    );
}
