import { useEffect } from 'react';
import { useToast } from '../components/ui/Toast';
import { useCompetitors } from '../hooks/useCompetitors';

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ReportsPage() {
  const { reports, isLoading, error } = useCompetitors();
  const { push } = useToast();

  useEffect(() => {
    if (!error) return;
    push({ variant: 'error', title: 'Não foi possível carregar os relatórios', description: error });
  }, [error, push]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-zinc-400">Reports</div>
        <h1 className="mt-1 text-xl font-semibold">Relatórios</h1>
        <p className="mt-2 text-sm text-zinc-400">Visão rápida do seu cadastro de concorrentes.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
          <div className="text-xs text-zinc-400">Total de concorrentes</div>
          <div className="mt-2 text-3xl font-semibold">{isLoading ? '—' : reports.total}</div>
          <div className="mt-2 text-xs text-zinc-500">Inclui apenas registros do seu usuário (RLS).</div>
        </div>

        <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
          <div className="text-xs text-zinc-400">Últimos 5 adicionados</div>
          <div className="mt-3 space-y-2">
            {isLoading ? (
              <div className="text-sm text-zinc-400">Carregando…</div>
            ) : reports.lastAdded.length === 0 ? (
              <div className="text-sm text-zinc-500">Você ainda não adicionou concorrentes.</div>
            ) : (
              reports.lastAdded.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="truncate text-xs text-zinc-500">{formatDate(c.created_at)}</div>
                  </div>
                  <a
                    className="shrink-0 text-xs text-indigo-300 hover:text-indigo-200"
                    href={c.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

