"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Zap,
  Clock,
  Heart,
  Briefcase,
  Map,
  Eye,
  Filter,
  Grid,
  List,
  ChevronDown,
  X
} from "lucide-react";

// Cores gradientes para as categorias
const categoryColors = [
  "from-orange-500 to-amber-500",
  "from-blue-500 to-cyan-500", 
  "from-emerald-500 to-green-500",
  "from-purple-500 to-pink-500",
  "from-rose-500 to-red-500",
];

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
  created_at: string;
};

type Category = {
  id: number;
  name: string;
  provider_count: number;
};

export default function AnunciosPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [adsRes, categoriesRes] = await Promise.all([
          fetch(`/api/ads/public?limit=${limit}&offset=${(page - 1) * limit}`),
          fetch("/api/categories/popular")
        ]);

        if (adsRes.ok) {
          const data = await adsRes.json();
          setAds(data.ads || []);
          setTotal(data.total || 0);
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data);
        }
      } catch {
        console.error("Erro ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page]);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = searchTerm === "" || 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.provider_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || ad.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50/20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="Antly" className="h-10 w-auto" />
          </Link>

          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/explorar" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:text-orange-600 hover:bg-orange-50">
              <Map size={16} />
              Explorar
            </Link>
            <Link href="/anuncios" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 text-orange-600">
              <Briefcase size={16} />
              Anúncios
            </Link>
          </div>

          <Link
            href="/auth"
            className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30"
          >
            Entrar
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 mb-4 transition-colors">
            <ArrowLeft size={16} />
            Voltar para a Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Todos os Anúncios</h1>
              <p className="text-slate-500">
                {total} anúncios disponíveis na plataforma
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Filter size={16} />
                Filtros
              </button>
              
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Filtros</h3>
                <button onClick={() => setShowFilters(false)} className="md:hidden text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">Categoria</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === "" ? "bg-orange-50 text-orange-600 font-medium" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    Todas as categorias
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat.name ? "bg-orange-50 text-orange-600 font-medium" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {cat.name}
                      <span className="text-slate-400 ml-1">({cat.provider_count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Ads Grid/List */}
          <div className="flex-1">
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`bg-slate-100 rounded-2xl animate-pulse ${viewMode === "grid" ? "h-80" : "h-32"}`}></div>
                ))}
              </div>
            ) : filteredAds.length > 0 ? (
              <>
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
                  {filteredAds.map((ad, idx) => (
                    viewMode === "grid" ? (
                      <Link
                        key={ad.id}
                        href={`/anuncio/${ad.id}`}
                        className="group overflow-hidden rounded-2xl bg-white border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 hover:border-orange-200"
                      >
                        {/* Image */}
                        <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
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
                          
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-slate-700 shadow-sm">
                              {ad.category}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 flex flex-col gap-1">
                            {ad.warranty && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                                <ShieldCheck size={10} /> Garantia
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {ad.title}
                          </h3>
                          
                          <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                            {ad.description || "Serviço profissional de qualidade."}
                          </p>

                          <div className="flex items-center gap-2 mb-3">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-[10px]">
                              {ad.provider_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate">{ad.provider_name}</p>
                              {ad.city && ad.state && (
                                <p className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                  <MapPin size={8} /> {ad.city}, {ad.state}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1">
                              <Star size={12} fill="currentColor" className="text-amber-500" />
                              <span className="text-xs font-bold text-slate-700">{Number(ad.ratings_avg || 0).toFixed(1)}</span>
                              <span className="text-xs text-slate-400">({ad.ratings_count || 0})</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <Eye size={10} />
                              {ad.views || 0}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        key={ad.id}
                        href={`/anuncio/${ad.id}`}
                        className="group flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 transition-all hover:shadow-lg hover:border-orange-200"
                      >
                        {/* Image */}
                        <div className="relative h-24 w-32 flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
                          {ad.photos && ad.photos.length > 0 ? (
                            <img src={ad.photos[0]} alt={ad.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${categoryColors[idx % categoryColors.length]} flex items-center justify-center text-white`}>
                                {getCategoryIcon(ad.category)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <span className="text-xs font-medium text-orange-600 mb-1 block">{ad.category}</span>
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                {ad.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-100">
                              <Star size={12} fill="currentColor" className="text-amber-500" />
                              <span className="text-xs font-bold text-amber-700">{Number(ad.ratings_avg || 0).toFixed(1)}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-500 line-clamp-1 mb-2">
                            {ad.description || "Serviço profissional de qualidade."}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">{ad.provider_name}</span>
                            {ad.city && ad.state && (
                              <span className="flex items-center gap-1">
                                <MapPin size={10} /> {ad.city}, {ad.state}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Eye size={10} /> {ad.views || 0} views
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum anúncio encontrado</h3>
                <p className="text-sm text-slate-500 mb-6">Tente ajustar os filtros ou volte mais tarde.</p>
                <button
                  onClick={() => {setSearchTerm(""); setSelectedCategory("");}}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

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
