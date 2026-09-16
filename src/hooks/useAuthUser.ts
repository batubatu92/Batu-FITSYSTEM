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

// Always use the redirect flow, never a popup: on mobile Safari a "popup" is
// just a new tab with no reliable window.opener, so the postMessage-based
// handshake signInWithPopup depends on frequently never completes. Redirect
// works reliably because VITE_FIREBASE_AUTH_DOMAIN is set to this app's own
// Hosting domain (not the default *.firebaseapp.com) — Firebase Hosting
// proxies the /__/auth/* handler on whatever domain it serves, so the whole
// flow stays same-origin and Safari's ITP never blocks the sign-in state.
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
