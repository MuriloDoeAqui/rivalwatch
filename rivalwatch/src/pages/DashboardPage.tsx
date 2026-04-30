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
    isLoading: sitesLoading,
  } = useSites();

  const { push } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<{
    id: string;
    values: CompetitorFormValues;
  } | null>(null);

  useEffect(() => {
    if (!error) return;
    push({
      variant: 'error',
      title: 'Erro no dashboard',
      description: error,
    });
  }, [error, push]);

  // 🔥 INSIGHTS REAIS
  const insights = useMemo(() => {
    const total = items.length;
    const sitesTotal = sites.length;

    const last = items[0];

    const weekCount = items.filter((c) => {
      const created = new Date(c.created_at);
      const now = new Date();
      const diff = now.getTime() - created.getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      total,
      sitesTotal,
      lastName: last?.name ?? 'Nenhum',
      weekCount,
    };
  }, [items, sites]);

  const onCreate = async (values: CompetitorFormValues) => {
    try {
      await create(values);
      push({ variant: 'success', title: 'Concorrente adicionado' });
      setCreateOpen(false);
    } catch (err) {
      push({
        variant: 'error',
        title: 'Erro ao criar',
        description: err instanceof Error ? err.message : 'Erro inesperado',
      });
    }
  };

  const onEdit = async (values: CompetitorFormValues) => {
    if (!editing) return;

    try {
      await update({ id: editing.id, ...values });
      push({ variant: 'success', title: 'Atualizado com sucesso' });
      setEditing(null);
    } catch (err) {
      push({
        variant: 'error',
        title: 'Erro ao atualizar',
        description: err instanceof Error ? err.message : 'Erro inesperado',
      });
    }
  };

  const onDelete = async (id: string) => {
    try {
      await remove(id);
      push({ variant: 'success', title: 'Removido com sucesso' });
    } catch (err) {
      push({
        variant: 'error',
        title: 'Erro ao deletar',
        description: err instanceof Error ? err.message : 'Erro inesperado',
      });
    }
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
            {sitesLoading ? '...' : insights.sitesTotal}
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Status</p>
          <h2 className="text-3xl font-bold mt-2 text-green-400">
            Online
          </h2>
        </div>

      </div>

      {/* 🔥 INSIGHTS RÁPIDOS */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
        <h2 className="text-sm font-semibold mb-3">Insights rápidos</h2>

        <ul className="text-sm text-zinc-400 space-y-2">
          <li>• Você monitora {insights.total} concorrentes</li>
          <li>• Você tem {insights.sitesTotal} sites cadastrados</li>
          <li>• {insights.weekCount} concorrentes adicionados nos últimos 7 dias</li>
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
      <Modal
        title="Adicionar concorrente"
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      >
        <CompetitorForm
          submitLabel="Salvar"
          isSubmitting={isMutating}
          onSubmit={onCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <Modal
        title="Editar concorrente"
        isOpen={!!editing}
        onClose={() => setEditing(null)}
      >
        <CompetitorForm
          initialValues={editing?.values}
          submitLabel="Atualizar"
          isSubmitting={isMutating}
          onSubmit={onEdit}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      {/* LISTA */}
      <div className="space-y-3">

        {items.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-4 border border-zinc-900 rounded-lg p-3"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{c.name}</p>
              <p className="text-xs text-zinc-500 truncate">
                {c.website}
              </p>
              <p className="text-[10px] text-zinc-600 mt-1">
                Criado em {formatDate(c.created_at)}
              </p>
            </div>

            <div className="flex items-center gap-2">

              <a
                href={c.website}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-300"
              >
                Abrir
              </a>

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
                onClick={() => void onDelete(c.id)}
              >
                Deletar
              </Button>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}