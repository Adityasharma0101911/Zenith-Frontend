// material design 3 dashboard with gsap stagger animations
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Heart, Wallet } from "lucide-react";
import { API_URL } from "@/utils/api";
import ShoppingWidget from "@/components/ShoppingWidget";
import PulseCheck from "@/components/PulseCheck";
import AiInsight from "@/components/AiInsight";
import HistoryLog from "@/components/HistoryLog";
import MainframeLog from "@/components/MainframeLog";
import PageTransition from "@/components/PageTransition";
import ContextualSpotlight from "@/components/ContextualSpotlight";
import AnimatedCounter from "@/components/AnimatedCounter";
import ScrollProgress from "@/components/ScrollProgress";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

function SkeletonCard({ className = "" }: { className?: string }) {
    return (<div className={`bg-m3-surface-container rounded-m3-xl overflow-hidden ${className}`}><div className="m3-shimmer h-full w-full" /></div>);
}

export default function DashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<{ username: string; name: string; balance: number; spending_profile: string | null; stress_level: number; wellness_score: number } | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const welcomeRef = useRef<HTMLDivElement>(null);
    const greetingRef = useRef<HTMLHeadingElement>(null);
    const balanceRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLSpanElement>(null);
    const wellnessRef = useRef<HTMLDivElement>(null);
    const heartRef = useRef<HTMLSpanElement>(null);

    const fetchUserData = useCallback(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }
        fetch(`${API_URL}/api/user_data`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(data => {
                if (data.error) router.push("/login");
                else if (data.survey_completed === false) router.push("/survey");
                else setUserData(data);
            })
            .catch(() => { router.push("/login"); });
    }, [router]);

    useEffect(() => { fetchUserData(); }, [fetchUserData]);

    // stagger entrance with more dramatic reveal — kills old triggers on re-run to prevent memory leaks
    useEffect(() => {
        if (!containerRef.current || !userData) return;

        // kill only dashboard-scoped ScrollTriggers before creating new ones
        const existingTriggers = ScrollTrigger.getAll().filter(t => {
            const trigger = t.vars?.trigger;
            return trigger && containerRef.current?.contains(trigger as Element);
        });
        existingTriggers.forEach(t => t.kill());

        const widgets = containerRef.current.querySelectorAll(".dash-widget");
        const entranceTween = gsap.fromTo(widgets,
            { opacity: 0, y: 40, scale: 0.95, rotationX: -8 },
            { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 0.55, stagger: 0.12, delay: 0.15, ease: "power3.out", transformPerspective: 800, overwrite: true }
        );

        // ScrollTrigger reveal for widgets below the fold
        const triggers: globalThis.ScrollTrigger[] = [];
        widgets.forEach((widget, i) => {
            if (i < 2) return; // first two animate on load
            const st = ScrollTrigger.create({
                trigger: widget,
                start: "top 90%",
                onEnter: () => {
                    gsap.fromTo(widget,
                        { opacity: 0, y: 30, scale: 0.97 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", overwrite: true }
                    );
                },
                once: true,
            });
            triggers.push(st);
        });

        // cleanup: kill all triggers and tweens when userData changes or unmounts
        return () => {
            entranceTween.kill();
            triggers.forEach(t => t.kill());
        };
    }, [userData]);

    // welcome card inner animations — use fromTo with overwrite to prevent stacking on re-renders
    useEffect(() => {
        if (!userData) return;
        const tweens: gsap.core.Tween[] = [];
        if (greetingRef.current) tweens.push(gsap.fromTo(greetingRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.35, ease: "back.out(1.5)", overwrite: true }));
        if (balanceRef.current) tweens.push(gsap.fromTo(balanceRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.5, overwrite: true }));
        if (badgeRef.current) tweens.push(gsap.fromTo(badgeRef.current, { scale: 0 }, { scale: 1, duration: 0.4, delay: 0.6, ease: "back.out(1.5)", overwrite: true }));
        if (wellnessRef.current) tweens.push(gsap.fromTo(wellnessRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.7, overwrite: true }));
        return () => { tweens.forEach(t => t.kill()); };
    }, [userData]);

    // heart pulse
    useEffect(() => {
        if (!heartRef.current) return;
        const pulse = gsap.to(heartRef.current, { scale: 1.2, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" });
        return () => { pulse.kill(); };
    }, []);

    function handleTransactionComplete() { fetchUserData(); setRefreshTrigger(prev => prev + 1); }

    return (
        <PageTransition>
            <main className="min-h-screen px-4 pt-16 pb-10 md:pl-[232px] md:pr-8 md:pt-6 overflow-y-auto">
                <div className="flex flex-col items-center mt-4">
                    {userData ? (
                        <div ref={containerRef} className="flex flex-col items-center w-full max-w-2xl">
                            <div ref={welcomeRef} className="dash-widget w-full bg-m3-primary-container/80 backdrop-blur-xl backdrop-saturate-150 p-6 text-center rounded-m3-xl shadow-m3-2 border border-m3-outline-variant/10">
                                <h1 ref={greetingRef} className="text-m3-headline-medium text-m3-on-primary-container">Welcome, {userData.name}</h1>
                                <div ref={balanceRef} className="flex items-center justify-center gap-2 mt-2">
                                    <Wallet size={20} className="text-m3-on-primary-container/70" />
                                    <AnimatedCounter value={Number(userData.balance) || 0} prefix="$" className="text-m3-title-large text-m3-on-primary-container/80" duration={1.5} />
                                </div>
                                {userData.spending_profile && (
                                    <span ref={badgeRef} className="inline-block mt-2 px-3 py-1 rounded-m3-full bg-m3-surface text-m3-on-surface text-m3-label-medium">{userData.spending_profile}</span>
                                )}
                                <div ref={wellnessRef} className="mt-3 flex items-center justify-center gap-2" title="Calculated using real-time stress data to align with UN SDG #3.">
                                    <span ref={heartRef}><Heart size={16} className="text-m3-on-primary-container/60" /></span>
                                    <span className="text-m3-label-medium text-m3-on-primary-container/60">Wellness</span>
                                    <span className={`text-m3-title-large ${userData.wellness_score < 50 ? "text-m3-error" : "text-m3-on-primary-container"}`}>{userData.wellness_score}%</span>
                                </div>
                            </div>
                            <div className="dash-widget w-full mt-5"><AiInsight refreshTrigger={refreshTrigger} /></div>
                            <div className="dash-widget grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 w-full">
                                <PulseCheck triggerRefresh={() => setRefreshTrigger(prev => prev + 1)} />
                                <ShoppingWidget refreshData={handleTransactionComplete} />
                            </div>
                            <div className="dash-widget w-full mt-5"><MainframeLog refreshTrigger={refreshTrigger} /></div>
                            <div className="dash-widget w-full mt-5"><HistoryLog refreshTrigger={refreshTrigger} /></div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full max-w-2xl gap-5 mt-4">
                            <SkeletonCard className="w-full h-44" />
                            <SkeletonCard className="w-full h-24" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full"><SkeletonCard className="h-40" /><SkeletonCard className="h-40" /></div>
                            <SkeletonCard className="w-full h-32" />
                            <SkeletonCard className="w-full h-28" />
                        </div>
                    )}
                </div>
                <ContextualSpotlight />
                <ScrollProgress />
            </main>
        </PageTransition>
    );
}
