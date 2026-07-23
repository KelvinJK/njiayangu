import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpEmail: (email: string, password: string, fullName?: string, next?: string) => Promise<{ error?: string; needsVerification?: boolean }>;
  signInGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
      if (s && typeof window !== "undefined") {
        try {
          const next = sessionStorage.getItem("njiayangu.auth.next");
          if (next && next.startsWith("/") && !next.startsWith("//")) {
            sessionStorage.removeItem("njiayangu.auth.next");
            window.location.replace(next);
          }
        } catch { /* ignore */ }
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user: session?.user ?? null,
    session,
    loading,
    async signInEmail(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message };
    },
    async signUpEmail(email, password, fullName, next) {
      const origin = typeof window !== "undefined" ? window.location.origin : undefined;
      const redirect = origin
        ? next && next.startsWith("/") && !next.startsWith("//")
          ? `${origin}/auth?next=${encodeURIComponent(next)}`
          : origin
        : undefined;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirect,
          data: fullName ? { full_name: fullName } : undefined,
        },
      });
      if (error) return { error: error.message };
      return { needsVerification: !data.session };
    },
    async signInGoogle() {
      try {
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
        });
        if (result.error) return { error: (result.error as Error).message ?? "Sign-in failed" };
        return {};
      } catch (e) {
        return { error: e instanceof Error ? e.message : "Sign-in failed" };
      }
    },
    async signOut() {
      await supabase.auth.signOut();
    },
    async resetPassword(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth?mode=reset` : undefined,
      });
      return { error: error?.message };
    },
  }), [session, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
