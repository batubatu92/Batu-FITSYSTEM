// Mirrors src/lib/discipline.ts's indicator count. Keep in sync if indicators change.
export const INDICATOR_COUNT = 6;

export function scoreFromIndicators(indicators: Record<string, unknown> | undefined): {
  score: number;
  checkedCount: number;
} {
  const checkedCount = Object.values(indicators ?? {}).filter(Boolean).length;
  const score = Math.round((checkedCount / INDICATOR_COUNT) * 100);
  return { score, checkedCount };
}
