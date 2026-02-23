"use client";

import React from 'react';
import { type LevelResult, type LevelTier, ALL_LEVELS } from '@/lib/levels';

/* ================================================================
   ANTLY — Sistema de Selos de Confiança
   ================================================================ */

/* ── Visual config per tier ── */
const TIER_STYLE: Record<LevelTier, {
  gradient: string;       // CSS gradient for icon bg
  accent: string;         // main colour (hex)
  accentLight: string;    // soft surface  
  ring: string;           // ring/border colour
  glow: string;           // shadow glow
}> = {
  basico: {
    gradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
    accent: '#64748b',
    accentLight: '#f1f5f9',
    ring: '#cbd5e1',
    glow: '0 4px 14px rgba(100,116,139,0.18)',
  },
  confiavel: {
    gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    accent: '#2563eb',
    accentLight: '#eff6ff',
    ring: '#93c5fd',
    glow: '0 4px 14px rgba(37,99,235,0.2)',
  },
  verificado: {
    gradient: 'linear-gradient(135deg, #34d399, #059669)',
    accent: '#059669',
    accentLight: '#ecfdf5',
    ring: '#6ee7b7',
    glow: '0 4px 14px rgba(5,150,105,0.2)',
  },
  destaque: {
    gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    accent: '#7c3aed',
    accentLight: '#f5f3ff',
    ring: '#c4b5fd',
    glow: '0 4px 14px rgba(124,58,237,0.2)',
  },
  elite: {
    gradient: 'linear-gradient(135deg, #fbbf24, #d97706)',
    accent: '#d97706',
    accentLight: '#fffbeb',
    ring: '#fcd34d',
    glow: '0 4px 14px rgba(217,119,6,0.25)',
  },
};

/* ══════════════════════════════════════════════════════════════
   1. INLINE — Tiny pill for listing cards  
   Used: anuncios page (variant="inline" size="xs")
   ══════════════════════════════════════════════════════════════ */
