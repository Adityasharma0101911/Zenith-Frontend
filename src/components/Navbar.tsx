// material design 3 navigation bar
"use client";

// import the icons from lucide-react
import { Home, LayoutDashboard, User, Terminal } from "lucide-react";

// import motion for hover animations
import { motion } from "framer-motion";

// import Link and usePathname for active state
import Link from "next/link";
import { usePathname } from "next/navigation";

// import toast for smooth notifications
import toast from "react-hot-toast";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// import the sdg badge
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
            toast.success("Enterprise Sandbox Activated");
            setTimeout(() => window.location.reload(), 500);
        }
    } catch {
        toast.error("Could not activate demo mode");
    }
}

// nav item with m3 pill-shaped active indicator
function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center gap-1 relative"
            >
                {/* m3 pill-shaped active indicator behind icon */}
                <div className={`p-2 rounded-m3-full transition-colors duration-200 ${
                    isActive
                        ? "bg-m3-secondary-container text-m3-on-secondary-container"
                        : "text-m3-on-surface-variant hover:text-m3-on-surface"
                }`}>
                    <Icon size={20} />
                </div>
                <span className={`text-xs font-medium ${
                    isActive ? "text-m3-on-surface" : "text-m3-on-surface-variant"
                }`}>{label}</span>
            </motion.div>
        </Link>
    );
}

export default function Navbar() {
    return (
        <>
            {/* mobile navbar - m3 navigation bar at bottom */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                <div className="flex items-center justify-around px-4 py-2 bg-m3-surface-container/95 backdrop-blur-lg border-t border-m3-outline-variant/30">
                    <NavItem href="/" icon={Home} label="Home" />
                    <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem href="/login" icon={User} label="Account" />
                </div>

                {/* hidden demo button for mobile */}
                <button
                    onClick={handleDemoMode}
                    className="absolute -top-8 right-2 bg-m3-surface-container-highest text-m3-on-surface-variant text-xs px-2 py-1 rounded-m3-sm flex items-center gap-1 hover:bg-m3-surface-container-high transition-colors"
                >
                    <Terminal size={12} />
                    Dev
                </button>
            </nav>

            {/* desktop navbar - m3 surface at top */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
                <div className="flex items-center gap-6 px-8 py-2.5 bg-m3-surface-container/95 backdrop-blur-lg rounded-m3-full shadow-m3-2 border border-m3-outline-variant/20">

                    {/* brand name */}
                    <span className="text-lg font-semibold text-m3-primary mr-1">Zenith</span>

                    <NavItem href="/" icon={Home} label="Home" />
                    <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                    {/* sdg badge in the center on desktop */}
                    <div className="hidden md:flex">
                        <SdgBadge />
                    </div>

                    <NavItem href="/login" icon={User} label="Account" />

                    {/* hidden demo button */}
                    <button
                        onClick={handleDemoMode}
                        className="bg-m3-surface-container-highest text-m3-on-surface-variant text-xs px-2.5 py-1 rounded-m3-sm flex items-center gap-1 hover:bg-m3-surface-container-high transition-colors"
                    >
                        <Terminal size={12} />
                        Dev
                    </button>
                </div>
            </nav>
        </>
    );
}
