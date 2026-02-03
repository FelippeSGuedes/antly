"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Bell, User as UserIcon, Zap, Clock, CheckCircle, AlertCircle, TrendingUp, Calendar, Eye, MessageSquare, ChevronRight, Sparkles, ArrowUpRight, Shield, Award, ThumbsUp, MoreHorizontal, ExternalLink, Settings, Lock, Mail, Phone, Trash2, MapPin } from "lucide-react";
import SidebarProfile from '@/components/SidebarProfile';

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
  const [stats, setStats] = useState<any>(null);

  // UI state for client dashboard
  const [tab, setTab] = useState<'dashboard'|'myservices'|'reviews'|'profile'|'settings'>('dashboard');
  const [services, setServices] = useState<Array<{id:number;provider:string;service:string;date:string;status:string}>>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Array<{id:number;provider:string;rating:number;comment:string;status:string}>>([]);

  const [profileForm, setProfileForm] = useState({
    name: '', cpf: '', email: '', cep: '', phone: '', city: '', state: '', photo: ''
  });

  // cálculo simples de completude do perfil (0-100)
  const profileFields = ['name','cpf','email','cep','phone','city','photo'];
  const filledCount = profileFields.reduce((acc, key) => acc + ((profileForm as any)[key] ? 1 : 0), 0);
  const profileCompletion = Math.round((filledCount / profileFields.length) * 100);
  const profileTarget = 80; // meta mínima recomendada

  // construir objeto de profile para a SidebarProfile (mesma shape usada pelo prestador)
  const profileForSidebar = {
    profileUrl: profileForm.photo || null,
    category: 'Cliente',
    reliability_score: 80,
    city: profileForm.city || null,
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [meResponse, prosResponse, statsResponse] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/professionals"),
          fetch("/api/client/stats")
        ]);

        if (meResponse.ok) {
          const me = await meResponse.json();
          setUser(me);
          setProfileForm((p) => ({ ...p, name: me.name || '', email: me.email || '' }));
        }

        if (prosResponse.ok) {
          const pros = await prosResponse.json();
          setProfessionals(pros.slice(0, 6));
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
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
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-800 pb-20">
      {/* Header Espetacular */}
      <header className="relative overflow-hidden">
        {/* Background Gradient Quente */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-500">
          {/* Pattern - escondido em mobile para performance */}
          <div className="hidden sm:block absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.08%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          {/* Blobs - escondidos em mobile */}
          <div className="hidden md:block absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-400/30 rounded-full blur-[120px]"></div>
          <div className="hidden md:block absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-700/40 rounded-full blur-[100px]"></div>
        </div>
        
        {/* Conteúdo do Header */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-10 max-w-6xl mx-auto">
          {/* Topo com Logo e Avatar */}
          <div className="flex items-center justify-between py-4 sm:py-5 md:py-6">
            {/* Logo */}
            <div className="cursor-pointer group flex-shrink-0" onClick={() => setTab('dashboard')}>
              <img src="/logo.svg" alt="Antly" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto brightness-0 invert group-hover:scale-105 transition-transform" />
            </div>
            
            {/* Avatar e Info */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:block text-right">
                <p className="text-white font-bold text-sm md:text-base truncate max-w-[120px] md:max-w-none">{user.name}</p>
                <p className="text-orange-100 text-xs flex items-center justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Online
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* Hero do Header */}
          <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-5 md:mb-6">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="text-xs sm:text-sm font-bold text-white">Cliente Antly</span>
              <div className="w-px h-3 sm:h-4 bg-white/30"></div>
              <span className="text-[10px] sm:text-xs text-white/90 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verificado
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 md:mb-4 tracking-tight drop-shadow-lg">
              Olá, {user.name.split(' ')[0]}!
            </h1>
            
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              Encontre os melhores profissionais para você
            </p>
          </div>
          
          {/* Stats Rápidos - Container com width fixo e centralizado */}
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto pb-8 sm:pb-10 md:pb-12">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              <div className="text-center py-3 px-2 sm:p-3 md:p-4 lg:p-5 bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white">{stats?.totalServices || 0}</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-white/70 mt-0.5">Serviços</p>
              </div>
              <div className="text-center py-3 px-2 sm:p-3 md:p-4 lg:p-5 bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white">{stats?.totalReviews || 0}</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-white/70 mt-0.5">Avaliações</p>
              </div>
              <div className="text-center py-3 px-2 sm:p-3 md:p-4 lg:p-5 bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white">{stats?.profileCompletion || 0}%</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-white/70 mt-0.5">Perfil</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curva decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6 sm:h-8 md:h-10 lg:h-auto" preserveAspectRatio="none">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 33.3C840 36.7 960 43.3 1080 45C1200 46.7 1320 43.3 1380 41.7L1440 40V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#FDFBF7"/>
          </svg>
        </div>
      </header>

      {/* Layout Grid Principal */}
      <main className="max-w-6xl mx-auto mt-8 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <SidebarProfile user={user} profile={profileForSidebar} />

        {/* Main content */}
        <section className="lg:col-span-9">
          {/* Navigation Tabs com visual premium */}
          <div className="flex items-center gap-2 md:gap-6 mb-8 bg-white/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-100 shadow-sm overflow-x-auto">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { key: 'myservices', label: 'Meus Serviços', icon: Calendar },
              { key: 'reviews', label: 'Avaliações', icon: Star },
              { key: 'profile', label: 'Meu Perfil', icon: UserIcon },
              { key: 'settings', label: 'Configurações', icon: Settings }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key as typeof tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  tab === item.key
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon size={16} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>

          <div>
          {tab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header do Dashboard */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Olá, {user.name.split(' ')[0]}! 👋</h2>
                  <p className="text-slate-500 mt-1">Aqui está o resumo da sua conta</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} />
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>

              {/* Cards de métricas com gradientes e ícones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card: Em andamento */}
                <div className="group relative rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1 cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Zap size={24} className="text-white" />
                      </div>
                      <ArrowUpRight size={20} className="text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-white/80 text-sm font-medium">Em andamento</p>
                    <p className="mt-1 text-3xl font-bold">{services.filter(s=>s.status==='Em execução').length}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                      <TrendingUp size={12} />
                      <span>Serviços ativos</span>
                    </div>
                  </div>
                </div>

                {/* Card: Aguardando confirmação */}
                <div className="group relative rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-1 cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Clock size={24} className="text-white" />
                      </div>
                      <ArrowUpRight size={20} className="text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-white/80 text-sm font-medium">Aguardando</p>
                    <p className="mt-1 text-3xl font-bold">{services.filter(s=>s.status==='Aguardando confirmação').length}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                      <AlertCircle size={12} />
                      <span>Precisam atenção</span>
                    </div>
                  </div>
                </div>

                {/* Card: Avaliações pendentes */}
                <div className="group relative rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-5 text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-1 cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Star size={24} className="text-white" />
                      </div>
                      <ArrowUpRight size={20} className="text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-white/80 text-sm font-medium">Avaliar</p>
                    <p className="mt-1 text-3xl font-bold">{reviews.filter(r=>r.status==='Pendente').length}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                      <MessageSquare size={12} />
                      <span>Deixe sua opinião</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cards secundários */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group rounded-2xl bg-white border border-slate-100 p-5 transition-all duration-300 hover:shadow-lg hover:border-emerald-200">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                      <CheckCircle size={24} className="text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+12%</span>
                  </div>
                  <h3 className="mt-4 text-sm text-slate-500 font-medium">Total Concluídos</h3>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{services.filter(s=>s.status==='Executado').length}</p>
                  <p className="mt-2 text-xs text-slate-400">Serviços finalizados com sucesso</p>
                </div>

                <div className="group rounded-2xl bg-white border border-slate-100 p-5 transition-all duration-300 hover:shadow-lg hover:border-rose-200">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                      <Bell size={24} className="text-rose-600" />
                    </div>
                    <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="mt-4 text-sm text-slate-500 font-medium">Notificações</h3>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{reviews.filter(r=>r.status==='Pendente').length}</p>
                  <p className="mt-2 text-xs text-slate-400">Pendências que requerem ação</p>
                </div>
              </div>

              {/* Alert box com visual premium */}
              <div className="rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border border-orange-100 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Ações Pendentes</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                        {services.filter(s=>s.status==='Aguardando confirmação').length} serviço(s) aguardando sua confirmação
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                        {reviews.filter(r=>r.status==='Pendente').length} serviço(s) aguardando sua avaliação
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-orange-600 hover:bg-orange-100 transition-colors shadow-sm">
                    Ver tudo
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'myservices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Calendar size={20} className="text-orange-500" />
                        Meus Serviços
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">Acompanhe todos os serviços que você solicitou</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                        {services.length} serviços
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Prestador</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Serviço</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {services.map(s => {
                        const statusConfig: Record<string, { bg: string; text: string; icon: typeof Zap }> = {
                          'Em execução': { bg: 'bg-blue-50', text: 'text-blue-700', icon: Zap },
                          'Aguardando confirmação': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
                          'Executado': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
                          'Aguardando avaliação': { bg: 'bg-violet-50', text: 'text-violet-700', icon: Star }
                        };
                        const config = statusConfig[s.status] || { bg: 'bg-slate-50', text: 'text-slate-700', icon: AlertCircle };
                        const StatusIcon = config.icon;
                        
                        return (
                          <tr key={s.id} className="hover:bg-orange-50/30 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                                  <UserIcon size={18} className="text-orange-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">{s.provider}</p>
                                  <p className="text-xs text-slate-400">Profissional verificado</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-slate-700">{s.service}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-600">{new Date(s.date).toLocaleDateString('pt-BR')}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                                <StatusIcon size={12} />
                                {s.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setSelectedService(s.id)} className="p-2 hover:bg-orange-100 rounded-lg transition-colors">
                                  <Eye size={16} className="text-orange-600" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                  <MoreHorizontal size={16} className="text-slate-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedService && (
                <div className="rounded-2xl bg-white border border-slate-100 shadow-lg p-6 animate-scale-in">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                        <UserIcon size={24} className="text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{services.find(x=>x.id===selectedService)?.provider}</h4>
                        <p className="text-sm text-slate-500">{services.find(x=>x.id===selectedService)?.service}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedService(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <ExternalLink size={16} className="text-slate-400" />
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <h5 className="text-sm font-semibold text-slate-700 mb-3">Histórico de Status</h5>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle size={14} className="text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Pendente → Aprovado</p>
                          <p className="text-xs text-slate-400">Há 2 dias</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Zap size={14} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Aprovado → Em execução</p>
                          <p className="text-xs text-slate-400">Há 1 dia</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                      <CheckCircle size={16} /> Confirmar conclusão
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-semibold text-sm hover:bg-rose-100 transition-colors">
                      Cancelar
                    </button>
                    <button disabled={services.find(x=>x.id===selectedService)?.status !== 'Aguardando avaliação'} className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-semibold text-sm hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <Star size={16} /> Avaliar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Star size={24} className="text-amber-500" />
                    Avaliações
                  </h2>
                  <p className="text-slate-500 mt-1">Gerencie suas avaliações e feedbacks</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Avaliações Feitas */}
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-green-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                        <ThumbsUp size={18} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Avaliações Feitas</h4>
                        <p className="text-xs text-slate-500">{reviews.filter(r=>r.status!=='Pendente').length} avaliações</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {reviews.filter(r=>r.status!=='Pendente').map(r=> (
                      <div key={r.id} className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                              <UserIcon size={18} className="text-orange-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{r.provider}</p>
                              <p className="text-xs text-slate-400">Profissional</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                            {r.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1,2,3,4,5].map(star => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                            />
                          ))}
                          <span className="ml-2 text-sm font-bold text-slate-700">{r.rating}.0</span>
                        </div>
                        <p className="text-sm text-slate-600 italic">&quot;{r.comment}&quot;</p>
                      </div>
                    ))}
                    {reviews.filter(r=>r.status!=='Pendente').length === 0 && (
                      <div className="text-center py-8">
                        <Award size={40} className="mx-auto text-slate-200 mb-3" />
                        <p className="text-sm text-slate-400">Nenhuma avaliação feita ainda</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Avaliações Pendentes */}
                <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                        <Clock size={18} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Avaliações Pendentes</h4>
                        <p className="text-xs text-slate-500">{reviews.filter(r=>r.status==='Pendente').length} pendentes</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {reviews.filter(r=>r.status==='Pendente').map(r=> (
                      <div key={r.id} className="p-4 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                              <UserIcon size={18} className="text-amber-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{r.provider}</p>
                              <p className="text-xs text-amber-600 font-medium">Aguardando sua avaliação</p>
                            </div>
                          </div>
                          <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                        </div>
                        <button className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2">
                          <Star size={16} /> Avaliar agora
                        </button>
                      </div>
                    ))}
                    {reviews.filter(r=>r.status==='Pendente').length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle size={40} className="mx-auto text-emerald-200 mb-3" />
                        <p className="text-sm text-slate-400">Todas avaliações em dia!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                {/* Header com gradiente */}
                <div className="relative h-32 bg-gradient-to-br from-orange-400 via-amber-500 to-orange-500">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
                  <div className="absolute -bottom-10 left-8">
                    <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl">
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                        {profileForm.photo ? (
                          <img src={profileForm.photo} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon size={32} className="text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-14 pb-6 px-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{profileForm.name || user.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <Mail size={14} />
                        {profileForm.email || user.email}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <MapPin size={14} />
                        {profileForm.city || 'Cidade não informada'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href="/cliente/perfil" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                        <Settings size={16} /> Editar Perfil
                      </Link>
                      <button className="p-2.5 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                        <Eye size={18} className="text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                      <Shield size={12} /> Conta Verificada
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      <Award size={12} /> Desde 2024
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-semibold">
                      <Star size={12} /> 5.0 Média
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats rápidas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white border border-slate-100 p-5 text-center">
                  <p className="text-3xl font-bold text-slate-900">{services.length}</p>
                  <p className="text-sm text-slate-500 mt-1">Serviços</p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-100 p-5 text-center">
                  <p className="text-3xl font-bold text-slate-900">{reviews.filter(r=>r.status!=='Pendente').length}</p>
                  <p className="text-sm text-slate-500 mt-1">Avaliações</p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-100 p-5 text-center">
                  <p className="text-3xl font-bold text-orange-600">5.0</p>
                  <p className="text-sm text-slate-500 mt-1">Nota média</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Settings size={24} className="text-orange-500" />
                  Configurações
                </h2>
                <p className="text-slate-500 mt-1">Gerencie suas preferências de conta</p>
              </div>

              <div className="grid gap-4">
                {/* Segurança */}
                <div className="rounded-2xl bg-white border border-slate-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <Lock size={22} className="text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">Segurança</h4>
                      <p className="text-sm text-slate-500 mt-1">Altere sua senha e configurações de segurança</p>
                      <button className="mt-4 px-4 py-2 bg-violet-50 text-violet-700 rounded-xl text-sm font-semibold hover:bg-violet-100 transition-colors">
                        Alterar senha
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notificações */}
                <div className="rounded-2xl bg-white border border-slate-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Bell size={22} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">Notificações</h4>
                      <p className="text-sm text-slate-500 mt-1">Escolha como deseja receber atualizações</p>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform shadow-sm"></div>
                          </div>
                          <span className="text-sm text-slate-700 flex items-center gap-1">
                            <Mail size={14} /> Email
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform shadow-sm"></div>
                          </div>
                          <span className="text-sm text-slate-700 flex items-center gap-1">
                            <Phone size={14} /> WhatsApp
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacidade */}
                <div className="rounded-2xl bg-white border border-slate-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center flex-shrink-0">
                      <Shield size={22} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">Privacidade</h4>
                      <p className="text-sm text-slate-500 mt-1">Controle suas configurações de privacidade e dados</p>
                      <button className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-colors">
                        Gerenciar privacidade
                      </button>
                    </div>
                  </div>
                </div>

                {/* Zona de perigo */}
                <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-red-50 border border-rose-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <Trash2 size={22} className="text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-rose-900">Zona de Perigo</h4>
                      <p className="text-sm text-rose-600 mt-1">Ações irreversíveis para sua conta</p>
                      <button className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/25">
                        Excluir conta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  </div>
  );
}
