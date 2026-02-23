"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, Eye, Star, Briefcase, ChevronRight } from 'lucide-react';
import { calculateLevel, calculateProfileCompletion, type LevelInput, type ProfileFields, type LevelResult } from '@/lib/levels';
import { LevelCard } from '@/components/LevelBadge';

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

export default function SidebarProfile({ user, profile, stats, reviews }: {
  user: UserType;
  profile: ProviderProfile | null;
  stats?: { totalViews?: number; servicesExecuted?: number; totalEarnings?: number; avgRating?: string; responseRate?: number } | null;
  reviews?: { rating: number }[];
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    router.push('/auth');
  };

  const reliabilityScore = profile?.reliability_score ? (profile.reliability_score / 20).toFixed(1) : "5.0";
  const scoreNum = parseFloat(reliabilityScore);

  const profileCompletion = useMemo(() => {
    const fields: ProfileFields = {
      cpf: (profile as any)?.cpf || undefined,
      phone: profile?.phone || undefined,
      email: user?.email || undefined,
      profileUrl: profile?.profileUrl || undefined,
      category: profile?.category || undefined,
      city: profile?.city || undefined,
      serviceRadius: profile?.serviceRadius || undefined,
      serviceType: profile?.serviceType || undefined,
      experience: (profile as any)?.experience || undefined,
      bio: profile?.bio || undefined,
      availability: profile?.availability || undefined,
      whatsapp: profile?.whatsapp || undefined,
      address: profile?.address || undefined,
      name: user?.name || undefined,
    };
    return calculateProfileCompletion(fields);
  }, [user, profile]);

  const completedServices = stats?.servicesExecuted || 0;
  const reviewsCount = reviews?.length || 0;

  const levelResult = useMemo<LevelResult>(() => {
    const accountAge = user ? Math.floor((Date.now() - new Date(2025, 0, 1).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const input: LevelInput = {
      completedServices,
      reviewsCount,
      ratingAverage: scoreNum,
      profileCompletion,
      isVerified: !!(profile as any)?.cpf,
      hasCnpj: !!(profile as any)?.hasCnpj,
      cancelRate: 0,
      accountAgeDays: accountAge,
    };
    return calculateLevel(input);
  }, [completedServices, reviewsCount, scoreNum, profileCompletion, profile, user]);

  return (
    <aside className="lg:col-span-3 space-y-5 h-fit sticky top-24">
      {/* ── Profile Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.03)' }}>
        {/* Cover + avatar */}
        <div className="relative h-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(249,115,22,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(251,146,60,0.3) 0%, transparent 50%)' }} />
        </div>
        <div className="px-5 pb-5 -mt-10 relative">
          {/* Avatar */}
          <div className="w-[72px] h-[72px] rounded-2xl bg-white p-[3px] shadow-lg mb-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div className="w-full h-full rounded-[13px] bg-slate-100 flex items-center justify-center overflow-hidden">
              {profile?.profileUrl ? (
                <img src={profile.profileUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-slate-400" />
              )}
            </div>
          </div>

          <h2 className="text-[15px] font-bold text-slate-900 leading-tight">{user.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{profile?.category || 'Profissional'}</p>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-1 mt-4 -mx-1">
            {[
              { icon: Star, label: 'Nota', value: reliabilityScore },
              { icon: Briefcase, label: 'Serviços', value: completedServices },
              { icon: Eye, label: 'Views', value: stats?.totalViews || 0 },
            ].map((s) => (
              <div key={s.label} className="text-center py-2 px-1 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-bold text-slate-800 tabular-nums">{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Profile completion */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-slate-400">Perfil completo</span>
              <span className="font-semibold text-slate-600">{profileCompletion}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
                style={{ width: `${profileCompletion}%`, transition: 'width 0.8s ease' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-2">
            <Link
              href={user.role === 'provider' ? '/prestador/perfil' : '/cliente/perfil'}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-200 group"
            >
              <span className="flex items-center gap-2">
                <Settings size={14} className="transition-transform duration-300 group-hover:rotate-90" />
                Editar Perfil
              </span>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all duration-200 disabled:opacity-50"
            >
              <LogOut size={14} />
              {loggingOut ? 'Saindo...' : 'Sair da conta'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Level Card ── */}
      <LevelCard levelResult={levelResult} />
    </aside>
  );
}
