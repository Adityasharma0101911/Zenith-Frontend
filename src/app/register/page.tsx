// material design 3 registration page with rich android-style animations
"use client";

// import useState to track form inputs
import { useState } from "react";

// import useRouter to redirect after registering
import { useRouter } from "next/navigation";

// import Link for the login link
import Link from "next/link";

// import motion for entrance and micro-interaction animations
import { motion, AnimatePresence } from "framer-motion";

// import icons for trust theater and visual feedback
import { Loader2, UserPlus, Sparkles } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

import PageTransition from "@/components/PageTransition";

import InteractiveCard from "@/components/InteractiveCard";
import MotionButton from "@/components/MotionButton";

// m3 standard easing
const m3Ease = [0.2, 0, 0, 1] as const;

// stagger container for form fields cascade
const formStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
};

const formItem = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: m3Ease } },
};

export default function RegisterPage() {
    // these store the username and password the user types
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // this tracks the loading state for the trust theater animation
    const [loading, setLoading] = useState(false);

    // this changes text during the simulated key generation delay
    const [buttonText, setButtonText] = useState("Create Account");

    // track success state for celebration animation
    const [success, setSuccess] = useState(false);

    // this sends the new user data to the backend
    async function handleRegister(e: React.FormEvent) {
        // stop the page from refreshing
        e.preventDefault();

        // start the loading animation
        setLoading(true);
        setButtonText("Generating Secure Keys...");

        // send a post request with the username and password
        const res = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        // parse the response from the backend
        const data = await res.json();

        if (data.message) {
            // save the token so the survey page can use it
            if (data.token) localStorage.setItem("token", data.token);
            setSuccess(true);
            setButtonText("Vault Created!");

            // redirect to the survey to complete profile
            setTimeout(() => {
                router.push("/survey");
            }, 1500);
        } else {
            // reset the button if registration failed
            setLoading(false);
            setButtonText("Create Account");

            // show an alert if something went wrong
            alert("Registration failed. Try a different username.");
        }
    }

    return (
        <PageTransition>
            <main className="min-h-screen flex items-center justify-center px-6">
                {/* material card container with scale + fade entrance */}
                <motion.div
                    initial={{ opacity: 0, y: 32, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: m3Ease }}
                    className="w-full max-w-sm"
                >
                    {/* material card surface with hover lift tracking */}
                    <InteractiveCard
                        className="bg-m3-surface-container-low p-8 shadow-m3-2"
                        glowColor="rgba(var(--m3-primary), 0.15)"
                    >
                        {/* user icon with bounce entrance */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.2 }}
                            className="w-16 h-16 rounded-m3-full bg-m3-tertiary-container flex items-center justify-center mx-auto mb-5"
                        >
                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        key="sparkle"
                                        initial={{ scale: 0, rotate: -90 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    >
                                        <Sparkles className="text-m3-on-tertiary-container" size={28} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="user"
                                        exit={{ scale: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <UserPlus className="text-m3-on-tertiary-container" size={28} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* page title with fade */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4, ease: m3Ease }}
                            className="text-m3-headline-small text-m3-on-surface text-center"
                        >
                            Create your vault
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="text-m3-body-medium text-m3-on-surface-variant text-center mt-1"
                        >
                            Set up your Zenith guardian account
                        </motion.p>

                        {/* registration form with staggered field entrances */}
                        <motion.form
                            onSubmit={handleRegister}
                            variants={formStagger}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col gap-5 mt-8"
                        >
                            {/* material outlined text field for username */}
                            <motion.div variants={formItem} className="relative">
                                <input
                                    type="text"
                                    placeholder=" "
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="m3-input-outlined peer"
                                    required
                                />
                                <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">
                                    Username
                                </label>
                            </motion.div>

                            {/* material outlined text field for password */}
                            <motion.div variants={formItem} className="relative">
                                <input
                                    type="password"
                                    placeholder=" "
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="m3-input-outlined peer"
                                    required
                                />
                                <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">
                                    Password
                                </label>
                            </motion.div>

                            {/* material filled button with spring hover + trust theater */}
                            <motion.div variants={formItem}>
                                <MotionButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {/* show spinner when loading */}
                                    <AnimatePresence mode="wait">
                                        {loading && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="mr-2"
                                            >
                                                <Loader2 size={18} className="animate-spin" />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {buttonText}
                                </MotionButton>
                            </motion.div>
                        </motion.form>

                        {/* link to login page */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                            className="text-center text-m3-body-medium text-m3-on-surface-variant mt-6"
                        >
                            Already have an account?{" "}
                            <Link href="/login" className="text-m3-primary font-medium hover:underline">
                                Sign in
                            </Link>
                        </motion.p>
                    </InteractiveCard>
                </motion.div>
            </main>
        </PageTransition>
    );
}
