// collapsible left sidebar with gsap m3 navigation rail
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard, GraduationCap, Wallet, HeartPulse, LogOut,
    ChevronLeft, ChevronRight, Menu, X, ShoppingCart,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import SdgBadge from "@/components/SdgBadge";
import ThemePicker from "@/components/ThemePicker";
import DarkModeToggle from "@/components/DarkModeToggle";

const HIDDEN_PAGES = ["/", "/login", "/register", "/survey", "/onboarding"];
const NAV_ITEMS = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/scholar", icon: GraduationCap, label: "Scholar" },
    { href: "/guardian", icon: Wallet, label: "Guardian" },
    { href: "/guardian/purchases", icon: ShoppingCart, label: "Purchases" },
    { href: "/vitals", icon: HeartPulse, label: "Vitals" },
];

function SidebarItem({ href, icon: Icon, label, expanded }: { href: string; icon: React.ElementType; label: string; expanded: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    const itemRef = useRef<HTMLDivElement>(null);
    const pillRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    // hover + tap
    useEffect(() => {
        const el = itemRef.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.02, x: 1, duration: 0.2, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, x: 0, duration: 0.2, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.97, duration: 0.1 });
        const up = () => gsap.to(el, { scale: 1.02, duration: 0.15, ease: "power3.out" });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave);
        el.addEventListener("mousedown", down); el.addEventListener("mouseup", up);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); el.removeEventListener("mouseup", up); };
    }, []);

    // pill animation
    useEffect(() => {
        if (isActive && pillRef.current) {
            gsap.from(pillRef.current, { scaleX: 0, opacity: 0, duration: 0.4, ease: "back.out(1.5)" });
        }
    }, [isActive]);

    // label expand/collapse
    useEffect(() => {
        if (!labelRef.current) return;
        if (expanded) {
            gsap.to(labelRef.current, { width: "auto", opacity: 1, duration: 0.25, ease: "power3.out" });
        } else {
            gsap.to(labelRef.current, { width: 0, opacity: 0, duration: 0.2, ease: "power2.in" });
        }
    }, [expanded]);

    return (
        <Link href={href} className="block">
            <div
                ref={itemRef}
                className={`flex items-center gap-3 px-3 rounded-m3-full transition-colors relative m3-state-layer group overflow-hidden ${
                    isActive ? "bg-m3-secondary-container text-m3-on-secondary-container" : "text-m3-on-surface-variant hover:bg-m3-surface-container-high"
                }`}
                style={{ height: 56, paddingLeft: expanded ? 16 : 16, paddingRight: expanded ? 24 : 16 }}
            >
                {isActive && (
                    <div ref={pillRef} className="absolute inset-y-2 left-0 right-0 bg-m3-secondary-container rounded-m3-full -z-10" />
                )}
                <Icon size={24} className="shrink-0" />
                <span ref={labelRef} className="text-m3-label-large whitespace-nowrap overflow-hidden" style={{ width: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}>
                    {label}
                </span>
            </div>
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [expanded, setExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const sidebarRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const scrimRef = useRef<HTMLDivElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);
    const logoutLabelRef = useRef<HTMLSpanElement>(null);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const hidden = HIDDEN_PAGES.includes(pathname);

    // sidebar width animation
    useEffect(() => {
        if (hidden || !sidebarRef.current) return;
        gsap.to(sidebarRef.current, { width: expanded ? 220 : 80, duration: 0.3, ease: "power3.out" });
    }, [expanded, hidden]);

    // logo show/hide
    useEffect(() => {
        if (hidden || !logoRef.current) return;
        if (expanded) {
            gsap.to(logoRef.current, { opacity: 1, x: 0, width: "auto", duration: 0.25, ease: "power3.out", display: "flex" });
        } else {
            gsap.to(logoRef.current, { opacity: 0, x: -10, width: 0, duration: 0.2, ease: "power2.in", onComplete: () => { if (logoRef.current) logoRef.current.style.display = "none"; } });
        }
    }, [expanded, hidden]);

    // logout label expand/collapse
    useEffect(() => {
        if (hidden || !logoutLabelRef.current) return;
        if (expanded) {
            gsap.to(logoutLabelRef.current, { width: "auto", opacity: 1, duration: 0.25, ease: "power3.out" });
        } else {
            gsap.to(logoutLabelRef.current, { width: 0, opacity: 0, duration: 0.2, ease: "power2.in" });
        }
    }, [expanded, hidden]);

    // toggle button hover
    useEffect(() => {
        if (hidden) return;
        const el = toggleRef.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.1, duration: 0.15, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, duration: 0.15, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.9, duration: 0.1 });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); el.addEventListener("mousedown", down);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); };
    }, [hidden]);

    // hamburger entrance
    useEffect(() => {
        if (hidden) return;
        if (hamburgerRef.current) gsap.from(hamburgerRef.current, { opacity: 0, scale: 0.8, duration: 0.4, delay: 0.3, ease: "back.out(1.5)" });
    }, [hidden]);

    // mobile drawer animations
    useEffect(() => {
        if (hidden) return;
        if (mobileOpen) {
            if (scrimRef.current) gsap.from(scrimRef.current, { opacity: 0, duration: 0.3, ease: "power3.out" });
            if (drawerRef.current) gsap.from(drawerRef.current, { x: -280, duration: 0.5, ease: "back.out(1.2)" });
        }
    }, [mobileOpen, hidden]);

    if (hidden) return null;

    function closeDrawer() {
        const tl = gsap.timeline({ onComplete: () => setMobileOpen(false) });
        if (drawerRef.current) tl.to(drawerRef.current, { x: -280, duration: 0.3, ease: "power2.in" }, 0);
        if (scrimRef.current) tl.to(scrimRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0.05);
    }

    async function handleLogout() {
        const token = localStorage.getItem("token");
        try { await fetch(`${API_URL}/api/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }); } catch {}
        localStorage.removeItem("token");
        router.push("/login");
    }

    const sidebarContent = (
        <div className="flex flex-col h-full py-4 px-3">
            <div className="flex items-center justify-center mb-6 px-1 gap-2">
                <div ref={logoRef} className="flex-1 flex justify-center" style={{ display: expanded ? "flex" : "none" }}>
                    <Image src="/zenith-logo.png" alt="Zenith" width={200} height={125} className="h-20 w-auto" />
                </div>
                <button ref={toggleRef} onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-m3-full hover:bg-m3-surface-container-high text-m3-on-surface-variant hidden md:flex">
                    {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
                {NAV_ITEMS.map((item) => <SidebarItem key={item.href} {...item} expanded={expanded} />)}
            </nav>
            <div className="flex flex-col gap-2 mt-auto">
                {expanded && <div className="px-2 py-1"><SdgBadge /></div>}
                <ThemePicker expanded={expanded} />
                <DarkModeToggle expanded={expanded} />
                <button onClick={handleLogout} className="flex justify-start items-center gap-3 px-3 py-2.5 rounded-m3-full text-m3-error hover:bg-m3-error-container transition-colors bg-transparent shadow-none w-full">
                    <LogOut size={20} className="shrink-0" />
                    <span ref={logoutLabelRef} className="text-m3-label-large whitespace-nowrap overflow-hidden" style={{ width: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <button ref={hamburgerRef} onClick={() => setMobileOpen(true)} className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-m3-full bg-m3-surface-container shadow-m3-2 text-m3-on-surface">
                <Menu size={22} />
            </button>
            {mobileOpen && (
                <>
                    <div ref={scrimRef} onClick={closeDrawer} className="fixed inset-0 bg-black/40 z-50 md:hidden" />
                    <div ref={drawerRef} className="fixed left-0 top-0 bottom-0 w-[260px] bg-m3-surface-container-low z-50 md:hidden shadow-m3-4">
                        <button onClick={closeDrawer} className="absolute top-4 right-3 p-1.5 rounded-m3-full hover:bg-m3-surface-container-high text-m3-on-surface-variant"><X size={18} /></button>
                        {sidebarContent}
                    </div>
                </>
            )}
            <aside ref={sidebarRef} style={{ width: expanded ? 220 : 80 }} className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex bg-m3-surface-container-low border-r border-m3-outline-variant/30">
                {sidebarContent}
            </aside>
        </>
    );
}
