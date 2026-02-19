// zenith scholar - jarvis-style ai tutor dashboard
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lightbulb, Target, Layers } from "lucide-react";
import JarvisDashboard from "@/components/JarvisDashboard";
import PageTransition from "@/components/PageTransition";
import type { StatDef } from "@/components/JarvisDashboard";

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
                    placeholder="Ask Scholar anything..."
                />
            </main>
        </PageTransition>
    );
}
