// this creates the fake store layout
"use client";

// import useState to track the response message
import { useState } from "react";

// import the api url from our utils
import { API_URL } from "@/utils/api";

// this takes a refreshData function so the dashboard can update the balance
export default function ShoppingWidget({ refreshData }: { refreshData: () => void }) {
    // this stores the response message from the backend
    const [message, setMessage] = useState("");

    // this stores the error message if something goes wrong
    const [error, setError] = useState("");

    // this sends the buy request to the interceptor
    async function handleBuy() {
        // get the token from localStorage
        const token = localStorage.getItem("token");

        // this adds error catching in case the server is down
        try {
            // send a post request with the item and amount
            const res = await fetch(`${API_URL}/api/transaction/attempt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: 150, item_name: "Headphones" }),
            });

            // parse the response from the backend
            const data = await res.json();

            // clear any old errors
            setError("");

            // show the status and reason if blocked, or the allowed message
            if (data.status === "BLOCKED") {
                setMessage(`❌ ${data.status}: ${data.reason}`);
            } else if (data.status === "ALLOWED") {
                setMessage(`✅ Purchase allowed! New balance: $${data.new_balance.toFixed(2)}`);

                // this updates the balance on the screen after buying
                refreshData();
            } else {
                setMessage("Something went wrong.");
            }
        } catch {
            // this shows the error if the server is down
            setError("Could not connect to server.");
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            {/* product name */}
            <h2 className="text-xl font-bold">Noise Cancelling Headphones</h2>

            {/* product price */}
            <p className="text-2xl text-zenith-teal font-semibold mt-2">$150.00</p>

            {/* product description */}
            <p className="text-gray-500 text-sm mt-1">Premium wireless headphones with ANC</p>

            {/* buy button with smooth animations */}
            <button
                onClick={handleBuy}
                className="bg-zenith-teal text-white rounded-full p-4 w-full mt-4 hover:opacity-90 transition-all duration-300"
            >
                Buy Now
            </button>

            {/* show the response message from the interceptor */}
            {message && (
                <p className="mt-3 text-center text-sm font-medium">{message}</p>
            )}

            {/* this shows the error message in red if something broke */}
            {error && (
                <p className="mt-3 text-center text-sm font-medium text-red-500">{error}</p>
            )}
        </div>
    );
}
