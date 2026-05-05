import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-bold">RivalWatch</h1>
            <p className="text-xs text-zinc-400">
              MicroSaaS de monitoramento
            </p>
          </div>
        </div>
      </header>

      {/* CONTEÚDO CENTRALIZADO */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>

    </div>
  );
}