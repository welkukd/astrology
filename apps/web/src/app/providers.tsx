'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  supabase: SupabaseClient | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ session: null, supabase: null, loading: false });

export function Providers({ children }: { children: React.ReactNode }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const [supabase] = useState(() => (url && key ? createSupabaseClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null));
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
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