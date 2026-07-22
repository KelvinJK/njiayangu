import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Cloud, CloudOff, Loader2, LogOut, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { REGIONS } from "@/data/institutions";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — NjiaYangu" },
      { name: "description", content: "Manage your NjiaYangu profile, academic results, notifications and sync status." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "My account — NjiaYangu" },
      { property: "og:description", content: "Manage your profile and application preferences." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { t } = useI18n();
  const { user, loading, signOut } = useAuth();
  const { profile, setProfile, syncStatus, online, lastSyncedAt, sync, saved, heslb } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");

  useEffect(() => {
    setName(profile.fullName ?? "");
    setPhone(profile.phone ?? "");
    setRegion(profile.region ?? "");
  }, [profile.fullName, profile.phone, profile.region]);

  if (loading) return <AppShell><div className="container-page py-16 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/></div></AppShell>;

  if (!user) {
    return (
      <AppShell>
        <div className="container-page py-16 max-w-md mx-auto text-center">
          <ShieldCheck className="h-10 w-10 text-brand mx-auto"/>
          <h1 className="mt-3 text-2xl font-semibold">{t("account.signInRequired")}</h1>
          <p className="mt-2 text-muted-foreground">{t("account.signInRequiredSub")}</p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button asChild><Link to="/auth">{t("auth.signIn")}</Link></Button>
            <Button variant="outline" asChild><Link to="/">{t("auth.gotoHome")}</Link></Button>
          </div>
        </div>
      </AppShell>
    );
  }

  function saveProfile() {
    setProfile({ ...profile, fullName: name, phone, region });
    toast.success(t("account.saved"));
  }

  async function handleSignOut() {
    await signOut();
    toast.success(t("account.signedOut"));
    navigate({ to: "/" });
  }

  const heslbReady = Object.values(heslb).filter((v) => v === "ready").length;
  const heslbTotal = Object.keys(heslb).length;

  return (
    <AppShell>
      <div className="container-page py-8 md:py-12 max-w-4xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{t("account.title")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
          </div>
          <SyncBadge status={syncStatus} online={online} lastSyncedAt={lastSyncedAt} onSync={sync} t={t} />
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <StatCard label={t("account.saved")} value={saved.length.toString()} />
          <StatCard label={t("account.heslbReady")} value={`${heslbReady}/${heslbTotal || 0}`} />
          <StatCard label={t("account.combination")} value={profile.academics?.combinationCode ?? "—"} />
        </div>

        <section className="mt-8 rounded-2xl border bg-surface p-6">
          <h2 className="text-lg font-semibold">{t("account.profileSection")}</h2>
          <p className="text-sm text-muted-foreground">{t("account.profileSub")}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fn">{t("auth.fullName")}</Label>
              <Input id="fn" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ph">{t("account.phone")}</Label>
              <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+255…" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="rg">{t("account.region")}</Label>
              <select id="rg" value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1 w-full h-10 rounded-md border bg-background px-3 text-sm">
                <option value="">{t("account.selectRegion")}</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={saveProfile}><Save className="h-4 w-4 mr-2"/>{t("account.save")}</Button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border bg-surface p-6">
          <h2 className="text-lg font-semibold">{t("account.academic")}</h2>
          <p className="text-sm text-muted-foreground">{t("account.academicSub")}</p>
          <div className="mt-4">
            <Button asChild variant="outline"><Link to="/find-my-courses">{t("account.updateAcademics")}</Link></Button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border bg-surface p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Bell className="h-5 w-5"/>{t("account.notifications")}</h2>
          <p className="text-sm text-muted-foreground">{t("account.notificationsSub")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline"><Link to="/notifications">{t("account.viewInbox")}</Link></Button>
          </div>
        </section>

        <div className="mt-10 flex justify-end">
          <Button variant="outline" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2"/>{t("account.signOut")}</Button>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-surface p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function SyncBadge({ status, online, lastSyncedAt, onSync, t }: { status: string; online: boolean; lastSyncedAt: number | null; onSync: () => Promise<void>; t: (k: string) => string }) {
  const [busy, setBusy] = useState(false);
  const label = !online ? t("sync.offline") : status === "syncing" || busy ? t("sync.syncing") : status === "synced" ? t("sync.synced") : status === "error" ? t("sync.error") : t("sync.pending");
  const Icon = !online ? CloudOff : status === "error" ? CloudOff : Cloud;
  const color = !online ? "bg-muted text-muted-foreground" : status === "error" ? "bg-destructive/10 text-destructive" : status === "synced" ? "bg-success/10 text-success" : "bg-accent text-accent-foreground";
  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${color}`}>
        <Icon className="h-3.5 w-3.5"/> {label}
        {lastSyncedAt ? <span className="opacity-70">· {new Date(lastSyncedAt).toLocaleTimeString()}</span> : null}
      </div>
      <button
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        onClick={async () => { setBusy(true); await onSync(); setBusy(false); }}
        disabled={!online || busy}
        aria-label={t("sync.now")}
      >
        <RefreshCw className={`h-3.5 w-3.5 ${busy ? "animate-spin" : ""}`}/>
      </button>
    </div>
  );
}
