import { useEffect, useState, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import type { CompetitorFormValues } from '../components/competitors/CompetitorForm';
import { CompetitorForm } from '../components/competitors/CompetitorForm';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useCompetitors } from '../hooks/useCompetitors';
import { useSites } from '../hooks/useSites';

function formatDate(iso: string) {
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

  // 🔥 NOVO: modal de site
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

  const sitesByCompetitor = useMemo(() => {
    const map: Record<string, number> = {};

    sites.forEach((s) => {
      if (!s.competitor_id) return;
      map[s.competitor_id] = (map[s.competitor_id] || 0) + 1;
    });

    return map;
  }, [sites]);

  // =========================
  // CREATE SITE 🔥
  // =========================
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
    } catch (err) {
      push({
        variant: 'error',
        title: 'Erro ao criar site',
      });
    }
  };

  const onCreate = async (values: CompetitorFormValues) => {
    await create(values);
    push({ variant: 'success', title: 'Concorrente adicionado' });
    setCreateOpen(false);
  };

  const onEdit = async (values: CompetitorFormValues) => {
    if (!editing) return;
    await update({ id: editing.id, ...values });
    push({ variant: 'success', title: 'Atualizado' });
    setEditing(null);
  };

  const onDelete = async (id: string) => {
    await remove(id);
    push({ variant: 'success', title: 'Removido' });
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
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <p>Concorrentes</p>
          <h2>{insights.total}</h2>
        </div>

        <div className="card">
          <p>Sites</p>
          <h2>{insights.sitesTotal}</h2>
        </div>

        <div className="card">
          <p>Status</p>
          <h2 className="text-green-400">Online</h2>
        </div>
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {items.map((c) => {
          const totalSites = sitesByCompetitor[c.id] || 0;

          return (
            <div
              key={c.id}
              className="flex justify-between border p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs">{c.website}</p>

                <p className="text-xs text-indigo-400">
                  {totalSites} site(s) vinculados
                </p>
              </div>

              <div className="flex gap-2">

                {/* 🔥 BOTÃO NOVO */}
                <Button
                  onClick={() =>
                    setSiteModal({ competitorId: c.id })
                  }
                >
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

                <Button
                  variant="danger"
                  onClick={() => onDelete(c.id)}
                >
                  Deletar
                </Button>

              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL SITE 🔥 */}
      <Modal
        title="Vincular site"
        isOpen={!!siteModal}
        onClose={() => setSiteModal(null)}
      >
        <input
          placeholder="Nome"
          className="input"
          value={siteForm.name}
          onChange={(e) =>
            setSiteForm({ ...siteForm, name: e.target.value })
          }
        />

        <input
          placeholder="URL"
          className="input mt-2"
          value={siteForm.url}
          onChange={(e) =>
            setSiteForm({ ...siteForm, url: e.target.value })
          }
        />

        <Button className="mt-4 w-full" onClick={handleCreateSite}>
          Salvar
        </Button>
      </Modal>

    </div>
  );
}