import { useEffect, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { paths } from '../firebase/paths';
import type { UserProfile } from '../types';

export function useUserProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, paths.userProfile(uid)), (snap) => {
      setProfile((snap.data() as UserProfile | undefined) ?? {});
      setLoading(false);
    });
  }, [uid]);

  const saveProfile = async (next: Omit<UserProfile, 'updatedAt'>) => {
    if (!uid) return;
    await setDoc(
      doc(db, paths.userProfile(uid)),
      { ...next, updatedAt: serverTimestamp() },
      { merge: true },
    );
  };

  return { profile, loading, saveProfile };
}
