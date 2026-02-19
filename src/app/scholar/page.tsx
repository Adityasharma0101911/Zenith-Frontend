// zenith scholar - intellectual ai tutor page
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Lightbulb, Target } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import PageTransition from "@/components/PageTransition";

const m3Ease = [0.2, 0, 0, 1] as const;

// feature tips shown above the chat
const TIPS = [
    { icon: BookOpen, text: "Ask for study plans" },
    { icon: Lightbulb, text: "Break down concepts" },
    { icon: Target, text: "Get exam strategies" },
];

export default function ScholarPage() {
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
                        <div className="w-12 h-12 rounded-m3-lg bg-m3-tertiary-container flex items-center justify-center">
                            <GraduationCap size={24} className="text-m3-on-tertiary-container" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-m3-on-surface">Zenith Scholar</h1>
                            <p className="text-sm text-m3-on-surface-variant">Your intellectual AI tutor</p>
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
                                className="flex items-center gap-1.5 px-3 py-1 rounded-m3-full bg-m3-tertiary-container/40 text-xs text-m3-on-tertiary-container"
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
                        section="scholar"
                        placeholder="Ask Scholar anything..."
                        accentColor="text-m3-on-tertiary-container"
                        accentBg="bg-m3-tertiary-container"
                    />
                </div>
            </main>
        </PageTransition>
    );
}
