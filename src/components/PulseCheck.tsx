// this creates the slider for the user to set their stress
"use client";

// import useState to track the slider value and saved message
import { useState } from "react";

// import activity icon for the pulse branding
import { Activity } from "lucide-react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// this makes the stress slider change colors based on the value
function getStressColor(level: number) {
    // green/teal for calm levels 1-4
    if (level <= 4) return "text-teal-600";
    // orange for medium stress levels 5-7
    if (level <= 7) return "text-orange-500";
    // red for high stress levels 8-10
    return "text-red-600";
}

// this gets a label based on stress level
function getStressLabel(level: number) {
    if (level <= 4) return "Calm";
    if (level <= 7) return "Moderate";
    return "High Stress";
}

// this accepts triggerRefresh so it can tell the ai to update
export default function PulseCheck({ triggerRefresh }: { triggerRefresh: () => void }) {
    // this stores the current stress level from the slider
    const [stress, setStress] = useState(5);

    // this stores the saved message
    const [saved, setSaved] = useState(false);

    // this stores the error message if something goes wrong
    const [error, setError] = useState("");

    // this sends the new stress level to the backend
    async function handleUpdateStress() {
        // get the token from localStorage
        const token = localStorage.getItem("token");

        // this adds error catching in case the server is down
        try {
            // send a post request with the new stress level
            await fetch(`${API_URL}/api/update_stress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ new_stress_level: stress }),
            });

            // clear any old errors
            setError("");

            // show the saved message
            setSaved(true);

            // hide the saved message after 2 seconds
            setTimeout(() => setSaved(false), 2000);

            // this triggers the ai update when stress changes
            triggerRefresh();
        } catch {
            // this shows the error if the server is down
            setError("Could not connect to server.");
        }
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-lg p-6 w-80">
            {/* title with activity icon */}
            <div className="flex items-center gap-2">
                <Activity className="text-zenith-teal" size={22} />
                <h2 className="text-xl font-bold">Pulse Check</h2>
            </div>

            {/* show the current stress number with dynamic color */}
            <p className={`text-5xl font-bold mt-4 text-center transition-colors duration-300 ${getStressColor(stress)}`}>
                {stress}
            </p>

            {/* dynamic label that changes with stress level */}
            <p className={`text-sm font-medium text-center mt-1 transition-colors duration-300 ${getStressColor(stress)}`}>
                {getStressLabel(stress)}
            </p>

            {/* the range slider from 1 to 10 with modern teal accent */}
            <input
                type="range"
                min={1}
                max={10}
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full mt-4 accent-teal-600 h-2 rounded-full"
            />

            {/* labels for the slider */}
            <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1</span>
                <span>10</span>
            </div>

            {/* log pulse button with smooth animations */}
            <button
                onClick={handleUpdateStress}
                className="bg-zenith-teal text-white rounded-full p-4 w-full mt-4 hover:opacity-90 transition-all duration-300"
            >
                Log Pulse
            </button>

            {/* show saved message when successful */}
            {saved && (
                <p className="mt-3 text-center text-sm font-medium text-green-600">✅ Saved!</p>
            )}

            {/* this shows the error message in red if something broke */}
            {error && (
                <p className="mt-3 text-center text-sm font-medium text-red-500">{error}</p>
            )}
        </div>
    );
}
