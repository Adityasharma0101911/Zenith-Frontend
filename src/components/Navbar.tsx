// this creates the floating glassmorphism navbar
"use client";

// import the icons from lucide-react
import { Home, LayoutDashboard, User } from "lucide-react";

// import motion for hover animations
import { motion } from "framer-motion";

// import Link for navigation
import Link from "next/link";

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
            </nav>

            {/* desktop navbar - fixed at the top of the screen */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
                {/* glassmorphism container */}
                <div className="flex items-center gap-8 px-10 py-3 backdrop-blur-md bg-white/70 rounded-full shadow-lg border border-white/50">

                    {/* app name */}
                    <span className="text-lg font-bold text-zenith-teal mr-4">Zenith</span>

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

                    {/* profile icon with hover scale */}
                    <Link href="/login">
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="flex items-center gap-2 p-2 text-gray-600 hover:text-zenith-teal transition-colors">
                            <User size={20} />
                            <span className="text-sm">Account</span>
                        </motion.div>
                    </Link>
                </div>
            </nav>
        </>
    );
}
