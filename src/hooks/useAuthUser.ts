import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Home-screen-installed PWAs have no reliable window to pop up into, so they
// use the redirect flow; a normal browser tab uses popup for a smoother UX.
// Both only work because VITE_FIREBASE_AUTH_DOMAIN is set to this app's own
// Hosting domain (not the default *.firebaseapp.com) — Firebase Hosting
// proxies the /__/auth/* handler on whatever domain it serves, so keeping
// auth same-origin avoids Safari ITP blocking the sign-in state from
// crossing between two different Google-owned domains.
function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isStandalone()) {
      getRedirectResult(auth).catch((err) => console.error('Redirect sign-in failed', err));
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return isStandalone() ? signInWithRedirect(auth, provider) : signInWithPopup(auth, provider);
  };
  const signOut = () => firebaseSignOut(auth);

  return { user, loading, signInWithGoogle, signOut };
}
