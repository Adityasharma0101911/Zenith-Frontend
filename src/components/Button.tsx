// material design 3 reusable filled button
"use client";

export default function Button({ onClick, children, type = "button" }: { onClick?: () => void; children: React.ReactNode; type?: "button" | "submit" | "reset" }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="m3-btn-filled"
        >
            {children}
        </button>
    );
}
