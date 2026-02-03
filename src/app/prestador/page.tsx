"use client";

import React, { useState, useEffect, type ChangeEvent } from 'react';
import Link from "next/link";
import SidebarProfile from '@/components/SidebarProfile';
import { useRouter } from "next/navigation";
import { 
  User, MapPin, Clock, CreditCard, CheckCircle2, UploadCloud, 
  Briefcase, AlertCircle, Trash2, MoreHorizontal, ShieldCheck, 
  Zap, Search, Bell, ChevronRight, Settings, Plus, ArrowLeft, 
  LayoutGrid, List, X, TrendingUp, Eye, Star, DollarSign, 
  ArrowUpRight, Sparkles, Calendar, Award, MessageSquare, CheckCircle
} from 'lucide-react';

// --- CORES DO TEMA ---
const theme = {
  primary: 'orange-600',
  primaryLight: 'orange-50',
  textMain: 'slate-800',
  textMuted: 'slate-500',
  bg: 'slate-50'
};

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

type Ad = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "Postado" | "Em Analise" | "Reprovado";
  created_at: string;
  service_function?: string | null;
  service_type?: string | null;
  city?: string | null;
  state?: string | null;
  service_radius?: number | null;
  payment_methods?: string[] | null;
  attendance_24h?: boolean | null;
  emits_invoice?: boolean | null;
  warranty?: boolean | null;
  own_equipment?: boolean | null;
  specialized_team?: boolean | null;
  availability?: string[] | null;
  photos?: string[] | null;
  views?: number | null;
  ratings_count?: number | null;
  ratings_avg?: string | number | null;
};

// SidebarProfile component moved to src/components/SidebarProfile.tsx

type Review = {
  id: number;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  serviceTitle: string;
};

type ViewType = 'stats' | 'services' | 'reviews' | 'create' | 'view' | 'myjobs';

