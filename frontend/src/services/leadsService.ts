import { supabase } from './supabaseClient';

export async function createLead(params: { email: string }) {
  const { error } = await supabase.from('leads').insert([{ email: params.email }]);
  if (error) throw error;
}

