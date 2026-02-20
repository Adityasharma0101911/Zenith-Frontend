// material design 3 dashboard with gsap stagger animations
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Heart, Wallet } from "lucide-react";
import { API_URL } from "@/utils/api";
import ShoppingWidget from "@/components/ShoppingWidget";
import PulseCheck from "@/components/PulseCheck";
import AiInsight from "@/components/AiInsight";
import HistoryLog from "@/components/HistoryLog";
import MainframeLog from "@/components/MainframeLog";
import PageTransition from "@/components/PageTransition";
import ContextualSpotlight from "@/components/ContextualSpotlight";

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
            .then(res => res.json()).then(data => {
                if (data.error) router.push("/login");
                else if (data.survey_completed === false) router.push("/survey");
                else setUserData(data);
            });
    }, [router]);

    useEffect(() => { fetchUserData(); }, [fetchUserData]);

    // stagger entrance
    useEffect(() => {
        if (!containerRef.current || !userData) return;
        gsap.from(containerRef.current.querySelectorAll(".dash-widget"), {
            opacity: 0, y: 28, scale: 0.97, duration: 0.45, stagger: 0.1, delay: 0.15, ease: "power3.out",
        });
    }, [userData]);

    // welcome card inner animations
    useEffect(() => {
        if (!userData) return;
        if (greetingRef.current) gsap.from(greetingRef.current, { opacity: 0, scale: 0.9, duration: 0.5, delay: 0.35, ease: "back.out(1.5)" });
        if (balanceRef.current) gsap.from(balanceRef.current, { opacity: 0, duration: 0.3, delay: 0.5 });
        if (badgeRef.current) gsap.from(badgeRef.current, { scale: 0, duration: 0.4, delay: 0.6, ease: "back.out(1.5)" });
        if (wellnessRef.current) gsap.from(wellnessRef.current, { opacity: 0, y: 8, duration: 0.3, delay: 0.7 });
    }, [userData]);

    // heart pulse
    useEffect(() => {
        if (heartRef.current) gsap.to(heartRef.current, { scale: 1.2, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, [userData]);

    function handleTransactionComplete() { fetchUserData(); setRefreshTrigger(prev => prev + 1); }

    return (
        <PageTransition>
            <main className="min-h-screen px-4 pt-16 pb-10 md:pl-[232px] md:pr-8 md:pt-6 overflow-y-auto">
                <div className="flex flex-col items-center mt-4">
                    {userData ? (
                        <div ref={containerRef} className="flex flex-col items-center w-full max-w-2xl">
                            <div ref={welcomeRef} className="dash-widget w-full bg-m3-primary-container p-6 text-center rounded-m3-xl shadow-m3-2">
                                <h1 ref={greetingRef} className="text-m3-headline-medium text-m3-on-primary-container">Welcome, {userData.name}</h1>
                                <div ref={balanceRef} className="flex items-center justify-center gap-2 mt-2">
                                    <Wallet size={20} className="text-m3-on-primary-container/70" />
                                    <span className="text-m3-title-large text-m3-on-primary-container/80">${userData.balance.toFixed(2)}</span>
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
            </main>
        </PageTransition>
    );
}
