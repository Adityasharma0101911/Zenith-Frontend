// this protects the page from logged out users
"use client";

// import useEffect and useState to run code when the page loads
import { useEffect, useState } from "react";

// import useRouter to redirect if not logged in
import { useRouter } from "next/navigation";

// import the api url from our utils
import { API_URL } from "@/utils/api";

export default function DashboardPage() {
    const router = useRouter();

    // this stores the user data from the backend
    const [userData, setUserData] = useState<{ username: string; balance: number; dosha: string | null } | null>(null);

    // this fetches and shows the user data
    useEffect(() => {
        // get the token from localStorage
        const token = localStorage.getItem("token");

        // if there is no token, send them back to login
        if (!token) {
            router.push("/login");
            return;
        }

        // fetch the user data from the backend with the token
        fetch(`${API_URL}/api/user_data`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                // if we got an error, redirect to login
                if (data.error) {
                    router.push("/login");
                
                } else if (!data.dosha) {
                    router.push("/onboarding");
                } else {
                    // save the user data to state
                    setUserData(data);
                }
            });
    }, [router]);

    // this logs the user out by deleting their token
    function handleLogout() {
        // remove the token from localStorage
        localStorage.removeItem("token");

        // redirect back to the login page
        router.push("/login");
    }

    return (
        <main className="min-h-screen bg-white p-8">
            {/* logout button at the top right */}
            <div className="flex justify-end">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white rounded-full px-6 py-2 hover:opacity-90 transition"
                >
                    Logout
                </button>
            </div>

            {/* show the user data once it loads */}
            <div className="flex flex-col items-center justify-center mt-20">
                {userData ? (
                    <>
                        <h1 className="text-4xl font-bold">Welcome, {userData.username}</h1>
                        <p className="text-xl mt-4 text-gray-600">Balance: ${userData.balance.toFixed(2)}</p>
                        {userData.dosha && (
                            <p className="text-lg mt-2 text-gray-500">Dosha: {userData.dosha}</p>
                        )}
                    </>
                ) : (
                    <h1 className="text-4xl font-bold">Loading...</h1>
                )}
            </div>
        </main>
    );
}
