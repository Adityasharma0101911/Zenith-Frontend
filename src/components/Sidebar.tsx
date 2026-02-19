// collapsible left sidebar with m3 navigation rail
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
    LayoutDashboard,
    GraduationCap,
    Wallet,
    HeartPulse,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Terminal,
    ShoppingCart,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import SdgBadge from "@/components/SdgBadge";

const m3Ease = [0.2, 0, 0, 1] as const;

// pages where the sidebar should be hidden
const HIDDEN_PAGES = ["/", "/login", "/register", "/survey", "/onboarding"];

// nav items for the sidebar
const NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/scholar", icon: GraduationCap, label: "Scholar" },
    { href: "/guardian", icon: Wallet, label: "Guardian" },
    { href: "/guardian/purchases", icon: ShoppingCart, label: "Purchases" },
    { href: "/vitals", icon: HeartPulse, label: "Vitals" },
];

// triggers demo mode for presentations
async function handleDemoMode() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/api/demo_mode`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
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

// single nav item component
function SidebarItem({
    href,
    icon: Icon,
    label,
    expanded,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    expanded: boolean;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <motion.div
                whileHover={{ scale: 1.04, x: 2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-m3-lg transition-colors relative ${
                    isActive
                        ? "bg-m3-secondary-container text-m3-on-secondary-container"
                        : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"
                }`}
            >
                {/* active indicator bar */}
                {isActive && (
                    <motion.div
                        layoutId="sidebarActive"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-m3-primary rounded-r-full"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                )}
                <Icon size={20} className="shrink-0" />
                <AnimatePresence>
                    {expanded && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, ease: m3Ease }}
                            className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [expanded, setExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    // close mobile drawer on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // hide sidebar on auth/landing pages
    if (HIDDEN_PAGES.includes(pathname)) return null;

    // handles logout
    async function handleLogout() {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${API_URL}/api/logout`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch {
            // ignore if server is down
        }
        localStorage.removeItem("token");
        router.push("/login");
    }

    // the sidebar content (shared between mobile and desktop)
    const sidebarContent = (
        <div className="flex flex-col h-full py-4 px-3">
            {/* logo and collapse toggle */}
            <div className="flex items-center justify-between mb-6 px-1">
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image src="/zenith-logo.png" alt="Zenith" width={160} height={100} className="h-12 w-auto" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button
                    onClick={() => setExpanded(!expanded)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-m3-full hover:bg-m3-surface-container-high text-m3-on-surface-variant hidden md:flex"
                >
                    {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </motion.button>
            </div>

            {/* nav items */}
            <nav className="flex flex-col gap-1 flex-1">
                {NAV_ITEMS.map((item) => (
                    <SidebarItem key={item.href} {...item} expanded={expanded} />
                ))}
            </nav>

            {/* bottom section */}
            <div className="flex flex-col gap-2 mt-auto">
                {/* sdg badge when expanded */}
                {expanded && (
                    <div className="px-2 py-1">
                        <SdgBadge />
                    </div>
                )}

                {/* demo mode button */}
                <motion.button
                    onClick={handleDemoMode}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-m3-lg text-m3-on-surface-variant hover:bg-m3-surface-container-high transition-colors text-xs"
                >
                    <Terminal size={16} className="shrink-0" />
                    {expanded && <span>Dev Mode</span>}
                </motion.button>

                {/* logout button */}
                <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-m3-lg text-m3-error hover:bg-m3-error-container transition-colors"
                >
                    <LogOut size={20} className="shrink-0" />
                    <AnimatePresence>
                        {expanded && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );

    return (
        <>
            {/* mobile hamburger button */}
            <motion.button
                onClick={() => setMobileOpen(true)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-m3-full bg-m3-surface-container shadow-m3-2 text-m3-on-surface"
            >
                <Menu size={22} />
            </motion.button>

            {/* mobile drawer + scrim */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* dark scrim overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/40 z-50 md:hidden"
                        />
                        {/* slide-in drawer */}
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 w-[260px] bg-m3-surface-container-low z-50 md:hidden shadow-m3-4"
                        >
                            {/* close button */}
                            <motion.button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-3 p-1.5 rounded-m3-full hover:bg-m3-surface-container-high text-m3-on-surface-variant"
                            >
                                <X size={18} />
                            </motion.button>
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* desktop persistent sidebar */}
            <motion.aside
                animate={{ width: expanded ? 220 : 72 }}
                transition={{ duration: 0.25, ease: m3Ease }}
                className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex bg-m3-surface-container-low border-r border-m3-outline-variant/30"
            >
                {sidebarContent}
            </motion.aside>
        </>
    );
}
