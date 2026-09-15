import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase/config';
import { paths } from '../firebase/paths';
import type { StravaConnection } from '../types';

const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI;

interface CreateStateResponse {
  state: string;
}

export function useStravaConnection(uid: string | undefined) {
  const [connection, setConnection] = useState<StravaConnection | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, paths.stravaConnection(uid)), (snap) => {
      setConnection((snap.data() as StravaConnection | undefined) ?? { connected: false });
    });
  }, [uid]);

  const connectStrava = async () => {
    setStarting(true);
    try {
      const createState = httpsCallable<void, CreateStateResponse>(functions, 'createStravaOAuthState');
      const { data } = await createState();
      const url = new URL('https://www.strava.com/oauth/authorize');
      url.searchParams.set('client_id', STRAVA_CLIENT_ID);
      url.searchParams.set('redirect_uri', STRAVA_REDIRECT_URI);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('approval_prompt', 'auto');
      url.searchParams.set('scope', 'activity:read_all');
      url.searchParams.set('state', data.state);
      window.location.href = url.toString();
    } finally {
      setStarting(false);
    }
  };

  return { connection, connectStrava, starting };
}
