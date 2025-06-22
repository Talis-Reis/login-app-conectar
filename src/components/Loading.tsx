export default function Loading() {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
			<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-70"></div>
		</div>
	);
}
