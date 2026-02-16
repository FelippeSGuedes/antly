"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  User,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  Award,
  Briefcase,
  Heart,
  Share2,
  Mail,
  ExternalLink
} from "lucide-react";

type Provider = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  role: string;
  category: string;
  category_id: number;
  description: string | null;
  rating: number | null;
  reviews_count: number;
  verified: boolean;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
};

type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
};

export default function ProfissionalPage() {
  const params = useParams();
  const id = params.id as string;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const response = await fetch(`/api/providers/${id}`);
        if (!response.ok) {
          throw new Error("Profissional não encontrado");
        }
        const data = await response.json();
        setProvider(data.provider);
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProvider();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-slate-200"}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-white to-orange-50/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <span className="text-slate-500 font-medium">Carregando perfil...</span>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <User size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profissional não encontrado</h1>
          <p className="text-slate-500 mb-6">{error || "O perfil que você está procurando não existe."}</p>
          <Link
            href="/anuncios"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar para Anúncios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-white to-orange-50/30 text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-orange-100/50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/anuncios" className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-xl border transition-all ${
                isFavorite 
                  ? "bg-rose-50 border-rose-200 text-rose-500" 
                  : "bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200"
              }`}
            >
              <Heart size={20} className={isFavorite ? "fill-rose-500" : ""} />
            </button>
            <button className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header Card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
              {/* Cover */}
              <div className="h-32 bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
              </div>

              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="-mt-16 mb-4 flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-slate-50 to-slate-100 text-orange-500 shadow-xl">
                  <User size={48} />
                </div>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-slate-900">{provider.name}</h1>
                      {provider.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                          <ShieldCheck size={14} /> Verificado
                        </span>
                      )}
                    </div>
                    
                    <p className="text-lg font-semibold text-orange-600 mb-3">{provider.role}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-slate-400" />
                        {provider.city && provider.state 
                          ? `${provider.city}, ${provider.state}` 
                          : "Localidade não informada"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-slate-400" />
                        Membro desde {formatDate(provider.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center px-4 py-2 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="flex items-center gap-1 justify-center">
                        <Star size={18} fill="currentColor" className="text-amber-500" />
                        <span className="text-xl font-bold text-amber-700">
                          {provider.rating ? Number(provider.rating).toFixed(1) : "0.0"}
                        </span>
                      </div>
                      <p className="text-xs text-amber-600">{provider.reviews_count} avaliações</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                <Briefcase size={20} className="text-orange-500" />
                Sobre
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {provider.description || "Este profissional ainda não adicionou uma descrição ao seu perfil."}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6">
                <Star size={20} className="text-orange-500" />
                Avaliações ({reviews.length})
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-slate-900">{review.reviewer_name}</h4>
                            <span className="text-xs text-slate-400">{formatDate(review.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-slate-600 text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <Star size={24} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500">Este profissional ainda não recebeu avaliações.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Entre em Contato</h3>

              <div className="space-y-4 mb-6">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5">
                  <MessageCircle size={20} />
                  Pedir Orçamento Grátis
                </button>

                {provider.phone && (
                  <a
                    href={`tel:${provider.phone}`}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-700 transition-all hover:border-orange-200 hover:text-orange-600"
                  >
                    <Phone size={18} />
                    Ligar Agora
                  </a>
                )}

                <a
                  href={`mailto:${provider.email}`}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-700 transition-all hover:border-orange-200 hover:text-orange-600"
                >
                  <Mail size={18} />
                  Enviar Email
                </a>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-4">Informações</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock size={16} className="text-slate-400" />
                    <span>Responde em até 2 horas</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <span>Orçamento gratuito</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Award size={16} className="text-amber-500" />
                    <span>Categoria: {provider.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
              <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-3">
                <ShieldCheck size={18} />
                Dicas de Segurança
              </h4>
              <ul className="text-xs text-blue-700 space-y-2">
                <li>• Nunca faça pagamentos antecipados</li>
                <li>• Verifique as avaliações antes de contratar</li>
                <li>• Peça orçamento por escrito</li>
                <li>• Confirme todos os detalhes do serviço</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
