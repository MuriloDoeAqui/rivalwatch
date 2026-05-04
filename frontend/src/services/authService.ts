import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export type AuthSession = Session;
export type AuthUser = User;

export async function signInWithPassword(params: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword(params);
  if (error) throw error;
  return data;
}

export async function signUp(params: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signUp(params);
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

