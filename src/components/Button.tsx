// reusable primary button component

// this takes an onClick handler and children to display inside the button
export default function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="bg-zenith-teal text-white rounded-full p-4 hover:opacity-90 transition"
        >
            {children}
        </button>
    );
}
