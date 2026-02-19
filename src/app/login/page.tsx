// this adds smooth fade-ins and pill styling to the auth forms
"use client";

// import useState to track form inputs
import { useState } from "react";

// import useRouter to redirect after login
import { useRouter } from "next/navigation";

// import motion for entrance animation
import { motion } from "framer-motion";

// import the api url from our utils
import { API_URL } from "@/utils/api";

export default function LoginPage() {
    // these store the username and password the user types
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // this tracks the loading state for the encryption animation
    const [loading, setLoading] = useState(false);

    // this simulates enterprise encryption delays for the user experience
    const [buttonText, setButtonText] = useState("Login");

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
            // this saves the secure token to the browser
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
            setButtonText("Login");

            // show an alert if login failed
            alert("Login failed. Check your username and password.");
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            {/* this wraps the form in a smooth entrance animation */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
                    <h1 className="text-2xl font-bold text-center">Login</h1>

                    {/* username input with pill shape */}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-300 rounded-full p-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
                    />

                    {/* password input with pill shape */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded-full p-4 w-full focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
                    />

                    {/* login button with dynamic text */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                        className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition-all duration-300 disabled:opacity-70"
                    >
                        {buttonText}
                    </motion.button>
                </form>
            </motion.div>
        </main>
    );
}
