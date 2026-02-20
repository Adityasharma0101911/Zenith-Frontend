// zenith guardian - jarvis-style financial ai dashboard
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet, TrendingUp, PiggyBank, Target } from "lucide-react";
import JarvisDashboard from "@/components/JarvisDashboard";
import PageTransition from "@/components/PageTransition";
import { GuardianUtilities } from "@/components/UtilityToolkit";
import type { StatDef, RingDef } from "@/components/JarvisDashboard";

// stat cards derived from survey data
const STATS: StatDef[] = [
    {
        label: "Balance",
        key: "balance",
        icon: Wallet,
        format: (v) => `$${Number(v || 0).toFixed(2)}`,
    },
    { label: "Spending Style", key: "spending_profile", icon: TrendingUp },
    { label: "Income", key: "income_range", icon: PiggyBank },
    {
        label: "Financial Goals",
        key: "financial_goals",
        icon: Target,
        format: (v) => (Array.isArray(v) ? `${v.length} goals set` : String(v)),
    },
];

// score rings derived from survey
const RINGS: RingDef[] = [
    { label: "Financial Security", key: "savings", color: "var(--m3-primary-hex)", score: (v) => ({ "None": 10, "Under $1,000": 30, "$1,000-$10,000": 55, "$10,000-$50,000": 75, "$50,000+": 95 }[String(v)] ?? 0) },
    { label: "Spending Habits", key: "spending_profile", color: "var(--m3-secondary-hex)", score: (v) => ({ "Cautious Saver": 90, "Balanced Planner": 65, "Impulse Spender": 30 }[String(v)] ?? 0) },
    { label: "Goal Setting", key: "financial_goals", color: "var(--m3-tertiary-hex)", score: (v) => Array.isArray(v) ? Math.min(100, Math.round((v.length / 6) * 100)) : 0 },
];

export default function GuardianPage() {
    const router = useRouter();

    // redirect if not logged in
    useEffect(() => {
        if (!localStorage.getItem("token")) router.push("/login");
    }, [router]);

    return (
        <PageTransition>
            <main className="h-screen relative pl-0 md:pl-[220px] overflow-hidden">
                <JarvisDashboard
                    section="guardian"
                    title="Zenith Guardian"
                    subtitle="Your financial AI advisor"
                    headerIcon={Wallet}
                    accentContainer="bg-m3-primary-container"
                    accentText="text-m3-on-primary-container"
                    accentBorder="border-m3-primary"
                    stats={STATS}
                    rings={RINGS}
                    placeholder="Ask Guardian about your finances..."
                    utilities={<GuardianUtilities accentText="text-m3-on-primary-container" />}
                />
            </main>
        </PageTransition>
    );
}
