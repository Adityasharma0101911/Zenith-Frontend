// this creates the ui box for the ai advice
"use client";

// this fetches the custom ai advice from the backend
import { useEffect, useState } from "react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// this tells the ai to rethink when data changes
export default function AiInsight({ refreshTrigger }: { refreshTrigger: number }) {
    // this stores the ai advice text
    const [advice, setAdvice] = useState("Zenith AI is analyzing your vault...");

    // this fetches the ai advice from the backend
    async function fetchAdvice() {
        // get the token from localStorage
        const token = localStorage.getItem("token");

        // try to fetch the advice from the backend
        try {
            // send a get request with the auth token
            const res = await fetch(`${API_URL}/api/ai/insights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // parse the response
            const data = await res.json();

            // set the advice text from the backend
            setAdvice(data.advice);
        } catch {
            // if the fetch fails, show a fallback message
            setAdvice("Zenith AI is currently offline. Please try again later.");
        }
    }

    // this runs the fetch when the page loads or when refreshTrigger changes
    useEffect(() => {
        fetchAdvice();
    }, [refreshTrigger]);

    return (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl shadow-lg shadow-teal-100/50 p-6 w-full">
            {/* ai brain icon and title */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🧠</span>
                <h2 className="text-lg font-bold text-teal-800">Zenith AI Insight</h2>
            </div>

            {/* the ai advice text */}
            <p className="text-teal-700 text-sm leading-relaxed">{advice}</p>
        </div>
    );
}
