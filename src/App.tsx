import { Route, Routes } from 'react-router-dom';
import { useAuthUser } from './hooks/useAuthUser';
import { SignInScreen } from './components/auth/SignInScreen';
import { AppShell } from './components/layout/AppShell';
import { TodayPage } from './pages/TodayPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const { user, loading, signInWithGoogle, signOut } = useAuthUser();

  if (loading) {
    return <div className="flex h-full items-center justify-center text-slate-400">Cargando…</div>;
  }

  if (!user) {
    return <SignInScreen onSignIn={signInWithGoogle} />;
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<TodayPage user={user} />} />
        <Route path="settings" element={<SettingsPage user={user} onSignOut={signOut} />} />
      </Route>
    </Routes>
  );
}
