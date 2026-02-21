"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  Star,
  ShieldCheck,
  User,
  ArrowLeft,
  Clock,
  Heart,
  Briefcase,
  Eye,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Calendar,
  Zap,
  Share2,
  BadgeCheck
} from "lucide-react";

type Ad = {
  id: number;
  title: string;
  description: string;
  category: string;
  city: string | null;
  state: string | null;
  photos: string[] | null;
  views: number | null;
  ratings_count: number | null;
  ratings_avg: number | string | null;
  provider_name: string;
  provider_profile_photo: string | null;
  user_id: number;
  service_type: string | null;
  service_function: string | null;
  warranty: boolean | null;
  attendance_24h: boolean | null;
  payment_methods: string[] | null;
  service_radius: number | null;
  created_at: string;
  phone: string | null;
  whatsapp: string | null;
};

type ProviderBasic = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  role: string;
  category: string;
  description: string | null;
  rating: number | null;
  reviews_count: number;
  verified: boolean;
};

export default function AnuncioPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [providerDetails, setProviderDetails] = useState<ProviderBasic | null>(null);
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  useEffect(() => {
    const loadAd = async () => {
      try {
        const res = await fetch(`/api/ads/public/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAd(data);
        }
      } catch {
        console.error("Erro ao carregar anúncio");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadAd();
  }, [id]);

  const nextImage = () => {
    if (ad?.photos && ad.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % ad.photos!.length);
    }
  };

  const prevImage = () => {
    if (ad?.photos && ad.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + ad.photos!.length) % ad.photos!.length);
    }
  };

  const handleWhatsApp = () => {
    if (ad?.whatsapp) {
      const phone = ad.whatsapp.replace(/\D/g, '');
      const message = encodeURIComponent(`Olá! Vi seu anúncio "${ad.title}" no Antly e gostaria de mais informações.`);
      window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
    }
  };

  useEffect(() => {
    const loadProviderDetails = async () => {
      if (!isProviderModalOpen || !ad?.user_id) return;
      setIsProviderLoading(true);
      try {
        const response = await fetch(`/api/providers/${ad.user_id}`);
        if (!response.ok) return;
        const data = await response.json();
        if (data?.provider) {
          setProviderDetails(data.provider);
        }
      } catch {
        // fallback para dados do anúncio
      } finally {
        setIsProviderLoading(false);
      }
    };

    loadProviderDetails();
  }, [isProviderModalOpen, ad?.user_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Briefcase className="h-16 w-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Anúncio não encontrado</h1>
        <p className="text-slate-500 mb-6">O anúncio que você procura não existe ou foi removido.</p>
        <Link
          href="/anuncios"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold"
        >
          <ArrowLeft size={18} />
          Ver todos os anúncios
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50/20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="Antly" className="h-10 w-auto" />
          </Link>

          <Link
            href="/auth"
            className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25"
          >
            Entrar
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/anuncios" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 transition-colors">
            <ArrowLeft size={16} />
            Voltar para anúncios
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-video">
              {ad.photos && ad.photos.length > 0 ? (
                <>
                  <img 
                    src={ad.photos[currentImageIndex]} 
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {ad.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-slate-700 shadow-lg hover:bg-white transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-slate-700 shadow-lg hover:bg-white transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {ad.photos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-500">
                  <Briefcase className="h-24 w-24 text-white/50" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-sm font-bold text-slate-700 shadow-sm">
                  {ad.category}
                </span>
              </div>

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2.5 rounded-full backdrop-blur-sm shadow-lg transition-all ${isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-600 hover:text-rose-500'}`}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 shadow-lg hover:text-orange-500 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Thumbnail strip */}
            {ad.photos && ad.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {ad.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-orange-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Details Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{ad.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {ad.city && ad.state && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {ad.city}, {ad.state}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {ad.views || 0} visualizações
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {new Date(ad.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100">
                  <Star size={16} fill="currentColor" className="text-amber-500" />
                  <span className="font-bold text-amber-700">{Number(ad.ratings_avg || 0).toFixed(1)}</span>
                  <span className="text-amber-600 text-sm">({ad.ratings_count || 0})</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {ad.warranty && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                    <ShieldCheck size={14} /> Com Garantia
                  </span>
                )}
                {ad.attendance_24h && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    <Clock size={14} /> Atendimento 24h
                  </span>
                )}
                {ad.service_radius && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                    <MapPin size={14} /> Atende até {ad.service_radius}km
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 mb-3">Descrição</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-6">
                {ad.description || "Sem descrição disponível."}
              </p>

              {/* Service details */}
              {(ad.service_type || ad.service_function) && (
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-bold text-slate-900 mb-4">Detalhes do Serviço</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {ad.service_type && (
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Tipo de Serviço</p>
                        <p className="font-medium text-slate-900">{ad.service_type}</p>
                      </div>
                    )}
                    {ad.service_function && (
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Função</p>
                        <p className="font-medium text-slate-900">{ad.service_function}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              {ad.payment_methods && ad.payment_methods.length > 0 && (
                <div className="border-t border-slate-100 pt-6 mt-6">
                  <h3 className="font-bold text-slate-900 mb-3">Formas de Pagamento</h3>
                  <div className="flex flex-wrap gap-2">
                    {ad.payment_methods.map((method, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Provider Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Provider Info */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  {ad.provider_profile_photo ? (
                    <img
                      src={ad.provider_profile_photo}
                      alt={ad.provider_name}
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-lg"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {ad.provider_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{ad.provider_name}</h3>
                    <p className="text-sm text-orange-600 font-medium">{ad.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <BadgeCheck size={14} className="text-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">Profissional Verificado</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold text-slate-900">{Number(ad.ratings_avg || 0).toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-slate-500">{ad.ratings_count || 0} avaliações</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                      <Eye size={16} />
                      <span className="font-bold text-slate-900">{ad.views || 0}</span>
                    </div>
                    <p className="text-xs text-slate-500">visualizações</p>
                  </div>
                </div>

                {/* Contact buttons */}
                <div className="space-y-3">
                  {ad.whatsapp && (
                    <button
                      onClick={handleWhatsApp}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all"
                    >
                      <MessageCircle size={18} />
                      Chamar no WhatsApp
                    </button>
                  )}
                  
                  {ad.phone && (
                    <a
                      href={`tel:${ad.phone}`}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:border-orange-200 hover:text-orange-600 transition-all"
                    >
                      <Phone size={18} />
                      Ligar: {ad.phone}
                    </a>
                  )}

                  <button
                    onClick={() => setIsProviderModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-orange-500 transition-all"
                  >
                    <User size={18} />
                    Ver Perfil
                  </button>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-orange-50 rounded-2xl border border-orange-100 p-5">
                <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <Zap size={16} className="text-orange-500" />
                  Dicas de Segurança
                </h4>
                <ul className="space-y-2 text-sm text-orange-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    Sempre peça orçamentos detalhados por escrito
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    Verifique as avaliações de outros clientes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    Combine detalhes do serviço antes de contratar
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isProviderModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsProviderModalOpen(false)}
          />

          <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative p-6 md:p-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <button
                onClick={() => setIsProviderModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <ChevronRight className="rotate-45" size={22} />
              </button>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                {ad.provider_profile_photo ? (
                  <img
                    src={ad.provider_profile_photo}
                    alt={ad.provider_name}
                    className="h-20 w-20 rounded-2xl object-cover border-2 border-white/70 shadow-xl"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur text-white font-black text-2xl flex items-center justify-center border border-white/40 shadow-xl">
                    {ad.provider_name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-extrabold">{providerDetails?.name || ad.provider_name}</h3>
                    <BadgeCheck size={18} className="text-emerald-200" />
                  </div>
                  <p className="text-white/90 font-medium">
                    {providerDetails?.role || ad.service_function || ad.service_type || ad.category}
                  </p>
                  <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
                    <MapPin size={14} />
                    {providerDetails?.city || ad.city ? `${providerDetails?.city || ad.city}, ${providerDetails?.state || ad.state}` : "Atendimento regional"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-center">
                  <p className="text-xs text-amber-700 font-semibold">Avaliação</p>
                  <p className="text-lg font-black text-amber-600">{Number(providerDetails?.rating ?? ad.ratings_avg ?? 0).toFixed(1)}</p>
                </div>
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
                  <p className="text-xs text-blue-700 font-semibold">Avaliações</p>
                  <p className="text-lg font-black text-blue-600">{providerDetails?.reviews_count ?? ad.ratings_count ?? 0}</p>
                </div>
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-center">
                  <p className="text-xs text-purple-700 font-semibold">Visualizações</p>
                  <p className="text-lg font-black text-purple-600">{ad.views || 0}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
                  <p className="text-xs text-emerald-700 font-semibold">Status</p>
                  <p className="text-sm font-black text-emerald-600">Verificado</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <h4 className="font-bold text-slate-900 mb-2">Sobre o prestador</h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {isProviderLoading
                    ? "Carregando descrição..."
                    : providerDetails?.description || ad.description || "Profissional com experiência na área, focado em qualidade, pontualidade e bom atendimento."}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Especialidade</p>
                  <p className="font-bold text-slate-900">{ad.service_function || providerDetails?.role || ad.category}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Tipo de atendimento</p>
                  <p className="font-bold text-slate-900">{ad.service_type || "Residencial / Comercial"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Raio de atendimento</p>
                  <p className="font-bold text-slate-900">{ad.service_radius ? `${ad.service_radius} km` : "A combinar"}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Garantias</p>
                  <p className="font-bold text-slate-900">{ad.warranty ? "Com garantia" : "Sem garantia formal"}</p>
                </div>
              </div>

              {ad.payment_methods && ad.payment_methods.length > 0 && (
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h4 className="font-bold text-slate-900 mb-3">Formas de pagamento</h4>
                  <div className="flex flex-wrap gap-2">
                    {ad.payment_methods.map((method, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3">
                {ad.whatsapp && (
                  <button
                    onClick={handleWhatsApp}
                    className="rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600"
                  >
                    Chamar no WhatsApp
                  </button>
                )}
                {ad.phone ? (
                  <a
                    href={`tel:${ad.phone}`}
                    className="rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 text-center"
                  >
                    Ligar agora
                  </a>
                ) : (
                  <button
                    onClick={() => setIsProviderModalOpen(false)}
                    className="rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Fechar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              © 2026 Antly. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Feito com</span>
              <Heart size={12} className="text-rose-500 fill-rose-500" />
              <span>no Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
