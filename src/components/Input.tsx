// reusable input field with rounded corners

// this takes type, placeholder, and onChange to handle user input
export default function Input({
    type,
    placeholder,
    onChange,
}: {
    type: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-zenith-teal"
        />
    );
}
