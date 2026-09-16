export type IndicatorKey =
  | 'training'
  | 'nutrition'
  | 'sleep'
  | 'hydration'
  | 'mindset'
  | 'movement';

export type IndicatorMap = Record<IndicatorKey, boolean>;

export interface DailyCheckIn {
  date: string; // YYYY-MM-DD, local to the user
  indicators: Partial<IndicatorMap>;
  updatedAt?: unknown;
}

export interface DisciplineScoreDoc {
  date: string;
  score: number; // 0-100
  checkedCount: number;
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
  updatedAt?: unknown;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
