// zenith guardian - jarvis-style financial ai dashboard
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet, TrendingUp, PiggyBank, Target } from "lucide-react";
import JarvisDashboard from "@/components/JarvisDashboard";
import PageTransition from "@/components/PageTransition";
import type { StatDef } from "@/components/JarvisDashboard";

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
                    placeholder="Ask Guardian about your finances..."
                />
            </main>
        </PageTransition>
    );
}
