// highly interactive m3 button with ripple overflow and magnetic pull
"use client";

import { motion, useAnimation } from "framer-motion";
import { useRef, useState, ReactNode } from "react";

interface MotionButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "filled" | "tonal" | "outlined" | "text";
    magnetic?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export default function MotionButton({
    children,
    onClick,
    className = "",
    variant = "filled",
    magnetic = true,
    disabled = false,
    type = "button"
}: MotionButtonProps) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const controls = useAnimation();

    // Ripple state
    const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

    function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
        if (!magnetic || !btnRef.current || disabled) return;

        const rect = btnRef.current.getBoundingClientRect();
        // Calculate distance from center of button
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Pull the button slightly towards the cursor (Idea #8)
        controls.start({
            x: x * 0.15,
            y: y * 0.15,
            transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 }
        });
    }

    function handleMouseLeave() {
        if (!magnetic || disabled) return;
        // Snap back to center
        controls.start({
            x: 0,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 20 }
        });
    }

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        if (disabled) return;

        // Create ripple element at exact click coordinate (Idea #7)
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples(prev => [...prev, { x, y, id }]);

        // Cleanup ripple after animation completes (600ms)
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);

        if (onClick) onClick();
    }

    const baseClass = `relative overflow-hidden group ${variant === "filled" ? "m3-btn-filled" :
        variant === "tonal" ? "m3-btn-tonal" :
            variant === "outlined" ? "m3-btn-outlined" :
                "m3-btn-text"
        } ${className}`;

    return (
        <motion.button
            ref={btnRef}
            animate={controls}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: disabled ? 1 : 0.96 }}
            disabled={disabled}
            className={baseClass}
            type={type}
        >
            {/* The ripple layers */}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="absolute bg-current/20 rounded-full animate-ripple pointer-events-none"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: "1px",
                        height: "1px",
                        transform: "translate(-50%, -50%)"
                    }}
                />
            ))}

            {/* The actual content (must be relative to stay above ripple) */}
            <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full pointer-events-none">
                {children}
            </span>
        </motion.button>
    );
}
