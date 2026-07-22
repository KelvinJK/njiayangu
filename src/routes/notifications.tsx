import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Bell, BellOff, ExternalLink, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — NjiaYangu" },
      { name: "description", content: "HESLB, application and calendar reminders from NjiaYangu." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Notifications — NjiaYangu" },
      { property: "og:description", content: "Your in-app inbox for deadlines and updates." },
    ],
  }),
  component: NotificationsPage,
});

interface Notif {
  id: string;
  title: string;
  body: string | null;
  kind: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

function NotificationsPage() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const [items, setItems] = useState<Notif[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setItems((data ?? []) as Notif[]);
    })();
  }, [user]);

  async function markAllRead() {
    if (!user) return;
    setBusy(true);
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user.id).is("read_at", null);
    setItems((prev) => prev?.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() })) ?? []);
    setBusy(false);
  }

  if (loading) return <AppShell><div className="container-page py-16 flex justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div></AppShell>;
  if (!user) {
    return (
      <AppShell>
        <div className="container-page py-16 max-w-md mx-auto text-center">
          <Bell className="h-10 w-10 text-brand mx-auto"/>
          <h1 className="mt-3 text-2xl font-semibold">{t("notif.signInTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("notif.signInSub")}</p>
          <Button asChild className="mt-6"><Link to="/auth">{t("auth.signIn")}</Link></Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container-page py-8 md:py-12 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{t("notif.title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("notif.subtitle")}</p>
          </div>
          {items && items.some((n) => !n.read_at) && (
            <Button size="sm" variant="outline" onClick={markAllRead} disabled={busy}>{t("notif.markAll")}</Button>
          )}
        </div>

        <div className="mt-6 space-y-2">
          {items === null && <div className="text-muted-foreground text-sm">{t("common.loading")}…</div>}
          {items?.length === 0 && (
            <div className="rounded-xl border bg-surface p-8 text-center">
              <BellOff className="h-8 w-8 text-muted-foreground mx-auto"/>
              <p className="mt-3 text-muted-foreground">{t("notif.empty")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("notif.emptySub")}</p>
            </div>
          )}
          {items?.map((n) => (
            <div key={n.id} className={`rounded-xl border p-4 ${n.read_at ? "bg-surface" : "bg-accent/40 border-brand/30"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium">{n.title}</div>
                  {n.body && <div className="text-sm text-muted-foreground mt-1">{n.body}</div>}
                  <div className="text-xs text-muted-foreground mt-2">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</div>
                </div>
                {n.link && (
                  <a href={n.link} target="_blank" rel="noreferrer" className="text-brand text-sm inline-flex items-center gap-1 hover:underline">
                    {t("common.open")} <ExternalLink className="h-3.5 w-3.5"/>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">{t("notif.emailFooter")}</p>
      </div>
    </AppShell>
  );
}
