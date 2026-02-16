"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
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
  Navigation,
  User,
  TrendingUp,
  LogOut,
  Sun,
  Moon,
  Sunset,
} from "lucide-react";

// Configurar token do Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Cores gradientes para as categorias
const categoryColors = [
  "from-orange-500 to-amber-500",
  "from-blue-500 to-cyan-500", 
  "from-emerald-500 to-green-500",
  "from-purple-500 to-pink-500",
  "from-rose-500 to-red-500",
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Eletricista": <Zap className="w-5 h-5" />,
  "Encanador": <span className="text-lg">🔧</span>,
  "Pintor": <span className="text-lg">🎨</span>,
  "Pedreiro": <span className="text-lg">🧱</span>,
  "Marceneiro": <span className="text-lg">🪵</span>,
  "Jardineiro": <span className="text-lg">🌿</span>,
  "Limpeza": <span className="text-lg">🧹</span>,
  "Mecânico": <span className="text-lg">🔩</span>,
  "Técnico de Informática": <span className="text-lg">💻</span>,
  "Personal Trainer": <span className="text-lg">💪</span>,
  "Construção": <span className="text-lg">🏗️</span>,
  "Impermeabilização": <span className="text-lg">🌧️</span>,
  "default": <Briefcase className="w-5 h-5" />
};

const getCategoryIcon = (name: string) => {
  return categoryIcons[name] || categoryIcons["default"];
};

// Função para calcular distância entre duas coordenadas (fórmula Haversine)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
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
  latitude?: number | null;
  longitude?: number | null;
};

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Bom dia", icon: "sun" };
  if (hour >= 12 && hour < 18) return { text: "Boa tarde", icon: "sunset" };
  return { text: "Boa noite", icon: "moon" };
};

type Category = {
  id: number;
  name: string;
  group_name: string;
  provider_count?: number;
};

