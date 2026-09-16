import { useState } from 'react';

interface Props {
  onRedeem: (code: string) => Promise<void>;
  onSignOut: () => void;
}

export function AccessCodeGate({ onRedeem, onSignOut }: Props) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onRedeem(code.trim());
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message ?? 'Código no válido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-slate-50">Acceso por invitación</h1>
      <p className="max-w-xs text-sm text-slate-300">
        Batu Fit System está en fase privada. Introduce el código que te han pasado.
      </p>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Código de acceso"
        autoCapitalize="characters"
        className="w-full max-w-xs rounded-lg border border-base-border bg-base-surface p-3 text-center text-slate-100"
      />
      <button
        onClick={handleSubmit}
        disabled={submitting || !code.trim()}
        className="w-full max-w-xs rounded-full bg-gradient-to-r from-flame-from to-flame-to px-6 py-3 font-semibold text-base-bg shadow-lg shadow-black/30 disabled:opacity-60"
      >
        {submitting ? 'Comprobando…' : 'Entrar'}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button onClick={onSignOut} className="text-xs text-slate-400 underline">
        Cerrar sesión
      </button>
    </div>
  );
}
