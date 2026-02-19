// zenith vitals - jarvis-style health ai dashboard
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Dumbbell, Moon, Apple } from "lucide-react";
import JarvisDashboard from "@/components/JarvisDashboard";
import PageTransition from "@/components/PageTransition";
import type { StatDef, RingDef } from "@/components/JarvisDashboard";

// stat cards derived from survey data
const STATS: StatDef[] = [
    { label: "Exercise", key: "exercise_frequency", icon: Dumbbell },
    { label: "Sleep Quality", key: "sleep_quality", icon: Moon },
    { label: "Diet", key: "diet_quality", icon: Apple },
    {
        label: "Stress Level",
        key: "stress_level",
        icon: HeartPulse,
        format: (v) => `${v}/10`,
    },
];

// score rings derived from survey
const RINGS: RingDef[] = [
    { label: "Nutrition", key: "diet_quality", color: "var(--m3-primary-hex)", score: (v) => ({ "Needs improvement": 20, "Moderate": 45, "Healthy": 75, "Very healthy": 95 }[String(v)] ?? 0) },
    { label: "Exercise", key: "exercise_frequency", color: "var(--m3-secondary-hex)", score: (v) => ({ "Never": 10, "1-2 times/week": 35, "3-4 times/week": 60, "5+ times/week": 80, "Daily": 100 }[String(v)] ?? 0) },
    { label: "Rest & Recovery", key: "sleep_quality", color: "var(--m3-tertiary-hex)", score: (v) => ({ "Poor": 20, "Fair": 45, "Good": 70, "Excellent": 95 }[String(v)] ?? 0) },
];

export default function VitalsPage() {
    const router = useRouter();

    // redirect if not logged in
    useEffect(() => {
        if (!localStorage.getItem("token")) router.push("/login");
    }, [router]);

    return (
        <PageTransition>
            <main className="h-screen relative pl-0 md:pl-[220px] overflow-hidden">
                <JarvisDashboard
                    section="vitals"
                    title="Zenith Vitals"
                    subtitle="Your physical health AI coach"
                    headerIcon={HeartPulse}
                    accentContainer="bg-m3-secondary-container"
                    accentText="text-m3-on-secondary-container"
                    accentBorder="border-m3-secondary"
                    stats={STATS}
                    rings={RINGS}
                    placeholder="Ask Vitals about your health..."
                />
            </main>
        </PageTransition>
    );
}
