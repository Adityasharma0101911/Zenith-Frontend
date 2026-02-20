// habit tracking calendar heatmap
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL } from "@/utils/api";
import InteractiveCard from "./InteractiveCard";

interface LogDay {
    date: string;       // YYYY-MM-DD
    stress_level: number;
}

export default function CalendarHeatmap({ refreshTrigger }: { refreshTrigger: number }) {
    const [history, setHistory] = useState<LogDay[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${API_URL}/api/pulse_history`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.history) setHistory(data.history);
            })
            .catch(err => console.error(err));
    }, [refreshTrigger]);

    // generate last 84 days (12 weeks)
    const days = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        // timezone safe ISO string
        const offset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d.getTime() - offset)).toISOString().split('T')[0];
        days.push(localISOTime);
    }

    // map data for quick lookup
    const historyMap = history.reduce((acc, log) => {
        acc[log.date] = log.stress_level;
        return acc;
    }, {} as Record<string, number>);

    function getColorClass(val: number | undefined) {
        if (!val) return "bg-m3-surface-container-high border border-m3-outline-variant/30";
        if (val <= 3) return "bg-[#3B6B3B]/80 border border-[#3B6B3B]"; // green
        if (val <= 5) return "bg-[#A7C8E0]/80 border border-[#A7C8E0]"; // blue/teal depending on theme
        if (val <= 7) return "bg-m3-primary border border-m3-primary";
        return "bg-m3-error border border-m3-error"; // red
    }

    return (
        <InteractiveCard className="p-5 w-full mt-5 overflow-hidden" glowColor="rgba(var(--m3-primary), 0.1)">
            <h3 className="text-m3-title-small text-m3-on-surface mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-m3-primary animate-pulse" />
                Pulse History (12 Weeks)
            </h3>

            <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
                <div className="grid grid-flow-col grid-rows-7 gap-[3px] min-w-max">
                    {days.map((day, idx) => (
                        <motion.div
                            key={day}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.005, duration: 0.2 }}
                            whileHover={{ scale: 1.5, zIndex: 10 }}
                            className={`w-3.5 h-3.5 rounded-sm transition-colors duration-300 ${getColorClass(historyMap[day])}`}
                            title={historyMap[day] ? `Stress: ${historyMap[day]}/10 on ${day}` : `No data on ${day}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-1 mt-3">
                <span className="text-[10px] text-m3-on-surface-variant mr-1">Less</span>
                <div className={`w-3 h-3 rounded-sm bg-m3-surface-container-high border border-m3-outline-variant/30`} />
                <div className={`w-3 h-3 rounded-sm bg-[#3B6B3B]/80 border border-[#3B6B3B]`} />
                <div className={`w-3 h-3 rounded-sm bg-[#A7C8E0]/80 border border-[#A7C8E0]`} />
                <div className={`w-3 h-3 rounded-sm bg-m3-primary border border-m3-primary`} />
                <div className={`w-3 h-3 rounded-sm bg-m3-error border border-m3-error`} />
                <span className="text-[10px] text-m3-on-surface-variant ml-1">More</span>
            </div>
        </InteractiveCard>
    );
}
