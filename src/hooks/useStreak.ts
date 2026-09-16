import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, limit as fbLimit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { paths } from '../firebase/paths';
import { computeStreak, scoreFromValues } from '../lib/discipline';
import { todayKey } from '../lib/dates';
import type { DailyCheckIn } from '../types';

const HISTORY_DAYS = 60;

export function useStreak(uid: string | undefined) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, paths.dailyCheckIns(uid)),
      orderBy('date', 'desc'),
      fbLimit(HISTORY_DAYS),
    );
    return onSnapshot(q, (snap) => {
      const scoresByDate: Record<string, number> = {};
      snap.docs.forEach((d) => {
        const data = d.data() as DailyCheckIn;
        scoresByDate[data.date] = scoreFromValues(data.indicators);
      });
      setStreak(computeStreak(scoresByDate, todayKey()));
    });
  }, [uid]);

  return streak;
}
