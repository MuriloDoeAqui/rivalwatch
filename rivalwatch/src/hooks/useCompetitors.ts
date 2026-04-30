import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CompetitorRow } from '../services/competitorsService';
import {
  createCompetitor,
  deleteCompetitor,
  listCompetitors,
  updateCompetitor,
} from '../services/competitorsService';
import { useAuth } from './useAuth';

type State = {
  items: CompetitorRow[];
  isLoading: boolean;
  error: string | null;
};

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Erro inesperado.';
}

export function useCompetitors() {
  const { user } = useAuth();

  const [state, setState] = useState<State>({
    items: [],
    isLoading: true,
    error: null,
  });

  const [isMutating, setIsMutating] = useState(false);

  // =========================
  // LISTAR (ROBUSTO)
  // =========================
  const refresh = useCallback(async () => {
    if (!user) return;

    try {
      setState((s) => ({
        ...s,
        isLoading: true,
        error: null,
      }));

      const data = await listCompetitors(user.id);

      setState({
        items: data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: formatError(err),
      }));
    }
  }, [user]);

  // =========================
  // AUTO LOAD SE USUÁRIO EXISTIR
  // =========================
  useEffect(() => {
    if (!user) return;
    void refresh();
  }, [user, refresh]);

  // =========================
  // CREATE
  // =========================
  const create = useCallback(
    async (params: { name: string; website: string }) => {
      if (!user) return;

      setIsMutating(true);
      setState((s) => ({ ...s, error: null }));

      try {
        const created = await createCompetitor({
          userId: user.id,
          ...params,
        });

        setState((s) => ({
          ...s,
          items: [created, ...s.items],
        }));
      } catch (err) {
        setState((s) => ({ ...s, error: formatError(err) }));
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [user]
  );

  // =========================
  // DELETE
  // =========================
  const remove = useCallback(
    async (id: string) => {
      if (!user) return;

      setIsMutating(true);
      setState((s) => ({ ...s, error: null }));

      try {
        await deleteCompetitor({
          id,
          userId: user.id,
        });

        setState((s) => ({
          ...s,
          items: s.items.filter((c) => c.id !== id),
        }));
      } catch (err) {
        setState((s) => ({ ...s, error: formatError(err) }));
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [user]
  );

  // =========================
  // UPDATE
  // =========================
  const update = useCallback(
    async (params: { id: string; name: string; website: string }) => {
      if (!user) return;

      setIsMutating(true);
      setState((s) => ({ ...s, error: null }));

      try {
        const updated = await updateCompetitor({
          ...params,
          userId: user.id,
        });

        setState((s) => ({
          ...s,
          items: s.items.map((c) =>
            c.id === updated.id ? updated : c
          ),
        }));

        return updated;
      } catch (err) {
        setState((s) => ({ ...s, error: formatError(err) }));
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [user]
  );

  // =========================
  // MÉTRICAS SAAS
  // =========================
  const reports = useMemo(() => {
    return {
      total: state.items.length,
      lastAdded: state.items.slice(0, 5),
    };
  }, [state.items]);

  return {
    ...state,
    isMutating,
    refresh,
    create,
    remove,
    update,
    reports,
  };
}