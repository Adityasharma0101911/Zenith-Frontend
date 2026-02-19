// material design 3 login page with rich android-style animations
"use client";

// import useState to track form inputs
import { useState } from "react";

// import useRouter to redirect after login
import { useRouter } from "next/navigation";

// import motion for entrance and micro-interaction animations
import { motion, AnimatePresence } from "framer-motion";

// import icons for trust theater and visual feedback
import { Loader2, Lock, ShieldCheck } from "lucide-react";

// import Link for register link
import Link from "next/link";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// import page transition wrapper
import PageTransition from "@/components/PageTransition";

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

export default function LoginPage() {
    // these store the username and password the user types
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // this tracks the loading state for the trust theater animation
    const [loading, setLoading] = useState(false);

    // this changes text during the simulated encryption delay
    const [buttonText, setButtonText] = useState("Sign in");

    // track success state for celebration animation
    const [success, setSuccess] = useState(false);

    // this sends login info to the backend
    async function handleLogin(e: React.FormEvent) {
        // stop the page from refreshing
        e.preventDefault();

        // start the loading animation
        setLoading(true);
        setButtonText("Authenticating...");

        // send a post request with the username and password
        const res = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        // parse the response from the backend
        const data = await res.json();

        if (data.success) {
            // save the secure token to the browser
            localStorage.setItem("token", data.token);

            // simulate decrypting the vault before redirecting
            setButtonText("Decrypting Vault...");
            setSuccess(true);

            // wait 1.5 seconds to simulate enterprise encryption
            setTimeout(() => {
                // redirect to the dashboard page
                router.push("/dashboard");
            }, 1500);
        } else {
            // reset the button if login failed
            setLoading(false);
            setButtonText("Sign in");

            // show an alert if login failed
            alert("Login failed. Check your username and password.");
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
                    {/* material card surface with hover lift */}
                    <motion.div
                        whileHover={{ y: -2, boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}
                        transition={{ duration: 0.25, ease: m3Ease }}
                        className="bg-m3-surface-container-low rounded-m3-xl p-8 shadow-m3-2"
                    >
                        {/* lock icon with bounce entrance */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.2 }}
                            className="w-16 h-16 rounded-m3-full bg-m3-primary-container flex items-center justify-center mx-auto mb-5"
                        >
                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        key="check"
                                        initial={{ scale: 0, rotate: -90 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    >
                                        <ShieldCheck className="text-m3-on-primary-container" size={28} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="lock"
                                        exit={{ scale: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Lock className="text-m3-on-primary-container" size={28} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* page title with fade */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4, ease: m3Ease }}
                            className="text-2xl font-semibold text-m3-on-surface text-center"
                        >
                            Welcome back
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="text-sm text-m3-on-surface-variant text-center mt-1"
                        >
                            Sign in to your Zenith vault
                        </motion.p>

                        {/* login form with staggered field entrances */}
                        <motion.form
                            onSubmit={handleLogin}
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
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -1 }}
                                    whileTap={{ scale: loading ? 1 : 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="m3-btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {/* show spinner when loading */}
                                    <AnimatePresence mode="wait">
                                        {loading && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Loader2 size={18} className="animate-spin" />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {buttonText}
                                </motion.button>
                            </motion.div>
                        </motion.form>

                        {/* link to register page */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                            className="text-center text-sm text-m3-on-surface-variant mt-6"
                        >
                            New to Zenith?{" "}
                            <Link href="/register" className="text-m3-primary font-medium hover:underline">
                                Create account
                            </Link>
                        </motion.p>
                    </motion.div>
                </motion.div>
            </main>
        </PageTransition>
    );
}
