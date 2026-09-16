import type { IndicatorKey, IndicatorMap } from '../types';
import { addDays, dateKey, parseKey } from './dates';

export const INDICATORS: { key: IndicatorKey; label: string; emoji: string; description: string }[] = [
  {
    key: 'training',
    label: 'Entrenamiento',
    emoji: '\u{1F3CB}',
    description: 'Fuerza o cardio, mínimo 20 min',
  },
  {
    key: 'nutrition',
    label: 'Nutrición',
    emoji: '\u{1F957}',
    description: 'Comida real, sin ultraprocesados, todo el día',
  },
  {
    key: 'sleep',
    label: 'Sueño',
    emoji: '\u{1F634}',
    description: '7 horas o más',
  },
  {
    key: 'hydration',
    label: 'Hidratación',
    emoji: '\u{1F4A7}',
    description: '2 litros de agua o más',
  },
  {
    key: 'mindset',
    label: 'Mentalidad',
    emoji: '\u{1F9E0}',
    description: '10 min de meditación, journaling o desconexión de pantallas',
  },
  {
    key: 'movement',
    label: 'Movimiento',
    emoji: '\u{1F6B6}',
    description: 'Moverte fuera del entreno: caminar, subir escaleras...',
  },
];

// A day "counts" toward the streak once at least this % of indicators are checked.
export const DISCIPLINE_THRESHOLD = 80;

export function scoreFromIndicators(indicators: Partial<IndicatorMap> | undefined): number {
  if (!indicators) return 0;
  const checked = INDICATORS.filter((i) => indicators[i.key]).length;
  return Math.round((checked / INDICATORS.length) * 100);
}

export function checkedCountFromIndicators(indicators: Partial<IndicatorMap> | undefined): number {
  if (!indicators) return 0;
  return INDICATORS.filter((i) => indicators[i.key]).length;
}

export function missingLabels(indicators: Partial<IndicatorMap> | undefined): string[] {
  return INDICATORS.filter((i) => !indicators?.[i.key]).map((i) => i.label);
}

/**
 * Consecutive days meeting DISCIPLINE_THRESHOLD, ending today.
 * If today hasn't reached the threshold yet, it's excluded so an
 * in-progress day doesn't zero out an otherwise-live streak.
 */
export function computeStreak(scoresByDate: Record<string, number>, todayKeyStr: string): number {
  let cursor = parseKey(todayKeyStr);
  if ((scoresByDate[todayKeyStr] ?? 0) < DISCIPLINE_THRESHOLD) {
    cursor = addDays(cursor, -1);
  }
  let streak = 0;
  for (;;) {
    const key = dateKey(cursor);
    const score = scoresByDate[key];
    if (score === undefined || score < DISCIPLINE_THRESHOLD) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
