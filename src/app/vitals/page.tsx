// zenith vitals - physical health ai coach page
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeartPulse, Dumbbell, Moon, Apple } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import PageTransition from "@/components/PageTransition";

const m3Ease = [0.2, 0, 0, 1] as const;

// feature tips shown above the chat
const TIPS = [
    { icon: Dumbbell, text: "Workout plans" },
    { icon: Moon, text: "Sleep optimization" },
    { icon: Apple, text: "Nutrition tips" },
];

export default function VitalsPage() {
    const router = useRouter();

    // redirect if not logged in
    useEffect(() => {
        if (!localStorage.getItem("token")) router.push("/login");
    }, [router]);

    return (
        <PageTransition>
            <main className="h-screen flex flex-col pl-0 md:pl-[220px] overflow-hidden">
                {/* header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: m3Ease }}
                    className="px-6 pt-16 md:pt-6 pb-4 shrink-0"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-m3-lg bg-m3-secondary-container flex items-center justify-center">
                            <HeartPulse size={24} className="text-m3-on-secondary-container" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-m3-on-surface">Zenith Vitals</h1>
                            <p className="text-sm text-m3-on-surface-variant">Your physical health AI coach</p>
                        </div>
                    </div>

                    {/* quick tip chips */}
                    <div className="flex gap-2 flex-wrap">
                        {TIPS.map((t, i) => (
                            <motion.div
                                key={t.text}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-m3-full bg-m3-secondary-container/40 text-xs text-m3-on-secondary-container"
                            >
                                <t.icon size={12} />
                                {t.text}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* chat area */}
                <div className="flex-1 min-h-0">
                    <ChatInterface
                        section="vitals"
                        placeholder="Ask Vitals about your health..."
                        accentColor="text-m3-on-secondary-container"
                        accentBg="bg-m3-secondary-container"
                    />
                </div>
            </main>
        </PageTransition>
    );
}