// --- COMPONENTE 2: DASHBOARD HOME (MÉTRICAS) ---
const StatsDashboardView = ({ ads, profile, stats, reviews, setView }: { ads: Ad[], profile: ProviderProfile | null, stats: any, reviews: Review[], setView: (view: ViewType) => void }) => {
  const totalViews = stats?.totalViews || 0;
  const totalAds = ads.length;
  const servicesExecuted = stats?.servicesExecuted || 0;
  const totalEarnings = stats?.totalEarnings || 0;
  const avgRating = stats?.avgRating || '0.0';
  const responseRate = stats?.responseRate || 0; 

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header com saudação */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
           <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
           <p className="text-slate-500 mt-1 flex items-center gap-2">
             <Calendar size={14} />
             Últimos 30 dias • Atualizado agora
           </p>
         </div>
         <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
             <Calendar size={16} /> Período
           </button>
           <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all flex items-center gap-2">
             <Plus size={16} /> Novo Anúncio
           </button>
         </div>
      </div>

      {/* Cards de Métricas Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card: Visualizações */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
             <div className="relative">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Eye size={24} />
                  </div>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={12} /> +12%
                  </span>
               </div>
               <p className="text-white/80 text-sm font-medium">Visualizações</p>
               <p className="text-3xl font-bold mt-1">{totalViews}</p>
             </div>
          </div>

          {/* Card: Serviços */}
          <div className="group relative bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-2xl text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-1">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
             <div className="relative">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp size={12} /> +4%
                  </span>
               </div>
               <p className="text-white/80 text-sm font-medium">Serviços Executados</p>
               <p className="text-3xl font-bold mt-1">{servicesExecuted}</p>
             </div>
          </div>

          {/* Card: Avaliação */}
          <div className="group relative bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-1">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
             <div className="relative">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Star size={24} />
                  </div>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">
                    Média
                  </span>
               </div>
               <p className="text-white/80 text-sm font-medium">Sua Avaliação</p>
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold">{avgRating}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className={i <= Math.round(parseFloat(avgRating)) ? "fill-white text-white" : "text-white/40"} />)}
                  </div>
               </div>
             </div>
          </div>

          {/* Card: Anúncios Ativos */}
          <div className="group relative bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-2xl text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-1">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
             <div className="relative">
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles size={24} />
                  </div>
                  <ArrowUpRight size={20} className="text-white/60 group-hover:text-white transition-colors" />
               </div>
               <p className="text-white/80 text-sm font-medium">Anúncios Ativos</p>
               <p className="text-3xl font-bold mt-1">{ads.filter(a => a.status === 'Postado').length}</p>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Desempenho */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
               <TrendingUp size={20} className="text-orange-500" />
               Desempenho dos Anúncios
             </h3>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-orange-500"></span>
               <span className="text-xs text-slate-500">Visualizações</span>
             </div>
           </div>
           <div className="h-64 flex items-end justify-between gap-3 px-4 border-b border-slate-100 pb-4">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="w-full relative group/bar">
                      <div className="w-full bg-slate-100 rounded-t-lg h-56 relative overflow-hidden">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-lg transition-all duration-700" 
                          style={{ height: `${h}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-2 px-3 rounded-lg pointer-events-none transition-all shadow-lg z-10">
                        <div className="font-bold">{h} views</div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-slate-800"></div>
                      </div>
                  </div>
              ))}
           </div>
           <div className="flex justify-between text-xs text-slate-400 mt-4 px-2 font-medium">
              <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span><span>Dom</span>
           </div>
        </div>

        {/* Avaliações Recentes */}
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Star size={20} className="text-amber-500" />
                Últimas Avaliações
              </h3>
              {reviews.length > 0 && (
                <span 
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 cursor-pointer"
                  onClick={() => setView('reviews')}
                >
                  Ver todas
                </span>
              )}
            </div>
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <Star size={48} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm text-slate-400">Nenhuma avaliação recebida ainda</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50/50 hover:bg-orange-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-xs font-bold text-orange-600">
                                 {review.clientName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-slate-800 truncate">{review.clientName}</span>
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-full">
                                      <Star size={10} className="text-amber-500 fill-amber-500" />
                                      <span className="text-xs font-bold text-amber-700">{review.rating.toFixed(1)}</span>
                                    </div>
                                 </div>
                                 <p className="text-xs text-slate-500 line-clamp-2">"{review.comment}"</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                  onClick={() => setView('reviews')}
                  className="w-full mt-4 py-3 text-sm font-bold text-orange-600 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all"
                >
                    Ver Todas as Avaliações
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: REVIEWS VIEW (Avaliações) ---
const ReviewsView = ({ reviews, reviewsGiven, pendingReviews }: { reviews: Review[], reviewsGiven: any[], pendingReviews: any[] }) => {
    const [tab, setTab] = React.useState<'recebidas' | 'realizadas' | 'pendentes'>('recebidas');
    
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Premium */}
            <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 rounded-2xl shadow-2xl overflow-hidden">
               <div className="absolute inset-0 opacity-20">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                 <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
               </div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                   <div className="flex items-center gap-2 mb-3">
                     <Star size={16} className="text-white/80" />
                     <span className="text-white/80 text-sm font-bold uppercase tracking-wider">Reputação</span>
                   </div>
                   <h1 className="text-3xl font-bold text-white mb-2">Minhas Avaliações</h1>
                   <p className="text-white/80 max-w-md">
                     Veja o que seus clientes estão falando sobre seus serviços.
                   </p>
                 </div>
                 <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                   <div className="flex items-center justify-center gap-1 mb-2">
                     {[1,2,3,4,5].map(i => (
                       <Star key={i} size={24} className={`${i <= Math.round(avgRating) ? 'text-white fill-white' : 'text-white/40'}`} />
                     ))}
                   </div>
                   <div className="text-4xl font-bold text-white mb-1">{avgRating.toFixed(1)}</div>
                   <div className="text-white/70 text-sm">{reviews.length} avaliações</div>
                 </div>
               </div>
            </div>

            {/* Tabs Premium */}
            <div className="bg-white p-2 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-100 inline-flex gap-1">
                <button 
                  onClick={() => setTab('recebidas')} 
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    tab === 'recebidas' 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Award size={16} />
                    Recebidas ({reviews.length})
                  </span>
                </button>
                <button 
                  onClick={() => setTab('realizadas')} 
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    tab === 'realizadas' 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Star size={16} />
                    Realizadas ({reviewsGiven.length})
                  </span>
                </button>
                <button 
                  onClick={() => setTab('pendentes')} 
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    tab === 'pendentes' 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    Pendentes ({pendingReviews.length})
                  </span>
                </button>
            </div>

            {tab === 'recebidas' ? (
                reviews.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                    <Star size={64} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhuma avaliação recebida</h3>
                    <p className="text-slate-500">Suas avaliações aparecerão aqui quando clientes avaliarem seus serviços.</p>
                  </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {reviews.map((review, index) => (
                        <div 
                          key={review.id} 
                          className="group bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center font-bold text-orange-600 text-lg shadow-lg shadow-orange-500/10">
                                        {review.clientName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{review.clientName}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                          <Briefcase size={12} /> {review.serviceTitle}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-xl border border-amber-200">
                                    <span className="font-bold text-amber-700 text-lg">{review.rating}.0</span>
                                    <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={14} className={i < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
                                      ))}
                                    </div>
                                </div>
                            </div>
                            <div className="relative bg-gradient-to-br from-slate-50 to-orange-50/30 p-5 rounded-xl">
                              <div className="absolute top-3 left-4 text-orange-200 text-4xl font-serif">"</div>
                              <p className="text-slate-600 text-sm leading-relaxed italic pl-6 pr-2">{review.comment}</p>
                            </div>
                            <div className="mt-4 flex justify-end text-xs text-slate-400">
                                 <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                                   <Calendar size={12}/> {review.date}
                                 </span>
                            </div>
                        </div>
                    ))}
                </div>
                )
            ) : tab === 'realizadas' ? (
                reviewsGiven.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                    <MessageSquare size={64} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhuma avaliação realizada</h3>
                    <p className="text-slate-500">Avalie seus clientes após concluir um serviço.</p>
                  </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {reviewsGiven.map((review: any, index: number) => (
                        <div 
                          key={review.id} 
                          className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-600 text-lg">
                                        {review.clientName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{review.clientName}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                          <Briefcase size={12} /> {review.serviceTitle}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-xl border border-emerald-200">
                                    <span className="font-bold text-emerald-700 text-lg">{review.rating.toFixed(1)}</span>
                                    <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={14} className={i < review.rating ? "text-emerald-500 fill-emerald-500" : "text-slate-300"} />
                                      ))}
                                    </div>
                                </div>
                            </div>
                            <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 rounded-xl">
                              <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                            <div className="mt-4 flex justify-end text-xs text-slate-400">
                                 <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                                   <Calendar size={12}/> {new Date(review.date).toLocaleDateString('pt-BR')}
                                 </span>
                            </div>
                        </div>
                    ))}
                </div>
                )
            ) : (
                pendingReviews.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                    <CheckCircle size={64} className="mx-auto text-green-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhuma avaliação pendente</h3>
                    <p className="text-slate-500">Você está em dia com suas avaliações!</p>
                  </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {pendingReviews.map((pending: any, index: number) => (
                        <div 
                          key={pending.serviceId} 
                          className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl shadow-xl shadow-slate-900/5 border-2 border-orange-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
                                  {pending.clientName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900">{pending.clientName}</h4>
                                  <p className="text-sm text-slate-600">{pending.serviceTitle}</p>
                                </div>
                              </div>
                              <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                Pendente
                              </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl mb-4">
                              <p className="text-xs text-slate-500 mb-2">Concluído em: {new Date(pending.completedAt).toLocaleDateString('pt-BR')}</p>
                              <p className="text-sm text-slate-700">Avalie sua experiência com este cliente</p>
                            </div>
                            <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl">
                              Avaliar Agora
                            </button>
                        </div>
                    ))}
                </div>
                )
            )}
        </div>
    );
};

// --- COMPONENTE: MY SERVICES VIEW (ANTIGO DASHBOARD VIEW) ---
const MyServicesView = ({ ads, onCreateClick, onViewAd, deleteAd }: { ads: Ad[], onCreateClick: () => void, onViewAd: (ad: Ad) => void, deleteAd: (id: number) => void }) => (
  <div className="space-y-8 animate-fade-in">
    {/* Header do Dashboard Premium */}
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl overflow-hidden">
       {/* Elementos decorativos */}
       <div className="absolute inset-0 opacity-10">
         <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
       </div>
       <div className="absolute top-4 right-4 w-24 h-24 border border-white/10 rounded-full"></div>
       <div className="absolute top-8 right-8 w-16 h-16 border border-white/10 rounded-full"></div>
       
       <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
           <div className="flex items-center gap-2 mb-3">
             <Sparkles size={16} className="text-orange-400" />
             <span className="text-orange-400 text-sm font-bold uppercase tracking-wider">Painel de Anúncios</span>
           </div>
           <h1 className="text-3xl font-bold text-white mb-2">Seus Anúncios</h1>
           <p className="text-slate-400 max-w-md">
             Gerencie seus anúncios ativos e crie novas oportunidades de negócio.
           </p>
         </div>
         <button 
           onClick={onCreateClick}
           className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
         >
           <Plus size={20} />
           Criar Novo Anúncio
         </button>
       </div>
    </div>

    {/* Filtros Premium */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-100">
       <div className="relative w-full sm:w-96">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
         <input 
           type="text" 
           placeholder="Buscar em seus anúncios..." 
           className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
         />
       </div>
       <div className="flex gap-2">
         <button className="p-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
           <LayoutGrid size={18} />
         </button>
         <button className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white border border-transparent shadow-md shadow-orange-500/20">
           <List size={18} />
         </button>
       </div>
    </div>

    {/* Tabela Premium */}
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 overflow-hidden">
       <table className="w-full text-left">
         <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
           <tr>
             <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Serviço</th>
             <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
             <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Estatísticas</th>
             <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
           </tr>
         </thead>
         <tbody className="divide-y divide-slate-100">
           {ads.map((ad, index) => (
             <tr key={ad.id} className={`hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-amber-50/30 transition-all group ${ad.status === 'Reprovado' ? 'opacity-60' : ''}`} style={{ animationDelay: `${index * 50}ms` }}>
               <td className="px-6 py-5">
                 <div className="flex items-center gap-4">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105 ${
                     ad.status === 'Reprovado' ? 'bg-slate-100 text-slate-400' : 
                     ad.status === 'Postado' ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25' :
                     'bg-gradient-to-br from-amber-100 to-orange-100 text-orange-600'
                   }`}>
                     {ad.status === 'Reprovado' ? <AlertCircle size={22} /> : <Briefcase size={22} />}
                   </div>
                   <div>
                     <p 
                        onClick={() => onViewAd(ad)}
                        className="font-bold text-slate-800 text-sm cursor-pointer hover:text-orange-600 transition-colors group-hover:text-orange-600"
                     >
                       {ad.title}
                     </p>
                     <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                       <Calendar size={11} /> {new Date(ad.created_at).toLocaleDateString('pt-BR')}
                     </p>
                   </div>
                 </div>
               </td>
               <td className="px-6 py-5">
                 <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                    ad.status === 'Em Analise' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200' : 
                    ad.status === 'Reprovado' ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-600 border-red-200' :
                    'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200'
                 }`}>
                   {ad.status === 'Em Analise' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                   {ad.status === 'Postado' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                   {ad.status === 'Reprovado' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                   {ad.status === 'Postado' ? 'Ativo' : ad.status}
                 </span>
               </td>
               <td className="px-6 py-5 hidden md:table-cell">
                 <div className="flex items-center gap-4 text-sm">
                   <span title="Visualizações" className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                     <Eye size={14} className="text-blue-500" /> 
                     <span className="font-semibold">{ad.views || 0}</span>
                   </span>
                   <span title="Avaliações" className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                     <Star size={14} className="text-amber-500" /> 
                     <span className="font-semibold">{ad.ratings_count || 0}</span>
                   </span>
                 </div>
               </td>
               <td className="px-6 py-5 text-right">
                 <div className="flex items-center justify-end gap-2">
                   <button 
                     onClick={() => onViewAd(ad)}
                     className="p-2.5 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                     title="Visualizar"
                   >
                     <Eye size={18} />
                   </button>
                   <button 
                     onClick={() => deleteAd(ad.id)}
                     className="p-2.5 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                     title="Excluir"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
       {ads.length === 0 && (
          <div className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <Briefcase size={32} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Nenhum anúncio encontrado</h3>
            <p className="text-slate-500 text-sm mb-6">Comece criando seu primeiro anúncio para atrair clientes</p>
            <button 
              onClick={onCreateClick}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <Plus size={18} /> Criar Anúncio
            </button>
          </div>
       )}
    </div>
  </div>
);

// --- COMPONENTE 3: AD PREVIEW (CLIENT VIEW) ---
const AdPreviewView = ({ ad, profile, userName, onBack }: { ad: Ad, profile: ProviderProfile | null, userName?: string, onBack: () => void }) => {
  const whatsappNumber = profile?.whatsapp ? `55${profile.whatsapp.replace(/\D/g, '')}` : "";
  const whatsappUrl = whatsappNumber 
    ? `https://wa.me/${whatsappNumber}?text=Olá ${encodeURIComponent(userName || profile?.category || "Profissional")}, vi seu anúncio "${encodeURIComponent(ad.title)}" na Antly e gostaria de solicitar um orçamento.`
    : "#";

  return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <div className="p-1 rounded-md bg-white border border-slate-200 group-hover:border-slate-300 transition-colors">
              <ArrowLeft size={14} />
            </div>
            Voltar para meus anúncios
          </button>
    
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                
                {/* Hero / Title Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold uppercase rounded-full mb-3">
                                {ad.category} • {ad.service_function}
                            </span>
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-2">{ad.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><MapPin size={14} /> {profile?.city || "Localização"}, {profile?.state || "BR"}</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> Postado em {new Date(ad.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Photos */}
                {ad.photos && ad.photos.length > 0 && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                        <div className="grid grid-cols-2 gap-1 p-1">
                            {ad.photos.map((photo, idx) => (
                                <div key={idx} className={`relative overflow-hidden ${idx === 0 && ad.photos && ad.photos.length % 2 !== 0 ? 'col-span-2 h-64' : 'h-48'}`}>
                                    <img src={photo} alt={`Trabalho ${idx}`} className="w-full h-full object-cover rounded-sm hover:scale-105 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Sobre o Serviço</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{ad.description}</p>
                </div>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <CreditCard size={16} className="text-orange-500"/> Pagamento Aceito
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {ad.payment_methods?.map(m => (
                                <span key={m} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-100">{m}</span>
                            )) || <span className="text-sm text-slate-400">A combinar</span>}
                        </div>
                     </div>

                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <CheckCircle2 size={16} className="text-emerald-500"/> Diferenciais
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            {ad.attendance_24h && <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Atendimento 24h</li>}
                            {ad.warranty && <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Garantia de Serviço</li>}
                            {ad.own_equipment && <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Equipamento Próprio</li>}
                            {ad.specialized_team && <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Equipe Especializada</li>}
                            {ad.emits_invoice && <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500"/> Emite Nota Fiscal</li>}
                            {!ad.attendance_24h && !ad.warranty && !ad.own_equipment && !ad.specialized_team && !ad.emits_invoice && (
                                <li className="text-slate-400 italic">Nenhum diferencial listado.</li>
                            )}
                        </ul>
                     </div>
                </div>
            </div>

            {/* Sidebar / CTA */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                     <div className="text-center mb-6">
                         <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full mb-3 overflow-hidden">
                            {profile?.profileUrl ? (
                                <img src={profile.profileUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-full h-full p-4 text-slate-300" />
                            )}
                         </div>
                         <h3 className="font-bold text-lg text-slate-900">{profile?.category || "Profissional"}</h3>
                         <div className="flex items-center justify-center gap-1 mt-1">
                             {[1,2,3,4,5].map(i => <Zap key={i} size={12} className="text-orange-500 fill-orange-500" />)}
                             <span className="text-xs font-bold text-slate-600 ml-1">5.0</span>
                         </div>
                     </div>

                     <div className="space-y-4 border-t border-slate-100 pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Membro desde</span>
                            <span className="font-semibold text-slate-700">Jan 2026</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Projetos</span>
                            <span className="font-semibold text-slate-700">12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Raio de Atendimento</span>
                            <span className="font-semibold text-slate-700">{profile?.serviceRadius ? `${profile.serviceRadius}km` : 'N/A'}</span>
                        </div>
                     </div>

                     <div className="mt-8">
                         <a 
                           href={whatsappUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                         >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Fazer Orçamento
                         </a>
                         <p className="text-xs text-center text-slate-400 mt-3">Resposta média em 15 minutos</p>
                     </div>
                </div>
            </div>
          </div>
        </div>
  );
};

// --- COMPONENTE 4: FORMULÁRIO (CRIAR) ---
const CreateAdForm = ({ 
  onCancel, 
  onPublish, 
  form, 
  setForm,
  profile,
  handlePhotoUpload,
  photoPreviews,
  handlePaymentToggle,
  errors,
  isEditing = false
}: {
  onCancel: () => void,
  onPublish: (e: React.FormEvent) => void,
  form: any,
  setForm: any,
  profile: ProviderProfile | null,
  handlePhotoUpload: (e: ChangeEvent<HTMLInputElement>) => void,
  photoPreviews: string[],
  handlePaymentToggle: (m: string) => void,
  errors: string | null,
  isEditing?: boolean
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onCancel}
        className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <div className="p-1 rounded-md bg-white border border-slate-200 group-hover:border-slate-300 transition-colors">
          <ArrowLeft size={14} />
        </div>
        Voltar para meus anúncios
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{isEditing ? "Editar Anúncio" : "Novo Anúncio"}</h1>
          <p className="text-slate-500 text-sm">Preencha os dados abaixo para divulgar seus serviços.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Cancelar</button>
           <button onClick={onPublish} className="px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
             {isEditing ? "Salvar Alterações" : "Salvar e Publicar"}
           </button>
        </div>
      </div>

      {errors && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {errors}
        </div>
      )}

      <form className="space-y-6" onSubmit={onPublish}>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Detalhes do Serviço</h3>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">Passo 1 de 2</span>
          </div>
          
          <div className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Título do Anúncio *</label>
              <input 
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                type="text" 
                maxLength={80}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm"
                placeholder="Ex: Eletricista Residencial e Predial - Atendimento 24h"
              />
              <p className="mt-2 text-xs text-slate-400">Seja específico. Títulos claros atraem 40% mais cliques.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 relative group hover:border-orange-200 transition-colors">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Categoria Principal</label>
                 <div className="flex items-center gap-3">
                   <div className="bg-white p-2 rounded-lg shadow-sm text-orange-600">
                     <Briefcase size={18} />
                   </div>
                   <span className="font-semibold text-slate-700">{profile?.category || "N/A"}</span>
                 </div>
                 <div className="absolute top-3 right-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                   <CheckCircle2 size={16} />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Função / Especialidade *</label>
                <input 
                  value={form.serviceFunction}
                  onChange={(e) => setForm({...form, serviceFunction: e.target.value})}
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                  placeholder="Ex: Acabamentos"
                />
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">Descrição Detalhada *</label>
               <textarea 
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                rows={5} 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm resize-none"
                placeholder="Descreva sua experiência, ferramentas que utiliza e tipos de projetos que realiza..."
               ></textarea>
            </div>

            {/* Fotos */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Fotos do Trabalho (Até 7)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="text-sm text-slate-600 font-medium">Clique para fazer upload ou arraste e solte</p>
                    <p className="text-xs text-slate-400">PNG, JPG até 5MB</p>
                </div>
                {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                     {photoPreviews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                           <img src={src} alt="" className="w-full h-full object-cover" />
                        </div>
                     ))}
                   </div>
                )}
            </div>

            {/* Checkboxes e Pagamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Formas de Pagamento</h4>
                    <div className="space-y-2">
                        {["Crédito", "Débito", "Pix", "Espécie"].map((method) => (
                            <label key={method} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-orange-500/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={form.paymentMethods.includes(method)}
                                    onChange={() => handlePaymentToggle(method)}
                                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300" 
                                />
                                <span className="text-sm font-medium text-slate-700">{method}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid gap-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Diferenciais</h4>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.attendance24h} onChange={(e) => setForm({...form, attendance24h: e.target.checked})} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                        <span className="text-sm text-slate-700">Atendimento 24h</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.warranty} onChange={(e) => setForm({...form, warranty: e.target.checked})} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                        <span className="text-sm text-slate-700">Garantia de Serviço</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.ownEquipment} onChange={(e) => setForm({...form, ownEquipment: e.target.checked})} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                        <span className="text-sm text-slate-700">Equipamento Próprio</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={form.specializedTeam} onChange={(e) => setForm({...form, specializedTeam: e.target.checked})} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                        <span className="text-sm text-slate-700">Equipe Especializada</span>
                    </label>
                </div>
            </div>
          </div>
        </div>

        {/* Action Bar (Footer do Form) */}
        <div className="flex items-center justify-end pt-4 gap-4">
          <button type="submit" className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            {isEditing ? "Salvar Alterações" : "Salvar e Publicar"} <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};


export default function PrestadorPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('stats');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  const [form, setForm] = useState({
    title: "",
    serviceFunction: "",
    description: "",
    paymentMethods: [] as string[],
    attendance24h: false,
    warranty: false,
    ownEquipment: false,
    specializedTeam: false,
    photos: [] as string[]
  });
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsGiven, setReviewsGiven] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

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

      const [adsResponse, profileResponse, reviewsResponse, statsResponse, reviewsGivenResponse, pendingReviewsResponse] = await Promise.all([
        fetch("/api/provider/ads"),
        fetch("/api/provider/profile"),
        fetch("/api/provider/reviews"),
        fetch("/api/provider/stats"),
        fetch("/api/provider/reviews-given"),
        fetch("/api/provider/reviews-pending")
      ]);

      if (adsResponse.ok) {
        const data = await adsResponse.json();
        setAds(data);
      }

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews || []);
      }

      if (reviewsGivenResponse.ok) {
        const givenData = await reviewsGivenResponse.json();
        setReviewsGiven(givenData.reviews || []);
      }

      if (pendingReviewsResponse.ok) {
        const pendingData = await pendingReviewsResponse.json();
        setPendingReviews(pendingData.pending || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const p = profileData?.profile || {};
        const address = p?.address;
        const number = p?.number;
        const category = p?.category;
        const phone = p?.phone;
        const whatsapp = p?.whatsapp;
        const cpf = p?.cpf;
        const serviceType = p?.serviceType || p?.service_type;
        const city = p?.city;
        
        // Reliability score handling would go here, assuming API will return it in future
        const reliability_score = p?.reliability_score || null; 

        setProfile({
          category,
          serviceType,
          city,
          state: p?.state,
          serviceRadius: p?.serviceRadius ?? p?.service_radius,
          issuesInvoice: p?.issuesInvoice ?? p?.issues_invoice,
          availability: p?.availability ?? [],
          bio: p?.bio ?? "",
          address,
          number,
          phone,
          whatsapp,
          reliability_score,
          profileUrl: p?.profileUrl || p?.profile_url
        });

        if (!form.description) {
            setForm((prev) => ({
                ...prev,
                description: p?.bio || ""
            }));
        }

        if (!address || !number || !category || !phone || !whatsapp || !cpf || !serviceType || !city) {
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

  // redirecionamentos devem ocorrer em efeitos, não durante a renderização
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/auth');
      return;
    }
    if (user && user.role !== 'provider') {
      router.push('/cliente');
      return;
    }
  }, [user, loading, router]);

  const handlePaymentToggle = (method: string) => {
    setForm((prev) => {
      const current = prev.paymentMethods;
      if (current.includes(method)) {
        return { ...prev, paymentMethods: current.filter((item) => item !== method) };
      }
      return { ...prev, paymentMethods: [...current, method] };
    });
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const total = photoPreviews.length + files.length;
    if (total > 7) {
      setError("Você pode enviar no máximo 7 imagens.");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError("Cada imagem deve ter no máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreviews((prev) => [...prev, result]);
        setForm((prev) => ({ ...prev, photos: [...prev.photos, result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEditAd = (ad: Ad) => {
    setEditingId(ad.id);
    setForm({
      title: ad.title,
      serviceFunction: ad.service_function || "",
      description: ad.description || "",
      paymentMethods: ad.payment_methods || [],
      attendance24h: ad.attendance_24h || false,
      warranty: ad.warranty || false,
      ownEquipment: ad.own_equipment || false,
      specializedTeam: ad.specialized_team || false,
      photos: ad.photos || []
    });
    setPhotoPreviews(ad.photos || []);
    setCurrentView('create');
  };

  const createAd = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validações básicas
    if (form.title.length < 10 || form.title.length > 80) {
      setError("Título deve ter entre 10 e 80 caracteres.");
      return;
    }
    if (!form.serviceFunction) {
      setError("Função é obrigatória.");
      return;
    }

    const url = editingId ? `/api/provider/ads/${editingId}` : "/api/provider/ads";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Não foi possível salvar o anúncio.");
      return;
    }

    setForm({
      title: "",
      serviceFunction: "",
      description: profile?.bio || "",
      paymentMethods: [],
      attendance24h: false,
      warranty: false,
      ownEquipment: false,
      specializedTeam: false,
      photos: []
    });
    setEditingId(null);
    setPhotoPreviews([]);
    setNotification(editingId ? "Anúncio atualizado com sucesso!" : "Anúncio enviado com sucesso!");
    setCurrentView('services');
    setTimeout(() => setNotification(null), 3000);
    await load();
  };

  const deleteAd = async (id: number) => {
    if(!confirm("Tem certeza que deseja excluir este anúncio?")) return;
    await fetch(`/api/provider/ads/${id}`, { method: "DELETE" });
    await load();
  };

  // Views de Loading e Erro de Acesso
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "provider") {
    // enquanto aguardamos o efeito de redirecionamento, mostramos nada
    return null;
  }

  return (
    <div className={`min-h-screen bg-${theme.bg} font-sans text-${theme.textMain} pb-20`}>
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
           <div className="bg-green-500 rounded-full p-1"><CheckCircle2 size={14} className="text-white"/></div>
           <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

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
            <div className="cursor-pointer group flex-shrink-0" onClick={() => setCurrentView('stats')}>
              <img src="/logo.svg" alt="Antly" className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto brightness-0 invert group-hover:scale-105 transition-transform" />
            </div>
            
            {/* Avatar e Info */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="hidden sm:block text-right">
                <p className="text-white font-bold text-sm md:text-base truncate max-w-[120px] md:max-w-none">{user?.name || 'Usuário'}</p>
                <p className="text-orange-100 text-xs flex items-center justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Online
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
          </div>
          
          {/* Hero do Header */}
          <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-5 md:mb-6">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="text-xs sm:text-sm font-bold text-white">Conta PRO</span>
              <div className="w-px h-3 sm:h-4 bg-white/30"></div>
              <span className="text-[10px] sm:text-xs text-white/90 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verificado
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 md:mb-4 tracking-tight drop-shadow-lg">
              Painel do Prestador
            </h1>
            
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              Gerencie seus serviços e cresça seu negócio
            </p>
          </div>
          
          {/* Stats Rápidos - Container com width fixo e centralizado */}
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto pb-8 sm:pb-10 md:pb-12">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              <div className="text-center py-3 px-2 sm:p-3 md:p-4 lg:p-5 bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white">{ads?.length || 0}</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-white/70 mt-0.5">Anúncios</p>
              </div>
              <div className="text-center py-3 px-2 sm:p-3 md:p-4 lg:p-5 bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white">{stats?.avgRating || '0.0'}</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-white/70 mt-0.5">Avaliação</p>
              </div>
              <div className="text-center py-3 px-2 sm:p-3 md:p-4 lg:p-5 bg-white/15 backdrop-blur-sm rounded-xl sm:rounded-2xl">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white">{stats?.responseRate || 0}%</p>
                <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-white/70 mt-0.5">Resposta</p>
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
        <SidebarProfile user={user} profile={profile} />
        
        <section className="lg:col-span-9">
            {/* Navigation Tabs */}
            {currentView !== 'view' && currentView !== 'create' && (
                <div className="flex items-center gap-8 mb-8 border-b border-slate-200">
                  <button 
                    onClick={() => setCurrentView('stats')}
                    className={`pb-4 text-sm font-bold transition-colors border-b-2 ${currentView === 'stats' ? 'text-orange-600 border-orange-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                  >
                    Visão Geral
                  </button>
                  <button 
                    onClick={() => setCurrentView('services')}
                    className={`pb-4 text-sm font-bold transition-colors border-b-2 ${currentView === 'services' ? 'text-orange-600 border-orange-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                  >
                    Anúncios
                  </button>
                  <button 
                    onClick={() => setCurrentView('myjobs')}
                    className={`pb-4 text-sm font-bold transition-colors border-b-2 ${currentView === 'myjobs' ? 'text-orange-600 border-orange-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                  >
                    Meus Serviços
                  </button>
                  <button 
                    onClick={() => setCurrentView('reviews')}
                    className={`pb-4 text-sm font-bold transition-colors border-b-2 ${currentView === 'reviews' ? 'text-orange-600 border-orange-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                  >
                    Minhas Avaliações
                  </button>
                </div>
            )}

          {currentView === 'stats' && (
             <StatsDashboardView ads={ads} profile={profile} stats={stats} reviews={reviews} setView={setCurrentView} />
          )}

          {currentView === 'reviews' && (
             <ReviewsView reviews={reviews} reviewsGiven={reviewsGiven} pendingReviews={pendingReviews} />
          )}

          {currentView === 'myjobs' && (
            <div className="py-12 text-center text-slate-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Serviços em Andamento</h2>
              <p className="mb-4">Aqui aparecerão os serviços que você está realizando para clientes. Em breve você poderá acompanhar o andamento, status e detalhes de cada serviço.</p>
              <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50 py-12 px-6 max-w-xl mx-auto">
                <span className="text-orange-400 font-bold">Funcionalidade em desenvolvimento</span>
              </div>
            </div>
          )}

          {currentView === 'services' && (
            <MyServicesView 
              ads={ads} 
              onCreateClick={() => {
                setEditingId(null);
                setForm({
                  title: "",
                  serviceFunction: "",
                  description: profile?.bio || "",
                  paymentMethods: [],
                  attendance24h: false,
                  warranty: false,
                  ownEquipment: false,
                  specializedTeam: false,
                  photos: []
                });
                setPhotoPreviews([]);
                setCurrentView('create');
              }} 
              onViewAd={(ad) => {
                setSelectedAd(ad);
                setCurrentView('view');
              }}
              deleteAd={deleteAd} 
            />
          )}

          {currentView === 'create' && (
            <CreateAdForm 
              onCancel={() => {
                setEditingId(null);
                setCurrentView('services');
              }} 
              onPublish={createAd}
              form={form}
              setForm={setForm}
              profile={profile}
              handlePhotoUpload={handlePhotoUpload}
              photoPreviews={photoPreviews}
              handlePaymentToggle={handlePaymentToggle}
              errors={error}
              isEditing={!!editingId}
            />
          )}

          {currentView === 'view' && selectedAd && (
            <AdPreviewView 
              ad={selectedAd}
              profile={profile}
              userName={user?.name}
              onBack={() => {
                setSelectedAd(null);
                setCurrentView('services');
              }}
            />
          )}
        </section>
      </main>

       {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 isolate">
          <div 
             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
             onClick={() => setShowProfileModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900">Complete seu perfil</h2>
            <p className="mt-2 text-sm text-slate-500">
              Para publicar anúncios, preencha CPF, categoria, tipo de atendimento, cidade e contatos.
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
                 Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
