"use client";

import { User } from "@/@types/user.type";
import ConfirmModal from "@/components/ConfirmModal";
import EditRoleModal from "@/components/EditRoleModal";
import EditUserModal from "@/components/EditUserModal";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
			<Header
				onLogout={handleLogout}
				mainText="Listagem"
				secondaryText="Usuários"
			/>
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
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {(() => {
                        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                        if (!token) return "";
                        try {
                            const decoded: any = jwtDecode(token);
                            return decoded.firstName ? `Olá, ${decoded.firstName} ${decoded.lastName}` : "";
                        } catch {
                            return "";
                        }
                    })()}
                </h1>
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
