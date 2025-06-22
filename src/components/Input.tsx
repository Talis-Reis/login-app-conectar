import { ChangeEvent } from "react";

export default function Input({
	type = "text",
	value,
	onChange,
	label,
	required = true,
}: {
	type?: string;
	placeholder?: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	label: string;
	required?: boolean;
}) {
	return (
		<div className="mb-4">
			<label className="block mb-1 text-sm font-medium text-green-900">
				{label}
			</label>
			<input
				type={type}
				value={value}
				onChange={onChange}
				className="w-full px-4 py-2 border border-green-200 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition text-black"
				required={required}
			/>
		</div>
	);
}