export function LevelInline({ levelResult, className = '' }: {
  levelResult: LevelResult; className?: string;
}) {
  const s = TIER_STYLE[levelResult.level.tier];
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-[2px] rounded text-[10px] font-semibold leading-none whitespace-nowrap select-none ${className}`}
      style={{ color: s.accent, background: s.accentLight, border: `1px solid ${s.ring}40` }}
    >
      <span className="text-[9px] leading-none">{levelResult.level.icon}</span>
      {levelResult.level.name}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════
   2. BADGE — Horizontal compact badge
   Used: anuncio detail, profissional header (variant="badge")
   ══════════════════════════════════════════════════════════════ */
export function LevelBadgeCompact({ levelResult, showPoints = false, className = '' }: {
  levelResult: LevelResult; showPoints?: boolean; className?: string;
}) {
  const s = TIER_STYLE[levelResult.level.tier];
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0"
        style={{ background: s.gradient, boxShadow: s.glow }}
      >
        {levelResult.level.icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-slate-800 leading-tight">{levelResult.level.name}</p>
        <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
          {showPoints ? `${levelResult.points} pts · Nível de confiança` : 'Nível de confiança'}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   3. CARD — Full card with circular progress + linear bar + roadmap
   Used: SidebarProfile, profissional sidebar (variant="card")
   ══════════════════════════════════════════════════════════════ */
export function LevelCard({ levelResult, className = '' }: {
  levelResult: LevelResult; className?: string;
}) {
  const { level, points, nextLevel, progressToNextLevel, pointsToNextLevel } = levelResult;
  const s = TIER_STYLE[level.tier];
  const currentIdx = ALL_LEVELS.findIndex(l => l.tier === level.tier);

  // Circular ring
  const R = 36, C = 2 * Math.PI * R;
  const offset = C - (C * Math.min(progressToNextLevel, 100)) / 100;

  return (
    <div
      className={`rounded-2xl bg-white overflow-hidden ${className}`}
      style={{ border: `1px solid ${s.ring}30`, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.03)' }}
    >
      {/* Header: ring + info */}
      <div className="p-5 flex items-center gap-4">
        {/* Circular progress */}
        <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
            <circle cx="40" cy="40" r={R} fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
            <circle
              cx="40" cy="40" r={R}
              fill="none"
              stroke={s.accent}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={nextLevel ? offset : 0}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Center icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: s.gradient, boxShadow: s.glow }}
            >
              <span className="drop-shadow-sm">{level.icon}</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-extrabold text-slate-900">{level.name}</h3>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white tabular-nums"
              style={{ background: s.accent }}
            >
              {points} pts
            </span>
          </div>

          {nextLevel ? (
            <>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[11px] text-slate-400">Próximo:</span>
                <span className="text-[11px] font-semibold" style={{ color: TIER_STYLE[nextLevel.tier].accent }}>
                  {nextLevel.name}
                </span>
              </div>
              {/* Linear bar */}
              <div className="mt-2.5">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(3, progressToNextLevel)}%`, background: s.gradient }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Faltam <span className="font-semibold" style={{ color: s.accent }}>{pointsToNextLevel}</span> pts
                </p>
              </div>
            </>
          ) : (
            <p className="text-[11px] font-semibold mt-1" style={{ color: s.accent }}>
              {level.icon} Nível máximo alcançado
            </p>
          )}
        </div>
      </div>

      {/* Roadmap */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between relative">
          {/* Track */}
          <div className="absolute top-[10px] left-[10%] right-[10%] h-[2px] bg-slate-200 rounded-full" />
          {/* Filled track */}
          <div
            className="absolute top-[10px] left-[10%] h-[2px] rounded-full transition-all duration-700"
            style={{
              width: `${(currentIdx / Math.max(ALL_LEVELS.length - 1, 1)) * 80}%`,
              background: s.gradient,
            }}
          />
          {ALL_LEVELS.map((lvl, idx) => {
            const ls = TIER_STYLE[lvl.tier];
            const isActive = idx === currentIdx;
            const isPast = idx < currentIdx;
            const isFuture = idx > currentIdx;
            return (
              <div key={lvl.tier} className="flex flex-col items-center relative z-10" style={{ width: '20%' }}>
                <div
                  className="flex items-center justify-center rounded-md transition-all duration-300"
                  style={{
                    width: isActive ? 22 : 18,
                    height: isActive ? 22 : 18,
                    background: isFuture ? '#e2e8f0' : ls.gradient,
                    boxShadow: isActive ? ls.glow : 'none',
                    opacity: isFuture ? 0.45 : 1,
                  }}
                >
                  <span className={`leading-none ${isActive ? 'text-[11px]' : 'text-[9px]'}`}>
                    {isFuture ? '' : lvl.icon}
                  </span>
                </div>
                <span
                  className="text-[7px] font-semibold mt-1 text-center leading-none"
                  style={{ color: isActive ? ls.accent : isFuture ? '#cbd5e1' : '#94a3b8' }}
                >
                  {lvl.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DEFAULT EXPORT — backward compatible
   ══════════════════════════════════════════════════════════════ */
interface LevelBadgeProps {
  levelResult: LevelResult;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'badge' | 'card' | 'seal' | 'strip';
  showProgress?: boolean;
  showPoints?: boolean;
  animated?: boolean;
  className?: string;
}

export default function LevelBadge({
  levelResult,
  variant = 'badge',
  showPoints = false,
  className = '',
}: LevelBadgeProps) {
  switch (variant) {
    case 'inline':
      return <LevelInline levelResult={levelResult} className={className} />;
    case 'card':
      return <LevelCard levelResult={levelResult} className={className} />;
    case 'strip':
    case 'seal':
      return <LevelBadgeCompact levelResult={levelResult} showPoints className={className} />;
    default:
      return <LevelBadgeCompact levelResult={levelResult} showPoints={showPoints} className={className} />;
  }
}

/* ── Legacy re-exports ── */
export function ProviderTrustBadge({ levelResult, className = '' }: {
  levelResult: LevelResult; providerName?: string; className?: string;
}) {
  return <LevelBadgeCompact levelResult={levelResult} showPoints className={className} />;
}

export function LevelRoadmap(props: { levelResult: LevelResult; className?: string }) {
  return <LevelCard {...props} />;
}

export function DashboardLevelHero(props: { levelResult: LevelResult; className?: string }) {
  return <LevelCard {...props} />;
}

export function AnuncioLevelCard(props: { levelResult: LevelResult; className?: string }) {
  return <LevelBadgeCompact levelResult={props.levelResult} showPoints className={props.className} />;
}
