import { NavLink, Outlet } from 'react-router-dom';

// Coach chat needs the askCoach Cloud Function (Anthropic key) deployed;
// gated off until that's set up so there's no dead nav item in the meantime.
const COACH_ENABLED = import.meta.env.VITE_ENABLE_COACH === 'true';

interface Props {
  isAdmin?: boolean;
}

export function AppShell({ isAdmin }: Props) {
  const navItems = [
    { to: '/', label: 'Hoy' },
    ...(COACH_ENABLED ? [{ to: '/coach', label: 'Coach' }] : []),
    { to: '/settings', label: 'Ajustes' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <div className="mx-auto flex h-full max-w-md flex-col">
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-8">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t border-base-border bg-base-surface/95 py-3 backdrop-blur">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-accent' : 'text-slate-300'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
