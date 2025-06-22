"use client";

import Background from "@/components/Background";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// CHAMADA PARA API
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({email, password}),
			});

			const data = await res.json();

			if (res.ok) {
				if (data.role === "admin") router.push("/admin/users");
				else router.push("/profile");
			} else {
				setError(data.message || "Erro no login");
			}
		} catch (err) {
			setError("Erro de conexão com o servidor");
		} finally {
			setLoading(false);
		}
	};
	//

	const handleHref = (href: string) => (e: MouseEvent) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(() => {
			router.push(href);
		}, 500);
	};

	return (
		<>
			<Head>
				<title>Cadastro de usuário</title>
			</Head>
			{loading && <Loading />}
			<Background
				children={
					<form
						onSubmit={handleLogin}
						className="bg-white bg-opacity-90 p-10 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-md"
					>
						<div className="flex justify-center mb-6">
							<img
								src="https://cdn-icons-png.flaticon.com/512/2909/2909765.png"
								alt="Hortifruti"
								className="w-16 h-16"
							/>
						</div>
						<h2 className="text-3xl font-extrabold mb-6 text-center text-green-700">
							Cadastro de usuário
						</h2>

						{error && (
							<p className="text-red-500 text-sm mb-4 text-center">
								{error}
							</p>
						)}

						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							label="Nome"
							required
						/>

						<Input
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							label="Email"
							required
						/>

						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							label="Senha"
							required
						/>

						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							label="Confirme sua senha"
							required
						/>

						<div className="flex justify-center mb-6">
							<a
								href="/login"
								onClick={handleHref("/login")}
								className="text-sm text-green-600 hover:underline"
							>
								Já tem uma conta? Faça login
							</a>
						</div>

						<button
							type="submit"
							className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
						>
							Cadastrar
						</button>
					</form>
				}
			/>
		</>
	);
}
