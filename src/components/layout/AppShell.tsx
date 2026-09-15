import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Hoy' },
  { to: '/settings', label: 'Ajustes' },
];

export function AppShell() {
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
              `text-sm font-medium ${isActive ? 'text-accent' : 'text-slate-400'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
