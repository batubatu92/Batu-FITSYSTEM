import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/config';

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Popup-based sign-in is unreliable in iOS home-screen-installed PWAs,
    // so we use the redirect flow everywhere instead.
    getRedirectResult(auth).catch((err) => console.error('Redirect sign-in failed', err));
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = () => signInWithRedirect(auth, new GoogleAuthProvider());
  const signOut = () => firebaseSignOut(auth);

  return { user, loading, signInWithGoogle, signOut };
}
