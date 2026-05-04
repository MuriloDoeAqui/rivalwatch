import { useEffect, useState, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import type { CompetitorFormValues } from '../components/competitors/CompetitorForm';
import { useCompetitors } from '../hooks/useCompetitors';
import { useSites } from '../hooks/useSites';
import { useToast } from '../components/ui/Toast';

function formatDate(iso?: string) {
  if (!iso) return '—';

  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatPrice(price: any) {
  if (!price || isNaN(Number(price))) return 'Sem preço';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(price));
}

export function DashboardPage() {
  const {
    items,
    isLoading,
    error,
    create,
    remove,
    update,
  } = useCompetitors();

  const { sites, create: createSite } = useSites();
  const { push } = useToast();

  const [siteModal, setSiteModal] = useState<any>(null);
  const [siteForm, setSiteForm] = useState({ name: '', url: '' });

  useEffect(() => {
    if (error) {
      push({
        variant: 'error',
        title: 'Erro no dashboard',
        description: error,
      });
    }
  }, [error, push]);

  if (isLoading) {
    return (
      <div className="text-sm text-zinc-400">
        Carregando dashboard...
      </div>
    );
  }

  const sitesByCompetitor = useMemo(() => {
    const map: Record<string, number> = {};

    sites.forEach((s: any) => {
      if (!s.competitor_id) return;
      map[s.competitor_id] = (map[s.competitor_id] || 0) + 1;
    });

    return map;
  }, [sites]);

  const sitesGrouped = useMemo(() => {
    const map: Record<string, any[]> = {};

    sites.forEach((s: any) => {
      if (!s.competitor_id) return;

      if (!map[s.competitor_id]) {
        map[s.competitor_id] = [];
      }

      map[s.competitor_id].push(s);
    });

    return map;
  }, [sites]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">RivalWatch Dashboard</h1>
        <p className="text-sm text-zinc-400">
          Visão geral do seu SaaS
        </p>
      </div>

      {/* LISTA */}
      <div className="space-y-4">

        {items?.map((c) => {
          const competitorSites = sitesGrouped[c.id] || [];

          return (
            <div
              key={c.id}
              className="rounded-lg border border-zinc-900 bg-zinc-900/40 p-4 space-y-3"
            >

              {/* INFO PRINCIPAL */}
              <div>
                <p className="font-semibold">{c.name}</p>

                <p className="text-xs text-zinc-500 break-all">
                  {c.website}
                </p>

                <p className="text-[10px] text-zinc-600 mt-1">
                  Criado em {formatDate(c.created_at)}
                </p>

                <p className="text-xs text-indigo-400 mt-2">
                  {competitorSites.length} site(s) vinculados
                </p>
              </div>

              {/* SITES */}
              <div className="space-y-2">
                {competitorSites.length > 0 ? (
                  competitorSites.map((s: any) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded bg-zinc-950 px-3 py-2 text-xs"
                    >
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-green-400">
                          {formatPrice(s.price)}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {formatDate(s.last_checked)}
                        </div>
                      </div>

                      <a
                        href={s.url}
                        target="_blank"
                        className="text-indigo-400 hover:underline"
                      >
                        abrir
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic">
                    Nenhum site vinculado
                  </p>
                )}
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}