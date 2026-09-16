import { useAdminUsers } from '../hooks/useAdminUsers';

function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}

export function AdminPage() {
  const { users, loading, error, revokeAccess } = useAdminUsers();

  return (
    <div className="flex flex-col gap-4">
      <header className="text-center">
        <h1 className="text-xl font-bold text-slate-50">Usuarios</h1>
        <p className="text-sm text-slate-400">{users?.length ?? 0} cuentas registradas</p>
      </header>

      {loading && <p className="text-center text-sm text-slate-400">Cargando…</p>}
      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      <div className="flex flex-col gap-3">
        {users?.map((u) => (
          <div
            key={u.uid}
            className="rounded-xl border border-base-border bg-base-surface p-4 shadow-lg shadow-black/30"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-100">{u.displayName ?? '(sin nombre)'}</p>
                <p className="text-xs text-slate-400">{u.email ?? 'sin email'}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                  u.unlocked ? 'bg-accent/20 text-accent' : 'bg-slate-700/40 text-slate-400'
                }`}
              >
                {u.unlocked ? `Activo (${u.code})` : 'Sin acceso'}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Registrado: {formatDate(u.createdAt)} · Último login: {formatDate(u.lastLoginAt)}
            </p>
            {u.unlocked && (
              <button
                onClick={() => revokeAccess(u.uid)}
                className="mt-3 rounded-lg border border-red-900 bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-300"
              >
                Revocar acceso
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
