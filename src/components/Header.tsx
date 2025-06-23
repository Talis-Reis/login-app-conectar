import { UserGroupIcon } from "@heroicons/react/16/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

export default function Header({
	onLogout,
	mainText,
	secondaryText,
}: {
	onLogout: () => void;
	mainText: string;
	secondaryText: string;
}) {
	return (
		<header className="bg-green-700 px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between shadow">
			<div className="flex items-center gap-4">
				<UserGroupIcon className="w-12 h-12 text-white drop-shadow" />
				<div>
					<div className="text-white text-xs mb-1 font-semibold tracking-widest uppercase">
						{mainText}
					</div>
					<h1 className="text-4xl font-bold text-white leading-tight drop-shadow">
						{secondaryText}
					</h1>
				</div>
			</div>
			<button
				onClick={onLogout}
				className="mt-4 md:mt-0 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded font-semibold transition"
				title="Sair"
			>
				<ArrowRightOnRectangleIcon className="w-6 h-6" />
				Logout
			</button>
		</header>
	);
}
