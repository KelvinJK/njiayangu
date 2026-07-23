import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { GraduationCap, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : undefined,
    mode: typeof s.mode === "string" ? s.mode : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — NjiaYangu" },
      { name: "description", content: "Create your NjiaYangu account or sign in to save results, track applications, and receive deadline reminders." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Sign in — NjiaYangu" },
      { property: "og:description", content: "Save your Form Six results across devices with a NjiaYangu account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const { signInEmail, signUpEmail, signInGoogle, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const goAfterAuth = () => {
    if (next) {
      window.location.assign(next);
    } else {
      navigate({ to: "/account" });
    }
  };

  if (user) {
    // If a `next` target is set (e.g. OAuth consent), send them there instead of the account page.
    if (typeof window !== "undefined" && next) {
      window.location.replace(next);
      return null;
    }
    return (
      <AppShell>
        <div className="container-page py-16 text-center">
          <p className="text-lg font-medium">{t("auth.already")}</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild><Link to="/account">{t("auth.gotoAccount")}</Link></Button>
            <Button variant="outline" asChild><Link to="/">{t("auth.gotoHome")}</Link></Button>
          </div>
        </div>
      </AppShell>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await signInEmail(email, password);
        if (error) { toast.error(error); return; }
        toast.success(t("auth.welcome"));
        router.invalidate();
        goAfterAuth();
      } else if (mode === "signup") {
        const { error, needsVerification } = await signUpEmail(email, password, fullName || undefined, next);
        if (error) { toast.error(error); return; }
        if (needsVerification) {
          toast.success(t("auth.checkEmail"));
          setMode("signin");
        } else {
          toast.success(t("auth.welcome"));
          router.invalidate();
          goAfterAuth();
        }
      } else {
        const { error } = await resetPassword(email);
        if (error) { toast.error(error); return; }
        toast.success(t("auth.resetSent"));
        setMode("signin");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    // Persist next across the OAuth popup round-trip; the auth provider will
    // read it after the session hydrates and route the user back.
    if (next && typeof window !== "undefined") {
      try { sessionStorage.setItem("njiayangu.auth.next", next); } catch { /* ignore */ }
    }
    const { error } = await signInGoogle();
    if (error) { toast.error(error); setLoading(false); }
    // On success browser redirects (or popup closes then session hydrates).

  }

  return (
    <AppShell>
      <div className="container-page py-10 md:py-16">
        <div className="mx-auto max-w-md">
          <div className="flex items-center gap-2 mb-6 text-brand justify-center">
            <GraduationCap className="h-7 w-7" />
            <span className="text-xl font-semibold">{t("app.name")}</span>
          </div>

          <div className="rounded-2xl border bg-surface p-6 shadow-sm">
            <h1 className="text-2xl font-semibold">
              {mode === "signin" ? t("auth.signIn") : mode === "signup" ? t("auth.createAccount") : t("auth.forgot")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("auth.subtitle")}</p>

            {mode !== "forgot" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="mt-6 w-full h-11"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"/><path fill="#FBBC05" d="M5.84 14.1a6.87 6.87 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.65l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"/></svg>
                  {t("auth.google")}
                </Button>

                <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  {t("auth.or")}
                  <div className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <Label htmlFor="name">{t("auth.fullName")}</Label>
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Amina Hassan" />
                </div>
              )}
              <div>
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("auth.password")}</Label>
                    {mode === "signin" && (
                      <button type="button" className="text-xs text-brand hover:underline" onClick={() => setMode("forgot")}>
                        {t("auth.forgot")}?
                      </button>
                    )}
                  </div>
                  <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full h-11 mt-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? t("auth.signIn") : mode === "signup" ? t("auth.createAccount") : (<><Mail className="mr-2 h-4 w-4"/>{t("auth.sendReset")}</>)}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" && (
                <>{t("auth.noAccount")} <button className="text-brand hover:underline font-medium" onClick={() => setMode("signup")}>{t("auth.createAccount")}</button></>
              )}
              {mode === "signup" && (
                <>{t("auth.haveAccount")} <button className="text-brand hover:underline font-medium" onClick={() => setMode("signin")}>{t("auth.signIn")}</button></>
              )}
              {mode === "forgot" && (
                <button className="text-brand hover:underline" onClick={() => setMode("signin")}>← {t("auth.signIn")}</button>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("auth.disclaimer")}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
