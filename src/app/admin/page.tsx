"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  LayoutDashboard,
  Megaphone,
  Layers,
  Search,
  Bell,
  ChevronDown,
  MoreVertical,
  Filter,
  Download,
  Menu,
  X,
  LogOut,
  ShieldAlert,
  MessageSquare,
  Star,
  CreditCard,
  BarChart3,
  Settings,
  ShieldCheck,
  FileText,
  PlusCircle,
  Globe,
  Ban,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  MapPin,
  Tag,
  Image as ImageIcon
} from "lucide-react";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
  phone?: string | null;
  whatsapp?: string | null;
  city?: string | null;
  state?: string | null;
};

type AdminAd = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "Postado" | "Em Analise" | "Reprovado";
  created_at: string;
  user_name: string;
  user_email: string;
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
};

type SidebarItemProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  isActive?: boolean;
  subItems?: Array<{
    label: string;
    active?: boolean;
    count?: number;
    isDanger?: boolean;
    onClick?: () => void;
  }>;
  onSubItemClick?: (label: string) => void;
  isOpen?: boolean;
  alertCount?: number;
  isCollapsed?: boolean;
};

const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  subItems = [],
  isOpen: initialIsOpen = false,
  alertCount = 0,
  isCollapsed,
  onSubItemClick
}: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen || Boolean(isActive));
  const showSubmenu = isOpen && !isCollapsed && subItems.length > 0;

  return (
    <div className="mb-1 relative group/item">
      <div
        onClick={() => !isCollapsed && subItems.length > 0 && setIsOpen(!isOpen)}
        className={`
          flex items-center px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-200 select-none
          ${isActive
            ? "bg-orange-50 text-orange-700 shadow-sm border border-orange-100"
            : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"}
          ${isCollapsed ? "justify-center px-2" : "justify-between"}
        `}
        title={isCollapsed ? label : ""}
      >
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? "w-auto" : "flex-1"}`}>
          <Icon
            size={isCollapsed ? 22 : 18}
            className={`shrink-0 transition-all ${
              isActive
                ? "text-orange-600"
                : "text-slate-400 group-hover/item:text-slate-600"
            }`}
          />
          <span
            className={`font-medium text-xs truncate transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
            }`}
          >
            {label}
          </span>
        </div>

        {!isCollapsed && (
          <div className="flex items-center gap-2 fade-in">
            {alertCount > 0 && !isOpen && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                {alertCount}
              </span>
            )}
            {subItems.length > 0 && (
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        )}

        {isCollapsed && alertCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>

      {showSubmenu && (
        <div className="ml-5 pl-3 border-l-2 border-slate-100 mt-1 mb-2 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
          {subItems.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                if (item.onClick) item.onClick();
                if (onSubItemClick) onSubItemClick(item.label);
              }}
              className={`
                flex items-center justify-between text-[11px] py-1.5 px-3 rounded-md cursor-pointer transition-colors
                ${item.active
                  ? "text-orange-700 font-semibold bg-orange-50"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
              `}
            >
              <span className="truncate">{item.label}</span>
              {item.count && item.count > 0 && (
                <span
                  className={`text-[9px] font-bold px-1.5 rounded-full ${
                    item.isDanger ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: "ACTIVE" | "BLOCKED" | "PENDING" }) => {
  const styles = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    BLOCKED: "bg-red-50 text-red-700 border-red-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200"
  };

  const labels = {
    ACTIVE: "Ativo",
    BLOCKED: "Bloqueado",
    PENDING: "Pendente"
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
        styles[status]
      }`}
    >
      {labels[status]}
    </span>
  );
};

const UserBadge = ({ role }: { role: string }) => {
  const isAdmin = role.toUpperCase() === "ADMIN";
  return (
    <span
      className={`
      inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider
      ${isAdmin ? "text-purple-700" : "text-slate-600"}
    `}
    >
      {isAdmin && <ShieldCheck size={12} />}
      {isAdmin ? "Admin" : role.toUpperCase() === "CLIENT" ? "Cliente" : "Prestador"}
    </span>
  );
};

const Avatar = ({ name, url, collapsed, size = 'md' }: { name: string; url?: string; collapsed?: boolean; size?: 'sm' | 'md' | 'lg' }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: collapsed ? 'w-10 h-10 text-sm' : 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm'
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${currentSizeClass} rounded-full border border-slate-200 shadow-sm object-cover`}
      />
    );
  }

  return (
    <div
      className={`
      rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 font-bold shrink-0 select-none transition-all
      ${currentSizeClass}
      ${collapsed ? "bg-orange-50 text-orange-600 border-orange-200" : ""}
    `}
    >
      {initials}
    </div>
  );
};


