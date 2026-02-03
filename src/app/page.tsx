"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  User,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  ChevronLeft,
  Heart,
  Users,
  Briefcase,
  ThumbsUp,
  Play,
  Map,
  Eye,
  BadgeCheck,
  Menu,
  X,
  Flame,
  Crown
} from "lucide-react";

// Ícones de categoria personalizados
const categoryIcons: Record<string, React.ReactNode> = {
  "Eletricista": <Zap className="w-6 h-6" />,
  "Encanador": <span className="text-2xl">🔧</span>,
  "Pintor": <span className="text-2xl">🎨</span>,
  "Pedreiro": <span className="text-2xl">🧱</span>,
  "Marceneiro": <span className="text-2xl">🪵</span>,
  "Jardineiro": <span className="text-2xl">🌿</span>,
  "Limpeza": <span className="text-2xl">🧹</span>,
  "Mecânico": <span className="text-2xl">🔩</span>,
  "Técnico de Informática": <span className="text-2xl">💻</span>,
  "Personal Trainer": <span className="text-2xl">💪</span>,
  "Construção": <span className="text-2xl">🏗️</span>,
  "Impermeabilização": <span className="text-2xl">🌧️</span>,
  "default": <Briefcase className="w-6 h-6" />
};

const getCategoryIcon = (name: string) => {
  return categoryIcons[name] || categoryIcons["default"];
};

// Cores gradientes para as categorias
const categoryColors = [
  "from-orange-500 to-amber-500",
  "from-blue-500 to-cyan-500", 
  "from-emerald-500 to-green-500",
  "from-purple-500 to-pink-500",
  "from-rose-500 to-red-500",
];

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
};

type Category = {
  id: number;
  name: string;
  provider_count: number;
};

type FeaturedProvider = {
  id: number;
  name: string;
  role: string;
  category: string;
  location: string | null;
  rating: number | string | null;
  reviews: number | null;
  description: string | null;
  verified: boolean | null;
};

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
  service_type: string | null;
  warranty: boolean | null;
  attendance_24h: boolean | null;
};

