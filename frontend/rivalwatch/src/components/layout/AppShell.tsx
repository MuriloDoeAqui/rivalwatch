import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

function navLinkClassName(isActive: boolean) {
  return [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-zinc-900 text-zinc-50' : 'text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50',
  ].join(' ');
}

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="leading-tight">
              <div className="text-sm font-semibold">RivalWatch</div>
              <div className="text-xs text-zinc-400">MicroSaaS de monitoramento</div>
            </div>

            <nav className="hidden items-center gap-1 sm:flex">
              <NavLink to="/app" end className={({ isActive }) => navLinkClassName(isActive)}>
                Dashboard
              </NavLink>
              <NavLink to="/app/reports" className={({ isActive }) => navLinkClassName(isActive)}>
                Reports
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-xs text-zinc-400">Logado como</div>
              <div className="text-sm">{user?.email ?? user?.id}</div>
            </div>
            <Button variant="secondary" onClick={() => void logout()}>
              Sair
            </Button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-2 px-6 pb-3 sm:hidden">
          <NavLink to="/app" end className={({ isActive }) => navLinkClassName(isActive)}>
            Dashboard
          </NavLink>
          <NavLink to="/app/reports" className={({ isActive }) => navLinkClassName(isActive)}>
            Reports
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

