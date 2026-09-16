import { useEffect, useRef, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { functions, db } from '../firebase/config';
import type { ChatMessage } from '../types';

interface AskCoachResponse {
  reply: string;
}

// Keep the stored/sent history bounded: shorter Claude requests (cheaper,
// faster) and a small Firestore doc regardless of how long a chat gets.
const MAX_STORED_MESSAGES = 30;
// Server-side timeoutSeconds on askCoach is 120s; give the client a little
// more so a real server timeout always surfaces as an error, never an
// indefinite "Batu está escribiendo…".
const CALL_TIMEOUT_MS = 130_000;

export function useCoachChat(uid: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatDocRef = useRef(doc(db, 'users', uid, 'coachChat', 'main'));

  useEffect(() => {
    chatDocRef.current = doc(db, 'users', uid, 'coachChat', 'main');
    setLoadingHistory(true);
    getDoc(chatDocRef.current)
      .then((snap) => {
        const stored = snap.data()?.messages;
        setMessages(Array.isArray(stored) ? stored : []);
      })
      .catch((err) => console.error('load coach history failed', err))
      .finally(() => setLoadingHistory(false));
  }, [uid]);

  const persist = async (all: ChatMessage[]) => {
    const trimmed = all.slice(-MAX_STORED_MESSAGES);
    try {
      await setDoc(chatDocRef.current, { messages: trimmed, updatedAt: serverTimestamp() });
    } catch (err) {
      console.error('save coach history failed', err);
    }
  };

  const sendMessage = async (content: string) => {
    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next);
    setSending(true);
    setError(null);
    try {
      const askCoach = httpsCallable<{ messages: ChatMessage[] }, AskCoachResponse>(
        functions,
        'askCoach',
        { timeout: CALL_TIMEOUT_MS },
      );
      const { data } = await askCoach({ messages: next.slice(-MAX_STORED_MESSAGES) });
      const withReply = [...next, { role: 'assistant' as const, content: data.reply }];
      setMessages(withReply);
      void persist(withReply);
    } catch (err) {
      console.error('askCoach failed', err);
      setError('Batu AI Coach no está disponible ahora mismo. Inténtalo de nuevo en un momento.');
      void persist(next);
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    setMessages([]);
    setError(null);
    try {
      await deleteDoc(chatDocRef.current);
    } catch (err) {
      console.error('clear coach history failed', err);
    }
  };

  return { messages, loadingHistory, sending, error, sendMessage, clearChat };
}
