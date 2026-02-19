// this is the onboarding survey page
"use client";

// import useState to track form data
import { useState } from "react";

// import useRouter to redirect after finishing
import { useRouter } from "next/navigation";

// import motion for step transitions
import { motion, AnimatePresence } from "framer-motion";

// import the api url from our utils
import { API_URL } from "@/utils/api";

export default function OnboardingPage() {
    // this holds the current step number
    const [step, setStep] = useState(1);

    // this stores the user name from step 1
    const [name, setName] = useState("");

    // this stores the spending profile from step 2
    const [spendingProfile, setSpendingProfile] = useState("");

    // this stores the bank balance from step 3
    const [balance, setBalance] = useState("");

    const router = useRouter();

    // this sets the spending profile and moves to the next step
    function selectProfile(type: string) {
        setSpendingProfile(type);
        setStep(3);
    }

    // this sends the final data and finishes the onboarding
    async function handleFinish() {
        // get the token from localStorage
        const token = localStorage.getItem("token");

        // send a post request with all the collected data and the token
        await fetch(`${API_URL}/api/onboarding`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                spending_profile: spendingProfile,
                balance: parseFloat(balance),
            }),
        });

        // redirect to the dashboard after saving
        router.push("/dashboard");
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col gap-4 w-80">
                <AnimatePresence mode="wait">

                    {/* step 1: ask for the user name */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            className="flex flex-col gap-4"
                        >
                            <h1 className="text-2xl font-bold text-center">What is your name?</h1>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border border-gray-300 rounded-full p-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
                            />
                            {/* this button moves to step 2 */}
                            <motion.button
                                onClick={() => setStep(2)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                            >
                                Next
                            </motion.button>
                        </motion.div>
                    )}

                    {/* step 2: pick the spending profile */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            className="flex flex-col gap-4"
                        >
                            <h1 className="text-2xl font-bold text-center">Your Spending Style</h1>
                            <p className="text-sm text-gray-500 text-center">This helps Zenith protect you better</p>
                            {/* these buttons set the spending profile and go to step 3 */}
                            <motion.button
                                onClick={() => selectProfile("Cautious Saver")}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                            >
                                Cautious Saver
                            </motion.button>
                            <motion.button
                                onClick={() => selectProfile("Balanced Planner")}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                            >
                                Balanced Planner
                            </motion.button>
                            <motion.button
                                onClick={() => selectProfile("Impulse Spender")}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                            >
                                Impulse Spender
                            </motion.button>
                        </motion.div>
                    )}

                    {/* step 3: enter balance and finish */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            className="flex flex-col gap-4"
                        >
                            <h1 className="text-2xl font-bold text-center">Current Bank Balance</h1>
                            <input
                                type="number"
                                placeholder="Enter your balance"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                className="border border-gray-300 rounded-full p-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
                            />
                            {/* this sends the final data and finishes the onboarding */}
                            <motion.button
                                onClick={handleFinish}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                            >
                                Finish
                            </motion.button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </main>
    );
}
