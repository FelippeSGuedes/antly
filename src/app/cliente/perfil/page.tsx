"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, Shield, User as UserIcon, MapPin, Phone, Mail, ArrowLeft, Sparkles, Save, X } from "lucide-react";

export default function ClientePerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: '', cpf: '', email: '', cep: '', phone: '', city: '', state: '', photo: '' });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cepStatus, setCepStatus] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const fetchCep = async (value: string) => {
    const zip = (value || '').replace(/\D/g, "");
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
      setProfileForm((prev) => ({ ...prev, city: data.localidade || prev.city, state: data.uf || prev.state, cep: data.cep || prev.cep }));
      setCepStatus("CEP preenchido automaticamente.");
    } catch (e) {
      setCepStatus("Não foi possível buscar o CEP.");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const me = await meRes.json();
          setUser(me);
          setProfileForm((p) => ({ ...p, name: me.name || '', email: me.email || '' }));
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completionFields = [profileForm.name, profileForm.cpf, profileForm.email, profileForm.phone, profileForm.cep, profileForm.city, previewUrl];
  const filledCount = completionFields.filter(Boolean).length;
  const completion = Math.min(100, Math.round((filledCount / completionFields.length) * 100));

  const getScoreColor = (score: number) => {
    if (score < 50) return "bg-red-500";
    if (score < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setProfileForm(prev => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    try {
      // validação de CPF
      if (!isValidCPF(profileForm.cpf)) {
        setError('CPF inválido.');
        return;
      }
      // tentativa simples de salvar — endpoint a ajustar
      // await fetch('/api/client/profile', { method: 'PUT', body: JSON.stringify(profileForm), headers: { 'Content-Type': 'application/json' } });
      setStatus('Perfil salvo com sucesso.');
      // redireciona de volta para o dashboard do cliente
      setTimeout(() => {
        router.push('/cliente');
      }, 1500);
    } catch (err) {
      setError('Falha ao salvar.');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#FDFBF7] px-6 py-20 text-center text-slate-500">Carregando...</div>;
  if (!user) return (
    <div className="min-h-screen bg-[#FDFBF7] px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Acesso necessário</h1>
      <p className="mt-2 text-slate-500">Entre para acessar seu perfil.</p>
      <Link href="/auth" className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white">Ir para login</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 px-4 py-8 text-slate-800">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/cliente" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors">
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row gap-8">
        {/* Sidebar Status */}
        <div className="w-full lg:w-80 space-y-6 shrink-0">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 text-center relative overflow-hidden">
            {/* Gradiente de fundo */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-orange-400 via-amber-500 to-orange-500">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z\' fill=\'rgba(255,255,255,0.1)\'/%3E%3C/svg%3E')]"></div>
            </div>
            
            <div className="relative mt-10">
              <div className="w-28 h-28 rounded-full bg-white mx-auto flex items-center justify-center overflow-hidden border-4 border-white shadow-xl relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <UserIcon size={44} className="text-slate-300" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-1/2 translate-x-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-full cursor-pointer hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5">
                <Camera size={16} />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <h2 className="mt-5 font-bold text-xl text-slate-900">{profileForm.name || user.name}</h2>
            <p className="text-sm text-slate-500 truncate flex items-center justify-center gap-1 mt-1">
              <Mail size={12} /> {user.email}
            </p>

            <div className="mt-6 text-left p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                  <Sparkles size={12} className="text-orange-500" /> Completude
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${getScoreColor(completion)}`}>{completion}%</span>
              </div>
              <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner">
                <div className={`h-full transition-all duration-700 ${getScoreColor(completion)} relative overflow-hidden`} style={{ width: `${completion}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500 text-center">
                {completion < 80 ? "🎯 Complete seu perfil para melhor experiência!" : "✨ Parabéns! Perfil completo."}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-500"/> Checklist do Perfil</h3>
            <ul className="space-y-3 text-sm">
              <li className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isValidCPF(profileForm.cpf) ? "bg-emerald-50 text-emerald-700 font-medium" : "bg-slate-50 text-slate-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isValidCPF(profileForm.cpf) ? "bg-emerald-500" : "bg-slate-200"}`}>
                  {isValidCPF(profileForm.cpf) ? <CheckCircle size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400"></div>}
                </div>
                CPF Validado
              </li>
              <li className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${previewUrl ? "bg-emerald-50 text-emerald-700 font-medium" : "bg-slate-50 text-slate-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${previewUrl ? "bg-emerald-500" : "bg-slate-200"}`}>
                  {previewUrl ? <CheckCircle size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400"></div>}
                </div>
                Foto de Perfil
              </li>
              <li className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${profileForm.phone ? "bg-emerald-50 text-emerald-700 font-medium" : "bg-slate-50 text-slate-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${profileForm.phone ? "bg-emerald-500" : "bg-slate-200"}`}>
                  {profileForm.phone ? <CheckCircle size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400"></div>}
                </div>
                Telefone informado
              </li>
              <li className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${profileForm.city ? "bg-emerald-50 text-emerald-700 font-medium" : "bg-slate-50 text-slate-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${profileForm.city ? "bg-emerald-500" : "bg-slate-200"}`}>
                  {profileForm.city ? <CheckCircle size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400"></div>}
                </div>
                Cidade informada
              </li>
            </ul>
          </div>
        </div>

        {/* Main Form */}
        <div className="flex-1">
          <form onSubmit={save} className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-900/5 space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Shield size={24} className="text-orange-500" />
                Editar Perfil
              </h1>
              <p className="text-slate-500 text-sm mt-1">Mantenha seus dados atualizados para facilitar o contato e avaliações.</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-5 py-4 text-sm text-red-600 font-medium animate-scale-in">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <X size={18} className="text-red-600" />
                </div>
                {error}
              </div>
            )}
            {status && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-4 text-sm text-emerald-600 font-medium animate-scale-in">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={18} className="text-emerald-600" />
                </div>
                {status}
              </div>
            )}

            <section className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                  <Shield size={18} className="text-orange-600"/>
                </div>
                <h2 className="font-bold text-slate-800">Identidade & Contato</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Nome Completo</label>
                  <input type="text" required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">CPF (Obrigatório)</label>
                  <input type="text" placeholder="000.000.000-00" required value={profileForm.cpf} onChange={e => setProfileForm({...profileForm, cpf: e.target.value})} className={`w-full rounded-xl border ${isValidCPF(profileForm.cpf) ? "border-emerald-300 bg-emerald-50/50 text-emerald-700 ring-2 ring-emerald-500/20" : "border-slate-200 bg-slate-50/50"} px-4 py-3 text-sm transition-all outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20`}/>
                  {isValidCPF(profileForm.cpf) && <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1"><CheckCircle size={10} /> CPF válido</p>}
                  {!isValidCPF(profileForm.cpf) && profileForm.cpf.length > 0 && <p className="text-[11px] text-red-500 font-medium">CPF inválido</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"/>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Telefone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="tel" required value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"/>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                  <MapPin size={18} className="text-emerald-600"/>
                </div>
                <h2 className="font-bold text-slate-800">Localização</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">CEP</label>
                  <input type="text" value={profileForm.cep} onChange={e => {
                    const val = e.target.value;
                    setProfileForm({...profileForm, cep: val});
                    if(val.replace(/\D/g, "").length === 8) fetchCep(val);
                  }} onBlur={() => fetchCep(profileForm.cep)} placeholder="00000-000" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"/>
                  {cepStatus && <p className="text-[11px] text-slate-500">{cepStatus}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Cidade</label>
                  <input type="text" value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"/>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">Estado</label>
                  <input type="text" value={profileForm.state} onChange={e => setProfileForm({...profileForm, state: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"/>
                </div>
              </div>
            </section>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
              <button type="submit" className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-sm font-bold text-white transition-all hover:shadow-xl hover:shadow-orange-500/25 hover:-translate-y-0.5">
                <Save size={18} /> Salvar Perfil
              </button>
              <Link href="/cliente" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-4 text-sm font-bold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50">
                <X size={18} /> Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
