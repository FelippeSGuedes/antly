"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
};

type Professional = {
  id: number;
  name: string;
  role: string;
  category: string;
  location: string | null;
  rating: number | string | null;
};

export default function ClientePage() {
  const [user, setUser] = useState<User | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meResponse, prosResponse] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/professionals")
        ]);

        if (meResponse.ok) {
          const me = await meResponse.json();
          setUser(me);
        }

        if (prosResponse.ok) {
          const pros = await prosResponse.json();
          setProfessionals(pros.slice(0, 6));
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-20 text-center text-slate-500">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Acesso necessário</h1>
        <p className="mt-2 text-slate-500">Entre para visualizar seu perfil de cliente.</p>
        <Link
          href="/auth"
          className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white"
        >
          Ir para login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-6 py-12 text-slate-800">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Perfil do cliente
          </p>
          <h1 className="mt-2 text-3xl font-bold">Olá, {user.name}</h1>
          <p className="mt-2 text-sm text-slate-500">{user.email}</p>
        </header>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">Últimos anúncios</h2>
          <p className="mt-1 text-sm text-slate-500">
            Veja os profissionais adicionados recentemente.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((pro) => (
              <div key={pro.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900">{pro.name}</p>
                <p className="text-xs text-orange-600">{pro.role}</p>
                <p className="mt-2 text-xs text-slate-500">{pro.category}</p>
                <p className="mt-1 text-xs text-slate-400">{pro.location || "Local não informado"}</p>
                <p className="mt-2 text-xs font-semibold text-amber-500">
                  {Number(pro.rating ?? 0).toFixed(1)} estrelas
                </p>
              </div>
            ))}
            {professionals.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500">
                Nenhum anúncio disponível.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
