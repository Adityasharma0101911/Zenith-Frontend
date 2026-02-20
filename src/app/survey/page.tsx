// window-based survey — fake browser with tabs, maximize, resize, gsap animations, leaves
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import {
    User, Wallet, GraduationCap, HeartPulse, Brain,
    ChevronLeft, ChevronRight, Rocket, ShieldCheck, Scale, Zap,
    Minus, Maximize2, Minimize2, X, RotateCcw, ArrowLeft, ArrowRight, Search,
    Palette, Briefcase, Music, Gamepad2, Heart, Coffee,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import toast from "react-hot-toast";
import PageTransition from "@/components/PageTransition";
import FallingLeaves from "@/components/FallingLeaves";

// tab definitions for each survey section
const TABS = [
    { id: 1, icon: User, label: "About You", url: "survey.com/about" },
    { id: 2, icon: Wallet, label: "Finances", url: "survey.com/finances" },
    { id: 3, icon: GraduationCap, label: "Academics", url: "survey.com/academics" },
    { id: 4, icon: HeartPulse, label: "Health", url: "survey.com/health" },
    { id: 5, icon: Brain, label: "Wellness", url: "survey.com/wellness" },
];

// option card component with gsap hover
function OptionCard({ label, description, selected, onClick, icon: Icon, color }: {
    label: string; description?: string; selected: boolean; onClick: () => void; icon?: React.ElementType; color?: string;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.02, y: -2, duration: 0.2, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, y: 0, duration: 0.2, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.97, duration: 0.1 });
        const up = () => gsap.to(el, { scale: 1.02, duration: 0.15 });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave);
        el.addEventListener("mousedown", down); el.addEventListener("mouseup", up);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); el.removeEventListener("mouseup", up); };
    }, []);
    return (
        <button ref={ref} type="button" onClick={onClick}
            className={`w-full text-left px-4 py-3 rounded-m3-lg border-2 transition-colors ${selected ? `${color || "bg-m3-primary-container"} border-m3-primary` : "bg-m3-surface-container border-transparent hover:bg-m3-surface-container-high"}`}>
            <div className="flex items-center gap-3">
                {Icon && <Icon size={20} className={selected ? "text-m3-primary" : "text-m3-on-surface-variant"} />}
                <div className="flex-1">
                    <p className={`text-m3-label-large ${selected ? "text-m3-on-primary-container" : "text-m3-on-surface"}`}>{label}</p>
                    {description && <p className={`text-m3-body-small mt-0.5 ${selected ? "text-m3-on-primary-container/70" : "text-m3-on-surface-variant"}`}>{description}</p>}
                </div>
            </div>
        </button>
    );
}

// chip component with gsap hover
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void; }) {
    const ref = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.05, duration: 0.15, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, duration: 0.15, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.95, duration: 0.1 });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); el.addEventListener("mousedown", down);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); };
    }, []);
    return (
        <button ref={ref} type="button" onClick={onClick}
            className={`px-3 py-1.5 rounded-m3-full text-m3-label-medium border transition-colors ${selected ? "bg-m3-primary text-m3-on-primary border-m3-primary" : "bg-m3-surface-container text-m3-on-surface-variant border-m3-outline-variant hover:bg-m3-surface-container-high"}`}>
            {label}
        </button>
    );
}

