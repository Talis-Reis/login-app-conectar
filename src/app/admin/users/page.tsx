"use client";

import Loading from "@/components/Loading";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
    ArrowRightOnRectangleIcon,
    UserGroupIcon,
} from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type User = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	roles: string[];
	firstAccess?: string | null;
	lastAccess?: string | null;
	createdAt?: string | null;
};

function ConfirmModal({
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

function EditUserModal({
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

function EditRoleModal({
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

function Header({onLogout}: {onLogout: () => void}) {
	return (
		<header className="bg-green-700 px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between shadow">
			<div className="flex items-center gap-4">
				<UserGroupIcon className="w-12 h-12 text-white drop-shadow" />
				<div>
					<div className="text-white text-xs mb-1 font-semibold tracking-widest uppercase">
						Listagem
					</div>
					<h1 className="text-4xl font-bold text-white leading-tight drop-shadow">
						Usuários
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

export default function AdminUsersPage() {
	const router = useRouter();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [showInactive, setShowInactive] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [filterName, setFilterName] = useState("");
	const [filterRole, setFilterRole] = useState("");

	const [sortBy, setSortBy] = useState<"firstName" | "createdAt">(
		"firstName"
	);
	const [order, setOrder] = useState<"asc" | "desc">("asc");

	const [editModalOpen, setEditModalOpen] = useState(false);
	const [userToEdit, setUserToEdit] = useState<User | null>(null);

	const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
	const [userToEditRole, setUserToEditRole] = useState<User | null>(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const expiresAt = localStorage.getItem("token_expires_at");
		if (!token || !expiresAt || Date.now() > Number(expiresAt)) {
			router.replace("/login");
			return;
		}
		try {
			const decoded: any = jwtDecode(token);
			if (
				!decoded.authorization ||
				!decoded.authorization.includes("admin")
			) {
				router.replace("/profile");
			}
		} catch {
			localStorage.removeItem("token");
			localStorage.removeItem("token_expires_at");
			router.replace("/login");
		}
	}, [router]);

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			setError("");
			try {
				const token = localStorage.getItem("token");
				const params = new URLSearchParams({
					pageIndex: String(page),
					pageSize: String(pageSize),
					firstName: filterName,
					sortBy,
					order,
				});
				if (filterRole) params.append("roles", filterRole);

				const endpoint = showInactive
					? `${
							process.env.NEXT_PUBLIC_API_HOST
					  }/users/inactives?${params.toString()}`
					: `${
							process.env.NEXT_PUBLIC_API_HOST
					  }/users?${params.toString()}`;

				const res = await fetch(endpoint, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await res.json();
				if (!res.ok)
					throw new Error(data.message || "Erro ao buscar usuários");

				setUsers(data.users || []);
				setPage(data.pageIndex || 1);
				setPageSize(data.pageSize || 10);

				const totalItems = data.totalItens || 0;
				setTotal(totalItems);

				const totalPagesCalc =
					totalItems > 0
						? Math.ceil(totalItems / (data.pageSize || 10))
						: 1;
				setTotalPages(totalPagesCalc);
			} catch (err: any) {
				setError(err.message || "Erro ao buscar usuários");
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, [page, pageSize, showInactive, filterName, filterRole, sortBy, order]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setPage(1);
	};

	const handleDelete = async () => {
		if (!userToDelete) return;
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_HOST}/users/${userToDelete.id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log("Resposta da API:", res);

			if (!res.ok) throw new Error("Erro ao deletar usuário");
			setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
			setModalOpen(false);
			setUserToDelete(null);
		} catch (err: any) {
			alert(err.message || "Erro ao deletar usuário");
		} finally {
			setLoading(false);
		}
	};

	const handleSort = (field: "firstName" | "createdAt") => {
		if (sortBy === field) {
			setOrder(order === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setOrder("asc");
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("token_expires_at");
		router.replace("/login");
	};

	const handleEditUser = (user: User) => {
		setUserToEdit(user);
		setEditModalOpen(true);
	};

	const handleSaveUser = async (updated: Partial<User>) => {
		if (!userToEdit) return;
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_HOST}/users/change-user/${userToEdit.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						email: updated.email || userToEdit.email,
						firstName: updated.firstName || userToEdit.firstName,
						lastName: updated.lastName || userToEdit.lastName,
					}),
				}
			);

			if (!res.ok) throw new Error("Erro ao atualizar usuário");
			setUsers((prev) =>
				prev.map((u) =>
					u.id === userToEdit.id ? {...u, ...updated} : u
				)
			);
			setEditModalOpen(false);
			setUserToEdit(null);
		} catch (err: any) {
			alert(err.message || "Erro ao atualizar usuário");
		} finally {
			setLoading(false);
		}
	};

	const handleOpenEditRole = (user: User) => {
		setUserToEditRole(user);
		setEditRoleModalOpen(true);
	};

	const handleSaveRole = async (role: string) => {
		if (!userToEditRole) return;
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_HOST}/users/${userToEditRole.id}/permissions`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({roles: [role]}),
				}
			);
			if (!res.ok) throw new Error("Erro ao atualizar permissão");
			setUsers((prev) =>
				prev.map((u) =>
					u.id === userToEditRole.id ? {...u, roles: [role]} : u
				)
			);
			setEditRoleModalOpen(false);
			setUserToEditRole(null);
		} catch (err: any) {
			alert(err.message || "Erro ao atualizar permissão");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const handler = (e: any) => {
			handleOpenEditRole(e.detail);
		};
		window.addEventListener("openEditRole", handler);
		return () => window.removeEventListener("openEditRole", handler);
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			<Header onLogout={handleLogout} />
			<ConfirmModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onConfirm={handleDelete}
				user={userToDelete || undefined}
			/>
			<EditUserModal
				open={editModalOpen}
				onClose={() => setEditModalOpen(false)}
				onSave={handleSaveUser}
				onOpenEditRole={handleOpenEditRole}
				user={userToEdit}
			/>
			<EditRoleModal
				open={editRoleModalOpen}
				onClose={() => setEditRoleModalOpen(false)}
				onSave={handleSaveRole}
				currentRole={userToEditRole?.roles?.[0]}
				user={userToEditRole}
			/>
			<div className="max-w-6xl mx-auto mt-8 px-4">
				<form
					onSubmit={handleSearch}
					className="flex flex-wrap gap-4 items-end mb-4"
				>
					<div className="flex-1 min-w-[180px]">
						<label className="block text-gray-700 text-sm mb-1">
							Nome
						</label>
						<input
							type="text"
							value={filterName}
							onChange={(e) => setFilterName(e.target.value)}
							className="w-full px-3 py-2 rounded bg-gray-100 border border-gray-200 focus:outline-none text-black"
						/>
					</div>
					<div className="flex-1 min-w-[180px]">
						<label className="block text-gray-700 text-sm mb-1">
							Papel
						</label>
						<select
							value={filterRole}
							onChange={(e) => setFilterRole(e.target.value)}
							className="w-full px-3 py-2 rounded bg-gray-100 border border-gray-200 focus:outline-none text-black"
						>
							<option value="">Nenhum</option>
							<option value="admin">Admin</option>
							<option value="user">User</option>
						</select>
					</div>
					<div className="flex-1 text-right">
						<button
							type="button"
							className={`bg-green-700 text-white rounded px-6 py-2 hover:bg-green-800 ${
								showInactive ? "bg-opacity-70" : ""
							}`}
							onClick={() => {
								setShowInactive((prev) => !prev);
								setPage(1);
							}}
						>
							{showInactive ? "Usuários" : "Usuários Inativos"}
						</button>
					</div>
				</form>

				<div className="text-gray-500 text-sm mb-2">
					Total de registros encontrados: {total}
				</div>

				<div className="bg-white rounded shadow p-2">
					{loading && <Loading />}
					{error && (
						<p className="text-red-500 text-sm mb-4 text-center">
							{error}
						</p>
					)}
					{!loading && !error && (
						<div className="overflow-x-auto relative">
							<table className="min-w-full bg-white">
								<thead>
									<tr className="border-b">
										<th className="px-4 py-2 text-gray-500 text-xs font-semibold text-left">
											ID
										</th>
										<th className="px-4 py-2 text-gray-500 text-xs font-semibold text-left">
											E-MAIL
										</th>
										<th
											className="px-4 py-2 text-gray-500 text-xs font-semibold text-left cursor-pointer select-none"
											onClick={() =>
												handleSort("firstName")
											}
										>
											NOME
											<span className="inline-block ml-1 align-middle">
												{sortBy === "firstName" ? (
													order === "asc" ? (
														"▲"
													) : (
														"▼"
													)
												) : (
													<span className="opacity-30">
														▲▼
													</span>
												)}
											</span>
										</th>
										<th className="px-4 py-2 text-gray-500 text-xs font-semibold text-left">
											SOBRENOME
										</th>
										<th className="px-4 py-2 text-gray-500 text-xs font-semibold text-left">
											PERFIS
										</th>
										<th
											className="px-4 py-2 text-gray-500 text-xs font-semibold text-left cursor-pointer select-none"
											onClick={() =>
												handleSort("createdAt")
											}
										>
											DATA DE CRIAÇÃO
											<span className="inline-block ml-1 align-middle">
												{sortBy === "createdAt" ? (
													order === "asc" ? (
														"▲"
													) : (
														"▼"
													)
												) : (
													<span className="opacity-30">
														▲▼
													</span>
												)}
											</span>
										</th>
										<th className="px-4 py-2 text-gray-500 text-xs font-semibold text-left">
											PRIMEIRO ACESSO
										</th>
										<th className="px-4 py-2 text-gray-500 text-xs font-semibold text-left">
											ÚLTIMO ACESSO
										</th>
										<th className="px-4 py-2 text-gray-500 text-xs font-semibold text-left">
											AÇÕES
										</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr
											key={user.id}
											className={`border-b hover:bg-gray-50 ${
												showInactive ? "bg-red-50" : ""
											}`}
										>
											<td className="px-4 py-2 text-black">
												{user.id}
											</td>
											<td className="px-4 py-2 text-black">
												{user.email}
											</td>
											<td className="px-4 py-2 text-black">
												{user.firstName}
											</td>
											<td className="px-4 py-2 text-black">
												{user.lastName}
											</td>
											<td className="px-4 py-2 text-black">
												{user.roles &&
												user.roles.length > 0
													? user.roles.join(", ")
													: "-"}
											</td>
											<td
												className={`px-4 py-2 ${
													showInactive
														? "text-red-600 font-bold"
														: "text-black"
												}`}
											>
												{user.createdAt
													? new Date(
															user.createdAt
													  ).toLocaleString("pt-BR")
													: "-"}
											</td>
											<td className="px-4 py-2 text-black">
												{user.firstAccess
													? new Date(
															user.firstAccess
													  ).toLocaleString("pt-BR")
													: "-"}
											</td>
											<td className="px-4 py-2 text-black">
												{user.lastAccess
													? new Date(
															user.lastAccess
													  ).toLocaleString("pt-BR")
													: "-"}
											</td>
											<td className="px-4 py-2 flex gap-2">
												<button
													className="p-1 rounded hover:bg-green-100"
													title="Editar usuário"
													onClick={() =>
														handleEditUser(user)
													}
												>
													<PencilSquareIcon className="w-5 h-5 text-green-700" />
												</button>
												<button
													className="p-1 rounded hover:bg-red-100"
													title="Excluir usuário"
													onClick={() => {
														setUserToDelete(user);
														setModalOpen(true);
													}}
												>
													<TrashIcon className="w-5 h-5 text-red-600" />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 p-4 bg-gray-50 rounded shadow">
								<div className="flex items-center gap-4">
									<div className="text-gray-600 text-sm">
										Exibindo{" "}
										{users.length > 0
											? (page - 1) * pageSize + 1
											: 0}
										{users.length > 1
											? ` - ${
													(page - 1) * pageSize +
													users.length
											  }`
											: ""}{" "}
										de {total} usuários
									</div>
									<label className="text-gray-600 text-sm flex items-center gap-1">
										<span>Itens por página:</span>
										<select
											value={pageSize}
											onChange={(e) => {
												setPageSize(
													Number(e.target.value)
												);
												setPage(1);
											}}
											className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
										>
											<option value={10}>10</option>
											<option value={50}>50</option>
											<option value={100}>100</option>
										</select>
									</label>
								</div>
								<div className="flex items-center gap-2 w-full md:w-auto">
									<button
										type="button"
										onClick={() =>
											setPage((p) => Math.max(1, p - 1))
										}
										disabled={page <= 1}
										className={`bg-green-700 text-white rounded px-6 py-2 hover:bg-green-800 w-32 ${
											page <= 1
												? "opacity-50 cursor-not-allowed"
												: ""
										}`}
									>
										Anterior
									</button>
									<span className="text-green-800 font-bold w-32 text-center">
										Página {page} de {totalPages}
									</span>
									<button
										type="button"
										onClick={() =>
											setPage((p) =>
												Math.min(totalPages, p + 1)
											)
										}
										disabled={page >= totalPages}
										className={`bg-green-700 text-white rounded px-6 py-2 hover:bg-green-800 w-32 ${
											page >= totalPages
												? "opacity-50 cursor-not-allowed"
												: ""
										}`}
									>
										Próxima
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
