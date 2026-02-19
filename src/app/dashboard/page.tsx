// material design 3 dashboard with rich android-style stagger animations
"use client";

// import useEffect and useState to run code when the page loads
import { useEffect, useState, useCallback } from "react";

// import useRouter to redirect if not logged in
import { useRouter } from "next/navigation";

// import motion for stagger and micro-interaction animations
import { motion } from "framer-motion";

// import icons for the wellness score
import { Heart, Wallet } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// import all dashboard widgets
import ShoppingWidget from "@/components/ShoppingWidget";
import PulseCheck from "@/components/PulseCheck";
import AiInsight from "@/components/AiInsight";
import HistoryLog from "@/components/HistoryLog";
import MainframeLog from "@/components/MainframeLog";

// import animation components
import PageTransition from "@/components/PageTransition";
import AnimatedCounter from "@/components/AnimatedCounter";

// m3 standard easing
const m3Ease = [0.2, 0, 0, 1] as const;

// this staggers the dashboard widgets loading in
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.15,
        },
    },
};

// each child slides up and fades in with scale
const itemVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: m3Ease },
    },
};

// skeleton loading shimmer block
function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-m3-surface-container rounded-m3-xl overflow-hidden ${className}`}>
            <div className="m3-shimmer h-full w-full" />
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();

    // this stores the user data from the backend
    const [userData, setUserData] = useState<{ username: string; name: string; balance: number; spending_profile: string | null; stress_level: number; wellness_score: number } | null>(null);

    // this tells the ai to rethink when data changes
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // this ensures the ui reflects the demo state instantly
    const fetchUserData = useCallback(() => {
        // get the token from localStorage
        const token = localStorage.getItem("token");

        // if there is no token, send them back to login
        if (!token) {
            router.push("/login");
            return;
        }

        // fetch the user data from the backend with the token
        fetch(`${API_URL}/api/user_data`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                // if we got an error, redirect to login
                if (data.error) {
                    router.push("/login");
                } else if (data.survey_completed === false) {
                    // redirect to survey if not completed yet
                    router.push("/survey");
                } else {
                    // save the user data to state
                    setUserData(data);
                }
            });
    }, [router]);

    // this fetches and shows the user data when the page loads
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // this triggers a refresh for both the history and the balance
    function handleTransactionComplete() {
        fetchUserData();
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <PageTransition>
            <main className="min-h-screen px-4 pt-16 pb-10 md:pl-[232px] md:pr-8 md:pt-6 overflow-y-auto">
                {/* show the user data once it loads */}
                <div className="flex flex-col items-center mt-4">
                    {userData ? (
                        // stagger all dashboard widgets in
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col items-center w-full max-w-2xl"
                        >
                            {/* welcome header card with animated balance counter */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                                className="w-full bg-m3-primary-container rounded-m3-xl p-6 text-center transition-shadow hover:shadow-m3-3"
                            >
                                {/* greeting with bounce entrance */}
                                <motion.h1
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                    className="text-m3-headline-medium text-m3-on-primary-container"
                                >
                                    Welcome, {userData.name}
                                </motion.h1>

                                {/* animated balance counter */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center justify-center gap-2 mt-2"
                                >
                                    <Wallet size={20} className="text-m3-on-primary-container/70" />
                                    <AnimatedCounter
                                        value={userData.balance}
                                        prefix="$"
                                        decimals={2}
                                        className="text-m3-title-large text-m3-on-primary-container/80"
                                    />
                                </motion.div>

                                {/* spending profile badge with scale entrance */}
                                {userData.spending_profile && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }}
                                        className="inline-block mt-2 px-3 py-1 rounded-m3-full bg-m3-surface text-m3-on-surface text-m3-label-medium"
                                    >
                                        {userData.spending_profile}
                                    </motion.span>
                                )}

                                {/* animated wellness score aligned with UN SDG #3 */}
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.3 }}
                                    className="mt-3 flex items-center justify-center gap-2"
                                    title="Calculated using real-time stress data to align with UN SDG #3."
                                >
                                    <motion.span
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" as const }}
                                    >
                                        <Heart size={16} className="text-m3-on-primary-container/60" />
                                    </motion.span>
                                    <span className="text-m3-label-medium text-m3-on-primary-container/60">Wellness</span>
                                    <AnimatedCounter
                                        value={userData.wellness_score}
                                        suffix="%"
                                        decimals={0}
                                        className={`text-m3-title-large ${userData.wellness_score < 50 ? "text-m3-error" : "text-m3-on-primary-container"}`}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* ai insight card */}
                            <motion.div variants={itemVariants} className="w-full mt-5">
                                <AiInsight refreshTrigger={refreshTrigger} />
                            </motion.div>

                            {/* two-column grid for pulse check and shopping widget */}
                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 w-full">
                                <PulseCheck triggerRefresh={() => setRefreshTrigger(prev => prev + 1)} />
                                <ShoppingWidget refreshData={handleTransactionComplete} />
                            </motion.div>

                            {/* mainframe terminal */}
                            <motion.div variants={itemVariants} className="w-full mt-5">
                                <MainframeLog refreshTrigger={refreshTrigger} />
                            </motion.div>

                            {/* transaction history ledger */}
                            <motion.div variants={itemVariants} className="w-full mt-5">
                                <HistoryLog refreshTrigger={refreshTrigger} />
                            </motion.div>
                        </motion.div>
                    ) : (
                        // skeleton loading state with shimmer
                        <div className="flex flex-col items-center w-full max-w-2xl gap-5 mt-4">
                            <SkeletonCard className="w-full h-44" />
                            <SkeletonCard className="w-full h-24" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                <SkeletonCard className="h-40" />
                                <SkeletonCard className="h-40" />
                            </div>
                            <SkeletonCard className="w-full h-32" />
                            <SkeletonCard className="w-full h-28" />
                        </div>
                    )}
                </div>
            </main>
        </PageTransition>
    );
}
