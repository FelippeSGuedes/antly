"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Search,
  MapPin,
  Star,
  Filter,
  X,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  User,
  Sparkles,
  ArrowLeft,
  SlidersHorizontal,
  Map,
  Grid,
  Phone,
  Zap,
  Award,
  TrendingUp,
  Crown,
  Flame,
  Heart
} from "lucide-react";

mapboxgl.accessToken = "pk.eyJ1IjoiZmVsaXBwZWd1ZWRlcyIsImEiOiJjbWw1OGl6cGUwMTF6M2ZxM2xkOGUxODh6In0.rwuvw1wrV8zmR9_mmu8PNQ";

type Provider = {
  id: number;
  name: string;
  category: string;
  city: string;
  state: string;
  serviceType: string;
  latitude: number | null;
  longitude: number | null;
  profileUrl: string | null;
  description: string | null;
  whatsapp: string | null;
  rating: number;
  reviewCount: number;
};

type Category = {
  id: number;
  name: string;
  providerCount: number;
};

export default function ExplorarPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedCity, setSelectedCity] = useState("");
  const [minRating, setMinRating] = useState(0);

  const [hoveredProvider, setHoveredProvider] = useState<number | null>(null);

  // Buscar localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Fallback para São Paulo
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        }
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // Buscar categorias populares
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories/popular");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Buscar prestadores com filtros
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "Todos") params.set("category", selectedCategory);
      if (selectedCity) params.set("city", selectedCity);
      if (minRating > 0) params.set("minRating", minRating.toString());
      if (searchTerm) params.set("search", searchTerm);

      const response = await fetch(`/api/providers/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedCity, minRating, searchTerm]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current || viewMode !== "map" || !userLocation) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [userLocation.lng, userLocation.lat],
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Marcador do usuário
    new mapboxgl.Marker({ color: "#3B82F6" })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML("<p class='font-bold'>📍 Você está aqui</p>"))
      .addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [viewMode, userLocation]);

  // Atualizar marcadores dos prestadores
  useEffect(() => {
    if (!map.current || viewMode !== "map") return;

    // Limpar marcadores antigos
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Adicionar novos marcadores
    providers.forEach((provider) => {
      if (!provider.latitude || !provider.longitude) return;

      // Criar elemento customizado para o marcador
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.innerHTML = `
        <div class="relative cursor-pointer group">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-sm border-2 border-white transform transition-all duration-300 hover:scale-110">
            ${provider.name.charAt(0).toUpperCase()}
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-orange-500"></div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25, 
        closeButton: false,
        className: "custom-popup"
      }).setHTML(`
        <div class="p-4 min-w-[280px]">
          <div class="flex items-start gap-3">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-orange-600 font-bold text-xl shrink-0">
              ${provider.profileUrl ? `<img src="${provider.profileUrl}" class="w-full h-full rounded-xl object-cover" />` : provider.name.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-slate-900 text-lg truncate">${provider.name}</h3>
              <p class="text-sm text-orange-600 font-medium">${provider.category || "Profissional"}</p>
              <div class="flex items-center gap-1 mt-1">
                <span class="text-amber-500">★</span>
                <span class="font-bold text-slate-700">${provider.rating.toFixed(1)}</span>
                <span class="text-slate-400 text-xs">(${provider.reviewCount} avaliações)</span>
              </div>
            </div>
          </div>
          <p class="mt-3 text-sm text-slate-600 line-clamp-2">${provider.description || "Profissional disponível para atender na sua região."}</p>
          <div class="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span class="flex items-center gap-1">📍 ${provider.city || "Local"}, ${provider.state || "BR"}</span>
          </div>
          <a href="/profissional/${provider.id}" class="mt-4 block w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center font-bold rounded-xl text-sm hover:shadow-lg transition-all">
            Ver Perfil Completo
          </a>
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([provider.longitude, provider.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener("mouseenter", () => {
        setHoveredProvider(provider.id);
      });

      el.addEventListener("mouseleave", () => {
        setHoveredProvider(null);
      });

      markersRef.current.push(marker);
    });
  }, [providers, viewMode]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Todos");
    setSelectedCity("");
    setMinRating(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20">
      {/* Hero Header Impactante */}
      <header className="relative overflow-hidden">
        {/* Background com Efeitos Especiais */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600">
          {/* Partículas flutuantes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-20 right-20 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-yellow-300/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
          {/* Padrão de ondas */}
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path fill="white" d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
          </div>
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Logo GIGANTE no centro */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="group flex flex-col items-center">
              {/* Container do Logo com múltiplos efeitos */}
              <div className="relative mb-4">
                {/* Glow externo pulsante */}
                <div className="absolute inset-0 w-28 h-28 bg-white/30 rounded-3xl blur-2xl animate-pulse"></div>
                {/* Anel externo rotativo */}
                <div className="absolute -inset-2 rounded-[2rem] border-2 border-white/20 animate-spin" style={{animationDuration: '15s'}}></div>
                {/* Anel interno */}
                <div className="absolute -inset-1 rounded-[1.75rem] border border-white/30"></div>
                
                {/* Logo Principal */}
                <div className="relative w-28 h-28 rounded-3xl bg-white shadow-2xl shadow-orange-900/30 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {/* Gradiente interno */}
                  <div className="absolute inset-1 rounded-[1.25rem] bg-gradient-to-br from-orange-500 via-amber-400 to-orange-600 flex items-center justify-center overflow-hidden">
                    {/* Brilho diagonal animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    {/* Letra A */}
                    <span className="text-5xl font-black text-white drop-shadow-lg tracking-tighter">A</span>
                  </div>
                </div>
                
                {/* Ícones flutuantes ao redor */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce" style={{animationDuration: '2s'}}>
                  <Zap size={20} className="text-white fill-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-xl animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <div className="absolute top-1/2 -right-4 w-7 h-7 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-xl animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}>
                  <Star size={14} className="text-white fill-white" />
                </div>
              </div>
              
              {/* Nome da marca */}
              <h1 className="text-5xl font-black text-white drop-shadow-lg tracking-tight mb-1">
                Antly
              </h1>
              <p className="text-white/80 text-lg font-medium">Encontre os melhores profissionais</p>
            </Link>
          </div>

          {/* Barra de busca hero */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50 group-focus-within:opacity-80 transition-opacity"></div>
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-orange-900/20 overflow-hidden">
                <Search size={24} className="ml-5 text-orange-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, serviço ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-5 text-lg text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button className="m-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all">
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {/* Stats rápidos */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="font-semibold">{providers.length} profissionais online</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Flame size={18} className="text-yellow-300" />
              <span className="font-semibold">+50 categorias</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Star size={18} className="text-yellow-300 fill-yellow-300" />
              <span className="font-semibold">4.9 avaliação média</span>
            </div>
          </div>
        </div>
      </header>

      {/* Barra de navegação sticky */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-orange-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo pequeno para quando scrollar */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-lg font-black text-white">A</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-slate-800">Antly</span>
          </Link>

          {/* Badges de destaque */}
          <div className="hidden md:flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">{providers.length} online</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-200 shrink-0">
              <Flame size={14} className="text-orange-500" />
              <span className="text-sm font-medium text-orange-700">Em alta</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200 shrink-0">
              <Award size={14} className="text-purple-500" />
              <span className="text-sm font-medium text-purple-700">Top avaliados</span>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-1.5 flex shadow-inner">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "grid" 
                    ? "bg-white shadow-lg shadow-orange-500/10 text-orange-600" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Grid size={18} />
                <span className="hidden sm:inline text-sm font-medium">Cards</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "map" 
                    ? "bg-white shadow-lg shadow-orange-500/10 text-orange-600" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Map size={18} />
                <span className="hidden sm:inline text-sm font-medium">Mapa</span>
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden p-3 rounded-xl transition-all ${
                showFilters 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar Filtros Premium */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-80 shrink-0 space-y-6`}>
          {/* Card de Filtros com Design Premium */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-orange-500/10 border border-orange-100/50 overflow-hidden">
            {/* Header do Card */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white flex items-center gap-2 text-lg">
                  <Filter size={20} />
                  Filtros Avançados
                </h2>
                <button 
                  onClick={clearFilters} 
                  className="text-xs bg-white/20 hover:bg-white/30 text-white font-medium px-3 py-1.5 rounded-full transition-all"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Busca Premium */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-2">
                  <Search size={14} className="text-orange-500" />
                  Buscar Profissional
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-opacity"></div>
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Nome, serviço, especialidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="relative w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Categoria com Design Premium */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-2">
                  <Sparkles size={14} className="text-orange-500" />
                  Categoria
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                  <button
                    onClick={() => setSelectedCategory("Todos")}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-3 ${
                      selectedCategory === "Todos"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                        : "bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-600 border border-slate-100"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedCategory === "Todos" ? "bg-white/20" : "bg-orange-100"}`}>
                      <Grid size={16} className={selectedCategory === "Todos" ? "text-white" : "text-orange-500"} />
                    </div>
                    Todas as categorias
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all flex justify-between items-center ${
                        selectedCategory === cat.name
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                          : "bg-slate-50 text-slate-600 hover:bg-orange-50 hover:text-orange-600 border border-slate-100"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        selectedCategory === cat.name ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"
                      }`}>
                        {cat.providerCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cidade Premium */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-2">
                  <MapPin size={14} className="text-orange-500" />
                  Localização
                </label>
                <div className="relative group">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Digite sua cidade..."
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Avaliação Premium com Stars */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-2">
                  <Star size={14} className="text-orange-500" />
                  Avaliação mínima
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`py-3 rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                        minRating === rating
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30"
                          : "bg-slate-50 text-slate-600 hover:bg-amber-50 border border-slate-100"
                      }`}
                    >
                      {rating > 0 ? (
                        <>
                          <Star size={16} className={minRating === rating ? "fill-white text-white" : "fill-amber-400 text-amber-400"} />
                          <span className="text-xs">{rating}+</span>
                        </>
                      ) : (
                        <>
                          <Heart size={16} className={minRating === rating ? "text-white" : "text-slate-400"} />
                          <span className="text-xs">Todas</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card de Localização Premium */}
          {userLocation && (
            <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden">
              {/* Efeito de fundo */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">Sua localização</p>
                  <p className="text-sm text-white/80">Mostrando profissionais próximos</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/90">GPS ativo</span>
              </div>
            </div>
          )}

          {/* Card Promocional */}
          <div className="bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 rounded-3xl p-5 border border-orange-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Crown size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900">É profissional?</p>
                <p className="text-xs text-slate-500">Cadastre-se gratuitamente</p>
              </div>
            </div>
            <Link 
              href="/cadastro" 
              className="block w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Criar minha conta
            </Link>
          </div>
        </aside>

        {/* Conteúdo Principal Premium */}
        <main className="flex-1 min-w-0">
          {/* Header de Resultados Premium */}
          <div className="mb-6 p-5 bg-white rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {loading ? "Buscando profissionais..." : `${providers.length} profissionais`}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {selectedCategory !== "Todos" 
                      ? `Categoria: ${selectedCategory}` 
                      : "Mostrando todas as categorias"}
                  </p>
                </div>
              </div>
              {providers.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Ordenar por:</span>
                  <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20">
                    <option>Mais relevantes</option>
                    <option>Melhor avaliados</option>
                    <option>Mais próximos</option>
                    <option>Mais recentes</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {viewMode === "grid" ? (
            /* Grid de cards Premium */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-lg animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-slate-200"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-slate-200 rounded-lg w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
                      </div>
                    </div>
                    <div className="mt-4 h-24 bg-slate-100 rounded-xl"></div>
                  </div>
                ))
              ) : providers.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <Search size={40} className="text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Nenhum profissional encontrado</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">Tente ajustar os filtros ou buscar por outra categoria para encontrar mais resultados.</p>
                  <button
                    onClick={clearFilters}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              ) : (
                providers.map((provider, idx) => (
                  <div
                    key={provider.id}
                    className="group bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/15 hover:-translate-y-2 transition-all duration-500"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Header gradient com padrão */}
                    <div className="h-28 bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'2\' fill=\'rgba(255,255,255,0.15)\'/%3E%3C/svg%3E')]"></div>
                      
                      {/* Avatar flutuante */}
                      <div className="absolute bottom-0 left-6 translate-y-1/2">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white transform group-hover:scale-105 transition-transform">
                          {provider.profileUrl ? (
                            <img src={provider.profileUrl} alt={provider.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                              <span className="text-3xl font-black text-orange-600">
                                {provider.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Badge online */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>

                      {/* Rating Premium */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          <span className="text-sm font-black text-slate-800">{provider.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Badge Destaque (para alguns) */}
                      {idx < 3 && (
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-3 py-1 shadow-lg">
                            <Flame size={12} className="text-white" />
                            <span className="text-xs font-bold text-white">Top</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 pt-14">
                      <h3 className="font-bold text-xl text-slate-900 mb-1 truncate group-hover:text-orange-600 transition-colors">{provider.name}</h3>
                      <p className="text-orange-600 text-sm font-semibold mb-3 flex items-center gap-1">
                        <Sparkles size={12} />
                        {provider.category}
                      </p>
                      <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {provider.description || "Profissional qualificado disponível para atender na sua região com excelência."}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-5 pb-5 border-b border-slate-100">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-orange-400" />
                          {provider.city || "Local"}, {provider.state || "BR"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageCircle size={14} className="text-orange-400" />
                          {provider.reviewCount} avaliações
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/profissional/${provider.id}`}
                          className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center font-bold rounded-2xl text-sm hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:scale-[1.02]"
                        >
                          Ver Perfil Completo
                        </Link>
                        {provider.whatsapp && (
                          <a
                            href={`https://wa.me/55${provider.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:shadow-lg hover:shadow-green-500/30 transition-all transform hover:scale-105"
                          >
                            <Phone size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Mapa Premium */
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-orange-50/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <Map size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Mapa Interativo</p>
                    <p className="text-xs text-slate-500">Clique nos marcadores para ver detalhes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full"></div>
                  <span>{providers.length} profissionais no mapa</span>
                </div>
              </div>
              <div
                ref={mapContainer}
                className="w-full h-[650px]"
                style={{ minHeight: "500px" }}
              />
            </div>
          )}

          {/* Seção de Destaque Inferior */}
          {!loading && providers.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
              <div className="relative flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Zap size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Não encontrou o que procurava?</h3>
                    <p className="text-white/80">Publique uma solicitação e receba propostas de profissionais</p>
                  </div>
                </div>
                <Link 
                  href="/solicitar-servico" 
                  className="px-8 py-4 bg-white text-orange-600 font-bold rounded-2xl hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Publicar Solicitação
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Estilos customizados para popup do Mapbox */}
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 20px;
          box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.3);
          border: 1px solid #fed7aa;
        }
        .mapboxgl-popup-close-button {
          display: none;
        }
        .custom-marker {
          cursor: pointer;
        }
        .custom-marker:hover {
          z-index: 1000;
        }
        /* Scrollbar customizada */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #f59e0b);
          border-radius: 10px;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Animação de entrada dos cards */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .grid > div {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
