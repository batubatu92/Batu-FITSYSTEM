import type { User } from 'firebase/auth';
import { useStravaConnection } from '../hooks/useStravaConnection';
import { useUserProfile } from '../hooks/useUserProfile';
import { ProfileForm } from '../components/settings/ProfileForm';

interface Props {
  user: User;
  onSignOut: () => void;
}

// Strava connect needs the Cloud Functions (Blaze plan) deployed; gated off
// until that's set up so the first Hosting-only release has no dead button.
const STRAVA_ENABLED = import.meta.env.VITE_ENABLE_STRAVA === 'true';

export function SettingsPage({ user, onSignOut }: Props) {
  const { connection, connectStrava, starting } = useStravaConnection(user.uid);
  const { profile, loading: profileLoading, saveProfile } = useUserProfile(user.uid);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-bold text-slate-50">Ajustes</h1>
        <p className="text-sm text-slate-400">{user.email}</p>
      </header>

      {!profileLoading && <ProfileForm profile={profile} onSave={saveProfile} />}

      {STRAVA_ENABLED && (
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
      )}

      <button
        onClick={onSignOut}
        className="rounded-lg border border-base-border py-2 text-sm text-slate-400"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
