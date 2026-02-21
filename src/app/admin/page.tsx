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
  Image as ImageIcon,
  ArrowUpRight,
  ArrowRight,
  MoreHorizontal,
  PieChart as PieChartIcon,
  TrendingUp,
  Sparkles,
  Award,
  DollarSign,
  Calendar,
  Briefcase,
  Zap,
  Activity,
  AlertCircle,
  Crown,
} from "lucide-react";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "client" | "provider" | "admin";
  created_at?: string;
  phone?: string | null;
  whatsapp?: string | null;
  city?: string | null;
  state?: string | null;
  category?: string | null;
  cpf?: string | null;
  profileUrl?: string | null;
  serviceType?: string | null;
  hasCnpj?: boolean | null;
  issuesInvoice?: boolean | null;
  attendsOtherCities?: boolean | null;
  serviceRadius?: number | null;
  experience?: string | null;
  availability?: string[] | null;
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
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  isActive?: boolean;
  subItems?: Array<{
    label: string;
    value?: string;
    active?: boolean;
    count?: number;
    isDanger?: boolean;
    onClick?: () => void;
  }>;
  onSubItemClick?: (value: string) => void;
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
          flex items-center px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-all duration-200 select-none
          ${isActive
            ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-700 shadow-sm border border-orange-200/50"
            : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-800"}
          ${isCollapsed ? "justify-center px-2" : "justify-between"}
        `}
        title={isCollapsed ? label : ""}
      >
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? "w-auto" : "flex-1"}`}>
          <div className={`${isActive ? "p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20" : ""}`}>
            <Icon
              size={isCollapsed ? 22 : isActive ? 14 : 18}
              className={`shrink-0 transition-all ${
                isActive
                  ? ""
                  : "text-slate-400 group-hover/item:text-slate-600"
              }`}
            />
          </div>
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
              <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg shadow-red-500/20">
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
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full border-2 border-white shadow-lg" />
        )}
      </div>

      {showSubmenu && (
        <div className="ml-5 pl-3 border-l-2 border-orange-100 mt-1 mb-2 space-y-0.5 animate-fade-in">
          {subItems.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                if (item.onClick) item.onClick();
                if (onSubItemClick) onSubItemClick(item.value || item.label);
              }}
              className={`
                flex items-center justify-between text-[11px] py-2 px-3 rounded-lg cursor-pointer transition-all
                ${item.active
                  ? "text-orange-700 font-semibold bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
              `}
            >
              <span className="truncate">{item.label}</span>
              {item.count && item.count > 0 && (
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    item.isDanger ? "bg-gradient-to-r from-red-100 to-rose-100 text-red-600" : "bg-slate-100 text-slate-500"
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

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    ACTIVE: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/10",
    SUSPENDED: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-500/10",
    BLOCKED: "bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-200 shadow-sm shadow-orange-500/10",
    BANNED: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 shadow-sm shadow-red-500/10",
    PENDING: "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200 shadow-sm"
  };

  const icons: Record<string, React.ReactNode> = {
    ACTIVE: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>,
    SUSPENDED: <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1"></span>,
    BLOCKED: <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1"></span>,
    BANNED: <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>,
    PENDING: <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1"></span>
  };

  const labels: Record<string, string> = {
    ACTIVE: "Ativo",
    SUSPENDED: "Suspenso",
    BLOCKED: "Bloqueado",
    BANNED: "Banido",
    PENDING: "Pendente"
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
        styles[status] || styles.PENDING
      }`}
    >
      {icons[status]}
      {labels[status] || status}
    </span>
  );
};

const UserBadge = ({ role }: { role: string }) => {
  if (!role) return null;
  const isAdmin = role.toUpperCase() === "ADMIN";
  const isProvider = role.toUpperCase() === "PROVIDER";
  
  const badgeStyles = isAdmin 
    ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md shadow-purple-500/20" 
    : isProvider 
      ? "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200"
      : "bg-slate-100 text-slate-600";
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${badgeStyles}`}>
      {isAdmin && <Crown size={12} />}
      {isProvider && <Briefcase size={10} />}
      {isAdmin ? "Admin" : role.toUpperCase() === "CLIENT" ? "Cliente" : "Prestador"}
    </span>
  );
};

