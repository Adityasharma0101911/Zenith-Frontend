// this creates the registration form layout
"use client";

// import useState to track form inputs
import { useState } from "react";

// import useRouter to redirect after registering
import { useRouter } from "next/navigation";

// import Link for the login link
import Link from "next/link";

// import the api url from our utils
import { API_URL } from "@/utils/api";

export default function RegisterPage() {
    // these store the username and password the user types
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // this sends the new user data to the backend
    async function handleRegister(e: React.FormEvent) {
        // stop the page from refreshing
        e.preventDefault();

        // send a post request with the username and password
        const res = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        // parse the response from the backend
        const data = await res.json();

        if (data.message) {
            // registration worked so redirect to login
            router.push("/login");
        } else {
            // show an alert if something went wrong
            alert("Registration failed. Try a different username.");
        }
    }

    return (
        <main className="min-h-screen bg-white flex items-center justify-center">
            <form onSubmit={handleRegister} className="flex flex-col gap-4 w-80">
                <h1 className="text-2xl font-bold text-center">Create Account</h1>

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

                {/* create account button */}
                <button
                    type="submit"
                    className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                >
                    Create Account
                </button>

                {/* link to the login page */}
                <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-zenith-teal underline">
                        Login
                    </Link>
                </p>
            </form>
        </main>
    );
}
