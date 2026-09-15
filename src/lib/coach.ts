import { DISCIPLINE_THRESHOLD } from './discipline';

interface CoachInput {
  score: number;
  streak: number;
  missing: string[];
}

/**
 * Rule-based v1 for Batu AI Coach. Swap the body for a call to a
 * Cloud Function backed by an LLM once we want dynamic coaching copy —
 * the signature can stay the same.
 */
export function getCoachMessage({ score, streak, missing }: CoachInput): string {
  if (score === 100) {
    return streak > 1
      ? `🔥 ${streak} días perfectos seguidos. Esto ya es un hábito, Batu.`
      : '💯 Día perfecto. Así se construye disciplina.';
  }
  if (score === 0) {
    return 'Hoy no has marcado nada todavía. Elige un indicador y arranca — el primer check es el más importante.';
  }
  if (score >= DISCIPLINE_THRESHOLD) {
    return `Vas muy bien (${score}%). Solo te falta: ${missing.join(', ')}.`;
  }
  const priority = missing.slice(0, 2).join(' y ');
  return `Llevas ${score}%. Para no romper la racha necesitas al menos ${DISCIPLINE_THRESHOLD}% hoy. Prioriza: ${priority}.`;
}
