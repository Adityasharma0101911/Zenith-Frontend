// material design 3 registration page
"use client";

// import useState to track form inputs
import { useState } from "react";

// import useRouter to redirect after registering
import { useRouter } from "next/navigation";

// import Link for the login link
import Link from "next/link";

// import motion for entrance animation
import { motion } from "framer-motion";

// import loader icon for the trust theater spinning effect
import { Loader2 } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

export default function RegisterPage() {
    // these store the username and password the user types
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // this tracks the loading state for the trust theater animation
    const [loading, setLoading] = useState(false);

    // this changes text during the simulated key generation delay
    const [buttonText, setButtonText] = useState("Create Account");

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
            // wait 1.5 seconds to simulate key generation
            setTimeout(() => {
                // registration worked so redirect to login
                router.push("/login");
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
        <main className="min-h-screen flex items-center justify-center px-6">
            {/* material card container with entrance animation */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-sm"
            >
                {/* material card surface */}
                <div className="bg-m3-surface-container-low rounded-m3-xl p-8 shadow-m3-2">
                    {/* page title */}
                    <h1 className="text-2xl font-semibold text-m3-on-surface text-center">
                        Create your vault
                    </h1>
                    <p className="text-sm text-m3-on-surface-variant text-center mt-1">
                        Set up your Zenith guardian account
                    </p>

                    {/* registration form */}
                    <form onSubmit={handleRegister} className="flex flex-col gap-5 mt-8">
                        {/* material outlined text field for username */}
                        <div className="relative">
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
                        </div>

                        {/* material outlined text field for password */}
                        <div className="relative">
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
                        </div>

                        {/* material filled button with trust theater */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.95 }}
                            className="m3-btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {/* show spinner when loading */}
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {buttonText}
                        </motion.button>
                    </form>

                    {/* link to login page */}
                    <p className="text-center text-sm text-m3-on-surface-variant mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-m3-primary font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
