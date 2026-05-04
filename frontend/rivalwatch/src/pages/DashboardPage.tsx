import { useEffect, useState, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import type { CompetitorFormValues } from '../components/competitors/CompetitorForm';
import { CompetitorForm } from '../components/competitors/CompetitorForm';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useCompetitors } from '../hooks/useCompetitors';
import { useSites } from '../hooks/useSites';

function formatDate(iso?: string) {
  if (!iso) return '—';

  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function DashboardPage() {
  const {
    items,
    isLoading,
    isMutating,
    error,
    create,
    remove,
    update,
  } = useCompetitors();

  const {
    sites,
    create: createSite,
  } = useSites();

  const { push } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<{
    id: string;
    values: CompetitorFormValues;
  } | null>(null);

  const [siteModal, setSiteModal] = useState<{
    competitorId: string;
  } | null>(null);

  const [siteForm, setSiteForm] = useState({
    name: '',
    url: '',
  });

  useEffect(() => {
    if (!error) return;
    push({
      variant: 'error',
      title: 'Erro no dashboard',
      description: error,
    });
  }, [error, push]);

  // 🔥 INSIGHTS
  const insights = useMemo(() => {
    const total = items.length;
    const sitesTotal = sites.length;

    const last = items[0];

    const weekCount = items.filter((c) => {
      const created = new Date(c.created_at);
      const now = new Date();
      return now.getTime() - created.getTime() < 7 * 86400000;
    }).length;

    return {
      total,
      sitesTotal,
      lastName: last?.name ?? 'Nenhum',
      weekCount,
    };
  }, [items, sites]);

  // 🔥 CONTAGEM
  const sitesByCompetitor = useMemo(() => {
    const map: Record<string, number> = {};

    sites.forEach((s: any) => {
      if (!s.competitor_id) return;
      map[s.competitor_id] = (map[s.competitor_id] || 0) + 1;
    });

    return map;
  }, [sites]);

  // 🔥 AGRUPAMENTO
  const sitesGrouped = useMemo(() => {
    const map: Record<string, any[]> = {};

    sites.forEach((s: any) => {
      if (!s.competitor_id) return;

      if (!map[s.competitor_id]) {
        map[s.competitor_id] = [];
      }

      map[s.competitor_id].push(s);
    });

    return map;
  }, [sites]);

  // 🔥 CRIAR SITE
  const handleCreateSite = async () => {
    if (!siteModal) return;

    try {
      await createSite({
        name: siteForm.name,
        url: siteForm.url,
        competitorId: siteModal.competitorId,
      });

      push({ variant: 'success', title: 'Site vinculado!' });

      setSiteModal(null);
      setSiteForm({ name: '', url: '' });
    } catch {
      push({
        variant: 'error',
        title: 'Erro ao criar site',
      });
    }
  };

  const onCreate = async (values: CompetitorFormValues) => {
    try {
      await create(values);
      push({ variant: 'success', title: 'Concorrente criado' });
      setCreateOpen(false);
    } catch {}
  };

  const onEdit = async (values: CompetitorFormValues) => {
    if (!editing) return;

    try {
      await update({ id: editing.id, ...values });
      push({ variant: 'success', title: 'Atualizado' });
      setEditing(null);
    } catch {}
  };

  const onDelete = async (id: string) => {
    try {
      await remove(id);
      push({ variant: 'success', title: 'Removido' });
    } catch {}
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">RivalWatch Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Visão geral do seu SaaS
        </p>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Concorrentes</p>
          <h2 className="text-3xl font-bold mt-2">
            {isLoading ? '...' : insights.total}
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Sites monitorados</p>
          <h2 className="text-3xl font-bold mt-2">
            {insights.sitesTotal}
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Status</p>
          <h2 className="text-3xl font-bold mt-2 text-green-400">
            Online
          </h2>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
        <h2 className="text-sm font-semibold mb-3">Insights rápidos</h2>

        <ul className="text-sm text-zinc-400 space-y-2">
          <li>• Você monitora {insights.total} concorrentes</li>
          <li>• Você tem {insights.sitesTotal} sites cadastrados</li>
          <li>• {insights.weekCount} novos nos últimos 7 dias</li>
          <li>• Último concorrente: {insights.lastName}</li>
        </ul>
      </div>

      {/* BOTÃO */}
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)} disabled={isMutating}>
          + Novo concorrente
        </Button>
      </div>

      {/* MODAIS */}
      <Modal title="Adicionar concorrente" isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <CompetitorForm
          submitLabel="Salvar"
          isSubmitting={isMutating}
          onSubmit={onCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <Modal title="Editar concorrente" isOpen={!!editing} onClose={() => setEditing(null)}>
        <CompetitorForm
          initialValues={editing?.values}
          submitLabel="Atualizar"
          isSubmitting={isMutating}
          onSubmit={onEdit}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <Modal title="Vincular site" isOpen={!!siteModal} onClose={() => setSiteModal(null)}>
        <input
          placeholder="Nome do site"
          className="input bg-zinc-950 text-white placeholder:text-zinc-500"
          value={siteForm.name}
          onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
        />

        <input
          placeholder="URL"
          className="input mt-2 bg-zinc-950 text-white placeholder:text-zinc-500"
          value={siteForm.url}
          onChange={(e) => setSiteForm({ ...siteForm, url: e.target.value })}
        />

        <Button className="mt-4 w-full" onClick={handleCreateSite}>
          Salvar
        </Button>
      </Modal>

      {/* LISTA */}
      <div className="space-y-3">

        {items.map((c) => {
          const totalSites = sitesByCompetitor[c.id] || 0;
          const competitorSites = sitesGrouped[c.id] || [];

          return (
            <div key={c.id} className="flex items-start justify-between gap-4 border border-zinc-900 rounded-lg p-3">
              
              <div className="min-w-0 w-full">
                <p className="font-medium truncate">{c.name}</p>

                <p className="text-xs text-zinc-500 truncate">
                  {c.website}
                </p>

                <p className="text-[10px] text-zinc-600 mt-1">
                  Criado em {formatDate(c.created_at)}
                </p>

                <p className="text-xs text-indigo-400 mt-1">
                  {totalSites} site(s) vinculados
                </p>

                {/* 🔥 SITES + PREÇO */}
                {competitorSites.length > 0 ? (
                  <div className="mt-2 space-y-1 border border-zinc-800 rounded p-2 max-h-28 overflow-y-auto">
                    {competitorSites.map((s: any) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between bg-zinc-900 px-2 py-1 rounded text-xs"
                      >
                        <div className="flex flex-col truncate">
                          <span className="truncate">{s.name}</span>

                          <span className="text-green-400 text-[11px]">
                            {s.price ? `R$ ${s.price}` : 'Sem preço'}
                          </span>

                          <span className="text-[10px] text-zinc-500">
                            {formatDate(s.last_checked)}
                          </span>
                        </div>

                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline ml-2"
                        >
                          abrir
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-600 italic mt-2">
                    Nenhum site vinculado
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => setSiteModal({ competitorId: c.id })}>
                  + Vincular site
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    setEditing({
                      id: c.id,
                      values: {
                        name: c.name,
                        website: c.website,
                      },
                    })
                  }
                >
                  Editar
                </Button>

                <Button variant="danger" onClick={() => void onDelete(c.id)}>
                  Deletar
                </Button>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}