// resize handle directions
type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export default function SurveyPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(1);
    const [launching, setLaunching] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [maximized, setMaximized] = useState(false);

    // survey state — original fields
    const [name, setName] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [occupation, setOccupation] = useState("");
    const [incomeRange, setIncomeRange] = useState("");
    const [spendingProfile, setSpendingProfile] = useState("");
    const [savings, setSavings] = useState("");
    const [financialGoals, setFinancialGoals] = useState<string[]>([]);
    const [balance, setBalance] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [learningStyle, setLearningStyle] = useState("");
    const [studyGoals, setStudyGoals] = useState<string[]>([]);
    const [exerciseFrequency, setExerciseFrequency] = useState("");
    const [sleepQuality, setSleepQuality] = useState("");
    const [dietQuality, setDietQuality] = useState("");
    const [healthGoals, setHealthGoals] = useState<string[]>([]);
    const [stressLevel, setStressLevel] = useState(5);
    const [biggestStressor, setBiggestStressor] = useState("");
    const [wellnessPriorities, setWellnessPriorities] = useState<string[]>([]);

    // new personal fields
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [profession, setProfession] = useState("");
    const [personalityType, setPersonalityType] = useState("");
    const [favoriteWayToUnwind, setFavoriteWayToUnwind] = useState("");
    const [morningOrNight, setMorningOrNight] = useState("");
    const [socialPreference, setSocialPreference] = useState("");

    // refs for gsap animations
    const windowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const tabBarRef = useRef<HTMLDivElement>(null);
    const rocketRef = useRef<HTMLSpanElement>(null);

    // dragging state
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
    const [centered, setCentered] = useState(true);

    // resize state
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDir, setResizeDir] = useState<ResizeDir | null>(null);
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
    const [hasCustomSize, setHasCustomSize] = useState(false);
    const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0, left: 0, top: 0 });

    // store pre-maximize rect for restore
    const preMaxRect = useRef({ x: 0, y: 0, w: 0, h: 0, wasCentered: true });

    useEffect(() => { if (!localStorage.getItem("token")) router.push("/login"); }, [router]);

    function toggleMulti(arr: string[], setter: (v: string[]) => void, val: string) {
        setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
    }

    // window entrance animation
    useEffect(() => {
        if (windowRef.current) {
            gsap.fromTo(windowRef.current,
                { opacity: 0, scale: 0.85, y: 40, rotationX: -8 },
                { opacity: 1, scale: 1, y: 0, rotationX: 0, duration: 0.7, ease: "power3.out", transformPerspective: 1000 }
            );
        }
    }, []);

    // tab content stagger entrance on tab change
    useEffect(() => {
        if (!contentRef.current) return;
        const items = contentRef.current.querySelectorAll(".step-item");
        gsap.fromTo(items,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, delay: 0.1, ease: "power3.out", overwrite: true }
        );
    }, [activeTab]);

    // tab indicator animation
    useEffect(() => {
        if (!tabBarRef.current) return;
        const tabs = tabBarRef.current.querySelectorAll(".browser-tab");
        tabs.forEach((tab, i) => {
            gsap.to(tab, {
                backgroundColor: activeTab === (i + 1) ? "var(--m3-surface-container-lowest, #fff)" : "transparent",
                duration: 0.2,
                ease: "power2.out",
            });
        });
    }, [activeTab]);

    // rocket animation during launch
    useEffect(() => {
        if (launching && rocketRef.current) {
            const tween = gsap.to(rocketRef.current, { y: -3, duration: 0.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
            return () => { tween.kill(); };
        }
    }, [launching]);

    // minimize animation
    const handleMinimize = useCallback(() => {
        if (!windowRef.current || minimized) return;
        gsap.to(windowRef.current, {
            scale: 0.02, y: 600, opacity: 0, duration: 0.5, ease: "power3.in",
            onComplete: () => setMinimized(true),
        });
    }, [minimized]);

    const handleRestore = useCallback(() => {
        setMinimized(false);
        setTimeout(() => {
            if (windowRef.current) {
                gsap.fromTo(windowRef.current,
                    { scale: 0.02, y: 600, opacity: 0 },
                    { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
                );
            }
        }, 10);
    }, []);

    // maximize / unmaximize with gsap transition
    const handleMaximize = useCallback(() => {
        if (!windowRef.current) return;
        if (!maximized) {
            // save current rect before maximizing
            const rect = windowRef.current.getBoundingClientRect();
            preMaxRect.current = {
                x: centered ? 0 : windowPos.x,
                y: centered ? 0 : windowPos.y,
                w: hasCustomSize ? windowSize.w : rect.width,
                h: hasCustomSize ? windowSize.h : rect.height,
                wasCentered: centered,
            };
            setCentered(false);
            setHasCustomSize(true);
            setMaximized(true);
            setWindowPos({ x: 0, y: 0 });
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
            gsap.fromTo(windowRef.current, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "power3.out" });
        } else {
            // restore from maximized
            setMaximized(false);
            const prev = preMaxRect.current;
            if (prev.wasCentered) {
                setCentered(true);
                setHasCustomSize(false);
            } else {
                setWindowPos({ x: prev.x, y: prev.y });
                setWindowSize({ w: prev.w, h: prev.h });
            }
            gsap.fromTo(windowRef.current, { scale: 1.02 }, { scale: 1, duration: 0.3, ease: "power3.out" });
        }
    }, [maximized, centered, windowPos, windowSize, hasCustomSize]);

    // fake reload animation
    const handleReload = useCallback(() => {
        if (!contentRef.current) return;
        gsap.to(contentRef.current, {
            opacity: 0, duration: 0.15, onComplete: () => {
                gsap.to(contentRef.current!, { opacity: 1, duration: 0.3 });
                const items = contentRef.current!.querySelectorAll(".step-item");
                gsap.fromTo(items, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: "power3.out" });
            }
        });
    }, []);

    // drag handlers — title bar
    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        if (maximized) return;
        setIsDragging(true);
        setCentered(false);
        const rect = windowRef.current?.getBoundingClientRect();
        if (rect) {
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setWindowPos({ x: rect.left, y: rect.top });
            if (!hasCustomSize) {
                setWindowSize({ w: rect.width, h: rect.height });
                setHasCustomSize(true);
            }
        }
    };

    useEffect(() => {
        if (!isDragging) return;
        const handleMove = (e: MouseEvent) => {
            setWindowPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
        };
        const handleUp = () => setIsDragging(false);
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
    }, [isDragging, dragOffset]);

    // resize handlers — edges and corners
    const startResize = useCallback((e: React.MouseEvent, dir: ResizeDir) => {
        e.preventDefault();
        e.stopPropagation();
        if (maximized) return;

        const rect = windowRef.current?.getBoundingClientRect();
        if (!rect) return;

        // switch from centered mode to positioned mode
        if (centered) {
            setCentered(false);
            setWindowPos({ x: rect.left, y: rect.top });
        }

        setIsResizing(true);
        setResizeDir(dir);
        setHasCustomSize(true);
        resizeStart.current = {
            x: e.clientX, y: e.clientY,
            w: rect.width, h: rect.height,
            left: rect.left, top: rect.top,
        };
    }, [centered, maximized]);

    useEffect(() => {
        if (!isResizing || !resizeDir) return;
        const start = resizeStart.current;
        const MIN_W = 360; const MIN_H = 350;

        const handleMove = (e: MouseEvent) => {
            const dx = e.clientX - start.x;
            const dy = e.clientY - start.y;
            let newW = start.w;
            let newH = start.h;
            let newX = start.left;
            let newY = start.top;

            if (resizeDir.includes("e")) newW = Math.max(MIN_W, start.w + dx);
            if (resizeDir.includes("w")) { newW = Math.max(MIN_W, start.w - dx); newX = start.left + (start.w - newW); }
            if (resizeDir.includes("s")) newH = Math.max(MIN_H, start.h + dy);
            if (resizeDir.includes("n")) { newH = Math.max(MIN_H, start.h - dy); newY = start.top + (start.h - newH); }

            setWindowSize({ w: newW, h: newH });
            setWindowPos({ x: newX, y: newY });
        };
        const handleUp = () => { setIsResizing(false); setResizeDir(null); };
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
    }, [isResizing, resizeDir]);

    async function handleFinish() {
        setLaunching(true);
        const token = localStorage.getItem("token");
        const surveyData = {
            name, age_range: ageRange, occupation, income_range: incomeRange, spending_profile: spendingProfile,
            savings, financial_goals: financialGoals, balance: parseFloat(balance) || 0, education_level: educationLevel,
            subjects, learning_style: learningStyle, study_goals: studyGoals, exercise_frequency: exerciseFrequency,
            sleep_quality: sleepQuality, diet_quality: dietQuality, health_goals: healthGoals, stress_level: stressLevel,
            biggest_stressor: biggestStressor, wellness_priorities: wellnessPriorities,
            // new personal fields
            hobbies, profession, personality_type: personalityType,
            favorite_way_to_unwind: favoriteWayToUnwind, morning_or_night: morningOrNight,
            social_preference: socialPreference,
        };
        try {
            const res = await fetch(`${API_URL}/api/survey`, {
                method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(surveyData),
            });
            if (res.ok) {
                if (windowRef.current) {
                    gsap.to(windowRef.current, {
                        scale: 0, opacity: 0, rotationX: 10, duration: 0.5, ease: "power3.in",
                        onComplete: () => router.push("/dashboard"),
                    });
                } else {
                    setTimeout(() => router.push("/dashboard"), 1200);
                }
            } else { setLaunching(false); toast.error("Failed to save survey."); }
        } catch { setLaunching(false); toast.error("Network error. Please try again."); }
    }

    const currentUrl = TABS.find(t => t.id === activeTab)?.url || "survey.com";

    // cursor classes for resize edges
    const RESIZE_CURSORS: Record<ResizeDir, string> = {
        n: "cursor-n-resize", s: "cursor-s-resize", e: "cursor-e-resize", w: "cursor-w-resize",
        ne: "cursor-ne-resize", nw: "cursor-nw-resize", se: "cursor-se-resize", sw: "cursor-sw-resize",
    };

    // compute window positioning style
    const windowStyle: React.CSSProperties = maximized
        ? { position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 100 }
        : centered
            ? {}
            : {
                position: "fixed",
                left: windowPos.x,
                top: windowPos.y,
                zIndex: 100,
                ...(hasCustomSize ? { width: windowSize.w, height: windowSize.h } : {}),
            };

    return (
        <PageTransition>
            {/* reactive falling leaf background */}
            <FallingLeaves count={24} />

            <main className="min-h-screen flex items-center justify-center px-4 py-6 relative z-10">

                {/* minimized taskbar pill */}
                {minimized && (
                    <div onClick={handleRestore}
                        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 cursor-pointer">
                        <div className="flex items-center gap-2 bg-m3-surface-container-high rounded-m3-full px-4 py-2.5 shadow-m3-2 border border-m3-outline-variant/30 hover:shadow-m3-3 transition-shadow">
                            <Image src="/zenith-logo.png" alt="Zenith" width={24} height={24} className="w-5 h-5 object-contain" />
                            <span className="text-m3-label-medium text-m3-on-surface">Zenith Survey</span>
                            <div className="w-2 h-2 rounded-full bg-m3-primary animate-pulse" />
                        </div>
                    </div>
                )}

                {/* the browser window */}
                {!minimized && (
                    <div
                        ref={windowRef}
                        className={`select-none relative ${maximized ? "" : centered ? "w-full max-w-lg" : ""}`}
                        style={windowStyle}
                    >
                        {/* resize handles — only when not maximized */}
                        {!maximized && (
                            <>
                                {/* edge handles */}
                                <div onMouseDown={e => startResize(e, "n")} className={`absolute -top-1 left-3 right-3 h-2 z-10 ${RESIZE_CURSORS.n}`} />
                                <div onMouseDown={e => startResize(e, "s")} className={`absolute -bottom-1 left-3 right-3 h-2 z-10 ${RESIZE_CURSORS.s}`} />
                                <div onMouseDown={e => startResize(e, "e")} className={`absolute top-3 -right-1 bottom-3 w-2 z-10 ${RESIZE_CURSORS.e}`} />
                                <div onMouseDown={e => startResize(e, "w")} className={`absolute top-3 -left-1 bottom-3 w-2 z-10 ${RESIZE_CURSORS.w}`} />
                                {/* corner handles */}
                                <div onMouseDown={e => startResize(e, "nw")} className={`absolute -top-1 -left-1 w-4 h-4 z-20 ${RESIZE_CURSORS.nw}`} />
                                <div onMouseDown={e => startResize(e, "ne")} className={`absolute -top-1 -right-1 w-4 h-4 z-20 ${RESIZE_CURSORS.ne}`} />
                                <div onMouseDown={e => startResize(e, "sw")} className={`absolute -bottom-1 -left-1 w-4 h-4 z-20 ${RESIZE_CURSORS.sw}`} />
                                <div onMouseDown={e => startResize(e, "se")} className={`absolute -bottom-1 -right-1 w-4 h-4 z-20 ${RESIZE_CURSORS.se}`} />
                            </>
                        )}

                        <div className={`bg-m3-surface-container-low shadow-m3-3 overflow-hidden border border-m3-outline-variant/30 flex flex-col ${maximized ? "rounded-none h-full" : "rounded-m3-xl"} ${hasCustomSize && !centered ? "h-full" : ""}`}>

                            {/* title bar — draggable, double-click to maximize */}
                            <div
                                onMouseDown={handleMouseDown}
                                onDoubleClick={handleMaximize}
                                className="bg-m3-surface-container-high px-3 py-2 flex items-center gap-2 cursor-grab active:cursor-grabbing border-b border-m3-outline-variant/20 shrink-0"
                            >
                                {/* zenith logo */}
                                <Image src="/zenith-logo.png" alt="Zenith" width={80} height={50} className="h-6 w-auto object-contain" />

                                {/* tab bar */}
                                <div ref={tabBarRef} className="flex-1 flex items-center gap-0.5 ml-2 overflow-x-auto">
                                    {TABS.map((tab) => {
                                        const TabIcon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`browser-tab flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs whitespace-nowrap transition-colors ${isActive
                                                    ? "bg-m3-surface-container-lowest text-m3-on-surface"
                                                    : "text-m3-on-surface-variant hover:bg-m3-surface-container/60"
                                                }`}
                                            >
                                                <TabIcon size={12} />
                                                <span className="hidden sm:inline">{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* traffic light window controls */}
                                <div className="flex items-center gap-1 ml-2">
                                    <button onClick={handleMinimize} className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors flex items-center justify-center group" title="Minimize">
                                        <Minus size={7} className="text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                    <button onClick={handleMaximize} className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors flex items-center justify-center group" title={maximized ? "Restore" : "Maximize"}>
                                        {maximized
                                            ? <Minimize2 size={6} className="text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            : <Maximize2 size={6} className="text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </button>
                                    <button onClick={() => toast("This window can't be closed until survey is complete!", { icon: "\uD83D\uDD12" })} className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors flex items-center justify-center group" title="Close">
                                        <X size={7} className="text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            </div>

                            {/* navigation bar */}
                            <div className="bg-m3-surface-container px-3 py-1.5 flex items-center gap-2 border-b border-m3-outline-variant/15 shrink-0">
                                <button
                                    onClick={() => activeTab > 1 && setActiveTab(activeTab - 1)}
                                    className={`p-1 rounded-m3-full transition-colors ${activeTab > 1 ? "hover:bg-m3-surface-container-high text-m3-on-surface-variant" : "text-m3-outline-variant cursor-default"}`}
                                    disabled={activeTab === 1}
                                >
                                    <ArrowLeft size={14} />
                                </button>
                                <button
                                    onClick={() => activeTab < 5 && setActiveTab(activeTab + 1)}
                                    className={`p-1 rounded-m3-full transition-colors ${activeTab < 5 ? "hover:bg-m3-surface-container-high text-m3-on-surface-variant" : "text-m3-outline-variant cursor-default"}`}
                                    disabled={activeTab === 5}
                                >
                                    <ArrowRight size={14} />
                                </button>
                                <button onClick={handleReload} className="p-1 rounded-m3-full hover:bg-m3-surface-container-high text-m3-on-surface-variant transition-colors">
                                    <RotateCcw size={14} />
                                </button>

                                {/* address bar */}
                                <div className="flex-1 flex items-center gap-2 bg-m3-surface-container-highest rounded-m3-full px-3 py-1 border border-m3-outline-variant/20">
                                    <Search size={12} className="text-m3-on-surface-variant/50 shrink-0" />
                                    <span className="text-xs text-m3-on-surface-variant truncate">{currentUrl}</span>
                                </div>
                            </div>

                            {/* loading bar */}
                            <div className="h-[2px] bg-m3-surface-container relative overflow-hidden shrink-0">
                                <div className="absolute inset-0 bg-m3-primary/40" />
                            </div>

                            {/* page content area — fills remaining space */}
                            <div className={`p-5 overflow-y-auto bg-m3-surface-container-lowest flex-1 ${maximized ? "" : hasCustomSize ? "" : "max-h-[60vh]"}`}>
                                <div ref={contentRef}>

                                    {/* tab 1: about you — with new personal questions */}
                                    {activeTab === 1 && (
                                        <div key="t1" className="flex flex-col gap-4">
                                            <div className="step-item text-center">
                                                <h1 className="text-m3-title-large text-m3-on-surface">About You</h1>
                                                <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">Let us get to know who you really are</p>
                                            </div>

                                            {/* name */}
                                            <div className="step-item relative">
                                                <input type="text" placeholder=" " value={name} onChange={e => setName(e.target.value)} className="m3-input-outlined peer" required />
                                                <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-lowest peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-lowest peer-[:not(:placeholder-shown)]:px-1">Your name</label>
                                            </div>

                                            {/* age range */}
                                            <div className="step-item">
                                                <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Age Range</p>
                                                <div className="flex flex-col gap-1.5">{["Under 18","18-24","25-34","35-44","45+"].map(opt => <OptionCard key={opt} label={opt} selected={ageRange===opt} onClick={()=>setAgeRange(opt)} />)}</div>
                                            </div>

                                            {/* occupation */}
                                            <div className="step-item">
                                                <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Occupation</p>
                                                <div className="flex flex-col gap-1.5">{["Student","Employed","Self-employed","Unemployed","Retired"].map(opt => <OptionCard key={opt} label={opt} selected={occupation===opt} onClick={()=>setOccupation(opt)} />)}</div>
                                            </div>

                                            {/* profession / field */}
                                            <div className="step-item relative">
                                                <input type="text" placeholder=" " value={profession} onChange={e => setProfession(e.target.value)} className="m3-input-outlined peer" />
                                                <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-lowest peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-lowest peer-[:not(:placeholder-shown)]:px-1">Profession / Field (e.g. Software Engineer, Nurse)</label>
                                            </div>

                                            {/* hobbies & interests */}
                                            <div className="step-item">
                                                <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Hobbies & Interests</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {["Reading","Gaming","Cooking","Fitness","Music","Art & Design","Photography","Travel","Writing","Gardening","Sports","Coding","Movies & TV","Hiking","Meditation","Dancing"].map(h =>
                                                        <Chip key={h} label={h} selected={hobbies.includes(h)} onClick={() => toggleMulti(hobbies, setHobbies, h)} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* personality type */}
                                            <div className="step-item">
                                                <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">What best describes your personality?</p>
                                                <div className="flex flex-col gap-1.5">
                                                    <OptionCard label="The Thinker" description="Analytical, love solving puzzles and deep thinking" icon={Brain} selected={personalityType==="The Thinker"} onClick={()=>setPersonalityType("The Thinker")} color="bg-m3-primary-container" />
                                                    <OptionCard label="The Creator" description="Imaginative, always making or designing something" icon={Palette} selected={personalityType==="The Creator"} onClick={()=>setPersonalityType("The Creator")} color="bg-m3-tertiary-container" />
                                                    <OptionCard label="The Achiever" description="Goal-oriented, driven by progress and results" icon={Briefcase} selected={personalityType==="The Achiever"} onClick={()=>setPersonalityType("The Achiever")} color="bg-m3-secondary-container" />
                                                    <OptionCard label="The Social Butterfly" description="People person, love connecting and sharing" icon={Heart} selected={personalityType==="The Social Butterfly"} onClick={()=>setPersonalityType("The Social Butterfly")} color="bg-m3-primary-container" />
                                                    <OptionCard label="The Adventurer" description="Spontaneous, always seeking new experiences" icon={Rocket} selected={personalityType==="The Adventurer"} onClick={()=>setPersonalityType("The Adventurer")} color="bg-m3-tertiary-container" />
                                                </div>
                                            </div>

                                            {/* morning or night */}
                                            <div className="step-item">
                                                <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Are you a...</p>
                                                <div className="flex flex-col gap-1.5">
                                                    {["Early Bird — I love mornings","Night Owl — I come alive at night","Somewhere in between"].map(opt =>
                                                        <OptionCard key={opt} label={opt} selected={morningOrNight===opt} onClick={()=>setMorningOrNight(opt)} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* social preference */}
                                            <div className="step-item">
                                                <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Social Preference</p>
                                                <div className="flex flex-col gap-1.5">
                                                    {["Love being around people","Small groups are my thing","I prefer one-on-one","Solo time recharges me"].map(opt =>
                                                        <OptionCard key={opt} label={opt} selected={socialPreference===opt} onClick={()=>setSocialPreference(opt)} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* favorite way to unwind */}
                                            <div className="step-item">
                                                <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Favorite Way to Unwind</p>
                                                <div className="flex flex-col gap-1.5">
                                                    <OptionCard label="Netflix & Chill" description="Binge a show or movie" icon={Gamepad2} selected={favoriteWayToUnwind==="Netflix & Chill"} onClick={()=>setFavoriteWayToUnwind("Netflix & Chill")} />
                                                    <OptionCard label="Get Moving" description="Exercise, walk, or play sports" icon={HeartPulse} selected={favoriteWayToUnwind==="Get Moving"} onClick={()=>setFavoriteWayToUnwind("Get Moving")} />
                                                    <OptionCard label="Creative Time" description="Draw, write, play music" icon={Music} selected={favoriteWayToUnwind==="Creative Time"} onClick={()=>setFavoriteWayToUnwind("Creative Time")} />
                                                    <OptionCard label="Social Hangout" description="Catch up with friends or family" icon={Heart} selected={favoriteWayToUnwind==="Social Hangout"} onClick={()=>setFavoriteWayToUnwind("Social Hangout")} />
                                                    <OptionCard label="Me Time" description="Read, meditate, bath, tea" icon={Coffee} selected={favoriteWayToUnwind==="Me Time"} onClick={()=>setFavoriteWayToUnwind("Me Time")} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* tab 2: finances */}
                                    {activeTab === 2 && (
                                        <div key="t2" className="flex flex-col gap-4">
                                            <div className="step-item text-center">
                                                <h1 className="text-m3-title-large text-m3-on-surface">Finances</h1>
                                                <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">Your financial picture</p>
                                            </div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Monthly Income</p><div className="flex flex-col gap-1.5">{["Under $1,000","$1,000-$3,000","$3,000-$5,000","$5,000-$10,000","$10,000+"].map(opt => <OptionCard key={opt} label={opt} selected={incomeRange===opt} onClick={()=>setIncomeRange(opt)} />)}</div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Spending Style</p><div className="flex flex-col gap-1.5">
                                                <OptionCard label="Cautious Saver" description="Think twice before every purchase" icon={ShieldCheck} selected={spendingProfile==="Cautious Saver"} onClick={()=>setSpendingProfile("Cautious Saver")} color="bg-m3-primary-container" />
                                                <OptionCard label="Balanced Planner" description="Budget wisely and stick to plans" icon={Scale} selected={spendingProfile==="Balanced Planner"} onClick={()=>setSpendingProfile("Balanced Planner")} color="bg-m3-secondary-container" />
                                                <OptionCard label="Impulse Spender" description="Buy now and think later" icon={Zap} selected={spendingProfile==="Impulse Spender"} onClick={()=>setSpendingProfile("Impulse Spender")} color="bg-m3-tertiary-container" />
                                            </div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Current Savings</p><div className="flex flex-col gap-1.5">{["None","Under $1,000","$1,000-$10,000","$10,000-$50,000","$50,000+"].map(opt => <OptionCard key={opt} label={opt} selected={savings===opt} onClick={()=>setSavings(opt)} />)}</div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Financial Goals</p><div className="flex flex-wrap gap-2">{["Save more","Pay off debt","Invest","Budget better","Build emergency fund","Reduce spending"].map(g => <Chip key={g} label={g} selected={financialGoals.includes(g)} onClick={()=>toggleMulti(financialGoals,setFinancialGoals,g)} />)}</div></div>
                                            <div className="step-item relative"><input type="number" placeholder=" " value={balance} onChange={e=>setBalance(e.target.value)} className="m3-input-outlined peer" /><label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-lowest peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-lowest peer-[:not(:placeholder-shown)]:px-1">Starting Balance ($)</label></div>
                                        </div>
                                    )}

                                    {/* tab 3: academics */}
                                    {activeTab === 3 && (
                                        <div key="t3" className="flex flex-col gap-4">
                                            <div className="step-item text-center">
                                                <h1 className="text-m3-title-large text-m3-on-surface">Academics</h1>
                                                <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">Your learning profile</p>
                                            </div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Education Level</p><div className="flex flex-col gap-1.5">{["High School","Undergraduate","Graduate","Professional","Self-taught"].map(opt => <OptionCard key={opt} label={opt} selected={educationLevel===opt} onClick={()=>setEducationLevel(opt)} />)}</div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Areas of Interest</p><div className="flex flex-wrap gap-2">{["STEM","Business","Arts","Health Sciences","Social Sciences","Technology","Languages","Mathematics"].map(s => <Chip key={s} label={s} selected={subjects.includes(s)} onClick={()=>toggleMulti(subjects,setSubjects,s)} />)}</div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Learning Style</p><div className="flex flex-col gap-1.5">{["Visual","Reading/Writing","Hands-on","Discussion-based","Audio/Lectures"].map(opt => <OptionCard key={opt} label={opt} selected={learningStyle===opt} onClick={()=>setLearningStyle(opt)} />)}</div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Study Goals</p><div className="flex flex-wrap gap-2">{["Improve grades","Learn new skills","Career growth","Personal enrichment","Exam prep","Research"].map(g => <Chip key={g} label={g} selected={studyGoals.includes(g)} onClick={()=>toggleMulti(studyGoals,setStudyGoals,g)} />)}</div></div>
                                        </div>
                                    )}

                                    {/* tab 4: health */}
                                    {activeTab === 4 && (
                                        <div key="t4" className="flex flex-col gap-4">
                                            <div className="step-item text-center">
                                                <h1 className="text-m3-title-large text-m3-on-surface">Health</h1>
                                                <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">Your physical wellness</p>
                                            </div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Exercise Frequency</p><div className="flex flex-col gap-1.5">{["Never","1-2 times/week","3-4 times/week","5+ times/week","Daily"].map(opt => <OptionCard key={opt} label={opt} selected={exerciseFrequency===opt} onClick={()=>setExerciseFrequency(opt)} />)}</div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Sleep Quality</p><div className="flex flex-col gap-1.5">{["Poor","Fair","Good","Excellent"].map(opt => <OptionCard key={opt} label={opt} selected={sleepQuality===opt} onClick={()=>setSleepQuality(opt)} />)}</div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Diet Quality</p><div className="flex flex-col gap-1.5">{["Needs improvement","Moderate","Healthy","Very healthy"].map(opt => <OptionCard key={opt} label={opt} selected={dietQuality===opt} onClick={()=>setDietQuality(opt)} />)}</div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Health Goals</p><div className="flex flex-wrap gap-2">{["Lose weight","Build muscle","Improve sleep","Reduce stress","Eat better","More energy","Flexibility"].map(g => <Chip key={g} label={g} selected={healthGoals.includes(g)} onClick={()=>toggleMulti(healthGoals,setHealthGoals,g)} />)}</div></div>
                                        </div>
                                    )}

                                    {/* tab 5: wellness */}
                                    {activeTab === 5 && (
                                        <div key="t5" className="flex flex-col gap-4">
                                            <div className="step-item text-center">
                                                <h1 className="text-m3-title-large text-m3-on-surface">Wellness</h1>
                                                <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">Your mental state</p>
                                            </div>
                                            <div className="step-item">
                                                <p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Current Stress Level</p>
                                                <div className="flex items-center gap-4"><span className="text-xs text-m3-on-surface-variant">Low</span><input type="range" min="1" max="10" value={stressLevel} onChange={e=>setStressLevel(parseInt(e.target.value))} className="flex-1" /><span className="text-xs text-m3-on-surface-variant">High</span></div>
                                                <p className="text-center text-lg font-semibold text-m3-primary mt-1">{stressLevel}/10</p>
                                            </div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Biggest Stressor</p><div className="flex flex-col gap-1.5">{["Work/School","Finances","Relationships","Health","Uncertainty","Time management"].map(opt => <OptionCard key={opt} label={opt} selected={biggestStressor===opt} onClick={()=>setBiggestStressor(opt)} />)}</div></div>
                                            <div className="step-item"><p className="text-xs text-m3-on-surface-variant mb-2 font-medium">Wellness Priorities</p><div className="flex flex-wrap gap-2">{["Stress management","Better sleep","More exercise","Mindfulness","Work-life balance","Social connections"].map(p => <Chip key={p} label={p} selected={wellnessPriorities.includes(p)} onClick={()=>toggleMulti(wellnessPriorities,setWellnessPriorities,p)} />)}</div></div>
                                        </div>
                                    )}
                                </div>

                                {/* navigation footer */}
                                <div className="flex items-center justify-between mt-6 gap-3">
                                    {activeTab > 1 ? (
                                        <button onClick={() => setActiveTab(activeTab - 1)} className="m3-btn-outlined flex items-center gap-1 px-4 py-2.5 text-sm"><ChevronLeft size={16} /> Back</button>
                                    ) : <div />}
                                    {activeTab < 5 ? (
                                        <button onClick={() => setActiveTab(activeTab + 1)} className="m3-btn-filled flex items-center gap-1">Continue <ChevronRight size={16} /></button>
                                    ) : (
                                        <button onClick={handleFinish} disabled={launching} className="m3-btn-filled flex items-center gap-2 disabled:opacity-80">
                                            {launching ? (<><span ref={rocketRef}><Rocket size={16} /></span> Launching...</>) : "Launch Zenith"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* status bar at bottom */}
                            <div className="bg-m3-surface-container-high px-3 py-1 flex items-center justify-between border-t border-m3-outline-variant/15 shrink-0">
                                <span className="text-[10px] text-m3-on-surface-variant/50">Tab {activeTab} of {TABS.length}</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-[10px] text-m3-on-surface-variant/50">Secure Connection</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </PageTransition>
    );
}
