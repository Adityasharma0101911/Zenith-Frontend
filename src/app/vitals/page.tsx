// zenith vitals - jarvis-style health ai dashboard
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Dumbbell, Moon, Apple } from "lucide-react";
import JarvisDashboard from "@/components/JarvisDashboard";
import PageTransition from "@/components/PageTransition";
import type { StatDef } from "@/components/JarvisDashboard";

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
                    placeholder="Ask Vitals about your health..."
                />
            </main>
        </PageTransition>
    );
}
