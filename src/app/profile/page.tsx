"use client";

import { User } from "@/@types/user.type";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState({email: "", firstName: "", lastName: ""});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [passwords, setPasswords] = useState({
		current: "",
		new: "",
		confirm: "",
	});
	const [passwordError, setPasswordError] = useState("");
	const [passwordSuccess, setPasswordSuccess] = useState("");

	useEffect(() => {
		const fetchProfile = async () => {
			setLoading(true);
			const token = localStorage.getItem("token");
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_HOST}/users/me`,
					{
						headers: {Authorization: `Bearer ${token}`},
					}
				);
				const data = await res.json();
				if (!res.ok)
					throw new Error(data.message || "Erro ao buscar usuário");
				setUser(data);
				setForm({
					email: data.email,
					firstName: data.firstName,
					lastName: data.lastName,
				});
			} catch (err: any) {
				setError(err.message || "Erro ao buscar usuário");
			} finally {
				setLoading(false);
			}
		};
		fetchProfile();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setForm((prev) => ({...prev, [name]: value}));
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
		const token = localStorage.getItem("token");
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_HOST}/users/change-user`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						email: form.email,
						firstName: form.firstName,
						lastName: form.lastName,
					}),
				}
			);
			if (!res.ok) throw new Error("Erro ao atualizar dados");
			setSuccess("Dados atualizados com sucesso!");
			setUser((prev) => prev && {...prev, ...form});
			setShowEditModal(false);
		} catch (err: any) {
			setError(err.message || "Erro ao atualizar dados");
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError("");
		setPasswordSuccess("");
		setLoading(true);
		const token = localStorage.getItem("token");
		if (passwords.new !== passwords.confirm) {
			setPasswordError("As senhas não coincidem.");
			setLoading(false);
			return;
		}
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_HOST}/users/change-password`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						currentPassword: passwords.current,
						newPassword: passwords.new,
					}),
				}
			);
			if (!res.ok) {
				let errorMsg = "Erro ao trocar senha";
				try {
					const data = await res.json();
					console.log("Password change error data:", data);
					if (data?.message) errorMsg = data.message;
				} catch {}
				throw new Error(errorMsg);
			}
			setPasswordSuccess("Senha alterada com sucesso!");
			setTimeout(() => setShowPasswordModal(false), 1500);
			setPasswords({current: "", new: "", confirm: ""});
		} catch (err: any) {
			console.log("Password change error:", err);
			setPasswordError(err.message || "Erro ao trocar senha");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("token_expires_at");
		router.replace("/login");
	};

	return (
		<div className="min-h-screen bg-gray-50 relative">
			{loading && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-transparent">
					<Loading />
				</div>
			)}
			<Header
				onLogout={handleLogout}
				mainText="Meu"
				secondaryText="Perfil"
			/>
			<div className="max-w-lg mx-auto mt-12 bg-white rounded shadow p-8">
				<h2 className="text-2xl font-bold mb-6 text-green-700">
					Meu Perfil
				</h2>
				{error && <div className="text-red-600 mb-4">{error}</div>}
				{success && (
					<div className="text-green-700 mb-4">{success}</div>
				)}
				<form onSubmit={handleUpdate} className="flex flex-col gap-4">
					<label>
						<span className="text-sm text-gray-700">Nome</span>
						<input
							type="text"
							name="firstName"
							value={form.firstName}
							onChange={handleChange}
							className="w-full px-3 py-2 rounded border border-gray-300 text-black"
							disabled={!editMode}
							required
						/>
					</label>
					<label>
						<span className="text-sm text-gray-700">Sobrenome</span>
						<input
							type="text"
							name="lastName"
							value={form.lastName}
							onChange={handleChange}
							className="w-full px-3 py-2 rounded border border-gray-300 text-black"
							disabled={!editMode}
							required
						/>
					</label>
					<label>
						<span className="text-sm text-gray-700">E-mail</span>
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							className="w-full px-3 py-2 rounded border border-gray-300 text-black"
							disabled={!editMode}
							required
						/>
					</label>
					<div className="flex gap-2 mt-4">
						{editMode ? (
							<>
								<button
									type="submit"
									className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800"
								>
									Salvar
								</button>
								<button
									type="button"
									onClick={() => {
										setEditMode(false);
										setForm({
											email: user?.email || "",
											firstName: user?.firstName || "",
											lastName: user?.lastName || "",
										});
									}}
									className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
								>
									Cancelar
								</button>
							</>
						) : (
							<>
								<button
									type="button"
									onClick={() => setShowEditModal(true)}
									className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800"
								>
									Editar Informações
								</button>
								<button
									type="button"
									onClick={() => setShowPasswordModal(true)}
									className="px-4 py-2 rounded bg-green-100 text-green-800 border border-green-700 hover:bg-green-200"
								>
									Trocar Senha
								</button>
							</>
						)}
					</div>
				</form>

				{/* Modal de troca de senha */}
				{showPasswordModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center">
						<div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm border border-green-700">
							<h3 className="text-lg font-bold mb-4 text-green-700">
								Trocar Senha
							</h3>
							<form
								onSubmit={handlePasswordChange}
								className="flex flex-col gap-4"
							>
								<input
									type="password"
									placeholder="Senha atual"
									value={passwords.current}
									onChange={(e) =>
										setPasswords((p) => ({
											...p,
											current: e.target.value,
										}))
									}
									className="px-3 py-2 rounded border border-gray-300 text-black"
									required
								/>
								<input
									type="password"
									placeholder="Nova senha"
									value={passwords.new}
									onChange={(e) =>
										setPasswords((p) => ({
											...p,
											new: e.target.value,
										}))
									}
									className="px-3 py-2 rounded border border-gray-300 text-black"
									required
								/>
								<input
									type="password"
									placeholder="Confirme a nova senha"
									value={passwords.confirm}
									onChange={(e) =>
										setPasswords((p) => ({
											...p,
											confirm: e.target.value,
										}))
									}
									className="px-3 py-2 rounded border border-gray-300 text-black"
									required
								/>
								{passwordError && (
									<div className="text-red-600">
										{passwordError}
									</div>
								)}
								{passwordSuccess && (
									<div className="text-green-700">
										{passwordSuccess}
									</div>
								)}
								<div className="flex gap-2 mt-2">
									<button
										type="submit"
										className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800"
									>
										Salvar
									</button>
									<button
										type="button"
										onClick={() => {
											setShowPasswordModal(false);
											setPasswords({
												current: "",
												new: "",
												confirm: "",
											});
											setPasswordError("");
											setPasswordSuccess("");
										}}
										className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
									>
										Cancelar
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* Modal de edição de informações */}
				{showEditModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center">
						<div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm border border-green-700">
							<h3 className="text-lg font-bold mb-4 text-green-700">
								Editar Informações
							</h3>
							<form
								onSubmit={handleUpdate}
								className="flex flex-col gap-4"
							>
								<label>
									<span className="text-sm text-gray-700">
										Nome
									</span>
									<input
										type="text"
										name="firstName"
										value={form.firstName}
										onChange={handleChange}
										className="w-full px-3 py-2 rounded border border-gray-300 text-black"
										required
									/>
								</label>
								<label>
									<span className="text-sm text-gray-700">
										Sobrenome
									</span>
									<input
										type="text"
										name="lastName"
										value={form.lastName}
										onChange={handleChange}
										className="w-full px-3 py-2 rounded border border-gray-300 text-black"
										required
									/>
								</label>
								<label>
									<span className="text-sm text-gray-700">
										E-mail
									</span>
									<input
										type="email"
										name="email"
										value={form.email}
										onChange={handleChange}
										className="w-full px-3 py-2 rounded border border-gray-300 text-black"
										required
									/>
								</label>
								<div className="flex gap-2 mt-2">
									<button
										type="submit"
										className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800"
									>
										Salvar
									</button>
									<button
										type="button"
										onClick={() => {
											setShowEditModal(false);
											setForm({
												email: user?.email || "",
												firstName:
													user?.firstName || "",
												lastName: user?.lastName || "",
											});
										}}
										className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
									>
										Cancelar
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
