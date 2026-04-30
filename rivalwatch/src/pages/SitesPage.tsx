import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useSites } from '../hooks/useSites';

type SiteFormValues = {
  name: string;
  website: string;
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

  const { push } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<{
    id: string;
    values: SiteFormValues;
  } | null>(null);

  const [form, setForm] = useState<SiteFormValues>({
    name: '',
    website: '',
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
    setForm({ name: '', website: '' });
  };

  const onCreate = async () => {
    try {
      await create(form);
      push({ variant: 'success', title: 'Site criado' });
      setCreateOpen(false);
      resetForm();
    } catch {}
  };

  const onEdit = async () => {
    if (!editing) return;

    try {
      await update({ id: editing.id, ...form });
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
        <Button onClick={() => setCreateOpen(true)}>
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
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-zinc-500">{s.url}</p>
              </div>

              <div className="flex gap-2">

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
                        website: s.url,
                      },
                    });
                    setForm({
                      name: s.name,
                      website: s.url,
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
          value={form.website}
          onChange={(e) =>
            setForm({ ...form, website: e.target.value })
          }
        />

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
          value={form.website}
          onChange={(e) =>
            setForm({ ...form, website: e.target.value })
          }
        />

        <Button className="mt-4 w-full" onClick={onEdit}>
          Atualizar
        </Button>
      </Modal>

    </div>
  );
}