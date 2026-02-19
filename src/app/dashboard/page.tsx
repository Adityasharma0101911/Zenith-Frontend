// material design 3 dashboard with stagger animations
"use client";

// import useEffect and useState to run code when the page loads
import { useEffect, useState, useCallback } from "react";

// import useRouter to redirect if not logged in
import { useRouter } from "next/navigation";

// import motion for stagger animations
import { motion } from "framer-motion";

// import icons for the wellness score and logout
import { LogOut, Heart } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// import all dashboard widgets
import ShoppingWidget from "@/components/ShoppingWidget";
import PulseCheck from "@/components/PulseCheck";
import AiInsight from "@/components/AiInsight";
import HistoryLog from "@/components/HistoryLog";
import MainframeLog from "@/components/MainframeLog";

// this staggers the dashboard widgets loading in
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
    },
};

// each child slides up and fades in
const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

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

    // this logs the user out by deleting their token
    function handleLogout() {
        // remove the token from localStorage
        localStorage.removeItem("token");

        // redirect back to the login page
        router.push("/login");
    }

    // this triggers a refresh for both the history and the balance
    function handleTransactionComplete() {
        fetchUserData();
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <main className="min-h-screen px-4 pt-20 pb-28 md:px-8">
            {/* top bar with logout */}
            <div className="flex justify-end max-w-2xl mx-auto">
                <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-m3-full bg-m3-error-container text-m3-on-error-container text-sm font-medium transition-colors"
                >
                    <LogOut size={16} />
                    Logout
                </motion.button>
            </div>

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
                        {/* welcome header card */}
                        <motion.div
                            variants={itemVariants}
                            className="w-full bg-m3-primary-container rounded-m3-xl p-6 text-center"
                        >
                            <h1 className="text-3xl font-semibold text-m3-on-primary-container">
                                Welcome, {userData.name}
                            </h1>
                            <p className="text-xl mt-2 text-m3-on-primary-container/80 font-medium">
                                ${userData.balance.toFixed(2)}
                            </p>
                            {userData.spending_profile && (
                                <span className="inline-block mt-2 px-3 py-1 rounded-m3-full bg-m3-surface text-m3-on-surface text-xs font-medium">
                                    {userData.spending_profile}
                                </span>
                            )}

                            {/* wellness score aligned with UN SDG #3 */}
                            <div
                                className="mt-3 flex items-center justify-center gap-2"
                                title="Calculated using real-time stress data to align with UN SDG #3."
                            >
                                <Heart size={16} className="text-m3-on-primary-container/60" />
                                <span className="text-sm text-m3-on-primary-container/60">Wellness</span>
                                <span className={`text-xl font-bold ${userData.wellness_score < 50 ? "text-m3-error" : "text-m3-on-primary-container"}`}>
                                    {userData.wellness_score}%
                                </span>
                            </div>
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
                    // loading state
                    <div className="flex flex-col items-center gap-3 mt-20">
                        <div className="w-10 h-10 border-3 border-m3-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-m3-on-surface-variant text-sm">Loading your vault...</p>
                    </div>
                )}
            </div>
        </main>
    );
}
