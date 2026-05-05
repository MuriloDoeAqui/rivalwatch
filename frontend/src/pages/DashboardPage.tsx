import { useEffect, useMemo } from 'react';
import { useCompetitors } from '../hooks/useCompetitors';
import { useSites } from '../hooks/useSites';
import { useToast } from '../components/ui/Toast';

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR');
}

function formatPrice(price: any) {
  if (price === null || price === undefined || isNaN(Number(price))) {
    return 'Sem preço';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(price));
}

export function DashboardPage() {
  // ✅ NOMES CORRETOS DOS HOOKS
  const { items, remove } = useCompetitors();
  const { sites, create, remove: removeSite } = useSites();
  const { push } = useToast();

  const safeItems = Array.isArray(items) ? items : [];
  const safeSites = Array.isArray(sites) ? sites : [];

  // ✅ AGRUPAMENTO CORRIGIDO (sem erro de null)
  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {};

    safeSites.forEach((s: any) => {
      if (!s?.competitor_id) return;

      const key = String(s.competitor_id);

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(s);
    });

    return map;
  }, [safeSites]);

  // ===== AÇÕES =====

  async function handleDeleteCompetitor(id: string) {
    if (!confirm('Deletar concorrente?')) return;

    await remove(id);

    push({
      title: 'Concorrente deletado',
      variant: 'success',
    });
  }

  async function handleAddSite(competitorId: string) {
    const name = prompt('Nome do site:');
    const url = prompt('URL:');

    if (!name || !url) return;

    await create({
      name,
      url,
      competitorId: competitorId, // ✅ nome correto
    });

    push({
      title: 'Site criado',
      variant: 'success',
    });
  }

  async function handleDeleteSite(id: string) {
    if (!confirm('Remover site?')) return;

    await removeSite(id);

    push({
      title: 'Site removido',
      variant: 'success',
    });
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">RivalWatch Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Visão geral do seu SaaS
        </p>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 p-4 rounded">
          <p className="text-xs text-zinc-400">Concorrentes</p>
          <p className="text-xl font-bold">{safeItems.length}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded">
          <p className="text-xs text-zinc-400">Sites</p>
          <p className="text-xl font-bold">{safeSites.length}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded">
          <p className="text-xs text-zinc-400">Com preço</p>
          <p className="text-xl font-bold">
            {safeSites.filter((s: any) => (s as any)?.price).length}
          </p>
        </div>
      </div>

      {/* LISTA */}
      {safeItems.map((c: any) => {
        const compSites = grouped[String(c.id)] || [];

        return (
          <div key={c.id} className="bg-zinc-900 p-5 rounded space-y-3">

            {/* INFO */}
            <div>
              <h2 className="font-semibold">{c?.name ?? 'Sem nome'}</h2>
              <p className="text-xs text-zinc-400">{c?.website ?? '—'}</p>
              <p className="text-xs text-zinc-500">
                {formatDate(c?.created_at)}
              </p>
            </div>

            {/* BOTÕES */}
            <div className="flex gap-3 text-xs">
              <button
                onClick={() => handleAddSite(c.id)}
                className="text-indigo-400 hover:underline"
              >
                + site
              </button>

              <button
                onClick={() => handleDeleteCompetitor(c.id)}
                className="text-red-400 hover:underline"
              >
                deletar
              </button>
            </div>

            {/* SITES */}
            {compSites.length > 0 ? (
              compSites.map((s: any) => (
                <div
                  key={s.id}
                  className="flex justify-between bg-zinc-800 p-2 rounded text-xs"
                >
                  <div>
                    <p>{s?.name ?? 'Sem nome'}</p>
                    <p className="text-green-400">
                      {formatPrice((s as any)?.price)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={s?.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400"
                    >
                      abrir
                    </a>

                    <button
                      onClick={() => handleDeleteSite(s.id)}
                      className="text-red-400"
                    >
                      remover
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500">
                Nenhum site vinculado
              </p>
            )}

          </div>
        );
      })}
    </div>
  );
}