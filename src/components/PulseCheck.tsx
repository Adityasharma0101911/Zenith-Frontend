// material design 3 pulse check stress slider with gsap animations
"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Activity, Check } from "lucide-react";
import { API_URL } from "@/utils/api";

function getStressColor(level: number) {
    if (level <= 4) return "text-m3-primary";
    if (level <= 7) return "text-m3-tertiary";
    return "text-m3-error";
}

function getStressBg(level: number) {
    if (level <= 4) return "bg-m3-primary/5";
    if (level <= 7) return "bg-m3-tertiary/5";
    return "bg-m3-error/5";
}

function getStressLabel(level: number) {
    if (level <= 4) return "Calm";
    if (level <= 7) return "Moderate";
    return "High Stress";
}

export default function PulseCheck({ triggerRefresh }: { triggerRefresh: () => void }) {
    const [stress, setStress] = useState(5);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const cardRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const numberRef = useRef<HTMLParagraphElement>(null);
    const labelRef = useRef<HTMLParagraphElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const savedRef = useRef<HTMLParagraphElement>(null);
    const errorRef = useRef<HTMLParagraphElement>(null);

    // card hover
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const enter = () => gsap.to(el, { y: -3, duration: 0.25, ease: "power3.out" });
        const leave = () => gsap.to(el, { y: 0, duration: 0.25, ease: "power3.out" });
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
    }, []);

    // icon bounce entrance
    useEffect(() => {
        if (!iconRef.current) return;
        gsap.from(iconRef.current, { scale: 0, duration: 0.5, delay: 0.1, ease: "back.out(2)" });
    }, []);

    // animate stress number change
    useEffect(() => {
        if (!numberRef.current) return;
        gsap.from(numberRef.current, { scale: 0.8, opacity: 0, y: -15, duration: 0.35, ease: "back.out(1.5)" });
    }, [stress]);

    // animate label change
    useEffect(() => {
        if (!labelRef.current) return;
        gsap.from(labelRef.current, { opacity: 0, duration: 0.2 });
    }, [stress]);

    // button hover
    useEffect(() => {
        const el = btnRef.current;
        if (!el) return;
        const enter = () => gsap.to(el, { scale: 1.03, y: -1, duration: 0.2, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, y: 0, duration: 0.2, ease: "power3.out" });
        const down = () => gsap.to(el, { scale: 0.95, duration: 0.1 });
        const up = () => gsap.to(el, { scale: 1.03, duration: 0.15, ease: "power3.out" });
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        el.addEventListener("mousedown", down);
        el.addEventListener("mouseup", up);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); el.removeEventListener("mouseup", up); };
    }, []);

    // animate saved message
    useEffect(() => {
        if (saved && savedRef.current) {
            gsap.from(savedRef.current, { opacity: 0, y: 8, scale: 0.9, duration: 0.35, ease: "back.out(1.5)" });
        }
    }, [saved]);

    // animate error message
    useEffect(() => {
        if (error && errorRef.current) {
            gsap.from(errorRef.current, { opacity: 0, duration: 0.3 });
        }
    }, [error]);

    async function handleUpdateStress() {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${API_URL}/api/update_stress`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ new_stress_level: stress }),
            });
            setError("");
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            triggerRefresh();
        } catch {
            setError("Could not connect to server.");
        }
    }

    return (
        <div ref={cardRef} className="bg-m3-surface-container-low rounded-m3-xl shadow-m3-1 p-6 w-full transition-shadow hover:shadow-m3-2">
            <div className="flex items-center gap-2.5">
                <div ref={iconRef} className="p-1.5 rounded-m3-full bg-m3-secondary-container">
                    <Activity className="text-m3-on-secondary-container" size={18} />
                </div>
                <h2 className="text-m3-title-medium text-m3-on-surface">Pulse Check</h2>
            </div>

            <div className={`rounded-m3-lg p-3 mt-4 transition-colors duration-500 ${getStressBg(stress)}`}>
                <p ref={numberRef} className={`text-5xl font-bold text-center ${getStressColor(stress)}`}>{stress}</p>
                <p ref={labelRef} className={`text-m3-label-large text-center mt-1 ${getStressColor(stress)}`}>{getStressLabel(stress)}</p>
            </div>

            <input type="range" min={1} max={10} value={stress} onChange={(e) => setStress(Number(e.target.value))} className="w-full mt-5 accent-m3-primary h-1.5 rounded-full bg-m3-surface-container-highest" />
            <div className="flex justify-between text-m3-label-small text-m3-on-surface-variant mt-1">
                <span>1</span><span>10</span>
            </div>

            <button ref={btnRef} onClick={handleUpdateStress} className="m3-btn-tonal w-full mt-5">Log Pulse</button>

            {saved && (
                <p ref={savedRef} className="mt-3 text-center text-sm font-medium text-m3-primary flex items-center justify-center gap-1">
                    <Check size={14} /> Saved
                </p>
            )}
            {error && (
                <p ref={errorRef} className="mt-3 text-center text-sm font-medium text-m3-error">{error}</p>
            )}
        </div>
    );
}
