'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  supabase: SupabaseClient | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ session: null, supabase: null, loading: true });

// Module-level singleton to prevent multiple GoTrueClient instances
let sharedSupabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (sharedSupabase) return sharedSupabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  sharedSupabase = createSupabaseClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return sharedSupabase;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => getSupabase());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ session, supabase, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
