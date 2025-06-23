import { User } from "@/@types/user.type";
import { useEffect, useState } from "react";

export default function EditRoleModal({
	open,
	onClose,
	onSave,
	currentRole,
	user,
}: {
	open: boolean;
	onClose: () => void;
	onSave: (role: string) => void;
	currentRole?: string;
	user?: User | null;
}) {
	const [role, setRole] = useState(currentRole || "");

	useEffect(() => {
		if (open) setRole(currentRole || "");
	}, [open, currentRole]);

	if (!open || !user) return null;

	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
			<div className="relative w-full flex justify-center">
				<div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-xs pointer-events-auto border border-green-700">
					<h2 className="text-lg font-bold mb-4 text-green-700">
						Alterar Permissão
					</h2>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							onSave(role);
						}}
						className="flex flex-col gap-4"
					>
						<label className="flex flex-col gap-1">
							<span className="text-sm text-gray-700">
								Selecione o novo papel
							</span>
							<select
								value={role}
								onChange={(e) => setRole(e.target.value)}
								className="px-3 py-2 rounded border border-gray-300 text-black"
								required
							>
								<option value="">Selecione...</option>
								<option value="admin">Admin</option>
								<option value="user">User</option>
							</select>
						</label>
						<div className="flex justify-end gap-2 mt-2">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
							>
								Cancelar
							</button>
							<button
								type="submit"
								className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800"
							>
								Salvar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