const Avatar = ({ name, url, collapsed, size = 'md' }: { name: string; url?: string; collapsed?: boolean; size?: 'sm' | 'md' | 'lg' }) => {
  const safeName = name || "Usuario";
  const initials = safeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: collapsed ? 'w-10 h-10 text-sm' : 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm'
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${currentSizeClass} rounded-xl border-2 border-white shadow-lg shadow-slate-200/50 object-cover ring-2 ring-slate-100`}
      />
    );
  }

  return (
    <div
      className={`
      rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-white shadow-lg shadow-slate-200/50 flex items-center justify-center text-slate-600 font-bold shrink-0 select-none transition-all ring-2 ring-slate-100
      ${currentSizeClass}
      ${collapsed ? "bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 ring-orange-100" : ""}
    `}
    >
      {initials}
    </div>
  );
};



const LevelBadge = ({ level }: { level: string }) => {
  const styles: any = {
    Gratuito: "bg-slate-100 text-slate-600",
    Premium: "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md shadow-purple-500/20",
    Verificado: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/20"
  };
  const icons: any = {
    Gratuito: null,
    Premium: <Crown size={10} className="mr-1" />,
    Verificado: <ShieldCheck size={10} className="mr-1" />
  };
  return (
    <span className={`inline-flex items-center text-[10px] uppercase font-bold px-2 py-1 rounded-lg ${styles[level] || styles.Gratuito}`}>
       {icons[level]}
       {level}
    </span>
  )
}

const UsersView = ({ userRows }: { userRows: any[] }) => (
  <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
    {/* Header Premium */}
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
      <div className="absolute top-4 right-4 w-24 h-24 border border-white/10 rounded-full"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border border-white/10 rounded-full"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-orange-400" />
            <span className="text-orange-400 text-sm font-bold uppercase tracking-wider">Gestão de Usuários</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Base de Usuários</h2>
          <p className="text-slate-400 mt-2">Gerencie todos os usuários da plataforma</p>
        </div>

        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 text-sm font-medium transition-all">
             <Filter size={16} />
             <span>Filtros</span>
           </button>
           <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 text-sm font-bold transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5">
             <Download size={16} />
             <span>Exportar</span>
           </button>
        </div>
      </div>
    </div>

    {/* Filtros Avançados Premium */}
    <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
           <label className="text-xs font-bold text-slate-600 mb-2 block">Buscar</label>
           <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="text" placeholder="Nome, email ou ID..." className="w-full pl-11 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 transition-all"/>
           </div>
        </div>
        
        <div className="w-44">
           <label className="text-xs font-bold text-slate-600 mb-2 block">Tipo de Usuário</label>
           <select className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-600 focus:outline-none focus:border-orange-400 cursor-pointer transition-all">
              <option>Todos</option>
              <option>Prestador</option>
              <option>Cliente</option>
              <option>Ambos</option>
           </select>
        </div>

        <div className="w-44">
           <label className="text-xs font-bold text-slate-600 mb-2 block">Status</label>
           <select className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-600 focus:outline-none focus:border-orange-400 cursor-pointer transition-all">
              <option>Todos</option>
              <option>Ativo</option>
              <option>Suspenso</option>
              <option>Bloqueado</option>
              <option>Banido</option>
           </select>
        </div>

         <div className="w-44">
           <label className="text-xs font-bold text-slate-600 mb-2 block">Nível</label>
           <select className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-600 focus:outline-none focus:border-orange-400 cursor-pointer transition-all">
              <option>Todos</option>
              <option>Gratuito</option>
              <option>Premium</option>
              <option>Verificado</option>
           </select>
        </div>

        <button className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl text-sm font-bold hover:from-slate-900 hover:to-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20">
           <Filter size={16} /> Aplicar
        </button>
    </div>

    <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Activity size={18} className="text-orange-500" />
          Listagem Completa
        </h3>
        <span className="text-xs bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1.5 rounded-lg text-orange-700 font-bold shadow-sm">{userRows.length} registros</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
              <th className="py-4 px-4 w-10 text-center"><input type="checkbox" className="rounded border-slate-300 text-orange-600 focus:ring-orange-200" /></th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Usuário / ID</th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Perfil & Nível</th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confiança</th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Detalhes</th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Anúncios</th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avaliação</th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cadastro / Acesso</th>
              <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {userRows.map((row) => (
              <tr key={row.id} className="hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-amber-50/20 transition-all group">
                <td className="py-4 px-4 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-orange-600 focus:ring-orange-200" />
                </td>
                
                {/* Usuário / ID */}
                <td className="py-4 px-4 max-w-[250px]">
                  <div className="flex items-center gap-3">
                    <Avatar name={row.name} size="sm" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-sm text-slate-800 truncate group-hover:text-orange-700 transition-colors" title={row.name}>{row.name}</span>
                         <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">#{row.id}</span>
                      </div>
                      <span className="text-xs text-slate-400 truncate" title={row.email}>{row.email}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded"><MapPin size={10}/> {row.cityLabel}</span>
                        {row.contact !== "-" && <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded">{row.contact}</span>}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Perfil & Nível */}
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-2 items-start">
                     <UserBadge role={row.role} />
                     <LevelBadge level={row.accountLevel} />
                  </div>
                </td>

                {/* Confiança */}
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-1.5">
                     <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg w-fit ${
                        row.reliabilityScore >= 70 ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700" :
                        row.reliabilityScore >= 50 ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700" :
                        "bg-gradient-to-r from-red-100 to-rose-100 text-red-700"
                     }`}>
                        {row.reliabilityScore}%
                     </span>
                     {row.cpfValid && <span className="text-[9px] text-green-600 flex items-center gap-1 font-bold bg-green-50 px-2 py-0.5 rounded"><ShieldCheck size={10}/> CPF Válido</span>}
                  </div>
                </td>
                
                {/* Detalhes */}
                <td className="py-4 px-4">
                   <div className="flex flex-wrap items-center gap-1">
                      {row.hasCnpj && <span title="Possui CNPJ" className="text-[9px] font-bold text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-1.5 py-0.5 rounded-lg border border-blue-100">CNPJ</span>}
                      {row.issuesInvoice && <span title="Emite Nota Fiscal" className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1 rounded border border-purple-100">NF</span>}
                      {(row.serviceRadius || 0) > 0 && <span title={`Raio: ${row.serviceRadius}km`} className="text-[9px] text-slate-500 bg-slate-100 px-1 rounded flex items-center gap-0.5 border border-slate-200"><MapPin size={8}/> {row.serviceRadius}km</span>}
                   </div>
                   <div className="text-[10px] text-slate-400 mt-1 max-w-[120px] truncate leading-tight" title={row.category || "Sem Categoria"}>{row.category || "-"}</div>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <StatusBadge status={row.status} />
                </td>

                {/* Anúncios */}
                <td className="py-3 px-4">
                   <div className="text-sm font-medium text-slate-700 text-center w-8">
                      {row.activeAdsCount > 0 ? row.activeAdsCount : <span className="text-slate-300">-</span>}
                   </div>
                </td>

                 {/* Avaliação */}
                <td className="py-3 px-4">
                   {row.rating !== "-" ? (
                     <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400"/>
                        <span className="text-sm font-bold text-slate-700">{row.rating}</span>
                     </div>
                   ) : <span className="text-slate-300 text-xs">-</span>}
                </td>

                {/* Datas */}
                <td className="py-3 px-4">
                   <div className="flex flex-col text-xs">
                      <span className="text-slate-600">Cad: {row.created_at ? new Date(row.created_at).toLocaleDateString('pt-BR') : "-"}</span>
                      <span className="text-slate-400 text-[10px]">Último: {row.lastAccess}</span>
                   </div>
                </td>

                {/* Ações */}
                <td className="py-3 px-4 text-right relative">
                  <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Ver Perfil">
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Mensagem">
                       <MessageSquare size={16} />
                    </button>
                    
                    <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors">
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


const AdsStatsView = ({ ads }: { ads: AdminAd[] }) => {
  const total = ads.length || 1;
  const pending = ads.filter(a => a.status === "Em Analise").length;
  const active = ads.filter(a => a.status === "Postado").length;
  const rejected = ads.filter(a => a.status === "Reprovado").length;
  // Simulação de expirados (já que não tem status na API)
  const expired = 0;

  const pendingPct = Math.round((pending / total) * 100);
  const activePct = Math.round((active / total) * 100);
  const rejectedPct = Math.round((rejected / total) * 100);
  const expiredPct = 0;

  // Calculando para gráfico de pizza (CSS Conic Gradient)
  const p1 = activePct;
  const p2 = p1 + pendingPct;
  const p3 = p2 + rejectedPct;

  // -------------------------------------------------------------
  // Cálculos reais de Categorias
  // -------------------------------------------------------------
  
  // 1. Agrupar anúncios por categorias reais
  const categoryCounts = ads.reduce((acc, curr) => {
    const cat = curr.category || "Sem Categoria";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Transformar em array e ordenar por contagem
  const sortedCategories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 3. Pegar top 5
  const topCategories = sortedCategories.slice(0, 5);
  
  // 4. Maior valor para barra de progresso (normalizar em 100%)
  const maxCount = topCategories[0]?.count || 1;

  // 5. Insights rápidos reais
  // Categoria com maior volume
  const topVolumeCat = topCategories[0]?.name || "-";
  
  // Categoria com maior rejeição (cálculo extra)
  const rejectedByCat = ads
    .filter(a => a.status === "Reprovado")
    .reduce((acc, curr) => {
      const cat = curr.category || "Sem Categoria";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const mostRejectedCat = Object.entries(rejectedByCat)
    .sort((a, b) => b[1] - a[1])[0];
    
  const mostRejectedName = mostRejectedCat ? mostRejectedCat[0] : "-";
  const mostRejectedCount = mostRejectedCat ? mostRejectedCat[1] : 0;


  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Premium */}
      <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-8 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="absolute top-4 right-4 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
            <PieChartIcon size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Estatísticas de Anúncios</h2>
            <p className="text-white/70 mt-1">Panorama geral do volume e estado dos anúncios</p>
          </div>
        </div>
      </div>

      {/* Cards de KPIs Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Anúncios</p>
            <div className="flex items-baseline gap-2 mt-2">
               <h3 className="text-4xl font-bold text-white">{ads.length}</h3>
               <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                 <TrendingUp size={10} /> +15%
               </span>
            </div>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/25">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <CheckCircle size={16} />
              </div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Ativos</p>
            </div>
            <h3 className="text-4xl font-bold">{active}</h3>
            <p className="text-xs text-white/60 mt-1">{activePct}% do total</p>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/25">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Clock size={16} />
              </div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Pendentes</p>
            </div>
            <h3 className="text-4xl font-bold">{pending}</h3>
            <p className="text-xs text-white/60 mt-1">{pendingPct}% aguardando</p>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/25">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <XCircle size={16} />
              </div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Rejeitados</p>
            </div>
            <h3 className="text-4xl font-bold">{rejected}</h3>
            <p className="text-xs text-white/60 mt-1">{rejectedPct}% com problemas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Distribuição Premium */}
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 lg:col-span-1 flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold text-slate-800 mb-6 w-full text-left flex items-center gap-2">
              <Sparkles size={18} className="text-purple-500" />
              Distribuição
            </h3>
            
            <div className="relative w-52 h-52 rounded-full mb-6 shadow-2xl" 
                 style={{
                   background: `conic-gradient(
                     #10B981 0% ${p1}%, 
                     #F97316 ${p1}% ${p2}%, 
                     #EF4444 ${p2}% ${p3}%, 
                     #94A3B8 ${p3}% 100%
                   )`
                 }}>
               <div className="absolute inset-5 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="text-4xl font-bold text-slate-800">{ads.length}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total</span>
               </div>
            </div>

            <div className="w-full space-y-3">
               <div className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-md shadow-emerald-500/20" />
                     <span className="text-slate-600 font-medium">Ativos</span>
                  </div>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{activePct}%</span>
               </div>
               <div className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-orange-50 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 shadow-md shadow-orange-500/20" />
                     <span className="text-slate-600 font-medium">Pendentes</span>
                  </div>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{pendingPct}%</span>
               </div>
               <div className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-red-50 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-rose-500 shadow-md shadow-red-500/20" />
                     <span className="text-slate-600 font-medium">Rejeitados</span>
                  </div>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{rejectedPct}%</span>
               </div>
            </div>
        </div>

        {/* Gráfico de Barras - Categoria Premium */}
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 lg:col-span-2">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-500" />
                Top Categorias
              </h3>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-bold transition-colors">Ver todas →</button>
           </div>
           
           <div className="space-y-5">
              {topCategories.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <BarChart3 size={24} className="text-slate-300" />
                  </div>
                  Nenhuma categoria registrada
                </div>
              ) : (
                topCategories.map((cat, i) => {
                  const colors = [
                    'from-indigo-500 to-purple-500',
                    'from-blue-500 to-indigo-500',
                    'from-emerald-500 to-teal-500',
                    'from-orange-500 to-amber-500',
                    'from-pink-500 to-rose-500'
                  ];
                  return (
                      <div key={cat.name} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-700 font-bold">{cat.name}</span>
                            <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded">{cat.count} anúncios</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${colors[i] || colors[0]} rounded-full transition-all duration-1000 ease-out relative`}
                              style={{ width: `${(cat.count / maxCount) * 100}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                        </div>
                      </div>
                  )
                })
              )}
           </div>

           <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 p-5 rounded-xl border border-slate-100">
                 <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                   <Award size={12} className="text-indigo-500" /> Categoria Mais Popular
                 </h4>
                 <p className="text-lg font-bold text-slate-800 mt-2 truncate">{topVolumeCat}</p>
                 <p className="text-xs text-slate-400">Total: {topCategories[0]?.count || 0} anúncios</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-red-50/50 p-5 rounded-xl border border-slate-100">
                 <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                   <AlertCircle size={12} className="text-red-500" /> Maior Rejeição
                 </h4>
                 <p className="text-lg font-bold text-slate-800 mt-2 truncate">{mostRejectedName}</p>
                 <p className="text-xs text-slate-400">{mostRejectedCount} reprovados</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// VIEW: Estatísticas de Novos Cadastros 
// ------------------------------------------------------------------
const UsersStatsView = ({ users }: { users: AdminUser[] }) => {
  // 1. KPIs Básicos
  const total = users.length || 1;
  const providers = users.filter(u => u.role === "provider").length;
  const clients = users.filter(u => u.role === "client").length;
  const admins = users.filter(u => u.role === "admin").length;

  const providerPct = Math.round((providers / total) * 100);
  const clientPct = Math.round((clients / total) * 100);

  // Novos usuários (últimos 30 dias)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
  
  const newUsers = users.filter(u => {
      if (!u.created_at) return false;
      return new Date(u.created_at) >= thirtyDaysAgo;
  });
  const newUsersCount = newUsers.length;
  const growthRate = Math.round((newUsersCount / (total - newUsersCount || 1)) * 100);

  // 2. Distribuição por Cidade (Top 5)
  const cityCounts = users.reduce((acc, curr) => {
      if (curr.city) {
          const city = curr.city.trim() + (curr.state ? ` - ${curr.state}` : "");
          acc[city] = (acc[city] || 0) + 1;
      }
      return acc;
  }, {} as Record<string, number>);

  const topCities = Object.entries(cityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  
  const maxCityCount = topCities[0]?.count || 1;

  // 3. Categorias de Prestadores (Top 5)
  const providerCategories = users
      .filter(u => u.role === "provider" && u.category)
      .reduce((acc, curr) => {
          const cat = curr.category!;
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);

  const topProviderCategories = Object.entries(providerCategories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

  // 4. Últimos cadastros
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Premium */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="absolute top-4 right-4 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
            <Users size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Novos Cadastros e Usuários</h2>
            <p className="text-white/70 mt-1">Análise demográfica e crescimento da base</p>
          </div>
        </div>
      </div>

      {/* KPIs Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Base Total</p>
            <div className="flex items-baseline gap-2 mt-2">
               <h3 className="text-4xl font-bold text-white">{total}</h3>
               <span className="text-xs text-blue-400 font-bold bg-blue-400/10 px-2 py-1 rounded-full">
                 Ativos
               </span>
            </div>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/25">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Novos (30d)</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold">{newUsersCount}</h3>
              {growthRate > 0 && <span className="text-xs text-white/80 font-bold flex items-center gap-1"><TrendingUp size={10}/> +{growthRate}%</span>}
            </div>
            <p className="text-xs text-white/60 mt-1">Crescimento recente</p>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-purple-500 to-violet-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/25">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Briefcase size={16} />
              </div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Prestadores</p>
            </div>
            <h3 className="text-4xl font-bold">{providers}</h3>
            <p className="text-xs text-white/60 mt-1">{providerPct}% da base</p>
          </div>
        </div>
        
        <div className="group relative bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/25">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Users size={16} />
              </div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Clientes</p>
            </div>
            <h3 className="text-4xl font-bold">{clients}</h3>
            <p className="text-xs text-white/60 mt-1">{clientPct}% da base</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Cidades Premium */}
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 lg:col-span-1">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
               <MapPin size={16} className="text-blue-600"/>
             </div>
             Top Cidades
           </h3>
           <div className="space-y-5">
             {topCities.length === 0 ? (
               <p className="text-sm text-slate-400 text-center py-8">Nenhuma localização registrada.</p>
             ) : (
               topCities.map((city, i) => (
                 <div key={city.name} className="relative group/city hover:bg-blue-50/50 p-2 -mx-2 rounded-lg transition-colors">
                    <div className="flex justify-between text-sm mb-2 z-10 relative">
                        <span className="font-medium text-slate-700">{city.name}</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{city.count}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700" 
                         style={{ width: `${(city.count / maxCityCount) * 100}%` }} 
                       />
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Categorias de Prestadores Premium */}
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 lg:col-span-1">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-violet-100">
               <Tag size={16} className="text-purple-600"/>
             </div>
             Áreas de Atuação
           </h3>
           <div className="space-y-3">
             {topProviderCategories.length === 0 ? (
               <p className="text-sm text-slate-400 text-center py-8">Nenhuma categoria de prestador.</p>
             ) : (
               topProviderCategories.map((cat, i) => (
                 <div key={cat.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-purple-50/30 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors group/cat">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-purple-500/20">
                         {i + 1}
                       </div>
                       <span className="text-sm font-medium text-slate-700 group-hover/cat:text-purple-700 transition-colors">{cat.name}</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">{cat.count}</span>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Últimos Cadastros Premium */}
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 lg:col-span-1">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100">
                  <Clock size={16} className="text-emerald-600"/>
                </div>
                Recentes
              </h3>
              <button className="text-xs text-orange-600 font-bold hover:text-orange-700 transition-colors">Ver todos →</button>
           </div>
           <div className="space-y-4">
              {recentUsers.map(user => (
                <div key={user.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-amber-50/30 transition-colors border border-transparent hover:border-orange-100">
                   <Avatar name={user.name} size="sm" />
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 leading-none truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 mt-1 truncate">{user.email}</p>
                      <div className="flex gap-2 mt-2">
                         <BadgeRole role={user.role} />
                         {user.city && (
                           <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg flex items-center gap-1">
                             <MapPin size={8} /> {user.city}
                           </span>
                         )}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

// Helper simples para badge
const BadgeRole = ({ role }: { role: string }) => {
   const colors = {
     admin: "bg-red-100 text-red-700",
     provider: "bg-purple-100 text-purple-700",
     client: "bg-cyan-100 text-cyan-700"
   };
   const labels = {admin: "Admin", provider: "Prestador", client: "Cliente"};
   // @ts-ignore
   return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${colors[role] || "bg-slate-100"}`}>{labels[role] || role}</span>
}


const StatsDashboardView = ({ 
  users,
  ads,
  onNavigate 
}: { 
  users: AdminUser[];
  ads: AdminAd[];
  onNavigate: (view: string) => void;
}) => {
  const pendingCount = ads.filter(a => a.status === "Em Analise").length;
  const reportedCount = 0; // Ainda sem endpoint de denúncias
  const revenue = 0; // Faturamento zerado
  const activeAdsCount = ads.filter(a => a.status === "Postado").length;
  const rejectedAdsCount = ads.filter(a => a.status === "Reprovado").length;
  const totalAds = ads.length || 1; // evitar divisao por zero
  
  // Usuários
  const totalUsers = users.length;
  const newUsers = users.filter(u => {
    if (!u.created_at) return false;
    const date = new Date(u.created_at);
    // Últimos 30 dias
    const diffTime = Math.abs(Date.now() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 30;
  }).length;
  const onlineUsers = 0; // Real-time não disponível

  // Dados para gráfico (últimos 7 dias de anúncios)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("pt-BR", { weekday: 'short' });
  });

  return (
  <div className="space-y-8 animate-fade-in">
    {/* Header Premium */}
    <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 p-8 rounded-2xl shadow-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
      <div className="absolute top-4 right-4 w-24 h-24 border border-white/20 rounded-full"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
            <LayoutDashboard size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Dashboard Geral</h2>
            <p className="text-white/70 mt-1">Visão completa dos indicadores de desempenho</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm p-1.5 border border-white/20 rounded-xl">
          <button className="px-4 py-2 text-xs font-bold bg-white text-orange-600 rounded-lg shadow-lg">30 Dias</button>
          <button className="px-4 py-2 text-xs font-bold text-white/80 hover:text-white rounded-lg">7 Dias</button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>
    </div>

    {/* Cards Principais Premium */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      
      {/* Card Faturamento */}
      <div className="group relative bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/25">
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative">
           <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <CreditCard size={20} />
              </div>
           </div>
           <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider">Faturamento Mês</h3>
           <p className="text-3xl font-bold mt-2">
              {revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
           </p>
           <p className="text-xs text-white/60 mt-2">Sem histórico</p>
         </div>
      </div>

       {/* Card Online Agora */}
      <div className="group relative bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/25">
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative">
           <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Globe size={20} />
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-white/20 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Agora
              </span>
           </div>
           <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider">Usuários Online</h3>
           <p className="text-3xl font-bold mt-2">{onlineUsers}</p>
           <p className="text-xs text-white/60 mt-2">Tempo real</p>
         </div>
      </div>

      {/* Card Novos Usuários */}
      <div className="group relative bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/25">
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative">
           <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Users size={20} />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-white/20 px-2.5 py-1 rounded-full">
                <TrendingUp size={10} /> Novo
              </span>
           </div>
           <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider">Novos Cadastros</h3>
           <p className="text-3xl font-bold mt-2">{newUsers}</p>
           <p className="text-xs text-white/60 mt-2">Total Geral: {totalUsers}</p>
         </div>
      </div>

      {/* Card Anúncios Pendentes */}
      <div 
        onClick={() => onNavigate("MANAGE_ADS_PENDING")}
        className="group relative bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/25 cursor-pointer"
      >
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="relative">
           <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Clock size={20} />
              </div>
              {pendingCount > 0 && <span className="flex items-center gap-1 text-[10px] font-bold bg-white text-orange-600 px-2.5 py-1 rounded-full shadow-lg animate-pulse">
                <AlertCircle size={10} /> Ação
              </span>}
           </div>
           <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider">Anúncios Pendentes</h3>
           <p className="text-3xl font-bold mt-2">{pendingCount}</p>
           <p className="text-xs text-white/60 mt-2 group-hover:text-white flex items-center gap-1 transition-colors">
              Revisar agora <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
           </p>
         </div>
      </div>

      {/* Card Denúncias */}
      <div className="group relative bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl shadow-xl text-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/25">
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative">
           <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
           </div>
           <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider">Denúncias Abertas</h3>
           <p className="text-3xl font-bold mt-2">{reportedCount}</p>
           <p className="text-xs text-white/60 mt-2">Requer atenção</p>
         </div>
      </div>
    </div>

    {/* Seção Central: Gráficos e Status de Anúncios */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
       
       {/* Gráfico Principal Premium */}
       <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 size={20} className="text-orange-500" />
                  Novos Anúncios (7 Dias)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Volume de entrada de anúncios na plataforma</p>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500"></span>
               <span className="text-xs text-slate-500 font-medium">Anúncios</span>
             </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4 border-b border-slate-100 h-64">
             {last7Days.map((day, i) => {
               const height = Math.random() * 80 + 10;
               return (
                 <div key={i} className="flex-1 flex flex-col justify-end group cursor-pointer items-center relative">
                    <div 
                      className="w-full max-w-[50px] bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-lg transition-all relative overflow-hidden shadow-lg shadow-orange-500/20"
                      style={{ height: `${height}%` }} 
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg pointer-events-none transition-all shadow-lg z-10">
                      <div className="font-bold">{Math.round(height)} ads</div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-slate-800"></div>
                    </div>
                    <span className="mt-3 text-xs text-slate-400 font-medium">{day}</span>
                 </div>
               );
             })}
          </div>
       </div>

       {/* Status Geral de Anúncios Premium */}
       <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-500" />
            Status dos Anúncios
          </h3>
          <p className="text-xs text-slate-400 mb-6">Visão geral total: <span className="font-bold text-slate-600">{totalAds}</span></p>
          
          <div className="space-y-6 flex-1">
             <div className="space-y-2 p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-green-50/30 hover:from-emerald-50 hover:to-green-50 transition-colors">
                <div className="flex justify-between text-xs font-medium">
                   <span className="text-emerald-700 flex items-center gap-2 font-bold">
                     <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-md shadow-emerald-500/30"></div>
                     Ativos
                   </span>
                   <span className="text-slate-600 bg-white px-2 py-0.5 rounded-lg shadow-sm">{activeAdsCount} ({((activeAdsCount/totalAds)*100).toFixed(1)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-700 relative" style={{ width: `${(activeAdsCount/totalAds)*100}%` }}>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                   </div>
                </div>
             </div>

             <div className="space-y-2 p-3 rounded-xl bg-gradient-to-r from-orange-50/50 to-amber-50/30 hover:from-orange-50 hover:to-amber-50 transition-colors">
                <div className="flex justify-between text-xs font-medium">
                   <span className="text-orange-700 flex items-center gap-2 font-bold">
                     <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 shadow-md shadow-orange-500/30 animate-pulse"></div>
                     Pendentes
                   </span>
                   <span className="text-slate-600 bg-white px-2 py-0.5 rounded-lg shadow-sm">{pendingCount} ({((pendingCount/totalAds)*100).toFixed(1)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700" style={{ width: `${(pendingCount/totalAds)*100}%` }}></div>
                </div>
             </div>

             <div className="space-y-2 p-3 rounded-xl bg-gradient-to-r from-red-50/50 to-rose-50/30 hover:from-red-50 hover:to-rose-50 transition-colors">
                <div className="flex justify-between text-xs font-medium">
                   <span className="text-red-600 flex items-center gap-2 font-bold">
                     <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-rose-500 shadow-md shadow-red-500/30"></div>
                     Rejeitados
                   </span>
                   <span className="text-slate-600 bg-white px-2 py-0.5 rounded-lg shadow-sm">{rejectedAdsCount} ({((rejectedAdsCount/totalAds)*100).toFixed(1)}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-700" style={{ width: `${(rejectedAdsCount/totalAds)*100}%` }}></div>
                </div>
             </div>
          </div>
       </div>
    </div>

    {/* Acesso Rápido Premium */}
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4 px-1 flex items-center gap-2">
        <Zap size={18} className="text-orange-500" />
        Acesso Rápido
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
         {[
           { icon: Megaphone, label: "Gerenciar Anúncios", view: "MANAGE_ADS_APPROVED", gradient: "from-blue-500 to-indigo-500", shadow: "shadow-blue-500/20" },
           { icon: Users, label: "Base de Usuários", view: "Lista de usuários", gradient: "from-indigo-500 to-purple-500", shadow: "shadow-indigo-500/20" },
           { icon: CreditCard, label: "Financeiro", view: "STATS_REVENUE", gradient: "from-emerald-500 to-green-500", shadow: "shadow-emerald-500/20" },
           { icon: ShieldCheck, label: "Moderação", view: "MANAGE_ADS_REPORTED", gradient: "from-red-500 to-rose-500", shadow: "shadow-red-500/20" },
           { icon: Settings, label: "Configurações", view: "Sistema", gradient: "from-slate-600 to-slate-700", shadow: "shadow-slate-500/20" },
           { icon: Globe, label: "Site Principal", view: "Site Institucional", gradient: "from-purple-500 to-violet-500", shadow: "shadow-purple-500/20" },
         ].map((item, idx) => (
           <button 
             key={idx}
             onClick={() => onNavigate(item.view)}
             className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:-translate-y-1 transition-all"
           >
              <div className={`p-3 rounded-xl mb-3 bg-gradient-to-br ${item.gradient} text-white shadow-lg ${item.shadow} group-hover:scale-110 transition-transform`}>
                 <item.icon size={22} />
              </div>
              <span className="text-xs font-bold text-slate-700 text-center group-hover:text-orange-600 transition-colors">{item.label}</span>
           </button>
         ))}
      </div>
    </div>
  </div>
)};

const PendingAdsView = ({
  ads,
  onApprove,
  onReject,
  onApproveAll,
  updatingAdId,
  isApprovingAll,
}: {
  ads: AdminAd[];
  onApprove: (adId: number) => void;
  onReject: (adId: number) => void;
  onApproveAll: () => void;
  updatingAdId: number | null;
  isApprovingAll: boolean;
}) => {
  const pendingAds = ads.filter((ad) => ad.status === "Em Analise");
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Premium */}
      <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="absolute top-4 right-4 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} className="animate-pulse" />
                Moderação
              </span>
              <span className="text-white/40">/</span>
              <span className="text-xs font-medium text-white/70">Anúncios</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Anúncios Pendentes</h2>
            <p className="text-white/70 mt-2 flex items-center gap-2">
              Existem <span className="font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-full">{pendingAds.length} anúncios</span> aguardando sua aprovação.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 text-sm font-bold transition-all">
              <Clock size={16} />
              <span>Mais recentes</span>
            </button>
            <button
              onClick={onApproveAll}
              disabled={isApprovingAll || pendingAds.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 rounded-xl hover:bg-white/90 text-sm font-bold transition-all shadow-lg shadow-black/10 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CheckCircle size={16} />
              <span>{isApprovingAll ? "Aprovando..." : "Aprovar Todos"}</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Cards Premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {pendingAds.map((ad) => (
          <div key={ad.id} className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col overflow-hidden group">
            
            {/* Topo do Card: Imagem e Badges */}
            <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
               <div className="flex flex-col items-center text-slate-300 gap-1">
                  <ImageIcon size={32} />
                  <span className="text-[10px] font-medium">Sem imagem</span>
                </div>
              
              {/* Badge de Categoria Premium */}
              <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 flex items-center gap-1.5">
                <Tag size={10} />
                {ad.category || "Geral"}
              </div>

              {/* Badge de Data */}
              <div className="absolute top-3 right-3 bg-slate-800/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-medium text-white flex items-center gap-1.5 shadow-lg">
                <Clock size={10} />
                {new Date(ad.created_at).toLocaleDateString("pt-BR")}
              </div>
              
              {/* Decorative corner */}
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-500/10 to-transparent"></div>
            </div>

            {/* Corpo do Card */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors" title={ad.title}>
                  {ad.title}
                </h3>
              </div>
              
              <p className="text-base font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">R$ --,--</p>
              
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3 line-clamp-2 flex-1">
                {ad.description}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3 bg-gradient-to-r from-slate-50 to-slate-100/50 p-2 rounded-lg border border-slate-100">
                <MapPin size={12} className="text-slate-400" />
                Local não informado
              </div>

              {/* Info do Vendedor Premium */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="relative">
                  <Avatar name={ad.user_name} size="sm" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-slate-700 truncate">{ad.user_name}</span>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] text-slate-400 font-medium">4.8</span>
                    <span className="text-slate-300 text-[10px]">•</span>
                    <span className="text-[10px] text-slate-400">Verificado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé de Ações Premium */}
            <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 border-t border-slate-100 grid grid-cols-3 gap-2">
               <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all text-[11px] font-bold shadow-sm">
                <Eye size={14} />
                Ver
              </button>
              <button
                onClick={() => onReject(ad.id)}
                disabled={updatingAdId === ad.id}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 transition-all text-[11px] font-bold shadow-lg shadow-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <XCircle size={14} />
                {updatingAdId === ad.id ? "..." : "Rejeitar"}
              </button>
              <button
                onClick={() => onApprove(ad.id)}
                disabled={updatingAdId === ad.id}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-all text-[11px] font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <CheckCircle size={14} />
                {updatingAdId === ad.id ? "..." : "Aprovar"}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Estado Vazio Premium */}
      {pendingAds.length === 0 && (
        <div className="relative flex flex-col items-center justify-center py-20 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-300 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30 rotate-3">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles size={20} className="text-emerald-500" />
              Tudo limpo por aqui!
            </h3>
            <p className="text-slate-600 text-sm mt-2 max-w-md text-center">Não há novos anúncios aguardando aprovação no momento. Ótimo trabalho!</p>
            
            <div className="flex items-center gap-3 mt-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">✓</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">✓</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">✓</div>
              </div>
              <span className="text-xs text-slate-500 font-medium">Todos os anúncios foram revisados</span>
            </div>
          </div>
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

const isValidCPF = (cpf: string | null | undefined) => {
  if (typeof cpf !== "string") return false;
  const cleanCPF = cpf.replace(/[^\d]+/g, "");
  if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/)) return false;
  
  const validateDigit = (t: number) => {
    let d = 0;
    let c = 0;
    for (t; t >= 2; t--) {
        d += parseInt(cleanCPF.substring(c, c + 1)) * t;
        c++;
    }
    d = (d * 10) % 11;
    if (d === 10 || d === 11) d = 0;
    return d;
  }

  if (validateDigit(10) !== parseInt(cleanCPF.substring(9, 10))) return false;
  if (validateDigit(11) !== parseInt(cleanCPF.substring(10, 11))) return false;
  return true;
};

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
  const [updatingAdId, setUpdatingAdId] = useState<number | null>(null);
  const [isApprovingAll, setIsApprovingAll] = useState(false);

  const pendingCount = useMemo(
    () => ads.filter((ad) => ad.status === "Em Analise").length,
    [ads]
  );

  const userRows = useMemo(() => users.map((item) => {
    // Score Calculation
    let score = 0;
    if (isValidCPF(item.cpf)) score += 25;
    if (item.phone) score += 15;
    if (item.email) score += 5;
    if (item.profileUrl) score += 10;
    if (item.category) score += 5;
    if (item.city && (item.serviceRadius || 0) > 0) score += 10;
    if (item.serviceType) score += 5;
    if (item.experience) score += 10;
    if (item.availability && item.availability.length > 0) score += 5;

    const reliabilityScore = Math.min(100, score);

    // Simulating extra data based on ID for consistency
    const statuses = ["ACTIVE", "SUSPENDED", "BLOCKED", "BANNED"];
    const levels = ["Gratuito", "Premium", "Verificado"];
    
    // Deterministic pseudo-random
    const mod = item.id % 10; 
    const isPremium = mod > 7;
    const statusIndex = mod === 0 ? 2 : mod === 1 ? 1 : 0; 
    
    // Last access date simulation
    const lastAccess = new Date();
    lastAccess.setHours(lastAccess.getHours() - (item.id % 48));

    return {
      ...item,
      status: statuses[statusIndex] as "ACTIVE" | "SUSPENDED" | "BLOCKED" | "BANNED",
      accountLevel: levels[item.id % 3],
      activeAdsCount: item.role === 'provider' ? (item.id % 5) : 0,
      rating: item.role === 'provider' ? (4 + (item.id % 10) / 10).toFixed(1) : "-",
      lastAccess: lastAccess.toLocaleString('pt-BR'),
      reliabilityScore,
      cpfValid: isValidCPF(item.cpf),
      contact: item.whatsapp
        ? `Whats: ${item.whatsapp}`
        : item.phone
        ? `Tel: ${item.phone}`
        : "-",
      cityLabel: item.city || item.state ? `${item.city ?? ""} - ${item.state ?? ""}` : "-"
    };
  }), [users]);

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

  const updateAdStatus = async (adId: number, status: AdminAd["status"]) => {
    setUpdatingAdId(adId);
    try {
      const response = await fetch(`/api/admin/ads/${adId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao atualizar status do anúncio.");
      }

      setAds((prev) => prev.map((ad) => (ad.id === adId ? { ...ad, status } : ad)));
    } catch (error) {
      console.error("Erro ao atualizar anúncio:", error);
    } finally {
      setUpdatingAdId(null);
    }
  };

  const approveAllPendingAds = async () => {
    const pendingIds = ads.filter((ad) => ad.status === "Em Analise").map((ad) => ad.id);
    if (pendingIds.length === 0) return;

    setIsApprovingAll(true);
    try {
      const responses = await Promise.all(
        pendingIds.map((id) =>
          fetch(`/api/admin/ads/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Postado" }),
          })
        )
      );

      const approvedIds = new Set<number>();
      responses.forEach((response, index) => {
        if (response.ok) {
          approvedIds.add(pendingIds[index]);
        }
      });

      setAds((prev) =>
        prev.map((ad) => (approvedIds.has(ad.id) ? { ...ad, status: "Postado" } : ad))
      );
    } catch (error) {
      console.error("Erro ao aprovar anúncios pendentes:", error);
    } finally {
      setIsApprovingAll(false);
    }
  };

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
              { label: "Dashboard Geral", value: "DASHBOARD", active: activeView === "DASHBOARD" },
              { label: "Estatísticas de Anúncios", value: "STATS_ADS_OVERVIEW", count: pendingCount, isDanger: pendingCount > 0, active: activeView === "STATS_ADS_OVERVIEW" },
              { label: "Novos cadastros", value: "STATS_USERS_NEW", active: activeView === "STATS_USERS_NEW" },
              { label: "Denúncias abertas", value: "STATS_REPORTS", count: reportedCount, isDanger: reportedCount > 0, active: activeView === "STATS_REPORTS" },
              { label: "Faturamento", value: "STATS_REVENUE", active: activeView === "STATS_REVENUE" },
              { label: "Gráfico de acessos", value: "STATS_ACCESS", active: activeView === "STATS_ACCESS" }
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
              { label: "Anúncios pendentes", value: "MANAGE_ADS_PENDING", count: pendingCount, isDanger: pendingCount > 0, active: activeView === "MANAGE_ADS_PENDING" },
              { label: "Anúncios aprovados", value: "MANAGE_ADS_APPROVED", active: activeView === "MANAGE_ADS_APPROVED" },
              { label: "Anúncios recusados", value: "MANAGE_ADS_REJECTED", active: activeView === "MANAGE_ADS_REJECTED" },
              { label: "Anúncios expirados", value: "MANAGE_ADS_EXPIRED", active: activeView === "MANAGE_ADS_EXPIRED" },
              { label: "Anúncios denunciados", value: "MANAGE_ADS_REPORTED", count: reportedCount, active: activeView === "MANAGE_ADS_REPORTED" },
              { label: "Destaques / Patrocinados", value: "MANAGE_ADS_FEATURED", active: activeView === "MANAGE_ADS_FEATURED" }
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
          
          {activeView === "STATS_ADS_OVERVIEW" ? (
             <AdsStatsView ads={ads} />
          ) : activeView === "STATS_USERS_NEW" ? (
             <UsersStatsView users={users} />
          ) : (activeView === "DASHBOARD" || activeView.startsWith("STATS_")) ? (
              <StatsDashboardView 
                users={users}
                ads={ads}
                onNavigate={setActiveView}
              />
          ) : null}

          {activeView === "MANAGE_ADS_PENDING" && (
            <PendingAdsView
              ads={ads}
              onApprove={(adId) => updateAdStatus(adId, "Postado")}
              onReject={(adId) => updateAdStatus(adId, "Reprovado")}
              onApproveAll={approveAllPendingAds}
              updatingAdId={updatingAdId}
              isApprovingAll={isApprovingAll}
            />
          )}

          {activeView !== "Lista de usuários" && 
           activeView !== "MANAGE_ADS_PENDING" && 
           !activeView.startsWith("STATS_") && 
           activeView !== "DASHBOARD" && (
            <PlaceholderView title={activeView} />
          )}
        </div>
      </div>
    </div>
  );
}
