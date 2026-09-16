// Mirrors src/lib/discipline.ts. Keep the two in sync if targets/pillars change.

const NUTRITION_PERCENT: Record<string, number> = {
  excesos: 25,
  normal: 60,
  picoteo: 80,
  muy_limpio: 100,
};

const DEFAULT_GLASS_ML = 250;

const TARGETS = {
  training: 20, // minutes
  sleep: 7, // hours
  hydration: 2, // liters
  mindset: 10, // minutes
  movement: 10000, // steps
};

function clampPercent(value: number, target: number): number {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / target) * 100)));
}

export function scoreFromIndicators(indicators: Record<string, unknown> | undefined): { score: number } {
  const v = (indicators ?? {}) as Record<string, number | string | undefined>;
  const glassMl = Number(v.hydrationGlassMl ?? DEFAULT_GLASS_ML);
  const liters = (Number(v.hydrationGlasses ?? 0) * glassMl) / 1000;
  const nutritionPercent = NUTRITION_PERCENT[String(v.nutritionLevel ?? '')] ?? 0;

  const percentages = [
    clampPercent(Number(v.trainingMinutes ?? 0), TARGETS.training),
    nutritionPercent,
    clampPercent(Number(v.sleepHours ?? 0), TARGETS.sleep),
    clampPercent(liters, TARGETS.hydration),
    clampPercent(Number(v.mindsetMinutes ?? 0), TARGETS.mindset),
    clampPercent(Number(v.movementSteps ?? 0), TARGETS.movement),
  ];

  const score = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
  return { score };
}
