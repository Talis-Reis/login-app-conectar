import { MouseEvent, ReactNode } from "react";

export default function Button({
	type = "button",
	onClick,
	children,
    disabled = false,
}: {
	type?: "button" | "submit" | "reset";
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
	children: ReactNode;
    disabled?: boolean;
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition`}
            disabled={disabled}
		>
			{children}
		</button>
	);
}
