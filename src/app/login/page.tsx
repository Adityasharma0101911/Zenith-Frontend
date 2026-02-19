// material design 3 login page
"use client";

// import useState to track form inputs
import { useState } from "react";

// import useRouter to redirect after login
import { useRouter } from "next/navigation";

// import motion for entrance animation
import { motion } from "framer-motion";

// import loader icon for the trust theater spinning effect
import { Loader2 } from "lucide-react";

// import Link for register link
import Link from "next/link";

// import the api url from our utils
import { API_URL } from "@/utils/api";

export default function LoginPage() {
    // these store the username and password the user types
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // this tracks the loading state for the trust theater animation
    const [loading, setLoading] = useState(false);

    // this changes text during the simulated encryption delay
    const [buttonText, setButtonText] = useState("Sign in");

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
                        Welcome back
                    </h1>
                    <p className="text-sm text-m3-on-surface-variant text-center mt-1">
                        Sign in to your Zenith vault
                    </p>

                    {/* login form */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-5 mt-8">
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

                    {/* link to register page */}
                    <p className="text-center text-sm text-m3-on-surface-variant mt-6">
                        New to Zenith?{" "}
                        <Link href="/register" className="text-m3-primary font-medium">
                            Create account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
