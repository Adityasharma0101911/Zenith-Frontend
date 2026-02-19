// material design 3 reusable filled button
export default function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="m3-btn-filled"
        >
            {children}
        </button>
    );
}
