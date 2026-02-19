// material design 3 onboarding wizard with rich android-style animations
"use client";

// import useState to track form data
import { useState } from "react";

// import useRouter to redirect after finishing
import { useRouter } from "next/navigation";

// import motion for step transitions and micro-interactions
import { motion, AnimatePresence } from "framer-motion";

// import icons for the spending profile cards
import { ShieldCheck, Scale, Zap, Rocket, ChevronRight } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// import page transition wrapper
import PageTransition from "@/components/PageTransition";

// m3 standard easing
const m3Ease = [0.2, 0, 0, 1] as const;

// stagger container for cascading children inside each step
const stepStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
    exit: { opacity: 0 },
};

const stepItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: m3Ease } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export default function OnboardingPage() {
    // this holds the current step number
    const [step, setStep] = useState(1);

    // this stores the user name from step 1
    const [name, setName] = useState("");

    // this stores the spending profile from step 2
    const [spendingProfile, setSpendingProfile] = useState("");

    // this stores the bank balance from step 3
    const [balance, setBalance] = useState("");

    // track launching state for celebration animation
    const [launching, setLaunching] = useState(false);

    const router = useRouter();

    // this sets the spending profile and moves to the next step
    function selectProfile(type: string) {
        setSpendingProfile(type);
        setStep(3);
    }

    // this sends the final data and finishes the onboarding
    async function handleFinish() {
        setLaunching(true);

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

        // wait a moment for celebration animation
        setTimeout(() => {
            // redirect to the dashboard after saving
            router.push("/dashboard");
        }, 1200);
    }

    // spending profiles data for the selection cards
    const profiles = [
        {
            label: "Cautious Saver",
            description: "You think twice before every purchase",
            icon: ShieldCheck,
            color: "bg-m3-primary-container text-m3-on-primary-container",
            ring: "ring-m3-primary",
        },
        {
            label: "Balanced Planner",
            description: "You budget wisely and stick to plans",
            icon: Scale,
            color: "bg-m3-secondary-container text-m3-on-secondary-container",
            ring: "ring-m3-secondary",
        },
        {
            label: "Impulse Spender",
            description: "You buy now and think later",
            icon: Zap,
            color: "bg-m3-tertiary-container text-m3-on-tertiary-container",
            ring: "ring-m3-tertiary",
        },
    ];

    return (
        <PageTransition>
            <main className="min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-sm">
                    {/* animated step indicator dots */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {[1, 2, 3].map((s) => (
                            <motion.div
                                key={s}
                                animate={{
                                    width: step === s ? 28 : 10,
                                    height: 10,
                                    borderRadius: 999,
                                }}
                                className={step >= s ? "bg-m3-primary" : "bg-m3-outline-variant"}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                        ))}
                    </div>

                    {/* material card surface with hover lift */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, ease: m3Ease }}
                        className="bg-m3-surface-container-low rounded-m3-xl p-8 shadow-m3-2"
                    >
                        <AnimatePresence mode="wait">

                            {/* step 1: ask for the user name */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={stepStagger}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="flex flex-col gap-5"
                                >
                                    <motion.div variants={stepItem} className="text-center">
                                        <h1 className="text-m3-headline-small text-m3-on-surface">
                                            What is your name?
                                        </h1>
                                        <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">
                                            We&apos;ll personalize your experience
                                        </p>
                                    </motion.div>

                                    {/* material outlined text field */}
                                    <motion.div variants={stepItem} className="relative">
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
                                    </motion.div>

                                    {/* next button with spring hover */}
                                    <motion.div variants={stepItem}>
                                        <motion.button
                                            onClick={() => setStep(2)}
                                            whileHover={{ scale: 1.03, y: -1 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            className="m3-btn-filled w-full flex items-center justify-center gap-1"
                                        >
                                            Continue
                                            <ChevronRight size={18} />
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* step 2: pick the spending profile */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    variants={stepStagger}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="flex flex-col gap-4"
                                >
                                    <motion.div variants={stepItem} className="text-center">
                                        <h1 className="text-m3-headline-small text-m3-on-surface">
                                            Your Spending Style
                                        </h1>
                                        <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">
                                            This helps Zenith protect you better
                                        </p>
                                    </motion.div>

                                    {/* spending profile tonal cards with staggered spring bounce */}
                                    {profiles.map((p, i) => (
                                        <motion.button
                                            key={p.label}
                                            variants={stepItem}
                                            whileHover={{
                                                scale: 1.03,
                                                y: -4,
                                                transition: { type: "spring", stiffness: 300, damping: 20 },
                                            }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => selectProfile(p.label)}
                                            className={`${p.color} rounded-m3-lg p-4 flex items-center gap-4 text-left transition-shadow duration-200 hover:shadow-m3-2`}
                                        >
                                            {/* icon with individual spring entrance */}
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 260,
                                                    damping: 12,
                                                    delay: 0.3 + i * 0.1,
                                                }}
                                            >
                                                <p.icon size={24} />
                                            </motion.div>
                                            <div className="flex-1">
                                                <p className="text-m3-label-large">{p.label}</p>
                                                <p className="text-m3-body-small opacity-80">{p.description}</p>
                                            </div>
                                            <ChevronRight size={16} className="opacity-50" />
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}

                            {/* step 3: enter balance and finish */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    variants={stepStagger}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="flex flex-col gap-5"
                                >
                                    <motion.div variants={stepItem} className="text-center">
                                        <h1 className="text-m3-headline-small text-m3-on-surface">
                                            Current Balance
                                        </h1>
                                        <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">
                                            Enter your bank balance to start tracking
                                        </p>
                                    </motion.div>

                                    {/* material outlined text field for balance */}
                                    <motion.div variants={stepItem} className="relative">
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
                                    </motion.div>

                                    {/* launch button with celebration effect */}
                                    <motion.div variants={stepItem}>
                                        <motion.button
                                            onClick={handleFinish}
                                            disabled={launching}
                                            whileHover={{ scale: launching ? 1 : 1.03, y: launching ? 0 : -1 }}
                                            whileTap={{ scale: launching ? 1 : 0.95 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            className="m3-btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-80"
                                        >
                                            <AnimatePresence mode="wait">
                                                {launching ? (
                                                    <motion.span
                                                        key="launching"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <motion.span
                                                            animate={{ y: [0, -4, 0] }}
                                                            transition={{ repeat: Infinity, duration: 0.6 }}
                                                        >
                                                            <Rocket size={18} />
                                                        </motion.span>
                                                        Launching Zenith...
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="ready"
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                    >
                                                        Launch Zenith
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>
        </PageTransition>
    );
}
