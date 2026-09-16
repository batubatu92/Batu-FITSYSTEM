import { Route, Routes } from 'react-router-dom';
import { useAuthUser } from './hooks/useAuthUser';
import { useAccessStatus } from './hooks/useAccessStatus';
import { SignInScreen } from './components/auth/SignInScreen';
import { AccessCodeGate } from './components/auth/AccessCodeGate';
import { AppShell } from './components/layout/AppShell';
import { TodayPage } from './pages/TodayPage';
import { SettingsPage } from './pages/SettingsPage';
import { CoachPage } from './pages/CoachPage';

export default function App() {
  const { user, loading, authError, signInWithGoogle, signOut } = useAuthUser();
  const { unlocked, redeemCode } = useAccessStatus(user?.uid);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-slate-400">Cargando…</div>;
  }

  if (!user) {
    return <SignInScreen onSignIn={signInWithGoogle} authError={authError} />;
  }

  if (unlocked === null) {
    return <div className="flex h-full items-center justify-center text-slate-400">Cargando…</div>;
  }

  if (!unlocked) {
    return <AccessCodeGate onRedeem={redeemCode} onSignOut={signOut} />;
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<TodayPage user={user} />} />
        <Route path="coach" element={<CoachPage />} />
        <Route path="settings" element={<SettingsPage user={user} onSignOut={signOut} />} />
      </Route>
    </Routes>
  );
}
