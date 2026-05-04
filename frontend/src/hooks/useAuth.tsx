import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { getSession, signInWithPassword, signOut, signUp } from '../services/authService';
import { supabase } from '../services/supabaseClient';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function formatAuthError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Erro inesperado ao autenticar.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const currentSession = await getSession();
        if (!isMounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (err) {
        if (!isMounted) return;
        setError(formatAuthError(err));
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void init();

    const { data } = supabase.auth.onAuthStateChange((_: AuthChangeEvent, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      error,
      clearError: () => setError(null),
      login: async ({ email, password }) => {
        setError(null);
        await signInWithPassword({ email, password });
      },
      register: async ({ email, password }) => {
        setError(null);
        await signUp({ email, password });
      },
      logout: async () => {
        setError(null);
        await signOut();
      },
    }),
    [error, isLoading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider />');
  }
  return ctx;
}

