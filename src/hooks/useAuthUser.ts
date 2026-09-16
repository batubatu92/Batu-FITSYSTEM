import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/config';

// signInWithRedirect kept failing silently on this device even with a
// same-origin authDomain (a known unresolved Safari 16.1+ issue: the
// IndexedDB state Firebase needs to correlate the return trip from Google
// doesn't survive the round trip). Firebase's own docs list signInWithPopup
// as the next fallback "for any hosting provider" once authDomain is fixed,
// so we use it unconditionally rather than branching on standalone/browser.
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      }),
    [],
  );

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      const e = err as { code?: string; message?: string };
      console.error('Popup sign-in failed', err);
      setAuthError(`${e.code ?? 'unknown'}: ${e.message ?? err}`);
    }
  };
  const signOut = () => firebaseSignOut(auth);

  return { user, loading, authError, signInWithGoogle, signOut };
}
