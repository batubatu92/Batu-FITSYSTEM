import type { User } from 'firebase/auth';
import { useStravaConnection } from '../hooks/useStravaConnection';

interface Props {
  user: User;
  onSignOut: () => void;
}

export function SettingsPage({ user, onSignOut }: Props) {
  const { connection, connectStrava, starting } = useStravaConnection(user.uid);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-bold text-slate-50">Ajustes</h1>
        <p className="text-sm text-slate-400">{user.email}</p>
      </header>

      <section className="rounded-xl border border-base-border bg-base-surface p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold text-slate-200">Strava</span>
          <span className={`text-xs ${connection?.connected ? 'text-accent' : 'text-slate-500'}`}>
            {connection?.connected ? 'Conectado' : 'No conectado'}
          </span>
        </div>
        {connection?.connected ? (
          <p className="text-sm text-slate-400">Athlete ID: {connection.athleteId}</p>
        ) : (
          <button
            onClick={connectStrava}
            disabled={starting}
            className="w-full rounded-lg bg-[#fc4c02] py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {starting ? 'Conectando…' : 'Conectar con Strava'}
          </button>
        )}
      </section>

      <button
        onClick={onSignOut}
        className="rounded-lg border border-base-border py-2 text-sm text-slate-400"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
