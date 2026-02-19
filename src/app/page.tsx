// material design 3 landing page with rich android-style animations
"use client";

// import motion for staggered entrance animations
import { motion } from "framer-motion";

// import icons for the feature cards
import { Shield, Brain, TrendingDown, ArrowRight, Sparkles } from "lucide-react";

// import Link to navigate to registration
import Link from "next/link";

// import page transition wrapper
import PageTransition from "@/components/PageTransition";

// m3 standard easing curve
const m3Ease = [0.2, 0, 0, 1] as const;

// stagger container for cascading children
const stagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

// individual item animation
const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: m3Ease } },
};

// feature card data
const features = [
    {
        icon: Shield,
        title: "Spending Guardian",
        desc: "Blocks impulse purchases when your stress is high",
        color: "bg-m3-primary-container",
        iconColor: "text-m3-on-primary-container",
    },
    {
        icon: Brain,
        title: "AI Insights",
        desc: "Personalized advice based on your mental state",
        color: "bg-m3-tertiary-container",
        iconColor: "text-m3-on-tertiary-container",
    },
    {
        icon: TrendingDown,
        title: "Stress Tracking",
        desc: "Real-time wellness monitoring aligned with UN SDG #3",
        color: "bg-m3-secondary-container",
        iconColor: "text-m3-on-secondary-container",
    },
];

export default function Home() {
    return (
        <PageTransition>
            <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-28">

                {/* hero section with staggered cascade */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="text-center max-w-lg"
                >
                    {/* animated badge */}
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container text-xs font-medium mb-5">
                        <Sparkles size={12} />
                        AI-Powered Financial Wellness
                    </motion.div>

                    {/* app name with scale entrance */}
                    <motion.h1
                        variants={fadeUp}
                        className="text-6xl font-bold text-m3-on-surface tracking-tight"
                    >
                        Zenith
                    </motion.h1>

                    {/* tagline fades in after title */}
                    <motion.p
                        variants={fadeUp}
                        className="text-m3-on-surface-variant mt-4 text-lg leading-relaxed"
                    >
                        Your guardian against impulse spending.
                        <br />
                        <span className="text-m3-primary font-medium">Powered by AI. Driven by wellness.</span>
                    </motion.p>

                    {/* call to action buttons with spring hover */}
                    <motion.div variants={fadeUp} className="flex gap-4 justify-center mt-8">
                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="m3-btn-filled flex items-center gap-2 px-8"
                            >
                                Get Started
                                <motion.span
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" as const }}
                                >
                                    <ArrowRight size={16} />
                                </motion.span>
                            </motion.button>
                        </Link>
                        <Link href="/login">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="m3-btn-tonal px-8"
                            >
                                Sign In
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* feature cards with individual staggered entrances and hover lift */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20 max-w-3xl w-full"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            variants={fadeUp}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 300, damping: 20 },
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="m3-card flex flex-col items-center text-center gap-3 cursor-default"
                        >
                            {/* icon container with bounce-in delay */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 12,
                                    delay: 0.6 + i * 0.15,
                                }}
                                className={`w-14 h-14 rounded-m3-lg ${f.color} flex items-center justify-center`}
                            >
                                <f.icon className={f.iconColor} size={26} />
                            </motion.div>
                            <h3 className="font-semibold text-m3-on-surface">{f.title}</h3>
                            <p className="text-sm text-m3-on-surface-variant leading-relaxed">
                                {f.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </PageTransition>
    );
}
