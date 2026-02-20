// material design 3 onboarding wizard with gsap animations
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ShieldCheck, Scale, Zap, Rocket, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/utils/api";
import PageTransition from "@/components/PageTransition";

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [spendingProfile, setSpendingProfile] = useState("");
    const [balance, setBalance] = useState("");
    const [launching, setLaunching] = useState(false);
    const router = useRouter();

    const dotsRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const stepRef = useRef<HTMLDivElement>(null);
    const rocketRef = useRef<HTMLSpanElement>(null);

    const profiles = [
        { label: "Cautious Saver", description: "You think twice before every purchase", icon: ShieldCheck, color: "bg-m3-primary-container text-m3-on-primary-container", ring: "ring-m3-primary" },
        { label: "Balanced Planner", description: "You budget wisely and stick to plans", icon: Scale, color: "bg-m3-secondary-container text-m3-on-secondary-container", ring: "ring-m3-secondary" },
        { label: "Impulse Spender", description: "You buy now and think later", icon: Zap, color: "bg-m3-tertiary-container text-m3-on-tertiary-container", ring: "ring-m3-tertiary" },
    ];

    // auth guard
    useEffect(() => { if (!localStorage.getItem("token")) router.push("/login"); }, [router]);

    // card entrance
    useEffect(() => {
        if (cardRef.current) gsap.from(cardRef.current, { opacity: 0, y: 24, scale: 0.96, duration: 0.5, ease: "power3.out" });
    }, []);

    // dots animation
    useEffect(() => {
        if (!dotsRef.current) return;
        const dots = dotsRef.current.querySelectorAll(".dot");
        dots.forEach((dot, i) => {
            gsap.to(dot, {
                width: step === (i + 1) ? 28 : 10,
                backgroundColor: step >= (i + 1) ? "var(--m3-primary)" : "var(--m3-outline-variant)",
                duration: 0.3, ease: "back.out(1.5)",
            });
        });
    }, [step]);

    // step content animation
    useEffect(() => {
        if (!stepRef.current) return;
        const items = stepRef.current.querySelectorAll(".step-item");
        gsap.from(items, { opacity: 0, y: 16, duration: 0.35, stagger: 0.08, delay: 0.15, ease: "power3.out" });
    }, [step]);

    // rocket bounce when launching
    useEffect(() => {
        if (launching && rocketRef.current) {
            const tween = gsap.to(rocketRef.current, { y: -4, duration: 0.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
            return () => { tween.kill(); };
        }
    }, [launching]);

    function selectProfile(type: string) { setSpendingProfile(type); setStep(3); }

    async function handleFinish() {
        setLaunching(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/onboarding`, {
                method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, spending_profile: spendingProfile, balance: parseFloat(balance) || 0 }),
            });
            if (!res.ok) throw new Error("Request failed");
            setTimeout(() => router.push("/dashboard"), 1200);
        } catch {
            toast.error("Could not complete onboarding. Please try again.");
            setLaunching(false);
        }
    }

    return (
        <PageTransition>
            <main className="min-h-screen flex items-center justify-center px-6">
                <div className="w-full max-w-sm">
                    <div ref={dotsRef} className="flex items-center justify-center gap-2 mb-6">
                        {[1, 2, 3].map(s => (
                            <div key={s} className="dot rounded-full h-[10px]" style={{ width: step === s ? 28 : 10, backgroundColor: step >= s ? "var(--m3-primary)" : "var(--m3-outline-variant)" }} />
                        ))}
                    </div>
                    <div ref={cardRef} className="bg-m3-surface-container-low rounded-m3-xl p-8 shadow-m3-2">
                        {step === 1 && (
                            <div ref={stepRef} className="flex flex-col gap-5">
                                <div className="step-item text-center">
                                    <h1 className="text-m3-headline-small text-m3-on-surface">What is your name?</h1>
                                    <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">We&apos;ll personalize your experience</p>
                                </div>
                                <div className="step-item relative">
                                    <input type="text" placeholder=" " value={name} onChange={e => setName(e.target.value)} className="m3-input-outlined peer" required />
                                    <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">Your name</label>
                                </div>
                                <div className="step-item">
                                    <button onClick={() => setStep(2)} className="m3-btn-filled w-full flex items-center justify-center gap-1">Continue <ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div ref={stepRef} className="flex flex-col gap-4">
                                <div className="step-item text-center">
                                    <h1 className="text-m3-headline-small text-m3-on-surface">Your Spending Style</h1>
                                    <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">This helps Zenith protect you better</p>
                                </div>
                                {profiles.map((p) => (
                                    <button key={p.label} onClick={() => selectProfile(p.label)} className={`step-item ${p.color} rounded-m3-lg p-4 flex items-center gap-4 text-left transition-shadow duration-200 hover:shadow-m3-2 hover:-translate-y-1 active:scale-[0.96] transition-transform`}>
                                        <p.icon size={24} />
                                        <div className="flex-1">
                                            <p className="text-m3-label-large">{p.label}</p>
                                            <p className="text-m3-body-small opacity-80">{p.description}</p>
                                        </div>
                                        <ChevronRight size={16} className="opacity-50" />
                                    </button>
                                ))}
                            </div>
                        )}
                        {step === 3 && (
                            <div ref={stepRef} className="flex flex-col gap-5">
                                <div className="step-item text-center">
                                    <h1 className="text-m3-headline-small text-m3-on-surface">Current Balance</h1>
                                    <p className="text-m3-body-medium text-m3-on-surface-variant mt-1">Enter your bank balance to start tracking</p>
                                </div>
                                <div className="step-item relative">
                                    <input type="number" placeholder=" " value={balance} onChange={e => setBalance(e.target.value)} className="m3-input-outlined peer" required />
                                    <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">Balance ($)</label>
                                </div>
                                <div className="step-item">
                                    <button onClick={handleFinish} disabled={launching} className="m3-btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-80">
                                        {launching ? (<><span ref={rocketRef}><Rocket size={18} /></span> Launching Zenith...</>) : "Launch Zenith"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}
