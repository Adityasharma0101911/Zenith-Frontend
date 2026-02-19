// this creates the login form layout
"use client";

// import useState to track form inputs
import { useState } from "react";

// import useRouter to redirect after login
import { useRouter } from "next/navigation";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// import Link for the login link
import Link from "next/link";

export default function LoginPage() {
    // these store the username and password the user types
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // this sends login info to the backend
    async function handleLogin(e: React.FormEvent) {
        // stop the page from refreshing
        e.preventDefault();

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

            // redirect to the dashboard page
            router.push("/dashboard");
        } else {
            // show an alert if login failed
            alert("Login failed. Check your username and password.");
        }
    }

    return (
        <main className="min-h-screen bg-white flex items-center justify-center">
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
                <h1 className="text-2xl font-bold text-center">Login</h1>

                {/* username input */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-zenith-teal"
                />

                {/* password input */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-zenith-teal"
                />

                {/* login button */}
                <button
                    type="submit"
                    className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                >
                    Login
                </button>
                {/* link to the register page */}
                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-zenith-teal underline">
                        Sign Up
                    </Link>
                </p>
            </form>
        </main>
    );
}
