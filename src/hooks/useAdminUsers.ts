import { useCallback, useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: string | null;
  lastLoginAt: string | null;
  unlocked: boolean;
  code: string | null;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const listUsers = httpsCallable<void, { users: AdminUser[] }>(functions, 'listUsers');
      const { data } = await listUsers();
      setUsers(data.users);
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message ?? 'No se pudo cargar la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const revokeAccess = async (uid: string) => {
    const revoke = httpsCallable<{ uid: string }, { ok: boolean }>(functions, 'revokeAccess');
    await revoke({ uid });
    await refresh();
  };

  return { users, loading, error, refresh, revokeAccess };
}
