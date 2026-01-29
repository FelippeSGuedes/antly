"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  User,
  Phone,
  MessageCircle,
  FileText
} from "lucide-react";
import logo from "../../logo.png";

export default function Home() {
  type CurrentUser = {
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
    availability: string | null;
    location: string | null;
    rating: number | string | null;
    reviews: number | null;
    description: string | null;
    tags: string[] | null;
    verified: boolean | null;
  };

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredPros = professionals.filter((pro) => {
    const matchesSearch =
      pro.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || pro.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [prosResponse, categoriesResponse] = await Promise.all([
          fetch("/api/professionals"),
          fetch("/api/categories")
        ]);

        if (!prosResponse.ok) {
          throw new Error("Falha ao buscar profissionais");
        }

        const prosData: Professional[] = await prosResponse.json();
        setProfessionals(prosData);

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.map((cat: { name: string }) => cat.name));
        }
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data: CurrentUser = await response.json();
          setUser(data);
        }
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans selection:bg-orange-200 selection:text-orange-900">
      <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="group flex items-center gap-3"
            onClick={() => {
              setSelectedCategory("Todos");
              setSearchTerm("");
            }}
          >
            <Image src={logo} alt="Antly" className="h-10 w-10" />
            <div className="flex flex-col items-start">
              <span className="text-2xl font-extrabold leading-none tracking-tight text-slate-900">
                Antly
              </span>
              <span className="mt-0.5 text-[10px] font-bold uppercase leading-none tracking-widest text-orange-600">
                Orçamentos
              </span>
            </div>
          </button>

          <div className="hidden items-center gap-8 text-sm font-bold text-slate-500 md:flex">
            <a href="#" className="transition-colors hover:text-orange-600">
              Como Funciona
            </a>
            <a href="#" className="transition-colors hover:text-orange-600">
              Dicas de Segurança
            </a>
            <a
              href="#"
              className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600 transition-colors"
            >
              <ShieldCheck size={16} /> Profissionais Verificados
            </a>
          </div>

          <div className="relative flex items-center gap-3">
            {isAuthLoading ? (
              <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-orange-200"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">{user.name}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                    {user.role === "admin" ? (
                      <Link
                        href="/admin"
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Painel admin
                      </Link>
                    ) : (
                      <>
                        <Link
                          href={user.role === "provider" ? "/prestador/perfil" : "/cliente"}
                          className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Perfil
                        </Link>
                        {user.role === "provider" && (
                          <Link
                            href="/prestador"
                            className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Meu Painel
                          </Link>
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600"
              >
                Entrar/Cadastro
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative mb-14 overflow-hidden rounded-[2rem] border border-orange-50 bg-white p-8 shadow-2xl shadow-orange-900/5 md:p-14">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-orange-400/20 blur-[100px]"></div>
            <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-yellow-400/20 blur-[80px]"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-700 shadow-sm">
              <FileText size={14} />
              COTAÇÃO RÁPIDA E GRATUITA
            </div>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
              Solicite orçamentos dos <br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                melhores profissionais locais.
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-500">
              Encontre o profissional ideal para o seu projecto. Analise perfis, veja avaliações
              e peça o seu orçamento directamente pelo chat ou telefone.
            </p>

            <div className="mx-auto flex max-w-2xl flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-orange-900/10 sm:flex-row">
              <div className="relative flex flex-1 items-center">
                <Search className="absolute left-4 text-orange-400" size={22} />
                <input
                  type="text"
                  placeholder="Que serviço precisa orçar? (ex: Pintura)"
                  className="h-12 w-full rounded-xl border-none bg-transparent pl-12 pr-4 font-medium text-slate-700 placeholder:text-slate-400 focus:ring-0"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <button className="h-12 rounded-xl bg-orange-500 px-8 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600">
                Ver Profissionais
              </button>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="ml-1 flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="h-6 w-1.5 rounded-full bg-orange-500"></span>
              Categorias de Orçamentos
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Todos", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold shadow-sm transition-all duration-200
                  ${
                    selectedCategory === cat
                      ? "bg-orange-500 border-orange-500 text-white shadow-orange-500/30 transform -translate-y-1"
                      : "bg-white border-slate-100 text-slate-500 hover:border-orange-200 hover:text-orange-600 hover:shadow-md"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full py-24 text-center">
              <p className="text-slate-500">Carregando profissionais...</p>
            </div>
          ) : hasError ? (
            <div className="col-span-full py-24 text-center">
              <p className="text-slate-500">Não foi possível carregar os profissionais.</p>
            </div>
          ) : filteredPros.length > 0 ? (
            filteredPros.map((pro) => (
              <div
                key={pro.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-0 transition-all duration-300 hover:border-orange-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="relative h-24 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="absolute right-4 top-4 flex gap-1">
                    {pro.verified && (
                      <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-white/90 px-2 py-1 text-[10px] font-bold text-emerald-600 shadow-sm backdrop-blur">
                        <ShieldCheck size={12} /> Verificado
                      </span>
                    )}
                  </div>
                </div>

                <div className="-mt-10 flex flex-1 flex-col px-6 pb-6">
                  <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-white text-orange-500 shadow-lg transition-transform group-hover:scale-105">
                    <User size={32} />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-orange-600">
                      {pro.name}
                    </h3>
                    <p className="mb-2 text-sm font-semibold text-orange-600">{pro.role}</p>

                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                      <div className="flex items-center font-bold text-amber-500">
                        <Star size={14} fill="currentColor" className="mr-1" />
                        {Number(pro.rating ?? 0).toFixed(1)}
                      </div>
                      <span className="text-slate-300">•</span>
                      <span>{pro.reviews ?? 0} avaliações</span>
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={14} className="text-slate-400" />
                      {pro.location || "Localidade não informada"}
                    </div>

                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {pro.description || "Descrição não informada."}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {(pro.tags ?? []).length > 0 ? (
                        (pro.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                          Sem tags
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto border-t border-slate-50 pt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-slate-400">Status</span>
                      <span className="rounded-lg border border-orange-100 bg-orange-50 px-2 py-1 text-xs font-bold text-orange-700">
                        {pro.availability || "Disponível"}
                      </span>
                    </div>

                    <div className="grid gap-2">
                      <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-orange-600 group-hover:shadow-orange-500/20">
                        <MessageCircle size={18} /> Pedir Orçamento Grátis
                      </button>
                      <div className="mt-1 grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200">
                          <Phone size={14} /> Ligar
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-200">
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
                <div className="mb-6 inline-flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-orange-50">
                  <Image src={logo} alt="Antly" className="h-10 w-10" />
                </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-800">
                Nenhum profissional para este serviço
              </h3>
              <p className="mx-auto mb-8 max-w-md text-slate-500">
                Tente buscar por outra categoria ou termo para solicitar seu orçamento.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Todos");
                }}
                className="font-bold text-orange-600 hover:underline"
              >
                Ver todas as categorias
              </button>
            </div>
          )}
        </div>

        <div className="relative mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-orange-500/20 blur-[80px]"></div>
          <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Quer receber pedidos de orçamento?
              </h2>
              <p className="text-lg text-slate-400">
                Crie seu perfil no Antly e receba solicitações de clientes interessados no seu
                trabalho. É fácil, rápido e sem taxas por orçamento.
              </p>
            </div>
            <Link
              href={
                user?.role === "admin"
                  ? "/admin"
                  : user?.role === "provider"
                  ? "/prestador"
                  : "/auth"
              }
              className="whitespace-nowrap rounded-xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 hover:bg-orange-400"
            >
              Começar a Anunciar
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-100 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-lg font-bold text-slate-900">Antly</p>
          <p className="mb-6 text-center text-sm text-slate-500">
            A forma mais rápida de orçar seus serviços.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="transition-colors hover:text-orange-600">
              Quem Somos
            </a>
            <a href="#" className="transition-colors hover:text-orange-600">
              Termos de Uso
            </a>
            <a href="#" className="transition-colors hover:text-orange-600">
              Suporte
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
