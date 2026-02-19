// this adds smooth fade-ins and pill styling to the auth forms
"use client";

// import useState to track form inputs
import { useState } from "react";

// import useRouter to redirect after registering
import { useRouter } from "next/navigation";

// import Link for the login link
import Link from "next/link";

// import motion for entrance animation
import { motion } from "framer-motion";

// import the api url from our utils
import { API_URL } from "@/utils/api";

export default function RegisterPage() {
    // these store the username and password the user types
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // this tracks the loading state for the encryption animation
    const [loading, setLoading] = useState(false);

    // this simulates enterprise encryption delays for the user experience
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
        <main className="min-h-screen flex items-center justify-center">
            {/* this wraps the form in a smooth entrance animation */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <form onSubmit={handleRegister} className="flex flex-col gap-4 w-80">
                    <h1 className="text-2xl font-bold text-center">Create Account</h1>

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

                    {/* create account button with dynamic text */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                        className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition-all duration-300 disabled:opacity-70"
                    >
                        {buttonText}
                    </motion.button>

                    {/* link to the login page */}
                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-zenith-teal underline">
                            Login
                        </Link>
                    </p>
                </form>
            </motion.div>
        </main>
    );
}
