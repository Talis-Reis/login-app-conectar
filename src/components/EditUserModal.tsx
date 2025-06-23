import { User } from "@/@types/user.type";
import { useEffect, useRef, useState } from "react";

export default function EditUserModal({
	open,
	onClose,
	onSave,
	onOpenEditRole,
	user,
}: {
	open: boolean;
	onClose: () => void;
	onSave: (updated: Partial<User>) => void;
	onOpenEditRole: (user: User) => void;
	user?: User | null;
}) {
	const [form, setForm] = useState<Partial<User>>(user || {});
	const firstInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open && user) {
			setForm(user);
			setTimeout(() => firstInputRef.current?.focus(), 100);
		}
	}, [open, user]);

	if (!open || !user) return null;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(form);
	};

	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
			<div className="relative w-full flex justify-center">
				<div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md pointer-events-auto border border-green-700">
					<h2 className="text-lg font-bold mb-4 text-green-700">
						Editar Usuário
					</h2>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<label className="flex flex-col gap-1">
							<span className="text-sm text-gray-700">Nome</span>
							<input
								ref={firstInputRef}
								name="firstName"
								type="text"
								value={form.firstName || ""}
								onChange={handleChange}
								className="px-3 py-2 rounded border border-gray-300 text-black"
								required
							/>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-sm text-gray-700">
								Sobrenome
							</span>
							<input
								name="lastName"
								type="text"
								value={form.lastName || ""}
								onChange={handleChange}
								className="px-3 py-2 rounded border border-gray-300 text-black"
								required
							/>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-sm text-gray-700">
								E-mail
							</span>
							<input
								name="email"
								type="email"
								value={form.email || ""}
								onChange={handleChange}
								className="px-3 py-2 rounded border border-gray-300 text-black"
								required
							/>
						</label>
						<div className="flex justify-between items-center mt-2">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
							>
								Cancelar
							</button>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => {
										onClose();
										setTimeout(() => {
											onOpenEditRole(user);
										}, 100);
									}}
									className="px-4 py-2 rounded bg-green-100 text-green-800 border border-green-700 hover:bg-green-200"
								>
									Alterar Permissão
								</button>
								<button
									type="submit"
									className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800"
								>
									Salvar
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
