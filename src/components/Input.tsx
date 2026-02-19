// material design 3 reusable outlined input
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
            className="m3-input-outlined"
        />
    );
}
