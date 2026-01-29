"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
};

type Ad = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "Postado" | "Em Analise" | "Reprovado";
  created_at: string;
};


export default function PrestadorPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [showProfileModal, setShowProfileModal] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const meResponse = await fetch("/api/auth/me");
      if (!meResponse.ok) {
        setUser(null);
        return;
      }
      const me = await meResponse.json();
      if (me.role !== "provider") {
        setUser(me);
        return;
      }
      setUser(me);

      const [adsResponse, profileResponse] = await Promise.all([
        fetch("/api/provider/ads"),
        fetch("/api/provider/profile")
      ]);

      if (adsResponse.ok) {
        const data = await adsResponse.json();
        setAds(data);
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const address = profileData?.profile?.address;
        const number = profileData?.profile?.number;
        const category = profileData?.profile?.category;
        const phone = profileData?.profile?.phone;
        const whatsapp = profileData?.profile?.whatsapp;
        if (!address || !number || !category || !phone || !whatsapp) {
          setShowProfileModal(true);
        }
      }

    } catch {
      setError("Não foi possível carregar o painel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createAd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/provider/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Não foi possível criar o anúncio.");
      return;
    }

    setForm({ title: "", description: "" });
    await load();
  };

  const deleteAd = async (id: number) => {
    await fetch(`/api/provider/ads/${id}`, { method: "DELETE" });
    await load();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-20 text-center text-slate-500">
        Carregando painel...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Acesso necessário</h1>
        <p className="mt-2 text-slate-500">Entre para acessar seu painel.</p>
        <Link
          href="/auth"
          className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white"
        >
          Ir para login
        </Link>
      </div>
    );
  }

  if (user.role !== "provider") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Painel exclusivo do prestador</h1>
        <p className="mt-2 text-slate-500">Seu perfil é de cliente.</p>
        <Link
          href="/cliente"
          className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white"
        >
          Ir para perfil do cliente
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-6 py-10 text-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Painel do prestador
          </p>
          <h1 className="mt-2 text-3xl font-bold">Olá, {user.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/prestador/perfil"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600"
            >
              Editar Perfil
            </Link>
          </div>
        </header>

        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Criar anúncio</h2>
          <p className="mt-1 text-sm text-slate-500">
            Após criar, o anúncio ficará em análise até aprovação do suporte.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={createAd}>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Função
              </label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Descrição
              </label>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500"
              >
                Publicar anúncio
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Meus anúncios</h2>
          <p className="mt-1 text-sm text-slate-500">
            Status: Postado, Em Analise ou Reprovado.
          </p>

          <div className="mt-6 grid gap-4">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{ad.title}</h3>
                  <p className="text-sm text-slate-500">{ad.category}</p>
                  {ad.description && (
                    <p className="mt-2 text-sm text-slate-600">{ad.description}</p>
                  )}
                </div>
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      ad.status === "Postado"
                        ? "bg-emerald-100 text-emerald-700"
                        : ad.status === "Reprovado"
                          ? "bg-red-100 text-red-600"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {ad.status}
                  </span>
                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="text-sm font-semibold text-slate-500 hover:text-red-500"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}

            {ads.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500">
                Você ainda não criou anúncios.
              </div>
            )}
          </div>
        </section>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900">Complete seu perfil</h2>
            <p className="mt-2 text-sm text-slate-500">
              Para publicar anúncios, preencha seu endereço e dados essenciais.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  router.push("/prestador/perfil");
                }}
                className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500"
              >
                Ir para o perfil
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600"
              >
                Mais tarde
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
