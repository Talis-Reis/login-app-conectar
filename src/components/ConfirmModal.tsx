import { User } from "@/@types/user.type";

export default function ConfirmModal({
	open,
	onClose,
	onConfirm,
	user,
}: {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	user?: User;
}) {
	if (!open || !user) return null;
	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
			<div className="relative w-full flex justify-center">
				<div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm pointer-events-auto border border-green-700">
					<h2 className="text-lg font-bold mb-4 text-green-700">
						Confirmar deleção
					</h2>
					<p className="mb-6 text-gray-700">
						Tem certeza que deseja excluir o usuário{" "}
						<span className="font-semibold">{user.email}</span>?
					</p>
					<div className="flex justify-end gap-2">
						<button
							onClick={onClose}
							className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
						>
							Cancelar
						</button>
						<button
							onClick={onConfirm}
							className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
						>
							Excluir
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
