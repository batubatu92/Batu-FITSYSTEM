import type { DailyIndicatorValues, IndicatorKey, NutritionLevel } from '../types';
import { addDays, dateKey, parseKey } from './dates';

export const INDICATORS: { key: IndicatorKey; label: string; emoji: string; description: string }[] = [
  {
    key: 'training',
    label: 'Entrenamiento',
    emoji: '\u{1F3CB}',
    description: 'Minutos reales entrenando, objetivo 20 min',
  },
  {
    key: 'nutrition',
    label: 'Nutrición',
    emoji: '\u{1F957}',
    description: 'Cómo has comido hoy, en general',
  },
  {
    key: 'sleep',
    label: 'Sueño',
    emoji: '\u{1F634}',
    description: 'Horas dormidas, objetivo 7h',
  },
  {
    key: 'hydration',
    label: 'Hidratación',
    emoji: '\u{1F4A7}',
    description: 'Vasos de agua, objetivo 2 litros',
  },
  {
    key: 'mindset',
    label: 'Mentalidad',
    emoji: '\u{1F9E0}',
    description: 'Minutos de meditación, journaling o desconexión, objetivo 10 min',
  },
  {
    key: 'movement',
    label: 'Movimiento',
    emoji: '\u{1F6B6}',
    description: 'Pasos dados, objetivo 10.000',
  },
];

export const NUTRITION_LEVELS: { value: NutritionLevel; label: string; percent: number }[] = [
  { value: 'excesos', label: 'Excesos', percent: 25 },
  { value: 'normal', label: 'Normal', percent: 60 },
  { value: 'picoteo', label: 'Picoteo controlado', percent: 80 },
  { value: 'muy_limpio', label: 'Muy limpio', percent: 100 },
];

export const DEFAULT_GLASS_ML = 250;

export const TARGETS = {
  training: 20, // minutes
  sleep: 7, // hours
  hydration: 2, // liters
  mindset: 10, // minutes
  movement: 10000, // steps
};

// A day "counts" toward the streak once the average of the 6 pillars hits this.
export const DISCIPLINE_THRESHOLD = 80;

function clampPercent(value: number, target: number): number {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / target) * 100)));
}

export function percentagesFromValues(
  values: Partial<DailyIndicatorValues> | undefined,
): Record<IndicatorKey, number> {
  const v = values ?? {};
  const glassMl = v.hydrationGlassMl ?? DEFAULT_GLASS_ML;
  const hydrationLiters = ((v.hydrationGlasses ?? 0) * glassMl) / 1000;
  const nutritionPercent = NUTRITION_LEVELS.find((l) => l.value === v.nutritionLevel)?.percent ?? 0;

  return {
    training: clampPercent(v.trainingMinutes ?? 0, TARGETS.training),
    nutrition: nutritionPercent,
    sleep: clampPercent(v.sleepHours ?? 0, TARGETS.sleep),
    hydration: clampPercent(hydrationLiters, TARGETS.hydration),
    mindset: clampPercent(v.mindsetMinutes ?? 0, TARGETS.mindset),
    movement: clampPercent(v.movementSteps ?? 0, TARGETS.movement),
  };
}

export function scoreFromValues(values: Partial<DailyIndicatorValues> | undefined): number {
  const pcts = percentagesFromValues(values);
  const total = INDICATORS.reduce((sum, i) => sum + pcts[i.key], 0);
  return Math.round(total / INDICATORS.length);
}

/** Labels of the pillars furthest from 100%, ascending — for coach messaging. */
export function neediestLabels(values: Partial<DailyIndicatorValues> | undefined): string[] {
  const pcts = percentagesFromValues(values);
  return INDICATORS.filter((i) => pcts[i.key] < 100)
    .sort((a, b) => pcts[a.key] - pcts[b.key])
    .map((i) => i.label);
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
