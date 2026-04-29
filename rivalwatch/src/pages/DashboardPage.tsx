import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import type { CompetitorFormValues } from '../components/competitors/CompetitorForm';
import { CompetitorForm } from '../components/competitors/CompetitorForm';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useCompetitors } from '../hooks/useCompetitors';

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function DashboardPage() {
  const { items, isLoading, isMutating, error, create, remove, update, reports } = useCompetitors();
  const { push } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; values: CompetitorFormValues } | null>(null);

  useEffect(() => {
    if (!error) return;
    push({ variant: 'error', title: 'Algo deu errado', description: error });
  }, [error, push]);

  const onCreate = async (values: CompetitorFormValues) => {
    try {
      await create(values);
      push({ variant: 'success', title: 'Concorrente adicionado' });
      setCreateOpen(false);
    } catch (err) {
      push({
        variant: 'error',
        title: 'Falha ao criar concorrente',
        description: err instanceof Error ? err.message : 'Tente novamente.',
      });
    }
  };

  const onEdit = async (values: CompetitorFormValues) => {
    if (!editing) return;

    try {
      await update({ id: editing.id, ...values });
      push({ variant: 'success', title: 'Concorrente atualizado' });
      setEditing(null);
    } catch (err) {
      push({
        variant: 'error',
        title: 'Falha ao editar concorrente',
        description: err instanceof Error ? err.message : 'Tente novamente.',
      });
    }
  };

  const onDelete = async (id: string) => {
    try {
      await remove(id);
      push({ variant: 'success', title: 'Concorrente removido' });
    } catch (err) {
      push({
        variant: 'error',
        title: 'Falha ao deletar concorrente',
        description: err instanceof Error ? err.message : 'Tente novamente.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-zinc-400">Dashboard</div>
        <h1 className="mt-1 text-xl font-semibold">Concorrentes</h1>
        <p className="mt-2 text-sm text-zinc-400">Cadastre e acompanhe seus principais concorrentes.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
          <div className="text-xs text-zinc-400">Total de concorrentes</div>
          <div className="mt-2 text-3xl font-semibold">{isLoading ? '—' : reports.total}</div>
        </div>
        <div className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
          <div className="text-xs text-zinc-400">Últimos adicionados</div>
          <div className="mt-3 space-y-2">
            {isLoading ? (
              <div className="text-sm text-zinc-400">Carregando…</div>
            ) : reports.lastAdded.length === 0 ? (
              <div className="text-sm text-zinc-500">Nenhum ainda.</div>
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

      <section className="rounded-lg border border-zinc-900 bg-zinc-950 p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Lista</div>
            <div className="mt-1 text-xs text-zinc-400">Crie, edite e remova seus concorrentes.</div>
          </div>
          <Button variant="primary" onClick={() => setCreateOpen(true)} disabled={isMutating}>
            Adicionar
          </Button>
        </div>

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

        <div className="mt-4">
          {isLoading ? (
            <div className="text-sm text-zinc-400">Carregando concorrentes…</div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950 p-8 text-center">
              <div className="text-sm font-medium">Nenhum concorrente ainda</div>
              <div className="mt-2 text-sm text-zinc-400">
                Adicione seu primeiro concorrente para começar a gerar insights e relatórios.
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="primary" onClick={() => setCreateOpen(true)}>
                  Adicionar concorrente
                </Button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-900">
              {items.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="truncate text-xs text-zinc-500">{c.website}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      className="text-sm text-indigo-300 hover:text-indigo-200"
                      href={c.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir
                    </a>
                    <Button
                      variant="secondary"
                      onClick={() => setEditing({ id: c.id, values: { name: c.name, website: c.website } })}
                      disabled={isMutating}
                    >
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => void onDelete(c.id)} disabled={isMutating}>
                      Deletar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

