import { ReactNode } from "react";

export default function Background({children}: {children: ReactNode}) {
	return (
		<div className="relative min-h-screen flex items-center justify-center">
			<div
				className="absolute inset-0 z-0"
				style={{
					backgroundImage: "url('/assets/images/green-apples.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					filter: "brightness(0.7) blur(1px)",
				}}
			/>
			<div className="absolute inset-0 bg-black opacity-40 z-10" />
			<main className="relative z-20 flex items-center justify-center w-full min-h-screen">
				{children}
			</main>
		</div>
	);
}
