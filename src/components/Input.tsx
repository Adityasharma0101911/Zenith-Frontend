// material design 3 reusable outlined input
"use client";

export default function Input({
    type,
    placeholder,
    value,
    onChange,
}: {
    type: string;
    placeholder: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="m3-input-outlined"
        />
    );
}