export default function AnunciosPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hoveredAd, setHoveredAd] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Filtros avançados
  const [radiusKm, setRadiusKm] = useState<number>(50);
  const [minRating, setMinRating] = useState<number>(0);
  const [hasWarranty, setHasWarranty] = useState<boolean>(false);
  const [has24hService, setHas24hService] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("recent");
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const limit = 12;

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude];
          setUserLocation(newLocation);
          setLocationLoading(false);
          
          // Atualizar mapa se já existe
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo({
              center: newLocation,
              zoom: 11,
              essential: true
            });
            
            // Atualizar marcador do usuário
            if (userMarkerRef.current) {
              userMarkerRef.current.setLngLat(newLocation);
            }
          }
        },
        () => {
          console.log("Usando localização padrão (São Paulo)");
          setUserLocation([-46.6333, -23.5505]);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setUserLocation([-46.6333, -23.5505]);
      setLocationLoading(false);
    }
  }, []);

  // Carregar usuário autenticado
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

  const greeting = getGreeting();

  // Inicializar mapa
  useEffect(() => {
    if (!showMap || !mapContainerRef.current || mapInstanceRef.current || !userLocation) return;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation,
      zoom: 11,
    });

    mapInstanceRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    userMarkerRef.current = new mapboxgl.Marker({ color: "#f97316" })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup().setHTML("<p class='font-bold text-sm'>📍 Sua localização</p>"))
      .addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap, userLocation]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [adsRes, categoriesRes] = await Promise.all([
          fetch(`/api/ads/public?limit=${limit}&offset=${(page - 1) * limit}`),
          fetch("/api/categories")
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

  const serviceTypes = ["Residencial", "Comercial", "Industrial", "Emergência", "Manutenção", "Instalação", "Reforma", "Consultoria"];

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setRadiusKm(50);
    setMinRating(0);
    setHasWarranty(false);
    setHas24hService(false);
    setSortBy("recent");
    setSelectedServiceTypes([]);
  };

  const activeFiltersCount = [
    searchTerm !== "",
    selectedCategory !== "",
    radiusKm !== 50,
    minRating > 0,
    hasWarranty,
    has24hService,
    selectedServiceTypes.length > 0
  ].filter(Boolean).length;

  const filteredAds = ads.filter(ad => {
    const matchesSearch = searchTerm === "" || 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.provider_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || ad.category === selectedCategory;
    const matchesRating = minRating === 0 || (ad.ratings_avg && Number(ad.ratings_avg) >= minRating);
    const matchesWarranty = !hasWarranty || ad.warranty === true;
    const matches24h = !has24hService || ad.attendance_24h === true;
    const matchesServiceType = selectedServiceTypes.length === 0 || (ad.service_type && selectedServiceTypes.includes(ad.service_type));
    
    // Filtro de distância baseado na localização do usuário
    let matchesDistance = true;
    if (userLocation && ad.latitude && ad.longitude) {
      const distance = calculateDistance(
        userLocation[1], // latitude do usuário
        userLocation[0], // longitude do usuário
        ad.latitude,
        ad.longitude
      );
      matchesDistance = distance <= radiusKm;
    }
    
    return matchesSearch && matchesCategory && matchesRating && matchesWarranty && matches24h && matchesServiceType && matchesDistance;
  }).sort((a, b) => {
    switch (sortBy) {
      case "rating": return (Number(b.ratings_avg) || 0) - (Number(a.ratings_avg) || 0);
      case "views": return (b.views || 0) - (a.views || 0);
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Atualizar marcadores
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    filteredAds.forEach((ad) => {
      // Usar coordenadas reais do anúncio se disponíveis, senão gerar aleatoriamente
      const lat = ad.latitude ?? userLocation[1] + (Math.random() - 0.5) * 0.1;
      const lng = ad.longitude ?? userLocation[0] + (Math.random() - 0.5) * 0.1;

      const el = document.createElement("div");
      el.className = "ad-marker";
      el.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <p class="font-bold text-slate-900 text-sm mb-1">${ad.title}</p>
          <p class="text-xs text-slate-500 mb-2">${ad.provider_name}</p>
          ${ad.city ? `<p class="text-xs text-orange-600">📍 ${ad.city}, ${ad.state}</p>` : ''}
          <a href="/anuncio/${ad.id}" class="block mt-2 text-center text-xs font-bold text-white bg-orange-500 rounded-lg py-1.5 hover:bg-orange-600">Ver Anúncio</a>
        </div>
      `);

      const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).setPopup(popup).addTo(mapInstanceRef.current!);
      el.addEventListener("mouseenter", () => setHoveredAd(ad.id));
      el.addEventListener("mouseleave", () => setHoveredAd(null));
      markersRef.current.push(marker);
    });
  }, [filteredAds, userLocation]);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="min-h-screen bg-[#FFFAF5] text-slate-800 font-sans flex flex-col">

      {/* Conteúdo Principal - Layout 3 colunas: Filtros | Anúncios | Mapa */}
      <div className="flex-1 flex">
        {/* ESQUERDA - Filtros Bonitos */}
        <aside className="hidden lg:block w-[360px] bg-gradient-to-b from-white to-orange-50/30 border-r border-orange-100 sticky top-0 h-screen overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Header do Filtro com auth */}
          <div className="p-5 bg-gradient-to-r from-orange-500 to-amber-500">
            <div className="flex items-center justify-between mb-3">
              <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold">Voltar</span>
              </Link>
              
              {isAuthLoading ? (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-white/20" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/30 transition-all"
                  >
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-orange-500 font-black text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-xs font-bold hidden xl:inline">{user.name.split(' ')[0]}</span>
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
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut size={16} /> Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth" className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-lg hover:bg-white/30 transition-all border border-white/20">
                  Entrar
                </Link>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Filter size={20} />
                Filtros
              </h3>
              {activeFiltersCount > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-white/80 hover:text-white font-medium bg-white/20 px-3 py-1 rounded-full">
                  Limpar ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* Busca */}
            <div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar serviços..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Categorias - Dropdown agrupado por Área */}
            <div>
              <label className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Briefcase size={16} className="text-orange-500" />
                Categorias
              </label>
              <div className="mt-3 relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white appearance-none cursor-pointer focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
                >
                  <option value="">Todas as Categorias</option>
                  {Object.entries(
                    categories.reduce((acc, cat) => {
                      const group = cat.group_name || "Outros";
                      if (!acc[group]) acc[group] = [];
                      acc[group].push(cat);
                      return acc;
                    }, {} as Record<string, Category[]>)
                  ).map(([groupName, groupCategories]) => (
                    <optgroup key={groupName} label={groupName}>
                      {groupCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Distância com visual melhorado */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <label className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Navigation size={16} className="text-orange-500" />
                Distância
              </label>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-orange-600">{radiusKm} km</span>
                  <MapPin size={20} className="text-slate-400" />
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>5km</span>
                  <span>100km</span>
                  <span>200km</span>
                </div>
              </div>
            </div>

            {/* Avaliação com estrelas visuais */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <label className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Star size={16} className="text-orange-500 fill-orange-500" />
                Avaliação Mínima
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { value: 0, label: "Todas", stars: 0 },
                  { value: 3, label: "3+", stars: 3 },
                  { value: 4, label: "4+", stars: 4 },
                  { value: 4.5, label: "4.5+", stars: 5 }
                ].map((rating) => (
                  <button
                    key={rating.value}
                    onClick={() => setMinRating(rating.value)}
                    className={`flex items-center justify-center gap-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      minRating === rating.value 
                        ? "bg-amber-500 text-white shadow-lg" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {rating.value > 0 && <Star size={14} fill="currentColor" />}
                    {rating.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de Serviço */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <label className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Zap size={16} className="text-orange-500" />
                Tipo de Atendimento
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {serviceTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (selectedServiceTypes.includes(type)) {
                        setSelectedServiceTypes(selectedServiceTypes.filter(t => t !== type));
                      } else {
                        setSelectedServiceTypes([...selectedServiceTypes, type]);
                      }
                    }}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                      selectedServiceTypes.includes(type) 
                        ? "bg-orange-500 text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Diferenciais */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <label className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-orange-500" />
                Diferenciais
              </label>
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setHasWarranty(!hasWarranty)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    hasWarranty 
                      ? "bg-emerald-500 text-white" 
                      : "bg-slate-50 text-slate-600 hover:bg-emerald-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={18} />
                    Oferece Garantia
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${hasWarranty ? "bg-white border-white" : "border-slate-300"}`}>
                    {hasWarranty && <span className="text-emerald-500 text-xs font-bold">✓</span>}
                  </div>
                </button>
                <button
                  onClick={() => setHas24hService(!has24hService)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    has24hService 
                      ? "bg-blue-500 text-white" 
                      : "bg-slate-50 text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock size={18} />
                    Atendimento 24h
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${has24hService ? "bg-white border-white" : "border-slate-300"}`}>
                    {has24hService && <span className="text-blue-500 text-xs font-bold">✓</span>}
                  </div>
                </button>
              </div>
            </div>

            {/* Ordenar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <label className="text-sm font-bold text-slate-800 mb-3 block">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 focus:border-orange-500 focus:outline-none cursor-pointer bg-slate-50"
              >
                <option value="recent">📅 Mais recentes</option>
                <option value="rating">⭐ Melhor avaliação</option>
                <option value="views">👁️ Mais vistos</option>
              </select>
            </div>

            {/* Toggle Mapa */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-sm font-bold transition-all ${
                showMap 
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Map size={18} />
              {showMap ? "Mapa Ativo" : "Mostrar Mapa"}
            </button>
          </div>
        </aside>

        {/* MEIO - Anúncios */}
        <div className="flex-1 overflow-y-auto bg-[#FFFAF5] scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="p-6">
            {/* Header dos Resultados */}
            <div className="flex items-center justify-between mb-6">
              <div>
                {user ? (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {greeting.text}, {user.name.split(' ')[0]}!
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Confira os <span className="font-semibold text-orange-600">{filteredAds.length}</span> profissionais disponíveis para você
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Encontre o Profissional Ideal</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span className="font-semibold text-orange-600">{filteredAds.length}</span> resultados encontrados
                      </span>
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedCategory && (
                  <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/25">
                    {getCategoryIcon(selectedCategory)}
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("")} className="ml-1 hover:text-orange-200 transition-colors">×</button>
                  </span>
                )}
                <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-100 rounded-2xl animate-pulse h-72"></div>
                ))}
              </div>
            ) : filteredAds.length > 0 ? (
              <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {filteredAds.map((ad, idx) => (
                  <Link
                    key={ad.id}
                    href={`/anuncio/${ad.id}`}
                    className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/15 hover:-translate-y-1 border border-slate-100 hover:border-orange-200 ${hoveredAd === ad.id ? 'ring-2 ring-orange-400 shadow-xl shadow-orange-500/20' : ''}`}
                    onMouseEnter={() => setHoveredAd(ad.id)}
                    onMouseLeave={() => setHoveredAd(null)}
                  >
                    {/* Image */}
                    <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden h-44">
                      {ad.photos && ad.photos.length > 0 ? (
                        <img src={ad.photos[0]} alt={ad.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
                          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${categoryColors[idx % categoryColors.length]} flex items-center justify-center text-white shadow-xl`}>
                            {getCategoryIcon(ad.category)}
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay gradiente sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-slate-700 shadow-sm">
                          {ad.category}
                        </span>
                      </div>
                      
                      {ad.warranty && (
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-[11px] font-bold text-white shadow-lg">
                            <ShieldCheck size={12} /> Garantia
                          </span>
                        </div>
                      )}

                      {ad.attendance_24h && (
                        <div className="absolute bottom-3 right-3">
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500 text-[11px] font-bold text-white shadow-lg">
                            <Clock size={12} /> 24h
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {ad.title}
                      </h3>
                      
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {ad.description || "Serviço profissional de qualidade."}
                      </p>

                      {/* Divider */}
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {ad.provider_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{ad.provider_name}</p>
                              {ad.city && (
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                  <MapPin size={10} /> {ad.city}, {ad.state}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg">
                              <Star size={14} fill="currentColor" className="text-amber-500" />
                              <span className="text-sm font-black text-amber-700">{Number(ad.ratings_avg || 0).toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <Eye size={12} />
                              {ad.views || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-orange-200">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                  <Briefcase className="h-10 w-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum anúncio encontrado</h3>
                <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">Tente ajustar os filtros ou aumentar o raio de distância para encontrar mais resultados</p>
                <button onClick={clearAllFilters} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:scale-105 transition-all">
                  Limpar Todos os Filtros
                </button>
              </div>
            )}

            {/* Paginação Premium */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1} 
                  className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm"
                >
                  <ArrowLeft size={18} />
                </button>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPage(i + 1)} 
                    className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${
                      page === i + 1 
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25" 
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-orange-50 hover:border-orange-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages} 
                  className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DIREITA - Mapa */}
        {showMap && (
          <div className="hidden lg:block w-[35%] sticky top-0 h-screen border-l border-slate-200 relative">
            <div ref={mapContainerRef} className="w-full h-full" />
            
            {/* Logo Antly no mapa */}
            <div className="absolute bottom-2 right-2 z-20">
              <img src="/logo.svg" alt="Antly" className="h-32 opacity-60 hover:opacity-90 transition-opacity" />
            </div>

            {/* Info box no mapa */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-slate-800">{filteredAds.length} anúncios</span>
                    <p className="text-xs text-slate-500">encontrados na região</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controle de zoom personalizado */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
              <button className="w-10 h-10 bg-white rounded-lg shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                +
              </button>
              <button className="w-10 h-10 bg-white rounded-lg shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                −
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Premium */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2">
              <img src="/logo.svg" alt="Antly" className="h-12 mb-4" />
              <p className="text-sm text-slate-500 max-w-xs mb-4 leading-relaxed">
                A forma mais rápida e segura de encontrar profissionais qualificados perto de você.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center text-orange-400 hover:from-orange-100 hover:to-amber-100 hover:text-orange-600 transition-all hover:shadow-md hover:-translate-y-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center text-orange-400 hover:from-orange-100 hover:to-amber-100 hover:text-orange-600 transition-all hover:shadow-md hover:-translate-y-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Plataforma</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li><Link href="/" className="hover:text-orange-600 transition-colors">Página Inicial</Link></li>
                <li><Link href="/auth" className="hover:text-orange-600 transition-colors">Para Profissionais</Link></li>
                <li><Link href="/anuncios" className="hover:text-orange-600 transition-colors">Anúncios</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4 text-sm">Suporte</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
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
              <Heart size={12} className="text-orange-500 fill-orange-500 animate-pulse" />
              <span>no Brasil</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Estilos Mapbox */}
      <style jsx global>{`
        .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib { display: none !important; }
        .mapboxgl-popup-content { padding: 0 !important; border-radius: 12px !important; box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important; }
        .ad-marker { cursor: pointer; }
        .ad-marker:hover > div { transform: scale(1.1); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
    </>
  );
}
