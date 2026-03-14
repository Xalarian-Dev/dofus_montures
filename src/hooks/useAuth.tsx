import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithDiscord: () => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Read the Supabase session synchronously from localStorage.
 * This avoids the async gap of getSession() that causes a flash in production.
 */
function getInitialSession(): { user: User | null; hasSession: boolean } {
  try {
    const storageKey = Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (storageKey) {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const sessionUser = parsed?.user ?? parsed?.currentSession?.user;
        if (sessionUser) return { user: sessionUser as User, hasSession: true };
      }
    }
  } catch {
    // Ignore parse errors — fall through to async resolution
  }
  return { user: null, hasSession: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = getInitialSession();
  const [user, setUser] = useState<User | null>(initial.user);
  const [loading, setLoading] = useState(!initial.hasSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });

  const signInWithDiscord = () =>
    supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });

  const signOut = () => supabase.auth.signOut();

  return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithDiscord, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
