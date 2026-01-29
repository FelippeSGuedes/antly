"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
};

type Profile = {
  address: string;
  number: string;
  city: string;
  state: string;
  zip: string;
  category: string;
  phone: string;
  whatsapp: string;
  bio: string;
};

type FormState = Profile & {
  name: string;
};

const emptyForm: FormState = {
  name: "",
  address: "",
  number: "",
  city: "",
  state: "",
  zip: "",
  category: "",
  phone: "",
  whatsapp: "",
  bio: ""
};

export default function PrestadorPerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [cepStatus, setCepStatus] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const meResponse = await fetch("/api/auth/me");
      if (!meResponse.ok) {
        setUser(null);
        return;
      }
      const me = (await meResponse.json()) as User;
      setUser(me);

      if (me.role !== "provider") {
        return;
      }

      const profileResponse = await fetch("/api/provider/profile");
      if (profileResponse.ok) {
        const data = await profileResponse.json();
        const profile = (data?.profile || {}) as Partial<Profile>;
        setForm({
          name: data?.name ?? me.name ?? "",
          address: profile.address ?? "",
          number: profile.number ?? "",
          city: profile.city ?? "",
          state: profile.state ?? "",
          zip: profile.zip ?? "",
          category: profile.category ?? "",
          phone: profile.phone ?? "",
          whatsapp: profile.whatsapp ?? "",
          bio: profile.bio ?? ""
        });
      }
    } catch {
      setError("Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const fetchCep = async (value: string) => {
    const zip = value.replace(/\D/g, "");
    if (zip.length !== 8) {
      setCepStatus(null);
      return;
    }

    setCepStatus("Buscando CEP...");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
      if (!response.ok) {
        setCepStatus("CEP não encontrado.");
        return;
      }
      const data = await response.json();
      if (data.erro) {
        setCepStatus("CEP não encontrado.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        address: data.logradouro || prev.address,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
        zip: data.cep || prev.zip
      }));
      setCepStatus("CEP preenchido automaticamente.");
    } catch {
      setCepStatus("Não foi possível buscar o CEP.");
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);

    const response = await fetch("/api/provider/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Não foi possível salvar o perfil.");
      return;
    }

    setStatus("Perfil atualizado com sucesso.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-20 text-center text-slate-500">
        Carregando perfil...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Acesso necessário</h1>
        <p className="mt-2 text-slate-500">Entre para acessar seu perfil.</p>
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
        <h1 className="text-2xl font-bold text-slate-900">Perfil exclusivo do prestador</h1>
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
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Perfil do prestador
          </p>
          <h1 className="mt-2 text-3xl font-bold">Olá, {user.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={save}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Informações pessoais
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Nome
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={(event) => {
                      const value = event.target.value;
                      setForm({ ...form, zip: value });
                      if (value.replace(/\D/g, "").length === 8) {
                        fetchCep(value);
                      }
                    }}
                    onBlur={() => fetchCep(form.zip)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="00000-000"
                  />
                  {cepStatus && (
                    <p className="mt-2 text-xs font-medium text-slate-500">{cepStatus}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Endereço
                  </label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={(event) => setForm({ ...form, address: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Número
                  </label>
                  <input
                    required
                    type="text"
                    value={form.number}
                    onChange={(event) => setForm({ ...form, number: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: 123"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(event) => setForm({ ...form, state: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Telefone
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    WhatsApp
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.whatsapp}
                    onChange={(event) => setForm({ ...form, whatsapp: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="(11) 98888-8888"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Atividade
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Categoria
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Selecione</option>
                    <optgroup label="Construção, Reforma e Residencial">
                      <option>Construção</option>
                      <option>Reforma</option>
                      <option>Hidráulica</option>
                      <option>Elétrica</option>
                      <option>Pintura</option>
                      <option>Gesso e Drywall</option>
                      <option>Serralheria</option>
                      <option>Marcenaria</option>
                      <option>Vidraçaria</option>
                      <option>Impermeabilização</option>
                      <option>Telhados e Coberturas</option>
                      <option>Instalações em geral</option>
                      <option>Serviços Gerais (Faz-tudo)</option>
                    </optgroup>
                    <optgroup label="❄️ Manutenção e Equipamentos">
                      <option>Manutenção</option>
                      <option>Refrigeração</option>
                      <option>Climatização (Ar-condicionado)</option>
                      <option>Eletrodomésticos</option>
                      <option>Máquinas e Equipamentos</option>
                      <option>Automação Residencial</option>
                    </optgroup>
                    <optgroup label="🧹 Limpeza e Conservação">
                      <option>Limpeza</option>
                      <option>Limpeza Pós-Obra</option>
                      <option>Conservação Predial</option>
                      <option>Dedetização e Controle de Pragas</option>
                      <option>Jardinagem</option>
                      <option>Paisagismo</option>
                    </optgroup>
                    <optgroup label="🚗 Transporte e Veículos">
                      <option>Transporte</option>
                      <option>Mudanças</option>
                      <option>Fretes</option>
                      <option>Mecânica Automotiva</option>
                      <option>Auto Elétrica</option>
                      <option>Lavagem e Estética Automotiva</option>
                    </optgroup>
                    <optgroup label="💻 Tecnologia e Digital">
                      <option>Tecnologia</option>
                      <option>Suporte Técnico</option>
                      <option>Desenvolvimento de Software</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Tráfego Pago</option>
                      <option>Social Media</option>
                      <option>Fotografia</option>
                      <option>Produção de Vídeo</option>
                      <option>Audiovisual</option>
                    </optgroup>
                    <optgroup label="🎓 Educação e Treinamento">
                      <option>Educação</option>
                      <option>Aulas Particulares</option>
                      <option>Cursos Livres</option>
                      <option>Idiomas</option>
                      <option>Reforço Escolar</option>
                    </optgroup>
                    <optgroup label="🎉 Eventos e Entretenimento">
                      <option>Eventos</option>
                      <option>Decoração</option>
                      <option>Buffet / Catering</option>
                      <option>DJ e Sonorização</option>
                      <option>Iluminação para Eventos</option>
                      <option>Organização de Eventos</option>
                    </optgroup>
                    <optgroup label="👤 Serviços Pessoais">
                      <option>Serviços Pessoais</option>
                      <option>Cuidados com Idosos</option>
                      <option>Babá</option>
                      <option>Cuidador</option>
                      <option>Pet Services (banho, passeio, adestramento)</option>
                      <option>Estética e Beleza</option>
                    </optgroup>
                    <optgroup label="🏢 Empresarial e Profissional">
                      <option>Serviços Empresariais</option>
                      <option>Consultoria</option>
                      <option>Contabilidade</option>
                      <option>Jurídico</option>
                      <option>Recursos Humanos</option>
                      <option>Segurança Patrimonial</option>
                    </optgroup>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sobre você
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(event) => setForm({ ...form, bio: event.target.value })}
                    className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {status && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {status}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-500"
            >
              Salvar alterações
            </button>
            <Link
              href="/prestador"
              className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600"
            >
              Voltar ao painel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
