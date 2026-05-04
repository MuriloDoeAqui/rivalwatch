import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      
      {/* HEADER FIXO */}
      <header className="border-b border-zinc-900 px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">RivalWatch</h1>

        <div className="text-sm text-zinc-400">
          MicroSaaS de monitoramento
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="p-6">
        <Outlet />
      </main>

    </div>
  );
}