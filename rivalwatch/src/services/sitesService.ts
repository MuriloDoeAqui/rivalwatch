import { supabase } from './supabaseClient';

export type SiteRow = {
  id: string;
  user_id: string;
  name: string;
  url: string;
  created_at: string;
};

export async function listSites(userId: string) {
  const { data, error } = await supabase
    .from('sites')
    .select('id,user_id,name,url,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as SiteRow[];
}

export async function createSite(params: { userId: string; name: string; url: string }) {
  const { data, error } = await supabase
    .from('sites')
    .insert({
      user_id: params.userId,
      name: params.name,
      url: params.url,
    })
    .select()
    .single();

  if (error) throw error;
  return data as SiteRow;
}

export async function deleteSite(params: { id: string; userId: string }) {
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', params.id)
    .eq('user_id', params.userId);

  if (error) throw error;
}

export async function updateSite(params: {
  id: string;
  userId: string;
  name: string;
  url: string;
}) {
  const { data, error } = await supabase
    .from('sites')
    .update({
      name: params.name,
      url: params.url,
    })
    .eq('id', params.id)
    .eq('user_id', params.userId)
    .select()
    .single();

  if (error) throw error;
  return data as SiteRow;
}