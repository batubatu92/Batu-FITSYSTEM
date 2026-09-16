import { useState } from 'react';
import type { User } from 'firebase/auth';
import { useCoachChat } from '../hooks/useCoachChat';
import { parseMessageParts } from '../lib/parseRecipes';
import { RecipeCard } from '../components/coach/RecipeCard';

const STARTER_PROMPTS = [
  '¿Qué entreno hoy?',
  'Dame un menú sin ultraprocesados',
  'Se me rompió la racha, ¿qué hago?',
  'Motívame',
];

interface Props {
  user: User;
}

export function CoachPage({ user }: Props) {
  const { messages, loadingHistory, sending, error, sendMessage, clearChat } = useCoachChat(
    user.uid,
  );
  const [draft, setDraft] = useState('');

  const handleSend = (text?: string) => {
    const content = (text ?? draft).trim();
    if (!content || sending) return;
    setDraft('');
    void sendMessage(content);
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div className="w-10" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-50">Batu AI Coach</h1>
          <p className="text-sm text-slate-300">Entreno, nutrición real, rutina. Pregúntale.</p>
        </div>
        {messages.length > 0 ? (
          <button
            onClick={() => void clearChat()}
            title="Nueva conversación"
            className="w-10 text-right text-xs text-slate-400"
          >
            Borrar
          </button>
        ) : (
          <div className="w-10" />
        )}
      </header>

      {loadingHistory && <p className="text-center text-sm text-slate-400">Cargando conversación…</p>}

      <div className="flex flex-col gap-3">
        {!loadingHistory && messages.length === 0 && (
          <div className="flex flex-col items-center gap-3 pt-4">
            <p className="text-center text-sm text-slate-400">Elige algo para empezar, o escribe lo tuyo:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-accent/30 bg-base-surface px-3 py-2 text-xs font-medium text-slate-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div
              key={i}
              className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-xl bg-accent/20 p-3 text-sm text-slate-100"
            >
              {m.content}
            </div>
          ) : (
            <div key={i} className="mr-auto flex max-w-[92%] flex-col gap-2">
              {parseMessageParts(m.content).map((part, j) =>
                part.type === 'recipe' ? (
                  <RecipeCard key={j} recipe={part.recipe} />
                ) : (
                  <div
                    key={j}
                    className="whitespace-pre-wrap rounded-xl bg-base-surface p-3 text-sm text-slate-200 shadow-md shadow-black/20"
                  >
                    {part.text}
                  </div>
                ),
              )}
            </div>
          ),
        )}
        {sending && <p className="text-sm text-slate-400">Batu está escribiendo…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-16 mx-auto flex max-w-md gap-2 border-t border-base-border bg-base-bg p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe a Batu…"
          className="flex-1 rounded-lg border border-base-border bg-base-surface p-2 text-sm text-slate-100"
        />
        <button
          onClick={() => handleSend()}
          disabled={sending || !draft.trim()}
          className="rounded-lg bg-gradient-to-r from-flame-from to-flame-to px-4 py-2 text-sm font-semibold text-base-bg shadow-md shadow-black/30 disabled:opacity-60"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
