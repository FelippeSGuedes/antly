"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Shield, User as UserIcon, Briefcase, Star, AlertCircle, CheckCircle, Camera, Upload } from "lucide-react";

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
  cpf: string;
  profileUrl: string;
  serviceType: string;
  hasCnpj: boolean;
  issuesInvoice: boolean;
  attendsOtherCities: boolean;
  serviceRadius: number;
  experience: string;
  availability: string[];
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
  bio: "",
  cpf: "",
  profileUrl: "",
  serviceType: "",
  hasCnpj: false,
  issuesInvoice: false,
  attendsOtherCities: false,
  serviceRadius: 15,
  experience: "",
  availability: [],
};

// CPF Validation Helper
const isValidCPF = (cpf: string) => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  
  const validateDigit = (t: number) => {
    let d = 0;
    let c = 0;
    for (t; t >= 2; t--) {
        d += parseInt(cpf.substring(c, c + 1)) * t;
        c++;
    }
    d = (d * 10) % 11;
    if (d === 10 || d === 11) d = 0;
    return d;
  }

  if (validateDigit(10) !== parseInt(cpf.substring(9, 10))) return false;
  if (validateDigit(11) !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

export default function PrestadorPerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [cepStatus, setCepStatus] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; group_name: string }>>([]);
  const router = useRouter();

  // Score Calculation
  const reliabilityScore = useMemo(() => {
    let score = 0;
    // Security (45%)
    if (isValidCPF(form.cpf)) score += 25;
    if (form.phone && form.phone.length >= 10) score += 15; // Simulated verified
    if (user?.email) score += 5; // Simulated verified

    // Visual (10%)
    if (previewUrl || form.profileUrl) score += 10;

    // Professional (30%)
    if (form.category) score += 5;
    if (form.city && form.serviceRadius > 0) score += 10;
    if (form.serviceType) score += 5;
    if (form.experience) score += 10;

    // Quality (10%)
    if (form.bio && form.bio.length > 50) score += 5;
    if (form.availability && form.availability.length > 0) score += 5;

    return Math.min(100, score);
  }, [form, user, previewUrl]);

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
          bio: profile.bio ?? "",
          cpf: profile.cpf ?? "",
          profileUrl: profile.profileUrl ?? "",
          serviceType: profile.serviceType ?? "",
          hasCnpj: profile.hasCnpj ?? false,
          issuesInvoice: profile.issuesInvoice ?? false,
          attendsOtherCities: profile.attendsOtherCities ?? false,
          serviceRadius: profile.serviceRadius ?? 15,
          experience: profile.experience ?? "",
          availability: profile.availability ?? [],
        });
        if (profile.profileUrl) setPreviewUrl(profile.profileUrl);
      }

      // carregar categorias disponíveis (não bloqueante)
      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData || []);
        }
      } catch (e) {
        // silêncio: falha ao carregar categorias não impede edição do perfil
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("A imagem deve ter no máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setForm(prev => ({ ...prev, profileUrl: reader.result as string })); // In real app, upload first
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvailabilityChange = (option: string) => {
      setForm(prev => {
           const current = prev.availability || [];
           if (current.includes(option)) {
               return { ...prev, availability: current.filter(item => item !== option) };
           } else {
               return { ...prev, availability: [...current, option] };
           }
      })
  }

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

    if (!isValidCPF(form.cpf)) {
        setError("CPF inválido. Por favor, verifique.");
        return;
    }

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
    // redireciona de volta para o dashboard do prestador
    try {
      router.push('/prestador');
    } catch (e) {
      // se falhar, apenas manter a mensagem de status
    }
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

  const getScoreColor = (score: number) => {
      if (score < 50) return "bg-red-500";
      if (score < 70) return "bg-yellow-500";
      return "bg-green-500";
  };

  // agrupa categorias por group_name para renderização do select
  const groupedCategories = categories.reduce((acc: Record<string, Array<{id:number;name:string}>>, cur) => {
    const g = cur.group_name || 'Outras';
    if (!acc[g]) acc[g] = [];
    acc[g].push({ id: cur.id, name: cur.name });
    return acc;
  }, {} as Record<string, Array<{id:number;name:string}>>);

  // gerar nodes para o select (evita lógica complexa dentro do JSX)
  const categoryOptions = Object.entries(groupedCategories).map(([group, items]) => (
    <optgroup key={group} label={group}>
      {items.map((it) => (
        <option key={it.id} value={it.name}>{it.name}</option>
      ))}
    </optgroup>
  ));

  return (
    <div className="min-h-screen bg-[#FDFBF7] px-4 py-8 text-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row gap-8">
        
        {/* Sidebar Status */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                 <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <UserIcon size={40} className="text-slate-300" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700 transition shadow-sm">
                        <Camera size={14} />
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                 </div>
                 <h2 className="mt-4 font-bold text-lg">{form.name}</h2>
                 <p className="text-sm text-slate-500 truncate">{user.email}</p>
                 
                 <div className="mt-6 text-left">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Confiabilidade</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${getScoreColor(reliabilityScore)}`}>{reliabilityScore}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-500 ${getScoreColor(reliabilityScore)}`} style={{ width: `${reliabilityScore}%` }}></div>
                     </div>
                     <p className="mt-2 text-[10px] text-slate-400 text-center">
                        {reliabilityScore < 70 ? "Complete seu perfil para ganhar destaque!" : "Seu perfil passa alta confiança!"}
                     </p>
                 </div>
             </div>

             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-green-500"/> Checklist de Qualidade</h3>
                <ul className="space-y-3 text-sm">
                    <li className={`flex items-center gap-2 ${isValidCPF(form.cpf) ? "text-green-600 font-medium" : "text-slate-400"}`}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isValidCPF(form.cpf) ? "border-green-500 bg-green-50" : "border-slate-300"}`}>
                           {isValidCPF(form.cpf) && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                        </div>
                        CPF Validado (+25%)
                    </li>
                    <li className={`flex items-center gap-2 ${previewUrl ? "text-green-600 font-medium" : "text-slate-400"}`}>
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${previewUrl ? "border-green-500 bg-green-50" : "border-slate-300"}`}>
                           {previewUrl && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                        </div>
                        Foto de Perfil (+10%)
                    </li>
                    <li className={`flex items-center gap-2 ${form.experience ? "text-green-600 font-medium" : "text-slate-400"}`}>
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${form.experience ? "border-green-500 bg-green-50" : "border-slate-300"}`}>
                           {form.experience && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                        </div>
                        Experiência Informada (+10%)
                    </li>
                     <li className={`flex items-center gap-2 ${form.city ? "text-green-600 font-medium" : "text-slate-400"}`}>
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${form.city ? "border-green-500 bg-green-50" : "border-slate-300"}`}>
                           {form.city && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                        </div>
                        Área de Atuação (+10%)
                    </li>
                </ul>
             </div>
        </div>

        {/* Main Form */}
        <div className="flex-1">
        <form
          onSubmit={save}
          className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-8"
        >
          {/* Header */}
          <div>
             <h1 className="text-2xl font-bold text-slate-800">Editar Perfil</h1>
             <p className="text-slate-500 text-sm">Mantenha suas informações atualizadas para atrair mais clientes.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
               <AlertCircle size={18}/> {error}
            </div>
          )}

          {/* Section 1: Identidade & Segurança */}
          <section className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Shield size={20} className="text-orange-500"/>
                  <h2 className="font-bold text-slate-700">Identidade & Segurança</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome Completo</label>
                      <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"/>
                  </div>
                  <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">CPF (Obrigatório)</label>
                      <input type="text" placeholder="000.000.000-00" required value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} className={`w-full rounded-xl border ${isValidCPF(form.cpf) ? "border-green-200 bg-green-50 text-green-700" : "border-slate-200 bg-slate-50"} px-4 py-2.5 text-sm`}/>
                      {!isValidCPF(form.cpf) && form.cpf.length > 0 && <p className="text-[10px] text-red-500 mt-1">CPF Invalido</p>}
                  </div>
                  <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Telefone</label>
                      <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"/>
                  </div>
                  <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">WhatsApp</label>
                      <input type="tel" required value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"/>
                  </div>
              </div>
          </section>

          {/* Section 2: Informações Profissionais */}
          <section className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Briefcase size={20} className="text-blue-500"/>
                  <h2 className="font-bold text-slate-700">Dados Profissionais</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                       <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Categoria Principal</label>
                       <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm" required>
                           <option value="">Selecione sua categoria...</option>
                           {categories.length === 0 ? (
                             <option disabled>Carregando categorias...</option>
                           ) : (
                             categoryOptions
                           )}
                       </select>
                  </div>

                  <div>
                       <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tipo de Atendimento</label>
                       <select value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
                           <option value="">Selecione...</option>
                           <option value="Residencial">Residencial</option>
                           <option value="Comercial">Comercial</option>
                           <option value="Industrial">Industrial</option>
                           <option value="Todos">Todos os tipos</option>
                       </select>
                  </div>

                  <div>
                       <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tempo de Experiência</label>
                       <select value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
                           <option value="">Selecione...</option>
                           <option value="Iniciante">Menos de 1 ano</option>
                           <option value="1-3 anos">1 a 3 anos</option>
                           <option value="3-5 anos">3 a 5 anos</option>
                           <option value="+5 anos">Mais de 5 anos</option>
                           <option value="+10 anos">Mais de 10 anos</option>
                       </select>
                  </div>

                  <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                          <input type="checkbox" checked={form.hasCnpj} onChange={e => setForm({...form, hasCnpj: e.target.checked})} className="rounded text-orange-600 focus:ring-orange-500"/>
                          Possui CNPJ?
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                          <input type="checkbox" checked={form.issuesInvoice} onChange={e => setForm({...form, issuesInvoice: e.target.checked})} className="rounded text-orange-600 focus:ring-orange-500"/>
                          Emite Nota Fiscal?
                      </label>
                  </div>
              </div>
          </section>

          {/* Section 3: Área de Atuação */}
           <section className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <UserIcon size={20} className="text-green-500"/>
                  <h2 className="font-bold text-slate-700">Localização e Atuação</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">CEP</label>
                    <input type="text" value={form.zip} onChange={e => {
                        const val = e.target.value;
                        setForm({...form, zip: val});
                        if(val.replace(/\D/g, "").length === 8) fetchCep(val);
                    }} onBlur={() => fetchCep(form.zip)} placeholder="00000-000" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"/>
                    {cepStatus && <p className="text-[10px] text-slate-400 mt-1">{cepStatus}</p>}
                 </div>
                 
                 <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Cidade Principal</label>
                        <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"/>
                    </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Estado</label>
                        <input type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"/>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Endereço Completo</label>
                    <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Número</label>
                    <input type="text" value={form.number} onChange={e => setForm({...form, number: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"/>
                 </div>

                 <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-2 font-bold text-sm text-slate-700">
                            <input type="checkbox" checked={form.attendsOtherCities} onChange={e => setForm({...form, attendsOtherCities: e.target.checked})} className="rounded text-orange-600 focus:ring-orange-500"/>
                            Atende outras cidades na região?
                        </label>
                        <span className="text-xs font-mono bg-white px-2 py-1 rounded border text-slate-500">{form.serviceRadius} km</span>
                     </div>
                     {form.attendsOtherCities && (
                        <div>
                             <input 
                              type="range" 
                              min="0" 
                              max="150" 
                              step="5"
                              value={form.serviceRadius} 
                              onChange={e => setForm({...form, serviceRadius: parseInt(e.target.value)})}
                              className="w-full accent-orange-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>Bairro</span>
                                <span>Cidade Vizinha (50km)</span>
                                <span>Regional (150km)</span>
                            </div>
                        </div>
                     )}
                 </div>
              </div>
           </section>

           {/* Section 4: Qualidade & Disponibilidade */}
           <section className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Star size={20} className="text-amber-500"/>
                  <h2 className="font-bold text-slate-700">Qualidade e Detalhes</h2>
              </div>
              
              <div>
                 <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Disponibilidade de Horário</label>
                 <div className="flex flex-wrap gap-2">
                     {["Segunda a Sexta", "Finais de Semana", "Horário Comercial", "Noturno", "Plantão 24h"].map((opt) => (
                         <button
                            type="button"
                            key={opt}
                            onClick={() => handleAvailabilityChange(opt)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                                form.availability && form.availability.includes(opt) 
                                ? "bg-orange-50 border-orange-200 text-orange-700" 
                                : "bg-white border-slate-200 text-slate-500 hover:border-orange-200"
                            }`}
                         >
                            {opt}
                         </button>
                     ))}
                 </div>
              </div>

               <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Sobre Você</label>
                  <textarea
                    value={form.bio}
                    onChange={(event) => setForm({ ...form, bio: event.target.value })}
                    placeholder="Descreva seus serviços, diferenciais e experiência..."
                    className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-right text-[10px] text-slate-400 mt-1">{form.bio.length} caracteres (min. 50 recomendado)</p>
                </div>
           </section>

          {status && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 font-medium text-center">
              {status}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-orange-600 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-orange-500 shadow-lg shadow-orange-200"
            >
              Salvar Perfil Profissional
            </button>
            <Link
              href="/prestador"
              className="rounded-xl border border-slate-200 px-6 py-4 text-sm font-bold text-slate-600 transition-colors hover:border-orange-200 hover:text-orange-600"
            >
              Cancelar
            </Link>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
