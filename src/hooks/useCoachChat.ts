import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import type { ChatMessage } from '../types';

interface AskCoachResponse {
  reply: string;
}

export function useCoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    const next: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setSending(true);
    setError(null);
    try {
      const askCoach = httpsCallable<{ messages: ChatMessage[] }, AskCoachResponse>(
        functions,
        'askCoach',
      );
      const { data } = await askCoach({ messages: next });
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('askCoach failed', err);
      setError('Batu AI Coach no está disponible ahora mismo. Inténtalo de nuevo en un momento.');
    } finally {
      setSending(false);
    }
  };

  return { messages, sending, error, sendMessage };
}
