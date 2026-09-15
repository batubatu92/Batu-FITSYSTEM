import { useState } from 'react';
import { useCoachChat } from '../hooks/useCoachChat';

export function CoachPage() {
  const { messages, sending, error, sendMessage } = useCoachChat();
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const content = draft.trim();
    if (!content || sending) return;
    setDraft('');
    void sendMessage(content);
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-xl font-bold text-slate-50">Batu AI Coach</h1>
        <p className="text-sm text-slate-400">Entreno, nutrición real, rutina. Pregúntale.</p>
      </header>

      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-500">
            Prueba con: "¿Qué entreno hoy?" o "Dame un menú del día sin ultraprocesados".
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap rounded-xl p-3 text-sm ${
              m.role === 'user'
                ? 'ml-auto bg-accent/20 text-slate-100'
                : 'mr-auto bg-base-surface text-slate-200'
            }`}
          >
            {m.content}
          </div>
        ))}
        {sending && <p className="text-sm text-slate-500">Batu está escribiendo…</p>}
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
          onClick={handleSend}
          disabled={sending || !draft.trim()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-base-bg disabled:opacity-60"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
