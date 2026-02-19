// this protects the page from logged out users
"use client";

// import useEffect and useState to run code when the page loads
import { useEffect, useState, useCallback } from "react";

// import useRouter to redirect if not logged in
import { useRouter } from "next/navigation";

// import motion for stagger animations
import { motion } from "framer-motion";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// this adds the store widget to the main dashboard
import ShoppingWidget from "@/components/ShoppingWidget";

// this puts the pulse check on the dashboard
import PulseCheck from "@/components/PulseCheck";

// this puts the ai brain at the top of the dashboard
import AiInsight from "@/components/AiInsight";

// this puts the ledger at the bottom of the dashboard
import HistoryLog from "@/components/HistoryLog";

// this puts the mainframe terminal on the dashboard
import MainframeLog from "@/components/MainframeLog";

// this staggers the dashboard widgets loading in
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

// each child slides up and fades in
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
    const router = useRouter();

    // this stores the user data from the backend
    const [userData, setUserData] = useState<{ username: string; balance: number; dosha: string | null; wellness_score: number } | null>(null);

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
        <main className="min-h-screen p-8 pt-20 pb-24">
            {/* logout button at the top right */}
            <div className="flex justify-end">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white rounded-full px-6 py-2 hover:opacity-90 transition-all duration-300"
                >
                    Logout
                </button>
            </div>

            {/* show the user data once it loads */}
            <div className="flex flex-col items-center mt-6">
                {userData ? (
                    // this staggers the dashboard widgets loading in
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-center w-full max-w-2xl"
                    >
                        {/* welcome text slides in first */}
                        <motion.div variants={itemVariants} className="text-center">
                            <h1 className="text-4xl font-bold">Welcome, {userData.username}</h1>
                            <p className="text-xl mt-4 text-gray-600">Balance: ${userData.balance.toFixed(2)}</p>
                            {userData.dosha && (
                                <p className="text-lg mt-2 text-gray-500">Dosha: {userData.dosha}</p>
                            )}

                            {/* this shows the wellness score on the dashboard */}
                            <div
                                className="mt-3 inline-block"
                                title="Calculated using real-time stress data to align with UN SDG #3."
                            >
                                <span className="text-sm text-gray-500 mr-2">Wellness Score:</span>
                                {/* this adds an explanation for the judges */}
                                <span className={`text-2xl font-bold ${userData.wellness_score < 50 ? "text-orange-500" : "text-zenith-teal"}`}>
                                    {userData.wellness_score}%
                                </span>
                            </div>
                        </motion.div>

                        {/* ai insight slides in second */}
                        <motion.div variants={itemVariants} className="w-full mt-8">
                            <AiInsight refreshTrigger={refreshTrigger} />
                        </motion.div>

                        {/* dashboard grid slides in third */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full">
                            {/* pulse check on the left, triggers ai update when stress changes */}
                            <PulseCheck triggerRefresh={() => setRefreshTrigger(prev => prev + 1)} />

                            {/* shopping widget on the right, pass refreshData to update balance and history */}
                            <ShoppingWidget refreshData={handleTransactionComplete} />
                        </motion.div>

                        {/* mainframe terminal slides in fourth */}
                        <motion.div variants={itemVariants} className="w-full mt-6">
                            <MainframeLog refreshTrigger={refreshTrigger} />
                        </motion.div>

                        {/* transaction ledger at the bottom, spans full width */}
                        <motion.div variants={itemVariants} className="w-full mt-6 col-span-1 md:col-span-2">
                            <HistoryLog refreshTrigger={refreshTrigger} />
                        </motion.div>
                    </motion.div>
                ) : (
                    <h1 className="text-4xl font-bold">Loading...</h1>
                )}
            </div>
        </main>
    );
}
