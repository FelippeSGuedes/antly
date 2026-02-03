"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ShieldCheck, Zap, Settings, Eye, Star, LogOut, Crown, TrendingUp, Sparkles } from 'lucide-react';

type UserType = {
  id: string;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
};

type ProviderProfile = {
  category?: string | null;
  serviceType?: string | null;
  city?: string | null;
  state?: string | null;
  serviceRadius?: number | null;
  issuesInvoice?: boolean | null;
  availability?: string[] | null;
  bio?: string | null;
  address?: string | null;
  number?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  reliability_score?: number | null;
  profileUrl?: string | null;
};

export default function SidebarProfile({ user, profile }: { user: UserType; profile: ProviderProfile | null }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore network errors
    }
    router.push('/auth');
  };

  const reliabilityScore = profile?.reliability_score ? (profile.reliability_score / 20).toFixed(1) : "5.0";
  const scoreNum = parseFloat(reliabilityScore);
  const isPremium = scoreNum >= 4.5;

  return (
    <aside className="lg:col-span-3 space-y-6 h-fit sticky top-24">
      {/* Card principal com gradiente animado */}
      <div className="group bg-white rounded-3xl shadow-xl shadow-orange-500/5 border border-slate-100 p-6 text-center relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1">
        {/* Background gradiente animado */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 opacity-95">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z\' fill=\'rgba(255,255,255,0.08)\'/%3E%3C/svg%3E')] opacity-50"></div>
        </div>
        
        {/* Badge Premium */}
        {isPremium && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-bold uppercase rounded-full flex items-center gap-1 shadow-lg shadow-amber-400/30 animate-pulse">
              <Crown size={10} /> Premium
            </span>
          </div>
        )}

        {/* Avatar com ring animado */}
        <div className="relative mt-10 mb-4">
          <div className="w-24 h-24 mx-auto relative">
            {/* Ring animado */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 animate-spin-slow opacity-70 blur-sm"></div>
            <div className="absolute inset-[3px] bg-white rounded-full p-1 shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                {profile?.profileUrl ? (
                  <img src={profile.profileUrl} alt={user.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <User size={36} className="text-slate-400" />
                )}
              </div>
            </div>
            {/* Status online */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-white shadow-lg">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-50"></div>
            </div>
          </div>
        </div>

        <h2 className="font-bold text-xl text-slate-900 tracking-tight">{user.name}</h2>
        <p className="text-sm text-slate-500 mb-4 flex items-center justify-center gap-1">
          <Sparkles size={12} className="text-orange-400" />
          {profile?.category || "Perfil"}
        </p>

        {/* Badges com efeito glassmorphism */}
        <div className="flex justify-center gap-2 mb-6">
          <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1.5 border border-emerald-200/50 shadow-sm">
            <ShieldCheck size={12} className="text-emerald-500" /> Verificado
          </span>
          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1.5 border border-blue-200/50 shadow-sm">
            <Zap size={12} className="text-blue-500" /> {reliabilityScore}
          </span>
        </div>

        {/* Botões com hover premium */}
        <Link href={user.role === 'provider' ? '/prestador/perfil' : '/cliente/perfil'} className="w-full py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:from-orange-50 hover:to-amber-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
          <Settings size={16} className="transition-transform duration-300 group-hover/btn:rotate-90" /> Editar Perfil
        </Link>
        <button onClick={handleLogout} disabled={loggingOut} className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 disabled:opacity-60">
          <LogOut size={16} /> {loggingOut ? 'Saindo...' : 'Sair'}
        </button>
      </div>

      {/* Card de estatísticas */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-5 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
            <TrendingUp size={16} className="text-orange-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">Estatísticas</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-50/50 hover:from-orange-50 hover:to-amber-50/50 transition-colors">
            <span className="text-sm text-slate-600 flex items-center gap-2">
              <Eye size={16} className="text-slate-400" /> Visualizações
            </span>
            <span className="font-bold text-slate-900 text-lg">0</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-50/50 hover:from-orange-50 hover:to-amber-50/50 transition-colors">
            <span className="text-sm text-slate-600 flex items-center gap-2">
              <Star size={16} className="text-slate-400" /> Avaliações
            </span>
            <span className="font-bold text-slate-900 text-lg">0</span>
          </div>
          
          {/* Progress bar animada */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Perfil completo</span>
              <span className="font-semibold text-orange-600">70%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="w-[70%] bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full transition-all duration-1000 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
