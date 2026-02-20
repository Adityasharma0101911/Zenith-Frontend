// material design 3 navigation bar with gsap transitions
"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Home, LayoutDashboard, User, Terminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { API_URL } from "@/utils/api";
import SdgBadge from "@/components/SdgBadge";

async function handleDemoMode() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${API_URL}/api/demo_mode`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        if (data.message) { toast.success("Enterprise Sandbox Activated"); setTimeout(() => window.location.reload(), 500); }
    } catch { toast.error("Could not activate demo mode"); }
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    const ref = useRef<HTMLDivElement>(null);
    const pillRef = useRef<HTMLDivElement>(null);

    // hover + tap
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.08, duration: 0.2, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, duration: 0.2, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.92, duration: 0.1 });
        const up = () => gsap.to(el, { scale: 1.08, duration: 0.15, ease: "power3.out" });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave);
        el.addEventListener("mousedown", down); el.addEventListener("mouseup", up);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); el.removeEventListener("mouseup", up); };
    }, []);

    // pill entrance
    useEffect(() => {
        if (isActive && pillRef.current) {
            gsap.from(pillRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: "back.out(2)" });
        }
    }, [isActive]);

    return (
        <Link href={href}>
            <div ref={ref} className="flex flex-col items-center gap-1 relative">
                <div className="relative p-2">
                    {isActive && (
                        <div ref={pillRef} className="absolute inset-0 bg-m3-secondary-container rounded-m3-full" />
                    )}
                    <Icon size={20} className={`relative z-10 transition-colors duration-200 ${isActive ? "text-m3-on-secondary-container" : "text-m3-on-surface-variant"}`} />
                </div>
                <span className={`text-xs font-medium transition-colors duration-200 ${isActive ? "text-m3-on-surface" : "text-m3-on-surface-variant"}`}>{label}</span>
            </div>
        </Link>
    );
}

export default function Navbar() {
    const mobileRef = useRef<HTMLElement>(null);
    const desktopRef = useRef<HTMLElement>(null);
    const brandRef = useRef<HTMLSpanElement>(null);
    const desktopInner = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mobileRef.current) gsap.from(mobileRef.current, { y: 60, opacity: 0, duration: 0.5, delay: 0.3, ease: "power3.out" });
        if (desktopRef.current) gsap.from(desktopRef.current, { y: -40, opacity: 0, duration: 0.5, delay: 0.1, ease: "power3.out" });
        if (brandRef.current) gsap.from(brandRef.current, { opacity: 0, scale: 0.9, duration: 0.4, delay: 0.4, ease: "back.out(1.5)" });
    }, []);

    // desktop hover lift
    useEffect(() => {
        const el = desktopInner.current;
        if (!el) return;
        const enter = () => gsap.to(el, { y: -1, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", duration: 0.25, ease: "power3.out" });
        const leave = () => gsap.to(el, { y: 0, boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)", duration: 0.25, ease: "power3.out" });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
    }, []);

    return (
        <>
            <nav ref={mobileRef} className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                <div className="flex items-center justify-around px-4 py-2 bg-m3-surface-container/95 backdrop-blur-lg border-t border-m3-outline-variant/30">
                    <NavItem href="/" icon={Home} label="Home" />
                    <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem href="/login" icon={User} label="Account" />
                </div>
                <button onClick={handleDemoMode} className="absolute -top-8 right-2 bg-m3-surface-container-highest text-m3-on-surface-variant text-xs px-2 py-1 rounded-m3-sm flex items-center gap-1 hover:bg-m3-surface-container-high transition-colors">
                    <Terminal size={12} />Dev
                </button>
            </nav>
            <nav ref={desktopRef} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
                <div ref={desktopInner} className="flex items-center gap-6 px-8 py-2.5 bg-m3-surface-container/95 backdrop-blur-lg rounded-m3-full shadow-m3-2 border border-m3-outline-variant/20">
                    <span ref={brandRef} className="text-lg font-semibold text-m3-primary mr-1">Zenith</span>
                    <NavItem href="/" icon={Home} label="Home" />
                    <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <div className="hidden md:flex"><SdgBadge /></div>
                    <NavItem href="/login" icon={User} label="Account" />
                    <button onClick={handleDemoMode} className="bg-m3-surface-container-highest text-m3-on-surface-variant text-xs px-2.5 py-1 rounded-m3-sm flex items-center gap-1 hover:bg-m3-surface-container-high transition-colors">
                        <Terminal size={12} />Dev
                    </button>
                </div>
            </nav>
        </>
    );
}
