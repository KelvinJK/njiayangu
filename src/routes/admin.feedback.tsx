import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/feedback")({
  head: () => ({
    meta: [
      { title: "Admin — Feedback inbox — NjiaYangu" },
      { name: "description", content: "Admin inbox for feedback submitted by NjiaYangu users." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Page,
});

type Feedback = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  message: string;
  category: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

const STATUSES = ["new", "in_progress", "resolved", "spam"] as const;

function Page() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [claiming, setClaiming] = useState(false);
  const [claimMsg, setClaimMsg] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setItems((data as Feedback[]) ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  async function updateItem(id: string, patch: Partial<Feedback>) {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    await supabase.from("feedback").update(patch).eq("id", id);
  }

  async function removeItem(id: string) {
    if (!confirm("Delete this feedback permanently?")) return;
    setItems((xs) => xs.filter((x) => x.id !== id));
    await supabase.from("feedback").delete().eq("id", id);
  }

  async function claimAdmin() {
    setClaiming(true);
    setClaimMsg("");
    const { data, error } = await supabase.rpc("claim_first_admin");
    setClaiming(false);
    if (error) {
      setClaimMsg(error.message);
      return;
    }
    if (data === true) {
      setClaimMsg("You are now the admin. Reloading…");
      setTimeout(() => window.location.reload(), 800);
    } else {
      setClaimMsg("An admin already exists. Ask them to grant you access.");
    }
  }

  if (authLoading || roleLoading) {
    return (
      <AppShell>
        <div className="container-page py-16 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <div className="container-page py-16 max-w-md">
          <h1 className="text-2xl font-semibold">Admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to view the feedback inbox.</p>
          <Link to="/auth" className="mt-4 inline-block h-11 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium leading-[44px]">
            Sign in
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="container-page py-12 max-w-lg">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand" />
              <h1 className="text-xl font-semibold">Admin access required</h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account doesn't have the admin role. If this is a fresh install and no admin has been claimed yet, you can claim it now.
            </p>
            <button
              onClick={claimAdmin}
              disabled={claiming}
              className="mt-4 h-11 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60"
            >
              {claiming && <Loader2 className="h-4 w-4 animate-spin" />} Claim first admin
            </button>
            {claimMsg && <p className="mt-3 text-sm">{claimMsg}</p>}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="container-page py-8">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand" />
              <h1 className="text-2xl font-semibold">Feedback inbox</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">All messages sent through the Contact page.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 px-3 rounded-md border bg-surface text-sm"
            >
              <option value="all">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button onClick={load} className="h-10 px-3 rounded-md border bg-surface text-sm inline-flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading messages…
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
            No feedback yet.
          </div>
        ) : (
          <ul className="mt-6 grid gap-3">
            {items.map((f) => (
              <li key={f.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{f.name}</span>
                      <a href={`mailto:${f.email}`} className="text-xs text-brand inline-flex items-center gap-1 hover:underline">
                        <Mail className="h-3 w-3" /> {f.email}
                      </a>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-surface border">{f.category}</span>
                      {f.user_id && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand">signed-in</span>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{new Date(f.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={f.status}
                      onChange={(e) => updateItem(f.id, { status: e.target.value })}
                      className="h-9 px-2 rounded-md border bg-surface text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeItem(f.id)}
                      aria-label="Delete"
                      className="h-9 w-9 grid place-items-center rounded-md border bg-surface text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm whitespace-pre-wrap">{f.message}</p>
                <textarea
                  defaultValue={f.admin_notes ?? ""}
                  placeholder="Admin notes (private)"
                  onBlur={(e) => {
                    const v = e.target.value;
                    if (v !== (f.admin_notes ?? "")) updateItem(f.id, { admin_notes: v || null });
                  }}
                  rows={2}
                  className="mt-3 w-full px-3 py-2 rounded-md border bg-surface text-sm"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
