import { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { paths } from '../firebase/paths';
import { todayKey } from '../lib/dates';
import type { DailyIndicatorValues } from '../types';

export function useTodayCheckIn(uid: string | undefined) {
  const today = useMemo(() => todayKey(), []);
  const [values, setValues] = useState<Partial<DailyIndicatorValues>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    const ref = doc(db, paths.dailyCheckIn(uid, today));
    return onSnapshot(ref, (snap) => {
      setValues(snap.data()?.indicators ?? {});
      setLoading(false);
    });
  }, [uid, today]);

  const updateValues = async (patch: Partial<DailyIndicatorValues>) => {
    if (!uid) return;
    const ref = doc(db, paths.dailyCheckIn(uid, today));
    // Optimistic update: onSnapshot will confirm it right after.
    setValues((prev) => ({ ...prev, ...patch }));
    await setDoc(
      ref,
      { date: today, indicators: patch, updatedAt: serverTimestamp() },
      { merge: true },
    );
  };

  return { today, values, loading, updateValues };
}
