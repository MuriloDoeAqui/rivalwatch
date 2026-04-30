import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import type { CompetitorFormValues } from '../components/competitors/CompetitorForm';
import { CompetitorForm } from '../components/competitors/CompetitorForm';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useCompetitors } from '../hooks/useCompetitors';

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
  const { items, isLoading, isMutating, error, create, remove, update, reports } =
    useCompetitors();

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

  const onCreate = async (values: CompetitorFormValues) => {
    try {
      await create(values);
      push({ variant: 'success', title: 'Concorrente adicionado' });
      setCreateOpen(false);
    } catch (err) {
      push({
        variant: 'error',
        title: 'Erro ao criar',
        description: err instanceof Error ? err.message : 'Tente novamente',
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
        description: err instanceof Error ? err.message : 'Tente novamente',
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
        description: err instanceof Error ? err.message : 'Tente novamente',
      });
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Visão geral do seu RivalWatch SaaS
        </p>
      </div>

      {/* CARDS SAAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Concorrentes</p>
          <h2 className="text-3xl font-bold mt-2">
            {isLoading ? '...' : items.length}
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Últimos adicionados</p>
          <h2 className="text-3xl font-bold mt-2">
            {isLoading ? '...' : reports.lastAdded.length}
          </h2>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Status</p>
          <h2 className="text-3xl font-bold mt-2 text-green-400">
            Ativo
          </h2>
        </div>

      </div>

      {/* BOTÃO */}
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)} disabled={isMutating}>
          + Adicionar concorrente
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

      {/* LISTA */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-5">

        <h2 className="text-sm font-semibold mb-4">Seus concorrentes</h2>

        {isLoading ? (
          <p className="text-sm text-zinc-400">Carregando...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhum concorrente ainda</p>
        ) : (
          <div className="space-y-3">
            {items.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border border-zinc-900 rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-zinc-500">{c.website}</p>
                </div>

                <div className="flex gap-2">
                  <a
                    className="text-sm text-indigo-300"
                    href={c.website}
                    target="_blank"
                  >
                    Abrir
                  </a>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      setEditing({
                        id: c.id,
                        values: { name: c.name, website: c.website },
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
        )}
      </div>

    </div>
  );
}