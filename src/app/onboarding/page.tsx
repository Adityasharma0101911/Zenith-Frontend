// material design 3 onboarding wizard
"use client";

// import useState to track form data
import { useState } from "react";

// import useRouter to redirect after finishing
import { useRouter } from "next/navigation";

// import motion for step transitions
import { motion, AnimatePresence } from "framer-motion";

// import icons for the spending profile cards
import { ShieldCheck, Scale, Zap } from "lucide-react";

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

    // spending profiles data for the selection cards
    const profiles = [
        {
            label: "Cautious Saver",
            description: "You think twice before every purchase",
            icon: ShieldCheck,
            color: "bg-m3-primary-container text-m3-on-primary-container",
        },
        {
            label: "Balanced Planner",
            description: "You budget wisely and stick to plans",
            icon: Scale,
            color: "bg-m3-secondary-container text-m3-on-secondary-container",
        },
        {
            label: "Impulse Spender",
            description: "You buy now and think later",
            icon: Zap,
            color: "bg-m3-tertiary-container text-m3-on-tertiary-container",
        },
    ];

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                {/* step indicator dots */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3].map((s) => (
                        <motion.div
                            key={s}
                            animate={{
                                width: step === s ? 24 : 8,
                                backgroundColor: step === s ? "#006B5E" : "#C4C7C5",
                            }}
                            className="h-2 rounded-full"
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    ))}
                </div>

                {/* material card surface */}
                <div className="bg-m3-surface-container-low rounded-m3-xl p-8 shadow-m3-2">
                    <AnimatePresence mode="wait">

                        {/* step 1: ask for the user name */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex flex-col gap-5"
                            >
                                <div className="text-center">
                                    <h1 className="text-2xl font-semibold text-m3-on-surface">
                                        What is your name?
                                    </h1>
                                    <p className="text-sm text-m3-on-surface-variant mt-1">
                                        We&apos;ll personalize your experience
                                    </p>
                                </div>

                                {/* material outlined text field */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder=" "
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="m3-input-outlined peer"
                                        required
                                    />
                                    <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">
                                        Your name
                                    </label>
                                </div>

                                {/* next button */}
                                <motion.button
                                    onClick={() => setStep(2)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="m3-btn-filled w-full"
                                >
                                    Continue
                                </motion.button>
                            </motion.div>
                        )}

                        {/* step 2: pick the spending profile */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex flex-col gap-4"
                            >
                                <div className="text-center">
                                    <h1 className="text-2xl font-semibold text-m3-on-surface">
                                        Your Spending Style
                                    </h1>
                                    <p className="text-sm text-m3-on-surface-variant mt-1">
                                        This helps Zenith protect you better
                                    </p>
                                </div>

                                {/* spending profile tonal cards */}
                                {profiles.map((p) => (
                                    <motion.button
                                        key={p.label}
                                        onClick={() => selectProfile(p.label)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.96 }}
                                        className={`${p.color} rounded-m3-lg p-4 flex items-center gap-4 text-left transition-all duration-200`}
                                    >
                                        <p.icon size={24} />
                                        <div>
                                            <p className="font-medium text-sm">{p.label}</p>
                                            <p className="text-xs opacity-80">{p.description}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}

                        {/* step 3: enter balance and finish */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex flex-col gap-5"
                            >
                                <div className="text-center">
                                    <h1 className="text-2xl font-semibold text-m3-on-surface">
                                        Current Balance
                                    </h1>
                                    <p className="text-sm text-m3-on-surface-variant mt-1">
                                        Enter your bank balance to start tracking
                                    </p>
                                </div>

                                {/* material outlined text field for balance */}
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder=" "
                                        value={balance}
                                        onChange={(e) => setBalance(e.target.value)}
                                        className="m3-input-outlined peer"
                                        required
                                    />
                                    <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">
                                        Balance ($)
                                    </label>
                                </div>

                                {/* finish button */}
                                <motion.button
                                    onClick={handleFinish}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="m3-btn-filled w-full"
                                >
                                    Launch Zenith
                                </motion.button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
