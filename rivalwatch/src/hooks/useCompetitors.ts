import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CompetitorRow } from '../services/competitorsService';
import { createCompetitor, deleteCompetitor, listCompetitors, updateCompetitor } from '../services/competitorsService';
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
  const [state, setState] = useState<State>({ items: [], isLoading: true, error: null });
  const [isMutating, setIsMutating] = useState(false);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await listCompetitors();
      setState({ items: data, isLoading: false, error: null });
    } catch (err) {
      setState((s) => ({ ...s, isLoading: false, error: formatError(err) }));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void refresh();
  }, [refresh, user]);

  const create = useCallback(
    async (params: { name: string; website: string }) => {
      if (!user) return;
      setIsMutating(true);
      setState((s) => ({ ...s, error: null }));
      try {
        const created = await createCompetitor({ userId: user.id, ...params });
        setState((s) => ({ ...s, items: [created, ...s.items] }));
      } catch (err) {
        setState((s) => ({ ...s, error: formatError(err) }));
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [user]
  );

  const remove = useCallback(async (id: string) => {
    setIsMutating(true);
    setState((s) => ({ ...s, error: null }));
    try {
      await deleteCompetitor({ id });
      setState((s) => ({ ...s, items: s.items.filter((c) => c.id !== id) }));
    } catch (err) {
      setState((s) => ({ ...s, error: formatError(err) }));
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const update = useCallback(
    async (params: { id: string; name: string; website: string }) => {
      if (!user) return;
    setIsMutating(true);
    setState((s) => ({ ...s, error: null }));
    try {
        const updated = await updateCompetitor({ ...params, userId: user.id });
        setState((s) => ({ ...s, items: s.items.map((c) => (c.id === updated.id ? updated : c)) }));
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

  const reports = useMemo(() => {
    const total = state.items.length;
    const lastAdded = state.items.slice(0, 5);
    return { total, lastAdded };
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

