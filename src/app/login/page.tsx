// material design 3 login page with gsap animations
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { API_URL } from "@/utils/api";
import PageTransition from "@/components/PageTransition";
import FloatingParticles from "@/components/FloatingParticles";
import TiltCard from "@/components/TiltCard";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [buttonText, setButtonText] = useState("Sign in");
    const [success, setSuccess] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const iconContainerRef = useRef<HTMLDivElement>(null);
    const lockRef = useRef<HTMLDivElement>(null);
    const checkRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);
    const footerRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`${API_URL}/api/user_data`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => { if (!res.ok) throw new Error(); return res.json(); })
                .then(data => { if (!data.error) router.push("/dashboard"); })
                .catch(() => {});
        }
    }, [router]);

    // entrance animations
    useEffect(() => {
        if (cardRef.current) gsap.from(cardRef.current, { opacity: 0, y: 32, scale: 0.95, duration: 0.5, ease: "power3.out" });
        if (iconContainerRef.current) gsap.from(iconContainerRef.current, { scale: 0, rotation: -180, duration: 0.6, delay: 0.2, ease: "back.out(1.5)" });
        if (titleRef.current) gsap.from(titleRef.current, { opacity: 0, y: 10, duration: 0.4, delay: 0.3, ease: "power3.out" });
        if (subtitleRef.current) gsap.from(subtitleRef.current, { opacity: 0, duration: 0.3, delay: 0.4 });
        if (formRef.current) {
            gsap.from(formRef.current.querySelectorAll(".form-item"), { opacity: 0, y: 20, scale: 0.95, duration: 0.4, stagger: 0.1, delay: 0.4, ease: "power3.out" });
        }
        if (footerRef.current) gsap.from(footerRef.current, { opacity: 0, duration: 0.3, delay: 0.7 });
    }, []);

    // card hover
    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;
        const enter = () => gsap.to(el, { y: -2, boxShadow: "0 6px 16px rgba(0,0,0,0.12)", duration: 0.25, ease: "power3.out" });
        const leave = () => gsap.to(el, { y: 0, boxShadow: "var(--m3-shadow-2)", duration: 0.25, ease: "power3.out" });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
    }, []);

    // submit button hover
    useEffect(() => {
        const el = submitBtnRef.current;
        if (!el) return;
        const enter = () => !loading && gsap.to(el, { scale: 1.03, y: -1, duration: 0.2, ease: "power3.out" });
        const leave = () => gsap.to(el, { scale: 1, y: 0, duration: 0.2, ease: "power3.out" });
        const down = () => !loading && gsap.to(el, { scale: 0.95, duration: 0.1 });
        const up = () => !loading && gsap.to(el, { scale: 1.03, duration: 0.15 });
        el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave);
        el.addEventListener("mousedown", down); el.addEventListener("mouseup", up);
        return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); el.removeEventListener("mousedown", down); el.removeEventListener("mouseup", up); };
    }, [loading]);

    // success icon swap animation
    useEffect(() => {
        if (success && checkRef.current) {
            gsap.from(checkRef.current, { scale: 0, rotation: -90, duration: 0.4, ease: "back.out(1.5)" });
        }
    }, [success]);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setButtonText("Authenticating...");
        try {
            const res = await fetch(`${API_URL}/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
            if (!res.ok) throw new Error("Request failed");
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("token", data.token); setButtonText("Decrypting Vault..."); setSuccess(true);
                setTimeout(() => router.push("/dashboard"), 1500);
            } else {
                setButtonText("Sign in"); toast.error("Login failed. Check your username and password.");
            }
        } catch {
            setButtonText("Sign in"); toast.error("Could not connect to server.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageTransition>
            <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
                <FloatingParticles count={15} />
                <div ref={cardRef} className="w-full max-w-sm relative z-10">
                    <TiltCard className="rounded-m3-xl" maxTilt={5}>
                    <div ref={innerRef} className="bg-m3-surface-container-low/80 backdrop-blur-xl backdrop-saturate-150 rounded-m3-xl p-8 shadow-m3-2 border border-m3-outline-variant/15">
                        <div ref={iconContainerRef} className="w-16 h-16 rounded-m3-full bg-m3-primary-container flex items-center justify-center mx-auto mb-5">
                            {success ? (
                                <div ref={checkRef}><ShieldCheck className="text-m3-on-primary-container" size={28} /></div>
                            ) : (
                                <div ref={lockRef}><Lock className="text-m3-on-primary-container" size={28} /></div>
                            )}
                        </div>
                        <h1 ref={titleRef} className="text-m3-headline-small text-m3-on-surface text-center">Welcome back</h1>
                        <p ref={subtitleRef} className="text-m3-body-medium text-m3-on-surface-variant text-center mt-1">Sign in to your Zenith vault</p>
                        <form ref={formRef} onSubmit={handleLogin} className="flex flex-col gap-5 mt-8">
                            <div className="form-item relative">
                                <input type="text" placeholder=" " value={username} onChange={e => setUsername(e.target.value)} className="m3-input-outlined peer" required />
                                <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">Username</label>
                            </div>
                            <div className="form-item relative">
                                <input type="password" placeholder=" " value={password} onChange={e => setPassword(e.target.value)} className="m3-input-outlined peer" required />
                                <label className="absolute left-3 top-4 text-m3-on-surface-variant text-sm transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-m3-primary peer-focus:bg-m3-surface-container-low peer-focus:px-1 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-m3-surface-container-low peer-[:not(:placeholder-shown)]:px-1">Password</label>
                            </div>
                            <div className="form-item">
                                <button ref={submitBtnRef} type="submit" disabled={loading} className="m3-btn-filled w-full flex items-center justify-center gap-2 disabled:opacity-70">
                                    {loading && <Loader2 size={18} className="animate-spin" />}
                                    {buttonText}
                                </button>
                            </div>
                        </form>
                        <p ref={footerRef} className="text-center text-m3-body-medium text-m3-on-surface-variant mt-6">
                            New to Zenith? <Link href="/register" className="text-m3-primary font-medium hover:underline">Create account</Link>
                        </p>
                    </div>
                    </TiltCard>
                </div>
            </main>
        </PageTransition>
    );
}
