export type IndicatorKey =
  | 'training'
  | 'nutrition'
  | 'sleep'
  | 'hydration'
  | 'mindset'
  | 'movement';

export type NutritionLevel = 'excesos' | 'normal' | 'picoteo' | 'muy_limpio';

// Raw values the user enters per pillar; percentages are derived from these
// (see src/lib/discipline.ts) rather than stored directly, so the target
// thresholds can change later without rewriting history.
export interface DailyIndicatorValues {
  trainingMinutes?: number;
  nutritionLevel?: NutritionLevel;
  sleepHours?: number;
  hydrationGlasses?: number;
  // Snapshot of the glass/bottle size (ml) at the time this was logged, so
  // changing the setting later doesn't retroactively change past days.
  hydrationGlassMl?: number;
  mindsetMinutes?: number;
  movementSteps?: number;
}

export interface DailyCheckIn {
  date: string; // YYYY-MM-DD, local to the user
  indicators: Partial<DailyIndicatorValues>;
  updatedAt?: unknown;
}

export interface DisciplineScoreDoc {
  date: string;
  score: number; // 0-100
  computedAt?: unknown;
}

export interface StravaConnection {
  connected: boolean;
  athleteId?: number;
  scope?: string;
  connectedAt?: unknown;
  updatedAt?: unknown;
}

export interface UserProfile {
  obstacle?: string;
  failureDays?: string;
  streakBreakReason?: string;
  trainingLevel?: string;
  goal?: string;
  restrictions?: string;
  notes?: string;
  glassSizeMl?: number;
  updatedAt?: unknown;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
