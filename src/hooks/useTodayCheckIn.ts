import { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { paths } from '../firebase/paths';
import { todayKey } from '../lib/dates';
import type { IndicatorKey, IndicatorMap } from '../types';

export function useTodayCheckIn(uid: string | undefined) {
  const today = useMemo(() => todayKey(), []);
  const [indicators, setIndicators] = useState<Partial<IndicatorMap>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const ref = doc(db, paths.dailyCheckIn(uid, today));
    return onSnapshot(ref, (snap) => {
      setIndicators(snap.data()?.indicators ?? {});
      setLoading(false);
    });
  }, [uid, today]);

  const toggleIndicator = async (key: IndicatorKey) => {
    if (!uid) return;
    const ref = doc(db, paths.dailyCheckIn(uid, today));
    const nextValue = !indicators[key];
    // Optimistic update: onSnapshot will confirm it right after.
    setIndicators((prev) => ({ ...prev, [key]: nextValue }));
    await setDoc(
      ref,
      { date: today, indicators: { [key]: nextValue }, updatedAt: serverTimestamp() },
      { merge: true },
    );
  };

  return { today, indicators, loading, toggleIndicator };
}
