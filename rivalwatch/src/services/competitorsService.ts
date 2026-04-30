import { supabase } from './supabaseClient';

export type CompetitorRow = {
  id: string;
  user_id: string;
  name: string;
  website: string;
  created_at: string;
};

// =========================
// LISTAR (FILTRADO POR USER)
// =========================
export async function listCompetitors(userId: string) {
  const { data, error } = await supabase
    .from('competitors')
    .select('id,user_id,name,website,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []) as CompetitorRow[];
}

// =========================
// CRIAR
// =========================
export async function createCompetitor(params: {
  userId: string;
  name: string;
  website: string;
}) {
  const { data, error } = await supabase
    .from('competitors')
    .insert({
      user_id: params.userId,
      name: params.name,
      website: params.website,
    })
    .select('id,user_id,name,website,created_at')
    .single();

  if (error) throw error;

  return data as CompetitorRow;
}

// =========================
// DELETAR (SEGURANÇA POR USER)
// =========================
export async function deleteCompetitor(params: {
  id: string;
  userId: string;
}) {
  const { error } = await supabase
    .from('competitors')
    .delete()
    .eq('id', params.id)
    .eq('user_id', params.userId);

  if (error) throw error;
}

// =========================
// ATUALIZAR (SEGURANÇA POR USER)
// =========================
export async function updateCompetitor(params: {
  id: string;
  userId: string;
  name: string;
  website: string;
}) {
  const { data, error } = await supabase
    .from('competitors')
    .update({
      name: params.name,
      website: params.website,
    })
    .eq('id', params.id)
    .eq('user_id', params.userId)
    .select('id,user_id,name,website,created_at')
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error(
      'Não foi possível atualizar. Verifique permissões ou se o item existe.'
    );
  }

  return data as CompetitorRow;
}