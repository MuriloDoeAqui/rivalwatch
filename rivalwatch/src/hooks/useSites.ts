import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import type { SiteRow } from '../services/sitesService';
import {
  listSites,
  createSite,
  deleteSite,
  updateSite,
} from '../services/sitesService';

type State = {
  items: SiteRow[];
  isLoading: boolean;
  error: string | null;
};

export function useSites() {
  const { user } = useAuth();

  const [state, setState] = useState<State>({
    items: [],
    isLoading: true,
    error: null,
  });

  const [isMutating, setIsMutating] = useState(false);

  // =========================
  // LISTAR
  // =========================
  const refresh = useCallback(async () => {
    if (!user?.id) return;

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const data = await listSites(user.id);

      setState({
        items: data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro ao carregar sites',
      }));
    }
  }, [user?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // =========================
  // CREATE 🔥 COM competitorId
  // =========================
  const create = useCallback(
    async (values: {
      name: string;
      url: string;
      competitorId: string | null;
    }) => {
      if (!user?.id) return;

      setIsMutating(true);
      setState((s) => ({ ...s, error: null }));

      try {
        const created = await createSite({
          userId: user.id,
          name: values.name,
          url: values.url,
          competitorId: values.competitorId,
        });

        setState((s) => ({
          ...s,
          items: [created, ...s.items],
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Erro ao criar site',
        }));
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [user?.id]
  );

  // =========================
  // DELETE
  // =========================
  const remove = useCallback(
    async (id: string) => {
      if (!user?.id) return;

      setIsMutating(true);
      setState((s) => ({ ...s, error: null }));

      try {
        await deleteSite({ id, userId: user.id });

        setState((s) => ({
          ...s,
          items: s.items.filter((i) => i.id !== id),
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Erro ao deletar site',
        }));
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [user?.id]
  );

  // =========================
  // UPDATE 🔥 COM competitorId
  // =========================
  const update = useCallback(
    async (values: {
      id: string;
      name: string;
      url: string;
      competitorId: string | null;
    }) => {
      if (!user?.id) return;

      setIsMutating(true);
      setState((s) => ({ ...s, error: null }));

      try {
        const updated = await updateSite({
          id: values.id,
          name: values.name,
          url: values.url,
          competitorId: values.competitorId,
          userId: user.id,
        });

        setState((s) => ({
          ...s,
          items: s.items.map((i) =>
            i.id === updated.id ? updated : i
          ),
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Erro ao atualizar site',
        }));
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [user?.id]
  );

  // =========================
  // MÉTRICAS
  // =========================
  const reports = useMemo(() => {
    return {
      total: state.items.length,
      lastAdded: state.items.slice(0, 5),
    };
  }, [state.items]);

  return {
    sites: state.items,
    isLoading: state.isLoading,
    error: state.error,

    isMutating,
    refresh,
    create,
    remove,
    update,
    reports,
  };
}