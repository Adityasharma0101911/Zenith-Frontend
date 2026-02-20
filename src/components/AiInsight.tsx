// material design 3 ai insight card with gsap typing reveal
"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Sparkles } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function AiInsight({ refreshTrigger }: { refreshTrigger: number }) {
    const [advice, setAdvice] = useState("");
    const [displayedText, setDisplayedText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const typingRef = useRef<NodeJS.Timeout | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);

    // typing effect
    function typeText(fullText: string) {
        if (typingRef.current) clearInterval(typingRef.current);
        setDisplayedText("");
        let i = 0;
        typingRef.current = setInterval(() => {
            if (i < fullText.length) {
                setDisplayedText(fullText.slice(0, i + 1));
                i++;
            } else {
                if (typingRef.current) clearInterval(typingRef.current);
            }
        }, 20);
    }

    // fetch ai advice
    async function fetchAdvice() {
        const cacheKey = "zenith_dashboard_insight";
        if (refreshTrigger === 0) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) { setAdvice(cached); setIsLoading(false); typeText(cached); return; }
        }
        const token = localStorage.getItem("token");
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/ai/insights`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setAdvice(data.advice); setIsLoading(false); typeText(data.advice);
            localStorage.setItem(cacheKey, data.advice);
        } catch {
            const fallback = "Zenith AI is currently offline. Please try again later.";
            setAdvice(fallback); setIsLoading(false); typeText(fallback);
        }
    }

    useEffect(() => {
        fetchAdvice();
        return () => { if (typingRef.current) clearInterval(typingRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTrigger]);

    // card float animation
    useEffect(() => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, { y: -4, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        const el = cardRef.current;
        const enter = () => gsap.to(el, { scale: 1.01, duration: 0.2, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, duration: 0.2, ease: "power3.out" });
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
    }, []);

    // header entrance
    useEffect(() => {
        if (!headerRef.current) return;
        gsap.from(headerRef.current, { opacity: 0, x: -12, duration: 0.4, ease: "power3.out" });
    }, []);

    // icon wiggle
    useEffect(() => {
        if (!iconRef.current) return;
        gsap.to(iconRef.current, { rotation: 15, duration: 0.75, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, []);

    // loading dots pulse
    useEffect(() => {
        if (!dotsRef.current || !isLoading) return;
        const dots = dotsRef.current.querySelectorAll(".ai-dot");
        dots.forEach((dot, i) => {
            gsap.to(dot, { opacity: 0.3, duration: 0.5, repeat: -1, yoyo: true, delay: i * 0.2, ease: "sine.inOut" });
        });
    }, [isLoading]);

    // blinking cursor
    useEffect(() => {
        if (!cursorRef.current) return;
        gsap.to(cursorRef.current, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true, ease: "steps(1)" });
    }, []);

    return (
        <div ref={cardRef} className="bg-m3-inverse-surface rounded-m3-xl p-6 w-full shadow-m3-3 transition-shadow hover:shadow-m3-4">
            <div ref={headerRef} className="flex items-center gap-2.5 mb-3">
                <div ref={iconRef} className="p-2 rounded-m3-full bg-m3-primary-container">
                    <Sparkles className="text-m3-on-primary-container" size={18} />
                </div>
                <h2 className="text-m3-title-medium text-m3-inverse-on-surface">Zenith AI Insight</h2>
            </div>

            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div ref={dotsRef} className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="ai-dot w-1.5 h-1.5 rounded-full bg-m3-primary-container" />
                        ))}
                    </div>
                    <span className="text-m3-inverse-on-surface/50 text-m3-body-medium">Analyzing your vault...</span>
                </div>
            ) : (
                <p className="text-m3-inverse-on-surface/75 text-m3-body-medium leading-relaxed">
                    {displayedText}
                    {displayedText.length < advice.length && (
                        <span ref={cursorRef} className="inline-block w-0.5 h-4 bg-m3-primary-container ml-0.5 align-text-bottom" />
                    )}
                </p>
            )}
        </div>
    );
}
