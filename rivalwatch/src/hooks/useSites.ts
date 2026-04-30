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

  const refresh = useCallback(async () => {
    if (!user) return;

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const data = await listSites(user.id);
      setState({ items: data, isLoading: false, error: null });
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Erro',
      }));
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // 🔥 CREATE
  const create = useCallback(
    async (values: { name: string; website: string }) => {
      if (!user) return;

      setIsMutating(true);

      try {
        const created = await createSite({
          userId: user.id,
          ...values,
        });

        setState((s) => ({
          ...s,
          items: [created, ...s.items],
        }));
      } finally {
        setIsMutating(false);
      }
    },
    [user]
  );

  // 🔥 DELETE
  const remove = useCallback(
    async (id: string) => {
      if (!user) return;

      setIsMutating(true);

      try {
        await deleteSite({ id, userId: user.id });

        setState((s) => ({
          ...s,
          items: s.items.filter((i) => i.id !== id),
        }));
      } finally {
        setIsMutating(false);
      }
    },
    [user]
  );

  // 🔥 UPDATE
  const update = useCallback(
    async (values: { id: string; name: string; website: string }) => {
      if (!user) return;

      setIsMutating(true);

      try {
        const updated = await updateSite({
          ...values,
          userId: user.id,
        });

        setState((s) => ({
          ...s,
          items: s.items.map((i) =>
            i.id === updated.id ? updated : i
          ),
        }));
      } finally {
        setIsMutating(false);
      }
    },
    [user]
  );

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