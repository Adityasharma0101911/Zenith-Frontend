// this is the onboarding survey page
"use client";

// import useState to track form data
import { useState } from "react";

// import useRouter to redirect after finishing
import { useRouter } from "next/navigation";

// import the api url from our utils
import { API_URL } from "@/utils/api";

export default function OnboardingPage() {
    // this holds the current step number
    const [step, setStep] = useState(1);

    // this stores the user name from step 1
    const [name, setName] = useState("");

    // this stores the dosha type from step 2
    const [dosha, setDosha] = useState("");

    // this stores the bank balance from step 3
    const [balance, setBalance] = useState("");

    const router = useRouter();

    // this sets the user dosha type and moves to the next step
    function selectDosha(type: string) {
        setDosha(type);
        setStep(3);
    }

    // this sends the final data and finishes the survey
    async function handleFinish() {
        // get the user id from localStorage
        const userId = localStorage.getItem("user_id");

        // send a post request with all the collected data
        await fetch(`${API_URL}/api/onboarding`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                dosha: dosha,
                stress_level: name,
                balance: parseFloat(balance),
            }),
        });

        // redirect to the dashboard after saving
        router.push("/dashboard");
    }

    return (
        <main className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col gap-4 w-80">

                {/* step 1: ask for the user name */}
                {step === 1 && (
                    <>
                        <h1 className="text-2xl font-bold text-center">Step 1: What is your name?</h1>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-zenith-teal"
                        />
                        {/* this button moves to step 2 */}
                        <button
                            onClick={() => setStep(2)}
                            className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                        >
                            Next
                        </button>
                    </>
                )}

                {/* step 2: pick the dosha type */}
                {step === 2 && (
                    <>
                        <h1 className="text-2xl font-bold text-center">Step 2: Choose Your Type</h1>
                        {/* these buttons set the dosha and go to step 3 */}
                        <button
                            onClick={() => selectDosha("Vata")}
                            className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                        >
                            Vata (Anxious)
                        </button>
                        <button
                            onClick={() => selectDosha("Pitta")}
                            className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                        >
                            Pitta (Focused)
                        </button>
                        <button
                            onClick={() => selectDosha("Kapha")}
                            className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                        >
                            Kapha (Calm)
                        </button>
                    </>
                )}

                {/* step 3: enter balance and finish */}
                {step === 3 && (
                    <>
                        <h1 className="text-2xl font-bold text-center">Step 3: Current Bank Balance</h1>
                        <input
                            type="number"
                            placeholder="Enter your balance"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-zenith-teal"
                        />
                        {/* this sends the final data and finishes the survey */}
                        <button
                            onClick={handleFinish}
                            className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
                        >
                            Finish
                        </button>
                    </>
                )}

            </div>
        </main>
    );
}
