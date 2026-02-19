// zenith scholar - jarvis-style ai tutor dashboard
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lightbulb, Target, Layers } from "lucide-react";
import JarvisDashboard from "@/components/JarvisDashboard";
import PageTransition from "@/components/PageTransition";
import type { StatDef, RingDef } from "@/components/JarvisDashboard";

// stat cards derived from survey data
const STATS: StatDef[] = [
    { label: "Education", key: "education_level", icon: GraduationCap },
    { label: "Learning Style", key: "learning_style", icon: Lightbulb },
    {
        label: "Interests",
        key: "subjects",
        icon: Layers,
        format: (v) => (Array.isArray(v) ? v.join(", ") : String(v)),
    },
    {
        label: "Study Goals",
        key: "study_goals",
        icon: Target,
        format: (v) => (Array.isArray(v) ? `${v.length} goals set` : String(v)),
    },
];

// score rings derived from survey
const RINGS: RingDef[] = [
    { label: "Academic Focus", key: "study_goals", color: "var(--m3-tertiary-hex)", score: (v) => Array.isArray(v) ? Math.min(100, Math.round((v.length / 6) * 100)) : 0 },
    { label: "Engagement", key: "subjects", color: "var(--m3-primary-hex)", score: (v) => Array.isArray(v) ? Math.min(100, Math.round((v.length / 8) * 100)) : 0 },
    { label: "Discipline", key: "education_level", color: "var(--m3-secondary-hex)", score: (v) => ({ "High School": 30, "Undergraduate": 55, "Graduate": 75, "Professional": 90, "Self-taught": 60 }[String(v)] ?? 0) },
];

export default function ScholarPage() {
    const router = useRouter();

    // redirect if not logged in
    useEffect(() => {
        if (!localStorage.getItem("token")) router.push("/login");
    }, [router]);

    return (
        <PageTransition>
            <main className="h-screen relative pl-0 md:pl-[220px] overflow-hidden">
                <JarvisDashboard
                    section="scholar"
                    title="Zenith Scholar"
                    subtitle="Your intellectual AI tutor"
                    headerIcon={GraduationCap}
                    accentContainer="bg-m3-tertiary-container"
                    accentText="text-m3-on-tertiary-container"
                    accentBorder="border-m3-tertiary"
                    stats={STATS}
                    rings={RINGS}
                    placeholder="Ask Scholar anything..."
                />
            </main>
        </PageTransition>
    );
}
