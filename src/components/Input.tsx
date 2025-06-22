import { ChangeEvent, useState } from "react";

export default function Input({
	type = "text",
	value,
	onChange,
	label,
	required = true,
}: {
	type?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	label: string;
	required?: boolean;
}) {
	const [showPassword, setShowPassword] = useState(false);

	const isPassword = type === "password";
	const inputType = isPassword && showPassword ? "text" : type;

	return (
		<div className="mb-4">
			<label className="block mb-1 text-sm font-medium text-green-900">
				{label}
			</label>
			<div className="relative">
				<input
					type={inputType}
					value={value}
					onChange={onChange}
					className="w-full px-4 py-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition text-black pr-10"
					required={required}
				/>
				{isPassword && (
					<button
						type="button"
						className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700"
						onClick={() => setShowPassword((v) => !v)}
						tabIndex={-1}
					>
						{showPassword ? "🙈" : "👁️"}
					</button>
				)}
			</div>
		</div>
	);
}
