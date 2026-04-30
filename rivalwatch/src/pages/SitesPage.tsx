import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useSites } from '../hooks/useSites';
import { useCompetitors } from '../hooks/useCompetitors';

type SiteFormValues = {
  name: string;
  url: string;
  competitorId: string | null;
};

export function SitesPage() {
  const {
    sites,
    isLoading,
    isMutating,
    error,
    create,
    remove,
    update,
  } = useSites();

  const { items: competitors } = useCompetitors();

  const { push } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<{
    id: string;
    values: SiteFormValues;
  } | null>(null);

  const [form, setForm] = useState<SiteFormValues>({
    name: '',
    url: '',
    competitorId: null,
  });

  useEffect(() => {
    if (!error) return;

    push({
      variant: 'error',
      title: 'Erro',
      description: error,
    });
  }, [error, push]);

  const resetForm = () => {
    setForm({
      name: '',
      url: '',
      competitorId: null,
    });
  };

  // =========================
  // CREATE
  // =========================
  const onCreate = async () => {
    try {
      await create({
        name: form.name,
        url: form.url,
        competitorId: form.competitorId,
      });

      push({ variant: 'success', title: 'Site criado' });
      setCreateOpen(false);
      resetForm();
    } catch {}
  };

  // =========================
  // UPDATE
  // =========================
  const onEdit = async () => {
    if (!editing) return;

    try {
      await update({
        id: editing.id,
        name: form.name,
        url: form.url,
        competitorId: form.competitorId,
      });

      push({ variant: 'success', title: 'Atualizado' });
      setEditing(null);
      resetForm();
    } catch {}
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Sites</h1>
        <p className="text-sm text-zinc-400">
          Gerencie os sites monitorados
        </p>
      </div>

      {/* BOTÃO */}
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)} disabled={isMutating}>
          + Novo site
        </Button>
      </div>

      {/* LISTA */}
      <div className="space-y-3">

        {isLoading ? (
          <p className="text-zinc-400">Carregando...</p>
        ) : sites.length === 0 ? (
          <p className="text-zinc-400">Nenhum site cadastrado</p>
        ) : (
          sites.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between border border-zinc-900 p-3 rounded-lg"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{s.name}</p>

                <p className="text-xs text-zinc-500 truncate">
                  {s.url}
                </p>

                {/* 🔥 CONCORRENTE */}
                <p className="text-xs text-indigo-400 mt-1">
                  {s.competitors?.name ?? 'Sem concorrente'}
                </p>
              </div>

              <div className="flex items-center gap-2">

                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-300 text-sm"
                >
                  Abrir
                </a>

                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditing({
                      id: s.id,
                      values: {
                        name: s.name,
                        url: s.url,
                        competitorId: s.competitor_id ?? null,
                      },
                    });

                    setForm({
                      name: s.name,
                      url: s.url,
                      competitorId: s.competitor_id ?? null,
                    });
                  }}
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  onClick={() => remove(s.id)}
                >
                  Deletar
                </Button>

              </div>
            </div>
          ))
        )}

      </div>

      {/* MODAL CRIAR */}
      <Modal
        title="Novo site"
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      >
        <input
          placeholder="Nome"
          className="input"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="URL"
          className="input mt-2"
          value={form.url}
          onChange={(e) =>
            setForm({ ...form, url: e.target.value })
          }
        />

        {/* 🔥 SELECT CONCORRENTE */}
        <select
          className="input mt-2"
          value={form.competitorId ?? ''}
          onChange={(e) =>
            setForm({
              ...form,
              competitorId: e.target.value || null,
            })
          }
        >
          <option value="">Sem concorrente</option>

          {competitors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <Button className="mt-4 w-full" onClick={onCreate}>
          Salvar
        </Button>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal
        title="Editar site"
        isOpen={!!editing}
        onClose={() => setEditing(null)}
      >
        <input
          placeholder="Nome"
          className="input"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="URL"
          className="input mt-2"
          value={form.url}
          onChange={(e) =>
            setForm({ ...form, url: e.target.value })
          }
        />

        <select
          className="input mt-2"
          value={form.competitorId ?? ''}
          onChange={(e) =>
            setForm({
              ...form,
              competitorId: e.target.value || null,
            })
          }
        >
          <option value="">Sem concorrente</option>

          {competitors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <Button className="mt-4 w-full" onClick={onEdit}>
          Atualizar
        </Button>
      </Modal>

    </div>
  );
}