export default function Home() {
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);
  const [featuredProviders, setFeaturedProviders] = useState<FeaturedProvider[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ providers: 0, services: 0, reviews: 0, ads: 0 });
  
  // Carousel state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [categoriesRes, providersRes, adsRes] = await Promise.all([
          fetch("/api/categories/popular"),
          fetch("/api/providers/search?limit=6"),
          fetch("/api/ads/public?limit=10")
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setPopularCategories(data);
          const totalProviders = data.reduce((acc: number, cat: Category) => acc + cat.provider_count, 0);
          setStats(prev => ({ ...prev, providers: totalProviders, services: totalProviders * 3, reviews: totalProviders * 5 }));
        }

        if (providersRes.ok) {
          const data = await providersRes.json();
          setFeaturedProviders(data.providers || []);
        }

        if (adsRes.ok) {
          const data = await adsRes.json();
          setAds(data.ads || []);
          setStats(prev => ({ ...prev, ads: data.total || 0 }));
        }
      } catch {
        console.error("Erro ao carregar dados");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/explorar?q=${encodeURIComponent(searchTerm)}`;
  };

  // Carousel navigation
  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(updateScrollButtons, 300);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => carousel.removeEventListener('scroll', updateScrollButtons);
    }
  }, [ads]);

  return (
    <div className="min-h-screen bg-[#FFFAF5] text-slate-800 font-sans">
      {/* Hero Section Gigante com Logo */}
      <div className="relative min-h-screen bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 overflow-hidden">
        {/* Efeitos de fundo animados */}
        <div className="absolute inset-0">
          {/* Bolhas de luz pulsantes */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-amber-300/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-48 h-48 bg-orange-300/25 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          
          {/* Padrão de ondas na parte inferior */}
          <svg className="absolute bottom-0 w-full h-32 opacity-20" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="white" d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          {/* Partículas flutuantes */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/40 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-amber-200/50 rounded-full animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-yellow-200/40 rounded-full animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        </div>

        {/* Navbar transparente no topo */}
        <nav className="relative z-50 px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo Grande na navbar */}
            <Link href="/" className="flex items-center group">
              <img 
                src="/logo.svg" 
                alt="Antly" 
                className="h-16 md:h-20 lg:h-24 w-auto brightness-0 invert drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/explorar" className="text-white/90 hover:text-white font-semibold flex items-center gap-2 transition-colors">
                <Map size={18} />
                Explorar
              </Link>
              <Link href="/anuncios" className="text-white/90 hover:text-white font-semibold flex items-center gap-2 transition-colors">
                <Briefcase size={18} />
                Anúncios
              </Link>
              <a href="#como-funciona" className="text-white/90 hover:text-white font-semibold transition-colors">
                Como Funciona
              </a>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {isAuthLoading ? (
                <div className="h-11 w-28 animate-pulse rounded-xl bg-white/20" />
              ) : user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/30 transition-all"
                  >
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-orange-500 font-black text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl z-50 border border-orange-100">
                      <div className="px-3 py-2 mb-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      {user.role === "admin" ? (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Zap size={16} /> Painel Admin
                        </Link>
                      ) : (
                        <>
                          <Link
                            href={user.role === "provider" ? "/prestador/perfil" : "/cliente"}
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <User size={16} /> Meu Perfil
                          </Link>
                          {user.role === "provider" && (
                            <Link
                              href="/prestador"
                              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <TrendingUp size={16} /> Meu Painel
                            </Link>
                          )}
                        </>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-orange-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 space-y-2">
              <Link href="/explorar" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 font-medium">
                <Map size={20} />
                Explorar Profissionais
              </Link>
              <Link href="/anuncios" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 font-medium">
                <Briefcase size={20} />
                Ver Anúncios
              </Link>
              <a href="#como-funciona" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 font-medium">
                <Play size={20} />
                Como Funciona
              </a>
            </div>
          )}
        </nav>

        {/* Conteúdo Central */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* Ícone Central com Efeitos Orbitais */}
            <div className="flex justify-center mb-6">
              <div className="relative w-52 h-52 md:w-64 md:h-64">
                {/* Glow de fundo */}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Órbitas animadas */}
                <div className="absolute inset-0 rounded-full border border-white/20 animate-spin" style={{animationDuration: '20s'}}></div>
                <div className="absolute inset-4 rounded-full border border-dashed border-white/15 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
                
                {/* Círculo central grande com ícone */}
                <div className="absolute inset-6 md:inset-10 bg-white/10 backdrop-blur-sm rounded-full border-2 border-white/30 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full shadow-2xl flex items-center justify-center animate-pulse">
                    <Users size={32} className="text-orange-500 md:w-12 md:h-12" />
                  </div>
                </div>
                
                {/* Profissionais orbitando */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl flex items-center justify-center animate-bounce" style={{animationDuration: '2s'}}>
                    <span className="text-xl md:text-2xl">🔧</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-xl flex items-center justify-center animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>
                    <span className="text-xl md:text-2xl">🎨</span>
                  </div>
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}>
                    <span className="text-xl md:text-2xl">⚡</span>
                  </div>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl shadow-xl flex items-center justify-center animate-bounce" style={{animationDuration: '2.2s', animationDelay: '0.3s'}}>
                    <span className="text-xl md:text-2xl">🏠</span>
                  </div>
                </div>
                
                {/* Ícones de avaliação nos cantos */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{animationDuration: '2.8s', animationDelay: '0.7s'}}>
                    <Star size={14} className="text-white fill-white md:w-[18px] md:h-[18px]" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg flex items-center justify-center animate-bounce" style={{animationDuration: '3.2s', animationDelay: '1.2s'}}>
                    <ShieldCheck size={14} className="text-white md:w-[18px] md:h-[18px]" />
                  </div>
                </div>
                <div className="absolute top-12 left-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-lg flex items-center justify-center animate-bounce" style={{animationDuration: '2.6s', animationDelay: '0.9s'}}>
                    <Zap size={14} className="text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-12 right-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg shadow-lg flex items-center justify-center animate-bounce" style={{animationDuration: '3.5s', animationDelay: '1.5s'}}>
                    <ThumbsUp size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-black mb-4 drop-shadow-lg leading-tight">
              Conectamos você aos melhores<br/>
              <span className="text-amber-200">profissionais</span> da sua região
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Compare perfis, analise avaliações reais e solicite orçamentos 100% gratuitos.
            </p>

            {/* Badges de destaque */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-sm font-bold text-white">{stats.providers}+ Online</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Flame size={16} className="text-yellow-300" />
                <span className="text-sm font-bold text-white">+50 Categorias</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Star size={16} className="text-yellow-300 fill-yellow-300" />
                <span className="text-sm font-bold text-white">4.9 Avaliação</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <Award size={16} className="text-yellow-300" />
                <span className="text-sm font-bold text-white">Top Brasil</span>
              </div>
            </div>

            {/* Search Box Hero - Embaixo */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-50 group-focus-within:opacity-80 transition-opacity"></div>
                <div className="relative flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-3xl shadow-2xl shadow-orange-900/30">
                  <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" size={24} />
                    <input
                      type="text"
                      placeholder="O que você precisa? Ex: Eletricista, Encanador..."
                      className="w-full h-16 rounded-2xl bg-orange-50/50 pl-14 pr-4 text-lg font-medium text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-orange-500/20 focus:bg-white border-0 transition-all"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 sm:px-12 text-lg font-bold text-white shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-3"
                  >
                    <Search size={22} />
                    <span>Buscar Agora</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-300" />
                <span className="font-semibold">100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-green-300" />
                <span className="font-semibold">Verificados</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-green-300" />
                <span className="font-semibold">Resposta Rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp size={20} className="text-green-300" />
                <span className="font-semibold">Satisfação Garantida</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar na parte inferior */}
        <div className="relative z-10 bg-white/10 backdrop-blur-xl border-t border-white/20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black text-white mb-1">{stats.providers}+</div>
                <div className="text-sm md:text-base text-white/70 font-medium">Profissionais</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black text-white mb-1">{stats.ads}+</div>
                <div className="text-sm md:text-base text-white/70 font-medium">Anúncios Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black text-white mb-1">{stats.services}+</div>
                <div className="text-sm md:text-base text-white/70 font-medium">Serviços</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-5xl font-black text-white mb-1">{stats.reviews}+</div>
                <div className="text-sm md:text-base text-white/70 font-medium">Avaliações</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Popular Categories Section */}
        <div className="mb-16">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Categorias Populares</h2>
              <p className="text-slate-500">Serviços mais procurados pelos clientes</p>
            </div>
            <Link 
              href="/explorar" 
              className="group flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              Ver todas
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularCategories.map((category, idx) => (
                <Link
                  key={category.id}
                  href={`/explorar?categoria=${encodeURIComponent(category.name)}`}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 hover:border-orange-200"
                >
                  <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${categoryColors[idx % categoryColors.length]} text-white shadow-lg`}>
                    {getCategoryIcon(category.name)}
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  
                  <p className="text-xs text-slate-400">
                    {category.provider_count} profissionais
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Ads Carousel Section */}
        <div className="mb-16">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-amber-500"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Anúncios em Destaque</h2>
              </div>
              <p className="text-slate-500 ml-5">Serviços disponíveis na plataforma</p>
            </div>
            
            {/* Carousel controls */}
            {ads.length > 3 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  disabled={!canScrollLeft}
                  className={`p-2.5 rounded-xl border transition-all ${canScrollLeft ? 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100' : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  disabled={!canScrollRight}
                  className={`p-2.5 rounded-xl border transition-all ${canScrollRight ? 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100' : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Carousel */}
          {isLoading ? (
            <div className="flex gap-5 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-72 md:w-80 h-80 rounded-2xl bg-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : ads.length > 0 ? (
            <div 
              ref={carouselRef}
              className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {ads.map((ad, idx) => (
                <Link
                  key={ad.id}
                  href={`/anuncio/${ad.id}`}
                  className="group flex-shrink-0 w-72 md:w-80 overflow-hidden rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 hover:border-orange-200"
                >
                  {/* Image/Placeholder */}
                  <div className="relative h-40 bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden">
                    {ad.photos && ad.photos.length > 0 ? (
                      <img 
                        src={ad.photos[0]} 
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${categoryColors[idx % categoryColors.length]} flex items-center justify-center text-white shadow-lg`}>
                          {getCategoryIcon(ad.category)}
                        </div>
                      </div>
                    )}
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-slate-700 shadow-sm">
                        {ad.category}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                      {ad.warranty && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                          <ShieldCheck size={10} /> Garantia
                        </span>
                      )}
                      {ad.attendance_24h && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500 text-[10px] font-bold text-white">
                          <Clock size={10} /> 24h
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {ad.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {ad.description || "Serviço profissional de qualidade."}
                    </p>

                    {/* Provider info */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                        {ad.provider_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{ad.provider_name}</p>
                        {ad.city && ad.state && (
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin size={10} /> {ad.city}, {ad.state}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-100">
                          <Star size={12} fill="currentColor" className="text-amber-500" />
                          <span className="text-xs font-bold text-amber-700">{Number(ad.ratings_avg || 0).toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-slate-400">({ad.ratings_count || 0})</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Eye size={12} />
                        {ad.views || 0} views
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-orange-200">
              <Briefcase className="mx-auto h-12 w-12 text-orange-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum anúncio disponível</h3>
              <p className="text-sm text-slate-500 mb-6">Seja o primeiro a criar um anúncio!</p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Criar Anúncio
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Ver todos os anúncios button */}
          {ads.length > 0 && (
            <div className="mt-10 text-center">
              <Link
                href="/anuncios"
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:shadow-orange-500/40 hover:-translate-y-1"
              >
                <Briefcase size={20} />
                Ver Todos os Anúncios
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>

        {/* Featured Providers Section */}
        {featuredProviders.length > 0 && (
          <div className="mb-16">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-emerald-400 to-green-500"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Profissionais em Destaque</h2>
                </div>
                <p className="text-slate-500 ml-5">Os melhores avaliados da plataforma</p>
              </div>
              <Link 
                href="/explorar" 
                className="group flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                Ver todos
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProviders.slice(0, 6).map((provider, idx) => (
                <Link
                  key={provider.id}
                  href={`/profissional/${provider.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className={`relative h-20 bg-gradient-to-br ${categoryColors[idx % categoryColors.length]} overflow-hidden`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M20 20h20v20H20z\'/%3E%3C/g%3E%3C/svg%3E')]"></div>
                    
                    {provider.verified && (
                      <div className="absolute right-3 top-3">
                        <span className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-emerald-600 shadow-sm">
                          <BadgeCheck size={12} /> Verificado
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="-mt-8 flex flex-1 flex-col px-5 pb-5">
                    {/* Avatar */}
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl border-4 border-white bg-white text-slate-400 shadow-lg">
                      <User size={28} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-0.5 group-hover:text-orange-600 transition-colors">
                      {provider.name}
                    </h3>
                    <p className="text-sm font-medium text-orange-600 mb-3">{provider.role || provider.category}</p>

                    {/* Rating & Location */}
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star size={14} fill="currentColor" className="text-amber-500" />
                        <span className="font-semibold text-slate-700">{Number(provider.rating ?? 0).toFixed(1)}</span>
                        <span className="text-slate-400">({provider.reviews ?? 0})</span>
                      </div>
                      {provider.location && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin size={12} />
                          <span className="truncate max-w-[100px]">{provider.location}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                      {provider.description || "Profissional qualificado."}
                    </p>

                    <button 
                      onClick={(e) => e.preventDefault()}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-white hover:shadow-lg transition-all"
                    >
                      <MessageCircle size={16} /> Pedir Orçamento
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div id="como-funciona" className="mb-16 scroll-mt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-600 mb-4">
              <Play size={14} />
              COMO FUNCIONA
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Simples, rápido e <span className="text-orange-500">gratuito</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Em 3 passos você encontra e contrata o profissional ideal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Pesquise",
                description: "Digite o serviço e encontre profissionais na sua região",
                icon: <Search className="w-7 h-7" />,
                color: "from-orange-500 to-amber-500"
              },
              {
                step: "2", 
                title: "Compare",
                description: "Analise perfis, avaliações e portfólios",
                icon: <Users className="w-7 h-7" />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "3",
                title: "Contrate",
                description: "Solicite orçamentos e escolha o melhor profissional",
                icon: <ThumbsUp className="w-7 h-7" />,
                color: "from-emerald-500 to-green-500"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                {idx < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-200 to-transparent z-0"></div>
                )}
                
                <div className="relative bg-white rounded-2xl border border-slate-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                    {item.step}
                  </div>
                  
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white">
                <Award size={12} />
                PARA PROFISSIONAIS
              </div>
              <h2 className="mb-3 text-2xl md:text-3xl font-bold text-white">
                Quer receber mais clientes?
              </h2>
              <p className="text-white/80 text-sm md:text-base max-w-md">
                Crie seu perfil e receba solicitações de orçamento. 
                <span className="text-white font-semibold"> Cadastro gratuito!</span>
              </p>
            </div>
            <Link
              href={user?.role === "admin" ? "/admin" : user?.role === "provider" ? "/prestador" : "/auth"}
              className="group whitespace-nowrap rounded-xl bg-white px-8 py-4 text-base font-bold text-orange-600 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2"
            >
              Começar Agora
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2">
              <img src="/logo.svg" alt="Antly" className="h-10 mb-4" />
              <p className="text-sm text-slate-500 max-w-xs mb-4">
                A forma mais rápida e segura de encontrar profissionais qualificados.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-400 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-400 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-3 text-sm">Plataforma</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#como-funciona" className="hover:text-orange-600 transition-colors">Como Funciona</a></li>
                <li><Link href="/auth" className="hover:text-orange-600 transition-colors">Para Profissionais</Link></li>
                <li><Link href="/explorar" className="hover:text-orange-600 transition-colors">Explorar</Link></li>
                <li><Link href="/anuncios" className="hover:text-orange-600 transition-colors">Anúncios</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-3 text-sm">Suporte</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              © 2026 Antly. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Feito com</span>
              <Heart size={12} className="text-orange-500 fill-orange-500" />
              <span>no Brasil</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Hide scrollbar CSS */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