const UsersView = ({ userRows }: { userRows: any[] }) => (
  <div className="max-w-[1600px] mx-auto space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Gestão
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-medium text-slate-500">Usuários</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Base de Usuários</h2>
      </div>

      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-800 text-sm font-medium transition-all shadow-sm">
          <Filter size={16} />
          <span>Filtros Avançados</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium transition-all shadow-md shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5">
          <Download size={16} />
          <span>Exportar</span>
        </button>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-100">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500" />
            <input
              type="text"
              placeholder="Filtrar por nome..."
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all w-64"
            />
          </div>
          <select className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-600 focus:outline-none focus:border-orange-300 cursor-pointer">
            <option>Todos os perfis</option>
            <option>Administradores</option>
            <option>Prestadores</option>
            <option>Clientes</option>
          </select>
          <select className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-600 focus:outline-none focus:border-orange-300 cursor-pointer">
            <option>Status: Todos</option>
            <option>Ativos</option>
            <option>Bloqueados</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-700">{userRows.length}</span> usuários encontrados
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="py-3 px-6 w-12 text-center">
                <input type="checkbox" className="rounded border-slate-300 text-orange-600 focus:ring-orange-200 cursor-pointer w-4 h-4" />
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Usuário</th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perfil</th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contato</th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Localização</th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {userRows.map((row) => (
              <tr key={row.id} className="hover:bg-orange-50/30 transition-colors group">
                <td className="py-3 px-6 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-orange-600 focus:ring-orange-200 cursor-pointer w-4 h-4" />
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar name={row.name} />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-slate-700 group-hover:text-orange-700 transition-colors">
                        {row.name}
                      </span>
                      <span className="text-xs text-slate-400">{row.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-3 px-6">
                  <UserBadge role={row.role} />
                </td>
                <td className="py-3 px-6">
                  {row.contact === "-" ? (
                    <span className="text-slate-300 text-xs">-</span>
                  ) : (
                    <div className="flex flex-col items-start gap-1">
                      {row.contact.includes("Whats") ? (
                        <span className="text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100">
                          {row.contact}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">{row.contact}</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="py-3 px-6 text-xs text-slate-500 font-medium">
                  {row.cityLabel === "-" ? <span className="text-slate-300">-</span> : row.cityLabel}
                </td>
                <td className="py-3 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors" title="Editar">
                      <FileText size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Bloquear">
                      <Ban size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-4 px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
        <span className="text-xs text-slate-500">
          Exibindo <span className="font-bold text-slate-700">1-{userRows.length}</span> de {userRows.length} resultados
        </span>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 transition-all">
            Anterior
          </button>
          <button className="px-3 py-1.5 text-xs font-bold bg-orange-600 text-white rounded-md shadow-sm shadow-orange-200">
            1
          </button>
          <button className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all">
            Próximo
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PendingAdsView = ({ ads }: { ads: AdminAd[] }) => {
  const pendingAds = ads.filter((ad) => ad.status === "Em Analise");
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-wider">Moderação</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-medium text-slate-500">Anúncios</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Anúncios Pendentes</h2>
          <p className="text-sm text-slate-500 mt-1">
            Existem <span className="font-bold text-orange-600">{pendingAds.length} anúncios</span> aguardando sua aprovação.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-all shadow-sm">
            <Clock size={16} />
            <span>Mais recentes</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-all shadow-md shadow-emerald-200">
            <CheckCircle size={16} />
            <span>Aprovar Todos</span>
          </button>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {pendingAds.map((ad) => (
          <div key={ad.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
            
            {/* Topo do Card: Imagem e Badges */}
            <div className="relative h-32 bg-slate-100 border-b border-slate-100 flex items-center justify-center overflow-hidden">
               {/* Placeholder para imagem, já que AdminAd ainda não tem campo de imagem */}
               <div className="flex flex-col items-center text-slate-400 gap-1">
                  <ImageIcon size={24} />
                  <span className="text-[10px] font-medium">Sem imagem</span>
                </div>
              
              {/* Badge de Categoria */}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-slate-700 shadow-sm border border-slate-200/50 flex items-center gap-1">
                <Tag size={8} className="text-orange-500" />
                {ad.category || "Geral"}
              </div>

              {/* Badge de Data */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-medium text-white flex items-center gap-1">
                <Clock size={8} />
                {new Date(ad.created_at).toLocaleDateString("pt-BR")}
              </div>
            </div>

            {/* Corpo do Card */}
            <div className="p-3 flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2" title={ad.title}>
                  {ad.title}
                </h3>
              </div>
              
              <p className="text-sm font-bold text-orange-600 mb-2">R$ --,--</p>
              
              <p className="text-[10px] text-slate-500 leading-relaxed mb-3 line-clamp-2 flex-1">
                {ad.description}
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-3 bg-slate-50 p-1.5 rounded">
                <MapPin size={10} />
                Local não informado
              </div>

              {/* Info do Vendedor */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <Avatar name={ad.user_name} size="sm" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-slate-700 truncate">{ad.user_name}</span>
                  <div className="flex items-center gap-1">
                    <Star size={8} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[9px] text-slate-400">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé de Ações */}
            <div className="p-2 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-1.5">
               <button className="flex items-center justify-center gap-1 py-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-[10px] font-medium shadow-sm">
                <Eye size={12} />
                Ver
              </button>
              <button className="flex items-center justify-center gap-1 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors text-[10px] font-bold border border-red-100">
                <XCircle size={12} />
                Rejeitar
              </button>
              <button className="flex items-center justify-center gap-1 py-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors text-[10px] font-bold border border-emerald-100">
                <CheckCircle size={12} />
                Aprovar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Estado Vazio (Caso não tenha anúncios) */}
      {pendingAds.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Tudo limpo por aqui!</h3>
          <p className="text-slate-500 text-sm">Não há novos anúncios aguardando aprovação no momento.</p>
        </div>
      )}
    </div>
  );
};

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="max-w-[1600px] mx-auto space-y-6">
    <div className="bg-white rounded-xl border border-slate-200 border-dashed p-12 text-center">
      <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <LayoutDashboard size={32} className="text-orange-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
        Esta funcionalidade está sendo preparada e estará disponível em breve com dados completos.
      </p>
    </div>
  </div>
);

export default function AdminPage() {
  const [activeView, setActiveView] = useState("Lista de usuários");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isPinned || isHovered;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);

  const pendingCount = useMemo(
    () => ads.filter((ad) => ad.status === "Em Analise").length,
    [ads]
  );
  const reportedCount = 0; // Placeholder: conectar com API real quando disponível
  const ticketCount = 0;   // Placeholder: conectar com API real quando disponível

  const load = async () => {
    setLoading(true);
    try {
      const meResponse = await fetch("/api/auth/me");
      if (!meResponse.ok) {
        setUser(null);
        return;
      }
      const me = (await meResponse.json()) as AuthUser;
      setUser(me);
      if (me.role !== "admin") {
        return;
      }

      const [usersResponse, adsResponse] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/ads")
      ]);

      if (usersResponse.ok) {
        const usersData = (await usersResponse.json()) as AdminUser[];
        setUsers(usersData);
      }

      if (adsResponse.ok) {
        const adsData = (await adsResponse.json()) as AdminAd[];
        setAds(adsData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] px-6 py-20 text-center text-slate-500">
        Carregando painel admin...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Acesso necessário</h1>
        <p className="mt-2 text-slate-500">Entre para acessar o painel administrativo.</p>
        <Link
          href="/auth"
          className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white"
        >
          Ir para login
        </Link>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F1F5F9] px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Acesso restrito</h1>
        <p className="mt-2 text-slate-500">Seu perfil não possui permissão para o admin.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white"
        >
          Voltar para o início
        </Link>
      </div>
    );
  }

  const userRows = users.map((item) => ({
    ...item,
    status: "ACTIVE" as const,
    contact: item.whatsapp
      ? `Whats: ${item.whatsapp}`
      : item.phone
      ? `Tel: ${item.phone}`
      : "-",
    cityLabel: item.city || item.state ? `${item.city ?? ""} ${item.state ?? ""}` : "-"
  }));

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-800 flex overflow-hidden">
      <div
        className={`fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        onMouseEnter={() => !isPinned && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed lg:fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 shadow-2xl lg:shadow-xl
          transition-all duration-300 ease-in-out flex flex-col h-full
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isExpanded ? "w-[270px]" : "lg:w-[80px]"}
        `}
      >
        <div
          className={`h-16 flex items-center border-b border-slate-100 bg-white shrink-0 transition-all ${
            isExpanded ? "px-5 justify-between" : "px-0 justify-center"
          }`}
        >
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ${
              isExpanded ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center mr-3 shadow-md shadow-orange-200 text-white shrink-0">
              <Layers size={18} strokeWidth={3} />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-bold text-lg text-slate-800 tracking-tight leading-none">
                Antly<span className="text-orange-600">Admin</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Painel Gestor v2.0
              </span>
            </div>
          </div>

          {!isExpanded && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 text-white animate-in zoom-in duration-300">
              <span className="font-bold text-xl">A</span>
            </div>
          )}

          {isExpanded && (
            <button
              onClick={() => {
                setIsPinned(!isPinned);
                // setIsHovered(false); // Removido para evitar fechamento abrupto ao desafixar
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors ml-2 hidden lg:block"
              title={isPinned ? "Desafixar Menu (Minimizar)" : "Fixar Menu"}
            >
              {isPinned ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar hover:custom-scrollbar-visible overflow-x-hidden">
          <div
            className={`px-5 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest transition-opacity duration-300 ${
              !isExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Principal
          </div>

          <SidebarItem
            icon={LayoutDashboard}
            label="Visão Geral"
            isCollapsed={!isExpanded}
            onSubItemClick={setActiveView}
            subItems={[
              { label: "Dashboard", active: activeView === "Dashboard" },
              { label: "Anúncios pendentes", count: pendingCount, isDanger: pendingCount > 0, active: activeView === "Anúncios pendentes" },
              { label: "Ativos / Rejeitados", active: activeView === "Ativos / Rejeitados" },
              { label: "Novos cadastros", active: activeView === "Novos cadastros" },
              { label: "Denúncias abertas", count: reportedCount, isDanger: reportedCount > 0, active: activeView === "Denúncias abertas" },
              { label: "Faturamento", active: activeView === "Faturamento" },
              { label: "Gráfico de acessos", active: activeView === "Gráfico de acessos" }
            ]}
          />

          <SidebarItem
            icon={Users}
            label="Usuários"
            isActive={
              activeView === "Lista de usuários" ||
              activeView === "Perfil do usuário" ||
              activeView === "Histórico de anúncios" ||
              activeView === "Avaliações recebidas" ||
              activeView === "Denúncias sofridas" ||
              activeView === "Bloqueios e suspensões" ||
              activeView === "Verificação / Reset"
            }
            isOpen
            isCollapsed={!isExpanded}
            onSubItemClick={setActiveView}
            subItems={[
              { label: "Lista de usuários", active: activeView === "Lista de usuários" },
              { label: "Perfil do usuário", active: activeView === "Perfil do usuário" },
              { label: "Histórico de anúncios", active: activeView === "Histórico de anúncios" },
              { label: "Avaliações recebidas", active: activeView === "Avaliações recebidas" },
              { label: "Denúncias sofridas", active: activeView === "Denúncias sofridas" },
              { label: "Bloqueios e suspensões", active: activeView === "Bloqueios e suspensões" },
              { label: "Verificação / Reset", active: activeView === "Verificação / Reset" }
            ]}
          />

          <div
            className={`mt-6 px-5 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest transition-opacity duration-300 ${
              !isExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Operacional
          </div>

          <SidebarItem
            icon={Megaphone}
            label="Anúncios"
            alertCount={pendingCount}
            isCollapsed={!isExpanded}
            onSubItemClick={setActiveView}
            subItems={[
              { label: "Anúncios pendentes", count: pendingCount, isDanger: pendingCount > 0, active: activeView === "Anúncios pendentes" },
              { label: "Anúncios aprovados", active: activeView === "Anúncios aprovados" },
              { label: "Anúncios recusados", active: activeView === "Anúncios recusados" },
              { label: "Anúncios expirados", active: activeView === "Anúncios expirados" },
              { label: "Anúncios denunciados", count: reportedCount, active: activeView === "Anúncios denunciados" },
              { label: "Destaques / Patrocinados", active: activeView === "Destaques / Patrocinados" }
            ]}
          />

          <SidebarItem
            icon={Layers}
            label="Categorias & Tags"
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Categorias principais" },
              { label: "Subcategorias" },
              { label: "Tags / Palavras-chave" },
              { label: "Ordem de exibição" }
            ]}
          />

          <SidebarItem
            icon={ShieldAlert}
            label="Moderação"
            alertCount={reportedCount}
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Denúncias de anúncios", count: reportedCount, isDanger: reportedCount > 0 },
              { label: "Denúncias de usuários", count: 2 },
              { label: "Histórico de decisões" },
              { label: "Motivos padrões" },
              { label: "Lista negra / Fraude" }
            ]}
          />

          <div
            className={`mt-6 px-5 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest transition-opacity duration-300 ${
              !isExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Suporte & Financeiro
          </div>

          <SidebarItem
            icon={MessageSquare}
            label="Mensagens & SAC"
            alertCount={ticketCount}
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Tickets abertos", count: ticketCount, isDanger: ticketCount > 0 },
              { label: "Tickets em andamento" },
              { label: "Tickets resolvidos" },
              { label: "Chat interno" },
              { label: "Mensagens automáticas" }
            ]}
          />

          <SidebarItem
            icon={Star}
            label="Avaliações"
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Avaliações recebidas" },
              { label: "Avaliações denunciadas" },
              { label: "Média por usuário" },
              { label: "Comentários ofensivos" }
            ]}
          />

          <SidebarItem
            icon={CreditCard}
            label="Financeiro"
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Planos disponíveis" },
              { label: "Assinaturas ativas" },
              { label: "Histórico pagamentos" },
              { label: "Reembolsos" },
              { label: "Cupons e promoções" }
            ]}
          />

          <SidebarItem
            icon={BarChart3}
            label="Relatórios"
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Relatório de anúncios" },
              { label: "Relatório de usuários" },
              { label: "Conversão / Funil" },
              { label: "Receita mensal" },
              { label: "Anúncios rejeitados" }
            ]}
          />

          <div
            className={`mt-6 px-5 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest transition-opacity duration-300 ${
              !isExpanded ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Configurações
          </div>

          <SidebarItem
            icon={Settings}
            label="Sistema"
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Regras de publicação" },
              { label: "Tempo de aprovação" },
              { label: "Palavras proibidas" },
              { label: "Limites por usuário" },
              { label: "Upload / Imagens" },
              { label: "SEO e URLs" },
              { label: "Integrações (API)" },
              { label: "Idioma / Localização" }
            ]}
          />

          <SidebarItem
            icon={ShieldCheck}
            label="Admin & Segurança"
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Usuários administradores" },
              { label: "Perfis de acesso" },
              { label: "Logs / Auditoria" },
              { label: "IPs Bloqueados" },
              { label: "2FA / Segurança" }
            ]}
          />

          <SidebarItem
            icon={Globe}
            label="Site Institucional"
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Páginas e Termos" },
              { label: "Banners Home" },
              { label: "Blog / Artigos" },
              { label: "FAQ / Ajuda" }
            ]}
          />

          <SidebarItem
            icon={PlusCircle}
            label="Extras"
            isCollapsed={!isExpanded}
            subItems={[
              { label: "Análise antifraude" },
              { label: "Lista negra telefones" },
              { label: "Exportação CSV" },
              { label: "Backup dados" },
              { label: "LGPD / Privacidade" }
            ]}
          />

          <div className="h-8" />
        </div>

        <div
          className={`p-3 border-t border-slate-200 bg-slate-50 shrink-0 transition-all ${
            isExpanded ? "" : "flex justify-center"
          }`}
        >
          <button
            className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white hover:shadow-md transition-all group border border-transparent hover:border-slate-100 ${
              isExpanded ? "text-left" : "justify-center"
            }`}
          >
            <Avatar name={user.name} collapsed={!isExpanded} />
            <div
              className={`flex-1 min-w-0 transition-all duration-300 ${
                isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 hidden"
              }`}
            >
              <p className="text-sm font-bold text-slate-700 truncate group-hover:text-orange-600 transition-colors">
                {user.name}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Super Admin</p>
              </div>
            </div>
            {isExpanded && <LogOut size={16} className="text-slate-400 group-hover:text-red-500 transition-colors" />}
          </button>
        </div>
      </aside>

      <div
        className={`
          flex-1 flex flex-col min-w-0 h-screen transition-all duration-300 ease-in-out
          ${isPinned ? "lg:ml-[270px]" : "lg:ml-[80px]"}
        `}
      >
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden md:flex flex-col">
              <h1 className="text-lg font-bold text-slate-800 leading-tight">Olá, {user.name}</h1>
              <span className="text-xs text-slate-500">Quinta-feira, 29 de Janeiro</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100/50 border border-slate-200 rounded-full px-4 py-2 w-72 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-300 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar usuário, anúncio, ID..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-600 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <button className="relative p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors">
                <Mail size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
              </button>
              <button className="relative p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8 bg-[#F1F5F9]">
          {activeView === "Lista de usuários" && <UsersView userRows={userRows} />}
          {activeView === "Anúncios pendentes" && <PendingAdsView ads={ads} />}
          {activeView !== "Lista de usuários" && activeView !== "Anúncios pendentes" && (
            <PlaceholderView title={activeView} />
          )}
        </div>
      </div>
    </div>
  );
}
