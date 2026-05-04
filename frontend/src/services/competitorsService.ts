import { supabase } from './supabaseClient';

export interface CompetitorRow {
  id: string;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// =========================
// 📝 CRUD OPERATIONS
// =========================

export async function listCompetitors(userId: string): Promise<CompetitorRow[]> {
  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createCompetitor(
  userId: string,
  competitor: Omit<CompetitorRow, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<CompetitorRow> {
  const { data, error } = await supabase
    .from('competitors')
    .insert({
      ...competitor,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCompetitor(
  id: string,
  updates: Partial<Omit<CompetitorRow, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
): Promise<CompetitorRow> {
  const { data, error } = await supabase
    .from('competitors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCompetitor(id: string): Promise<void> {
  const { error } = await supabase
    .from('competitors')
    .delete()
    .eq('id', id);

  if (error) throw error;
}