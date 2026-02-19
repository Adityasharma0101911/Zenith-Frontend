// this protects the page from logged out users
"use client";

// import useEffect to run code when the page loads
import { useEffect } from "react";

// import useRouter to redirect if not logged in
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    // check if the user is logged in when the page loads
    useEffect(() => {
        // get the user id from localStorage
        const userId = localStorage.getItem("user_id");

        // if there is no user id, send them back to login
        if (!userId) {
            router.push("/login");
        }
    }, [router]);

    return (
        <main className="min-h-screen bg-white flex items-center justify-center">
            <h1 className="text-4xl font-bold">Welcome to Zenith</h1>
        </main>
    );
}
