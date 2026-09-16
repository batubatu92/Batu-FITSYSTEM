import { useMemo } from 'react';
import type { User } from 'firebase/auth';
import { DisciplineScoreRing } from '../components/today/DisciplineScoreRing';
import { IndicatorGrid } from '../components/today/IndicatorGrid';
import { StreakBadge } from '../components/today/StreakBadge';
import { BatuCoachCard } from '../components/today/BatuCoachCard';
import { QuoteCard } from '../components/today/QuoteCard';
import { useTodayCheckIn } from '../hooks/useTodayCheckIn';
import { useStreak } from '../hooks/useStreak';
import { useUserProfile } from '../hooks/useUserProfile';
import { useRotatingQuote } from '../hooks/useRotatingQuote';
import { DEFAULT_GLASS_ML, neediestLabels, scoreFromValues } from '../lib/discipline';
import { getCoachMessage } from '../lib/coach';

interface Props {
  user: User;
}

export function TodayPage({ user }: Props) {
  const { values, loading, updateValues } = useTodayCheckIn(user.uid);
  const { profile } = useUserProfile(user.uid);
  const streak = useStreak(user.uid);
  const quote = useRotatingQuote();

  const score = useMemo(() => scoreFromValues(values), [values]);
  const missing = useMemo(() => neediestLabels(values), [values]);
  const coachMessage = useMemo(
    () => getCoachMessage({ score, streak, missing }),
    [score, streak, missing],
  );

  if (loading) {
    return <p className="text-center text-slate-300">Cargando…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="text-center">
        <p className="text-sm text-slate-300">Hola, {user.displayName?.split(' ')[0] ?? 'atleta'}</p>
        <h1 className="text-xl font-bold text-slate-50">Hoy</h1>
      </header>

      <QuoteCard quote={quote} />
      <DisciplineScoreRing score={score} />
      <StreakBadge streak={streak} />
      <IndicatorGrid
        values={values}
        glassSizeMl={profile.glassSizeMl ?? DEFAULT_GLASS_ML}
        onChange={updateValues}
      />
      <BatuCoachCard message={coachMessage} />
    </div>
  );
}
