import { useEffect, useRef, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

// Firebase's own signInWithPopup/signInWithRedirect resolvers are unreliable
// on mobile Safari (a still-unresolved upstream issue): redirect silently
// loses the pending sign-in state, and popup can leave the opened tab
// stranded on our own origin instead of navigating it to Google. Google
// Identity Services (the same library behind "Sign in with Google" buttons
// site-wide) handles the actual OAuth popup itself and is far more robust
// across browsers; we only hand its access token to Firebase afterwards.
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const signingIn = useRef(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      }),
    [],
  );

  const signInWithGoogle = () => {
    if (signingIn.current) return;
    const google = window.google;
    if (!google) {
      setAuthError('No se pudo cargar el inicio de sesión de Google. Revisa tu conexión y recarga.');
      return;
    }

    setAuthError(null);
    signingIn.current = true;

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      scope: 'openid email profile',
      callback: async (response) => {
        signingIn.current = false;
        if (!response.access_token) {
          setAuthError(`google_oauth: ${response.error ?? 'sin access_token'}`);
          return;
        }
        try {
          const credential = GoogleAuthProvider.credential(null, response.access_token);
          await signInWithCredential(auth, credential);
        } catch (err) {
          const e = err as { code?: string; message?: string };
          console.error('signInWithCredential failed', err);
          setAuthError(`${e.code ?? 'unknown'}: ${e.message ?? err}`);
        }
      },
      error_callback: (error) => {
        signingIn.current = false;
        setAuthError(`google_oauth: ${error.type}`);
      },
    });
    tokenClient.requestAccessToken();
  };

  const signOut = () => firebaseSignOut(auth);

  return { user, loading, authError, signInWithGoogle, signOut };
}
