// ============================================================
// Sistema de Níveis de Confiança - Antly
// ============================================================
// 5 Níveis: Básico → Confiável → Verificado → Destaque → Elite
// Cores:    Cinza  → Azul      → Verde      → Roxo     → Dourado
// ============================================================

export type LevelTier = 'basico' | 'confiavel' | 'verificado' | 'destaque' | 'elite';

export interface LevelInfo {
  tier: LevelTier;
  name: string;
  color: string;           // Tailwind text color
  bgColor: string;         // Tailwind bg color  
  borderColor: string;     // Tailwind border color
  gradientFrom: string;    // Tailwind gradient from
  gradientTo: string;      // Tailwind gradient to
  badgeBg: string;         // Badge background classes
  badgeText: string;       // Badge text color
  icon: string;            // Emoji/symbol
  minPoints: number;       // Minimum points for this level
  maxPoints: number;       // Max points before next level
}

export interface LevelInput {
  completedServices: number;
  reviewsCount: number;
  ratingAverage: number;
  profileCompletion: number;   // 0-100
  isVerified: boolean;         // CPF validated
  hasCnpj: boolean;
  cancelRate: number;          // 0-1 (percentage of cancelled services)
  accountAgeDays: number;
}

export interface LevelResult {
  level: LevelInfo;
  points: number;
  nextLevel: LevelInfo | null;
  pointsToNextLevel: number;
  progressToNextLevel: number; // 0-100 percentage
  progressMessage: string;
}

// ============================================================
// Level Definitions
// ============================================================

const LEVELS: LevelInfo[] = [
  {
    tier: 'basico',
    name: 'Básico',
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    gradientFrom: 'from-slate-400',
    gradientTo: 'to-slate-500',
    badgeBg: 'bg-gradient-to-r from-slate-100 to-slate-200',
    badgeText: 'text-slate-600',
    icon: '🔰',
    minPoints: 0,
    maxPoints: 149,
  },
  {
    tier: 'confiavel',
    name: 'Confiável',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-blue-600',
    badgeBg: 'bg-gradient-to-r from-blue-50 to-blue-100',
    badgeText: 'text-blue-700',
    icon: '🛡️',
    minPoints: 150,
    maxPoints: 349,
  },
  {
    tier: 'verificado',
    name: 'Verificado',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    gradientFrom: 'from-emerald-400',
    gradientTo: 'to-emerald-600',
    badgeBg: 'bg-gradient-to-r from-emerald-50 to-green-100',
    badgeText: 'text-emerald-700',
    icon: '✅',
    minPoints: 350,
    maxPoints: 599,
  },
  {
    tier: 'destaque',
    name: 'Destaque',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-purple-600',
    badgeBg: 'bg-gradient-to-r from-purple-50 to-violet-100',
    badgeText: 'text-purple-700',
    icon: '⭐',
    minPoints: 600,
    maxPoints: 899,
  },
  {
    tier: 'elite',
    name: 'Elite',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
    gradientFrom: 'from-amber-400',
    gradientTo: 'to-yellow-500',
    badgeBg: 'bg-gradient-to-r from-amber-50 to-yellow-100',
    badgeText: 'text-amber-700',
    icon: '👑',
    minPoints: 900,
    maxPoints: 1000,
  },
];

// ============================================================
// Points Calculation
// ============================================================

