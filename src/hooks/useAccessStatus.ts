import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase/config';

interface RedeemResponse {
  unlocked: boolean;
}

// null = still loading, undefined uid = no user yet.
export function useAccessStatus(uid: string | undefined) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    if (!uid) return;
    setUnlocked(null);
    return onSnapshot(doc(db, `users/${uid}/access/status`), (snap) => {
      setUnlocked(snap.data()?.unlocked === true);
    });
  }, [uid]);

  const redeemCode = async (code: string) => {
    const redeem = httpsCallable<{ code: string }, RedeemResponse>(functions, 'redeemAccessCode');
    await redeem({ code });
  };

  return { unlocked, redeemCode };
}
