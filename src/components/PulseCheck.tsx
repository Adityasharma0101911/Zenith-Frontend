// this creates the slider for the user to set their stress
"use client";

// import useState to track the slider value and saved message
import { useState } from "react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

export default function PulseCheck() {
    // this stores the current stress level from the slider
    const [stress, setStress] = useState(5);

    // this stores the saved message
    const [saved, setSaved] = useState(false);

    // this sends the new stress level to the backend
    async function handleUpdateStress() {
        // get the token from localStorage
        const token = localStorage.getItem("token");

        // send a post request with the new stress level
        await fetch(`${API_URL}/api/update_stress`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ new_stress_level: stress }),
        });

        // show the saved message
        setSaved(true);

        // hide the saved message after 2 seconds
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            {/* title */}
            <h2 className="text-xl font-bold">Current Stress Level</h2>

            {/* show the current stress number */}
            <p className="text-4xl text-zenith-teal font-semibold mt-2 text-center">{stress}</p>

            {/* the range slider from 1 to 10 */}
            <input
                type="range"
                min={1}
                max={10}
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full mt-4 accent-zenith-teal"
            />

            {/* labels for the slider */}
            <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Calm</span>
                <span>Stressed</span>
            </div>

            {/* log pulse button */}
            <button
                onClick={handleUpdateStress}
                className="bg-zenith-teal text-white rounded-full p-4 w-full mt-4 hover:opacity-90 transition"
            >
                Log Pulse
            </button>

            {/* show saved message when successful */}
            {saved && (
                <p className="mt-3 text-center text-sm font-medium text-green-600">✅ Saved!</p>
            )}
        </div>
    );
}
