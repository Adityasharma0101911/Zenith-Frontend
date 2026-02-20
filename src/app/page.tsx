// material design 3 landing page with rich gsap animations
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Shield, Brain, TrendingDown, ArrowRight, Sparkles, Zap, Lock, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import PageTransition from "@/components/PageTransition";
import FloatingParticles from "@/components/FloatingParticles";
import Magnetic from "@/components/Magnetic";
import TiltCard from "@/components/TiltCard";
import TextReveal from "@/components/TextReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const features = [
    { icon: Shield, title: "Spending Guardian", desc: "Blocks impulse purchases when your stress is high", color: "bg-m3-primary-container", iconColor: "text-m3-on-primary-container" },
    { icon: Brain, title: "AI Insights", desc: "Personalized advice based on your mental state", color: "bg-m3-tertiary-container", iconColor: "text-m3-on-tertiary-container" },
    { icon: TrendingDown, title: "Stress Tracking", desc: "Real-time wellness monitoring aligned with UN SDG #3", color: "bg-m3-secondary-container", iconColor: "text-m3-on-secondary-container" },
];

const stats = [
    { icon: Zap, value: "AI-Powered", label: "Smart Decisions" },
    { icon: Lock, value: "Real-time", label: "Stress Detection" },
    { icon: BarChart3, value: "SDG #3", label: "Health & Wellness" },
];

export default function Home() {
    const heroRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<HTMLSpanElement>(null);
    const getStartedRef = useRef<HTMLButtonElement>(null);
    const signInRef = useRef<HTMLButtonElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const glowOrbRef = useRef<HTMLDivElement>(null);

    // animated glow orb that follows scroll
    useEffect(() => {
        if (!glowOrbRef.current) return;
        const orb = glowOrbRef.current;
        gsap.set(orb, { xPercent: -50, yPercent: -50 });

        // slow float animation
        const float = gsap.to(orb, {
            x: "+=80",
            y: "+=40",
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // pulse opacity
        const pulse = gsap.to(orb, {
            opacity: 0.4,
            scale: 1.2,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        return () => { float.kill(); pulse.kill(); };
    }, []);

    // hero stagger entrance with more dramatic animations
    useEffect(() => {
        if (!heroRef.current) return;
        const items = heroRef.current.querySelectorAll(".hero-item");
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(items[0], { opacity: 0, y: -20, scale: 0.9, duration: 0.5, delay: 0.2 })
          .from(items[1], { opacity: 0, scale: 0.8, rotation: -5, duration: 0.7, ease: "back.out(1.5)" }, "-=0.2")
          .from(items[2], { opacity: 0, y: 24, duration: 0.5 }, "-=0.3")
          .from(items[3], { opacity: 0, y: 24, duration: 0.5 }, "-=0.2");
    }, []);

    // feature cards — ScrollTrigger reveal
    useEffect(() => {
        if (!gridRef.current) return;
        const cards = gridRef.current.querySelectorAll(".feature-card");
        const icons = gridRef.current.querySelectorAll(".feature-icon");

        // ScrollTrigger stagger reveal
        gsap.from(cards, {
            opacity: 0,
            y: 60,
            scale: 0.9,
            rotationX: -15,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

        // icon bounce after cards appear
        gsap.from(icons, {
            scale: 0,
            rotation: -180,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.3,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });

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

    // stats section — ScrollTrigger
    useEffect(() => {
        if (!statsRef.current) return;
        const items = statsRef.current.querySelectorAll(".stat-item");
        gsap.from(items, {
            opacity: 0,
            y: 30,
            scale: 0.9,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
            },
        });
    }, []);

    // infinite arrow bounce
    useEffect(() => {
        if (!arrowRef.current) return;
        const tween = gsap.to(arrowRef.current, { x: 6, duration: 0.75, repeat: -1, yoyo: true, ease: "sine.inOut" });
        return () => { tween.kill(); };
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
            <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-28 relative overflow-hidden">
                {/* ambient particles */}
                <FloatingParticles count={25} />

                {/* large glow orb */}
                <div
                    ref={glowOrbRef}
                    className="absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{
                        background: "radial-gradient(circle, rgb(var(--m3-primary) / 0.08), transparent 70%)",
                        filter: "blur(60px)",
                        opacity: 0.3,
                    }}
                />

                <div ref={heroRef} className="text-center max-w-lg relative z-10">
                    <Magnetic strength={0.15}>
                        <div className="hero-item inline-flex items-center gap-1.5 px-3 py-1 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container text-xs font-medium mb-5">
                            <Sparkles size={12} /> AI-Powered Financial Wellness
                        </div>
                    </Magnetic>
                    <div className="hero-item">
                        <Image src="/zenith-logo.png" alt="Zenith" width={400} height={260} className="mx-auto w-96" priority />
                    </div>
                    <div className="hero-item mt-4">
                        <TextReveal
                            text="Your guardian against impulse spending."
                            as="p"
                            className="text-m3-on-surface-variant text-lg leading-relaxed"
                            delay={0.6}
                        />
                        <p className="text-m3-primary font-medium mt-1">Powered by AI. Driven by wellness.</p>
                    </div>
                    <div className="hero-item flex gap-4 justify-center mt-8">
                        <Magnetic strength={0.2}>
                            <Link href="/register">
                                <button ref={getStartedRef} className="m3-btn-filled flex items-center gap-2 px-8">
                                    Get Started <span ref={arrowRef}><ArrowRight size={16} /></span>
                                </button>
                            </Link>
                        </Magnetic>
                        <Magnetic strength={0.2}>
                            <Link href="/login">
                                <button ref={signInRef} className="m3-btn-tonal px-8">Sign In</button>
                            </Link>
                        </Magnetic>
                    </div>
                </div>

                {/* stats strip */}
                <div ref={statsRef} className="flex flex-wrap justify-center gap-8 mt-16 relative z-10">
                    {stats.map((s) => (
                        <div key={s.label} className="stat-item flex items-center gap-3 px-5 py-3 rounded-m3-xl bg-m3-surface-container/80 backdrop-blur-sm border border-m3-outline-variant/20">
                            <div className="p-2 rounded-m3-lg bg-m3-primary-container/50">
                                <s.icon size={18} className="text-m3-primary" />
                            </div>
                            <div>
                                <p className="text-m3-label-large text-m3-on-surface">{s.value}</p>
                                <p className="text-m3-label-small text-m3-on-surface-variant">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 max-w-3xl w-full relative z-10">
                    {features.map((f) => (
                        <TiltCard key={f.title} className="feature-card m3-card flex flex-col items-center text-center gap-3 cursor-default">
                            <div className={`feature-icon w-14 h-14 rounded-m3-lg ${f.color} flex items-center justify-center`}>
                                <f.icon className={f.iconColor} size={26} />
                            </div>
                            <h3 className="font-semibold text-m3-on-surface">{f.title}</h3>
                            <p className="text-sm text-m3-on-surface-variant leading-relaxed">{f.desc}</p>
                        </TiltCard>
                    ))}
                </div>
            </main>
        </PageTransition>
    );
}
