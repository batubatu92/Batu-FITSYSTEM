import { useMemo } from 'react';
import type { User } from 'firebase/auth';
import { DisciplineScoreRing } from '../components/today/DisciplineScoreRing';
import { IndicatorGrid } from '../components/today/IndicatorGrid';
import { StreakBadge } from '../components/today/StreakBadge';
import { BatuCoachCard } from '../components/today/BatuCoachCard';
import { QuoteCard } from '../components/today/QuoteCard';
import { useTodayCheckIn } from '../hooks/useTodayCheckIn';
import { useStreak } from '../hooks/useStreak';
import { useRotatingQuote } from '../hooks/useRotatingQuote';
import { missingLabels, scoreFromIndicators } from '../lib/discipline';
import { getCoachMessage } from '../lib/coach';

interface Props {
  user: User;
}

export function TodayPage({ user }: Props) {
  const { indicators, loading, toggleIndicator } = useTodayCheckIn(user.uid);
  const streak = useStreak(user.uid);
  const quote = useRotatingQuote();

  const score = useMemo(() => scoreFromIndicators(indicators), [indicators]);
  const missing = useMemo(() => missingLabels(indicators), [indicators]);
  const coachMessage = useMemo(
    () => getCoachMessage({ score, streak, missing }),
    [score, streak, missing],
  );

  if (loading) {
    return <p className="text-center text-slate-400">Cargando…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="text-center">
        <p className="text-sm text-slate-400">Hola, {user.displayName?.split(' ')[0] ?? 'atleta'}</p>
        <h1 className="text-xl font-bold text-slate-50">Hoy</h1>
      </header>

      <QuoteCard quote={quote} />
      <DisciplineScoreRing score={score} />
      <StreakBadge streak={streak} />
      <IndicatorGrid indicators={indicators} onToggle={toggleIndicator} />
      <BatuCoachCard message={coachMessage} />
    </div>
  );
}