export function calculateLevelPoints(input: LevelInput): number {
  let points = 0;

  // 1. Serviços Concluídos (max 250 pts)
  //    0 srv = 0pts, 5 = 50pts, 15 = 120pts, 30 = 180pts, 50+ = 250pts
  if (input.completedServices >= 50) points += 250;
  else if (input.completedServices >= 30) points += 180;
  else if (input.completedServices >= 15) points += 120;
  else if (input.completedServices >= 5) points += 50;
  else points += input.completedServices * 10;

  // 2. Avaliações (max 200 pts)
  //    Cada avaliação = 8pts, teto de 25 avaliações
  points += Math.min(input.reviewsCount * 8, 200);

  // 3. Nota Média (max 200 pts)
  //    0-2.9 = 0pts, 3.0 = 60pts, 3.5 = 100pts, 4.0 = 140pts, 4.5 = 170pts, 5.0 = 200pts
  if (input.ratingAverage >= 5.0) points += 200;
  else if (input.ratingAverage >= 4.5) points += 170;
  else if (input.ratingAverage >= 4.0) points += 140;
  else if (input.ratingAverage >= 3.5) points += 100;
  else if (input.ratingAverage >= 3.0) points += 60;

  // 4. Perfil Completo (max 100 pts)
  points += Math.round(input.profileCompletion);

  // 5. Verificação (max 100 pts)
  if (input.isVerified) points += 60;
  if (input.hasCnpj) points += 40;

  // 6. Taxa de Cancelamento (penalidade: -50 a 0)
  if (input.cancelRate > 0.2) points -= 50;
  else if (input.cancelRate > 0.1) points -= 25;

  // 7. Tempo de conta (max 150 pts)
  //    30 dias = 20pts, 90 = 50pts, 180 = 80pts, 365 = 120pts, 730+ = 150pts
  if (input.accountAgeDays >= 730) points += 150;
  else if (input.accountAgeDays >= 365) points += 120;
  else if (input.accountAgeDays >= 180) points += 80;
  else if (input.accountAgeDays >= 90) points += 50;
  else if (input.accountAgeDays >= 30) points += 20;

  return Math.max(0, Math.min(1000, points));
}

// ============================================================
// Level Determination
// ============================================================

