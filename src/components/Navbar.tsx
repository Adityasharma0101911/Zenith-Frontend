// this creates the floating glassmorphism navbar
"use client";

// import the icons from lucide-react
import { Home, LayoutDashboard, User, Terminal } from "lucide-react";

// import motion for hover animations
import { motion } from "framer-motion";

// import Link for navigation
import Link from "next/link";

// import toast for smooth notifications
import toast from "react-hot-toast";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// this displays the sdg badge at the top
import SdgBadge from "@/components/SdgBadge";

// this triggers the database overwrite for the presentation
async function handleDemoMode() {
    // get the token from localStorage
    const token = localStorage.getItem("token");

    // try to activate demo mode
    try {
        const res = await fetch(`${API_URL}/api/demo_mode`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (data.message) {
            // show a smooth toast instead of an ugly alert
            toast.success("Enterprise Sandbox Activated");

            // reload the page so all widgets catch the new state
            setTimeout(() => window.location.reload(), 500);
        }
    } catch {
        toast.error("Could not activate demo mode");
    }
}

export default function Navbar() {
    return (
        <>
            {/* mobile navbar - fixed at the bottom of the screen */}
            <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden">
                {/* glassmorphism container */}
                <div className="flex items-center gap-6 px-8 py-3 backdrop-blur-md bg-white/70 rounded-full shadow-lg border border-white/50">

                    {/* home icon with hover scale */}
                    <Link href="/">
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-600 hover:text-zenith-teal transition-colors">
                            <Home size={22} />
                        </motion.div>
                    </Link>

                    {/* dashboard icon with hover scale */}
                    <Link href="/dashboard">
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-600 hover:text-zenith-teal transition-colors">
                            <LayoutDashboard size={22} />
                        </motion.div>
                    </Link>

                    {/* profile icon with hover scale */}
                    <Link href="/login">
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-600 hover:text-zenith-teal transition-colors">
                            <User size={22} />
                        </motion.div>
                    </Link>
                </div>

                {/* this creates the hidden demo button for mobile */}
                <button
                    onClick={handleDemoMode}
                    className="absolute -top-8 right-0 bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:bg-gray-300 transition-colors"
                >
                    <Terminal size={12} />
                    Dev
                </button>
            </nav>

            {/* desktop navbar - fixed at the top of the screen */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
                {/* glassmorphism container */}
                <div className="flex items-center gap-8 px-10 py-3 backdrop-blur-md bg-white/70 rounded-full shadow-lg border border-white/50">

                    {/* app name */}
                    <span className="text-lg font-bold text-zenith-teal mr-2">Zenith</span>

                    {/* home icon with hover scale */}
                    <Link href="/">
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="flex items-center gap-2 p-2 text-gray-600 hover:text-zenith-teal transition-colors">
                            <Home size={20} />
                            <span className="text-sm">Home</span>
                        </motion.div>
                    </Link>

                    {/* dashboard icon with hover scale */}
                    <Link href="/dashboard">
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="flex items-center gap-2 p-2 text-gray-600 hover:text-zenith-teal transition-colors">
                            <LayoutDashboard size={20} />
                            <span className="text-sm">Dashboard</span>
                        </motion.div>
                    </Link>

                    {/* this displays the sdg badge in the center on desktop */}
                    <div className="hidden md:flex">
                        <SdgBadge />
                    </div>

                    {/* profile icon with hover scale */}
                    <Link href="/login">
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="flex items-center gap-2 p-2 text-gray-600 hover:text-zenith-teal transition-colors">
                            <User size={20} />
                            <span className="text-sm">Account</span>
                        </motion.div>
                    </Link>

                    {/* this creates the hidden demo button */}
                    <button
                        onClick={handleDemoMode}
                        className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full flex items-center gap-1 hover:bg-gray-300 transition-colors"
                    >
                        <Terminal size={12} />
                        Dev Mode
                    </button>
                </div>
            </nav>
        </>
    );
}
