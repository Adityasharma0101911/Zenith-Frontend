// zenith guardian - financial ai advisor page
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, PiggyBank, Shield } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import PageTransition from "@/components/PageTransition";

const m3Ease = [0.2, 0, 0, 1] as const;

// feature tips shown above the chat
const TIPS = [
    { icon: PiggyBank, text: "Budget advice" },
    { icon: TrendingUp, text: "Spending analysis" },
    { icon: Shield, text: "Savings strategies" },
];

export default function GuardianPage() {
    const router = useRouter();

    // redirect if not logged in
    useEffect(() => {
        if (!localStorage.getItem("token")) router.push("/login");
    }, [router]);

    return (
        <PageTransition>
            <main className="min-h-screen flex flex-col pl-0 md:pl-[220px]">
                {/* header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: m3Ease }}
                    className="px-6 pt-16 md:pt-6 pb-4"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-m3-lg bg-m3-primary-container flex items-center justify-center">
                            <Wallet size={24} className="text-m3-on-primary-container" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-m3-on-surface">Zenith Guardian</h1>
                            <p className="text-sm text-m3-on-surface-variant">Your financial AI advisor</p>
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
                                className="flex items-center gap-1.5 px-3 py-1 rounded-m3-full bg-m3-primary-container/40 text-xs text-m3-on-primary-container"
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
                        section="guardian"
                        placeholder="Ask Guardian about your finances..."
                        accentColor="text-m3-on-primary-container"
                        accentBg="bg-m3-primary-container"
                    />
                </div>
            </main>
        </PageTransition>
    );
}
