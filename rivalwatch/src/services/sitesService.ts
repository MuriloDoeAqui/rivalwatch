import { supabase } from './supabaseClient';

export type SiteRow = {
  id: string;
  user_id: string;
  name: string;
  url: string;
  competitor_id: string | null;
  competitors?: {
    id: string;
    name: string;
  } | null;
  created_at: string;
};

// =========================
// LISTAR (COM JOIN + NORMALIZAÇÃO)
// =========================
export async function listSites(userId: string) {
  const { data, error } = await supabase
    .from('sites')
    .select(`
      id,
      user_id,
      name,
      url,
      competitor_id,
      created_at,
      competitors:competitors (
        id,
        name
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const normalized = (data ?? []).map((item: any) => ({
    ...item,
    competitors: Array.isArray(item.competitors)
      ? item.competitors[0] ?? null
      : item.competitors ?? null,
  }));

  return normalized as SiteRow[];
}

// =========================
// CREATE
// =========================
export async function createSite(params: {
  userId: string;
  name: string;
  url: string;
  competitorId: string | null;
}) {
  const { data, error } = await supabase
    .from('sites')
    .insert({
      user_id: params.userId,
      name: params.name,
      url: params.url,
      competitor_id: params.competitorId,
    })
    .select(`
      id,
      user_id,
      name,
      url,
      competitor_id,
      created_at
    `)
    .single();

  if (error) throw error;

  return {
    ...data,
    competitors: null, // evita undefined no frontend
  } as SiteRow;
}

// =========================
// DELETE
// =========================
export async function deleteSite(params: {
  id: string;
  userId: string;
}) {
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', params.id)
    .eq('user_id', params.userId);

  if (error) throw error;
}

// =========================
// UPDATE
// =========================
export async function updateSite(params: {
  id: string;
  userId: string;
  name: string;
  url: string;
  competitorId: string | null;
}) {
  const { data, error } = await supabase
    .from('sites')
    .update({
      name: params.name,
      url: params.url,
      competitor_id: params.competitorId,
    })
    .eq('id', params.id)
    .eq('user_id', params.userId)
    .select(`
      id,
      user_id,
      name,
      url,
      competitor_id,
      created_at
    `)
    .single();

  if (error) throw error;

  return {
    ...data,
    competitors: null, // mantém padrão
  } as SiteRow;
}