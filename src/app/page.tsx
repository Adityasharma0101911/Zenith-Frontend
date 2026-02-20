// material design 3 landing page with gsap animations
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Shield, Brain, TrendingDown, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PageTransition from "@/components/PageTransition";

const features = [
    { icon: Shield, title: "Spending Guardian", desc: "Blocks impulse purchases when your stress is high", color: "bg-m3-primary-container", iconColor: "text-m3-on-primary-container" },
    { icon: Brain, title: "AI Insights", desc: "Personalized advice based on your mental state", color: "bg-m3-tertiary-container", iconColor: "text-m3-on-tertiary-container" },
    { icon: TrendingDown, title: "Stress Tracking", desc: "Real-time wellness monitoring aligned with UN SDG #3", color: "bg-m3-secondary-container", iconColor: "text-m3-on-secondary-container" },
];

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLSpanElement>(null);
    const getStartedRef = useRef<HTMLButtonElement>(null);
    const signInRef = useRef<HTMLButtonElement>(null);

    // hero stagger entrance
    useEffect(() => {
        if (!heroRef.current) return;
        const items = heroRef.current.querySelectorAll(".hero-item");
        gsap.from(items, { opacity: 0, y: 32, duration: 0.5, stagger: 0.12, delay: 0.2, ease: "power3.out" });
    }, []);

    // feature cards stagger
    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.querySelectorAll(".feature-card");
        gsap.from(cards, { opacity: 0, y: 32, duration: 0.5, stagger: 0.12, delay: 0.4, ease: "power3.out" });
        // icon bounce
        const icons = gridRef.current.querySelectorAll(".feature-icon");
        gsap.from(icons, { scale: 0, duration: 0.5, stagger: 0.15, delay: 0.8, ease: "back.out(1.7)" });
        // hover on cards
        const cleanups: (() => void)[] = [];
        cards.forEach(card => {
            const enter = () => gsap.to(card, { y: -8, scale: 1.02, duration: 0.25, ease: "power3.out" });
            const leave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.25, ease: "power3.out" });
            const down = () => gsap.to(card, { scale: 0.98, duration: 0.1 });
            const up = () => gsap.to(card, { scale: 1.02, duration: 0.15 });
            card.addEventListener("mouseenter", enter); card.addEventListener("mouseleave", leave);
            card.addEventListener("mousedown", down); card.addEventListener("mouseup", up);
            cleanups.push(() => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave); card.removeEventListener("mousedown", down); card.removeEventListener("mouseup", up); });
        });
        return () => cleanups.forEach(fn => fn());
    }, []);

    // infinite arrow bounce
    useEffect(() => {
        if (arrowRef.current) gsap.to(arrowRef.current, { x: 4, duration: 0.75, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, []);

    // button hovers
    useEffect(() => {
        const btns = [getStartedRef.current, signInRef.current].filter(Boolean) as HTMLElement[];
        const cleanups: (() => void)[] = [];
        btns.forEach(btn => {
            const enter = () => gsap.to(btn, { scale: 1.05, y: -2, duration: 0.2, ease: "power3.out" });
            const leave = () => gsap.to(btn, { scale: 1, y: 0, duration: 0.2, ease: "power3.out" });
            const down = () => gsap.to(btn, { scale: 0.95, duration: 0.1 });
            const up = () => gsap.to(btn, { scale: 1.05, duration: 0.15 });
            btn.addEventListener("mouseenter", enter); btn.addEventListener("mouseleave", leave);
            btn.addEventListener("mousedown", down); btn.addEventListener("mouseup", up);
            cleanups.push(() => { btn.removeEventListener("mouseenter", enter); btn.removeEventListener("mouseleave", leave); btn.removeEventListener("mousedown", down); btn.removeEventListener("mouseup", up); });
        });
        return () => cleanups.forEach(fn => fn());
    }, []);

    return (
        <PageTransition>
            <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-28">
                <div ref={heroRef} className="text-center max-w-lg">
                    <div className="hero-item inline-flex items-center gap-1.5 px-3 py-1 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container text-xs font-medium mb-5">
                        <Sparkles size={12} /> AI-Powered Financial Wellness
                    </div>
                    <div className="hero-item">
                        <Image src="/zenith-logo.png" alt="Zenith" width={400} height={260} className="mx-auto w-96" priority />
                    </div>
                    <p className="hero-item text-m3-on-surface-variant mt-4 text-lg leading-relaxed">
                        Your guardian against impulse spending.<br />
                        <span className="text-m3-primary font-medium">Powered by AI. Driven by wellness.</span>
                    </p>
                    <div className="hero-item flex gap-4 justify-center mt-8">
                        <Link href="/register">
                            <button ref={getStartedRef} className="m3-btn-filled flex items-center gap-2 px-8">
                                Get Started <span ref={arrowRef}><ArrowRight size={16} /></span>
                            </button>
                        </Link>
                        <Link href="/login">
                            <button ref={signInRef} className="m3-btn-tonal px-8">Sign In</button>
                        </Link>
                    </div>
                </div>
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20 max-w-3xl w-full">
                    {features.map((f) => (
                        <div key={f.title} className="feature-card m3-card flex flex-col items-center text-center gap-3 cursor-default">
                            <div className={`feature-icon w-14 h-14 rounded-m3-lg ${f.color} flex items-center justify-center`}>
                                <f.icon className={f.iconColor} size={26} />
                            </div>
                            <h3 className="font-semibold text-m3-on-surface">{f.title}</h3>
                            <p className="text-sm text-m3-on-surface-variant leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </PageTransition>
    );
}
