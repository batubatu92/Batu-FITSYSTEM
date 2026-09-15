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
// need the redirect flow. A normal browser tab uses popup instead: Safari's
// redirect flow bounces through the authDomain (firebaseapp.com), and ITP
// blocks sharing the sign-in state back with a different origin (web.app),
// silently dropping the user back on the sign-in screen.
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
