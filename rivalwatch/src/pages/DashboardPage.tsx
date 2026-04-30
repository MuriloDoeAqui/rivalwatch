import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import type { CompetitorFormValues } from '../components/competitors/CompetitorForm';
import { CompetitorForm } from '../components/competitors/CompetitorForm';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useCompetitors } from '../hooks/useCompetitors';

function formatDate(iso?: string) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return '—';
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

  // 📊 INSIGHTS
  const insights = useMemo(() => {
    const total = items.length;

    const lastAdded = items[0];

    const weekCount = items.filter((c) => {
      const created = new Date(c.created_at);
      const now = new Date();
      return now.getTime() - created.getTime() < 7 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      total,
      weekCount,
      lastAddedText: lastAdded ? lastAdded.name : 'Nenhum ainda',
    };
  }, [items]);

  // CREATE
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

  // UPDATE
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

  // DELETE
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
          Visão inteligente dos seus concorrentes
        </p>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Total de concorrentes</p>
          <h2 className="text-3xl font-bold mt-2">
            {isLoading ? '...' : insights.total}
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Nesta semana</p>
          <h2 className="text-3xl font-bold mt-2 text-indigo-300">
            {isLoading ? '...' : insights.weekCount}
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Último adicionado</p>
          <h2 className="text-sm font-semibold mt-2">
            {isLoading ? '...' : insights.lastAddedText}
          </h2>
        </div>

      </div>

      {/* BOTÃO */}
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)} disabled={isMutating}>
          + Adicionar concorrente
        </Button>
      </div>

      {/* MODAL CREATE */}
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

      {/* MODAL EDIT */}
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

        {isLoading ? (
          <p className="text-sm text-zinc-400">Carregando...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nenhum concorrente ainda
          </p>
        ) : (
          items.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 border border-zinc-900 rounded-lg p-3"
            >

              {/* INFO */}
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{c.name}</p>
                <p className="text-xs text-zinc-500 truncate">
                  {c.website}
                </p>
              </div>

              {/* BOTÕES */}
              <div className="flex items-center gap-2 shrink-0">

                <a
                  href={c.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-indigo-300 hover:text-indigo-200"
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
          ))
        )}

      </div>

    </div>
  );
}