export function getLevelForPoints(points: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getNextLevel(currentLevel: LevelInfo): LevelInfo | null {
  const idx = LEVELS.findIndex(l => l.tier === currentLevel.tier);
  if (idx < LEVELS.length - 1) {
    return LEVELS[idx + 1];
  }
  return null; // Already at Elite
}

// ============================================================
// Main Function: Calculate full level result
// ============================================================

export function calculateLevel(input: LevelInput): LevelResult {
  const points = calculateLevelPoints(input);
  const level = getLevelForPoints(points);
  const nextLevel = getNextLevel(level);

  let pointsToNextLevel = 0;
  let progressToNextLevel = 100;

  if (nextLevel) {
    pointsToNextLevel = nextLevel.minPoints - points;
    const levelRange = nextLevel.minPoints - level.minPoints;
    const progressInLevel = points - level.minPoints;
    progressToNextLevel = Math.min(100, Math.round((progressInLevel / levelRange) * 100));
  }

  const progressMessage = buildProgressMessage(level, nextLevel, points, pointsToNextLevel, input);

  return {
    level,
    points,
    nextLevel,
    pointsToNextLevel,
    progressToNextLevel,
    progressMessage,
  };
}

// ============================================================
// Gamification Messages
// ============================================================

function buildProgressMessage(
  current: LevelInfo,
  next: LevelInfo | null,
  points: number,
  pointsToNext: number,
  input: LevelInput
): string {
  if (!next) {
    return '🏆 Parabéns! Você alcançou o nível máximo Elite!';
  }

  // Actionable tips based on what's missing
  const tips: string[] = [];

  if (!input.isVerified) {
    tips.push('Valide seu CPF para ganhar +60 pontos');
  }
  if (!input.hasCnpj) {
    tips.push('Cadastre seu CNPJ para ganhar +40 pontos');
  }
  if (input.profileCompletion < 100) {
    const missing = 100 - input.profileCompletion;
    tips.push(`Complete mais ${missing}% do perfil`);
  }
  if (input.reviewsCount < 25) {
    const needed = Math.min(25, Math.ceil(pointsToNext / 8));
    tips.push(`Receba mais ${needed} avaliações`);
  }
  if (input.completedServices < 50) {
    tips.push('Conclua mais serviços pela plataforma');
  }

  const mainMessage = `Faltam ${pointsToNext} pontos para alcançar o nível ${next.name}!`;
  const tip = tips.length > 0 ? ` 💡 Dica: ${tips[0]}.` : '';

  return `${mainMessage}${tip}`;
}

// ============================================================
// Helper: Calculate profile completion percentage
// ============================================================

export interface ProfileFields {
  cpf?: string;
  phone?: string;
  email?: string;
  profileUrl?: string;
  category?: string;
  city?: string;
  serviceRadius?: number;
  serviceType?: string;
  experience?: string;
  bio?: string;
  availability?: string[];
  whatsapp?: string;
  address?: string;
  name?: string;
}

const isValidCPF = (cpf: string | undefined): boolean => {
  if (!cpf || typeof cpf !== 'string') return false;
  const cleaned = cpf.replace(/[^\d]+/g, '');
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;

  const validateDigit = (t: number) => {
    let d = 0;
    let c = 0;
    for (let i = t; i >= 2; i--) {
      d += parseInt(cleaned.substring(c, c + 1)) * i;
      c++;
    }
    d = (d * 10) % 11;
    if (d === 10 || d === 11) d = 0;
    return d;
  };

  return (
    validateDigit(10) === parseInt(cleaned.substring(9, 10)) &&
    validateDigit(11) === parseInt(cleaned.substring(10, 11))
  );
};

export function calculateProfileCompletion(fields: ProfileFields): number {
  let score = 0;

  // Security (40%)
  if (isValidCPF(fields.cpf)) score += 20;
  if (fields.phone && fields.phone.length >= 10) score += 10;
  if (fields.email) score += 5;
  if (fields.whatsapp && fields.whatsapp.length >= 10) score += 5;

  // Visual (10%)
  if (fields.profileUrl) score += 10;

  // Professional (30%)
  if (fields.category) score += 5;
  if (fields.city) score += 5;
  if (fields.serviceRadius && fields.serviceRadius > 0) score += 5;
  if (fields.serviceType) score += 5;
  if (fields.experience) score += 5;
  if (fields.name && fields.name.length > 2) score += 5;

  // Quality (20%)
  if (fields.bio && fields.bio.length > 50) score += 10;
  if (fields.availability && fields.availability.length > 0) score += 5;
  if (fields.address) score += 5;

  return Math.min(100, score);
}

// ============================================================
// Helper: Format rating display
// ============================================================

export function formatRatingDisplay(
  ratingAvg: number | string | null | undefined,
  ratingsCount: number | null | undefined
): { text: string; isNew: boolean; numericRating: number } {
  const count = ratingsCount || 0;
  const avg = Number(ratingAvg || 0);

  if (count === 0 || avg === 0) {
    return {
      text: 'Novo',
      isNew: true,
      numericRating: 0,
    };
  }

  return {
    text: avg.toFixed(1),
    isNew: false,
    numericRating: avg,
  };
}

// ============================================================
// Estimate level from public data (for listing/detail pages)
// Uses same calculateLevel logic with best available data
// ============================================================

export function estimatePublicLevel(opts: {
  reviewsCount?: number | null;
  ratingAverage?: number | string | null;
  verified?: boolean;
  createdAt?: string | null;
  // Extra provider profile fields (when available from API)
  providerCpf?: string | null;
  providerBio?: string | null;
  providerCategory?: string | null;
  providerCity?: string | null;
  providerServiceRadius?: number | null;
  providerAvailability?: string[] | null;
  providerExperience?: string | null;
  providerHasCnpj?: boolean | null;
  providerServiceType?: string | null;
  providerProfilePhoto?: string | null;
  providerPhone?: string | null;
  providerWhatsapp?: string | null;
  providerName?: string | null;
  userCreatedAt?: string | null;
}): LevelResult {
  const reviewsCount = opts.reviewsCount ?? 0;
  const ratingAverage = Number(opts.ratingAverage || 0);
  
  // Use user_created_at (account creation) if available, fallback to ad created_at
  const dateRef = opts.userCreatedAt || opts.createdAt;
  const accountAgeDays = dateRef
    ? Math.floor((Date.now() - new Date(dateRef).getTime()) / (1000 * 60 * 60 * 24))
    : 30;

  // Calculate profile completion from available fields (same logic as frontend)
  const profileFields = [
    opts.providerCpf,
    opts.providerPhone,
    opts.providerProfilePhoto,
    opts.providerCategory,
    opts.providerCity,
    opts.providerServiceRadius,
    opts.providerServiceType,
    opts.providerExperience,
    opts.providerBio,
    opts.providerAvailability,
    opts.providerWhatsapp,
    opts.providerName,
  ];
  const filledFields = profileFields.filter(f => f !== null && f !== undefined && f !== '').length;
  const profileCompletion = Math.round((filledFields / profileFields.length) * 100);

  const isVerified = !!opts.providerCpf || !!opts.verified;
  const hasCnpj = !!opts.providerHasCnpj;

  return calculateLevel({
    completedServices: 0, // not available from public API
    reviewsCount,
    ratingAverage,
    profileCompletion,
    isVerified,
    hasCnpj,
    cancelRate: 0,
    accountAgeDays,
  });
}

// ============================================================
// All levels (exported for UI)
// ============================================================

export const ALL_LEVELS = LEVELS;
