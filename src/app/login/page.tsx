"use client";

import Background from "@/components/Background";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import { jwtDecode } from "jwt-decode";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { FormEvent, MouseEvent, useEffect, useState } from "react";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		const start = Date.now();

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_HOST}/auth/signin`,
				{
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({email, password}),
				}
			);

			const data = await res.json();

			console.log("Login response:", data);

			if (res.ok) {
				localStorage.setItem("token", data.accessToken);
				const expiresAt = Date.now() + 60 * 60 * 1000;
				localStorage.setItem("token_expires_at", expiresAt.toString());

				const decoded: any = jwtDecode(data.accessToken);
				console.log("Roles do usuário:", decoded.authorization);

				if (
					decoded.authorization &&
					decoded.authorization.includes("admin")
				) {
					router.replace("/admin/users");
				} else {
					router.replace("/profile");
				}
			} else {
				setLoading(false);
				setError(data.message || "Erro no login");
			}
		} catch (err) {
			setLoading(false);
			setError("Erro de conexão com o servidor");
		} finally {
			const elapsed = Date.now() - start;
			const minTime = 1500;
			setTimeout(() => setLoading(false), Math.max(0, minTime - elapsed));
		}
	};

	const handleHref = (href: string) => (e: MouseEvent) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(() => {
			router.push(href);
		}, 500);
	};

	useEffect(() => {
		const checkToken = () => {
			const expiresAt = localStorage.getItem("token_expires_at");
			if (expiresAt && Date.now() > Number(expiresAt)) {
				localStorage.removeItem("token");
				localStorage.removeItem("token_expires_at");
				router.push("/login");
			}
		};
		const interval = setInterval(checkToken, 60 * 1000);
		checkToken();
		return () => clearInterval(interval);
	}, [router]);

	return (
		<>
			<Head>
				<title>Login</title>
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
							Login
						</h2>

						{error && (
							<p className="text-red-500 text-sm mb-4 text-center">
								{error}
							</p>
						)}

						<Input
							type="email"
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
						<div className="flex justify-between items-center mb-6">
							<a
								href="/register"
								onClick={handleHref("/register")}
								className="text-sm text-green-600 hover:underline"
							>
								Criar conta
							</a>
						</div>

						<Button
							type="submit"
							onClick={(e) => {
								e.preventDefault();
								handleLogin(e);
							}}
						>
							Entrar
						</Button>
					</form>
				}
			/>
		</>
	);
}
