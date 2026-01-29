"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client"
  });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login"
            ? { email: form.email, password: form.password }
            : form
        )
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha na autenticação.");
      }

      const data = await response.json();
      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "client") {
        router.push("/cliente");
      } else {
        router.push("/prestador");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha na autenticação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Acessar Antly</h1>
            <Link href="/" className="text-sm font-semibold text-orange-600 hover:underline">
              Voltar
            </Link>
          </div>

          <div className="mb-6 flex rounded-full bg-slate-100 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full px-4 py-2 transition-colors ${
                mode === "login" ? "bg-white text-slate-900 shadow" : "text-slate-500"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-full px-4 py-2 transition-colors ${
                mode === "register" ? "bg-white text-slate-900 shadow" : "text-slate-500"
              }`}
            >
              Criar conta
            </button>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            {mode === "register" && (
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nome
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Senha
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {mode === "register" && (
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tipo de perfil
                </label>
                <select
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="client">Cliente</option>
                  <option value="provider">Prestador</option>
                </select>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-orange-600 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500 disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
