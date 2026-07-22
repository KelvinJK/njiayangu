import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { HESLB_CHECKLIST, HESLB_STEPS, HESLB_MISTAKES, HESLB_FAQ, HESLB_ACADEMIC_YEAR } from "@/data/heslb";
import { CheckCircle2, AlertCircle, HelpCircle, MinusCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/heslb")({
  head: () => ({
    meta: [
      { title: "HESLB Guide & Checklist — NjiaYangu" },
      { name: "description", content: "Personalised HESLB preparation for Tanzanian Form Six leavers: document checklist, application steps, common mistakes and FAQs." },
      { property: "og:title", content: "HESLB Guide — NjiaYangu" },
      { property: "og:description", content: "Prepare your HESLB application step by step." },
    ],
  }),
  component: HeslbPage,
});

const statusMeta = {
  ready: { label: { en: "Ready", sw: "Tayari" }, icon: CheckCircle2, cls: "text-success bg-success/10 border-success/30" },
  missing: { label: { en: "Missing", sw: "Haipo" }, icon: AlertCircle, cls: "text-destructive bg-destructive/10 border-destructive/30" },
  verify: { label: { en: "Needs verification", sw: "Inahitaji uhakiki" }, icon: HelpCircle, cls: "text-gold bg-gold/15 border-gold/30" },
  na: { label: { en: "Not applicable", sw: "Haitumiki" }, icon: MinusCircle, cls: "text-muted-foreground bg-muted border-border" },
} as const;

function HeslbPage() {
  const { t, lang } = useI18n();
  const { heslb, setHeslb } = useStore();

  const totalReady = HESLB_CHECKLIST.filter((i) => heslb[i.id] === "ready").length;
  const progress = Math.round((totalReady / HESLB_CHECKLIST.length) * 100);

  return (
    <AppShell>
      <section className="container-page py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold">{t("nav.heslb")}</h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
          {lang === "en"
            ? `Prepare your HESLB application for the ${HESLB_ACADEMIC_YEAR} academic year. Track each requirement individually.`
            : `Jitayarishe kwa maombi ya HESLB kwa mwaka wa masomo ${HESLB_ACADEMIC_YEAR}. Fuatilia kila hitaji.`}
        </p>

        {/* Progress */}
        <div className="mt-6 rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{lang === "en" ? "Your readiness" : "Utayari wako"}</span>
            <span className="text-muted-foreground">{totalReady}/{HESLB_CHECKLIST.length} · {progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-success transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold">{lang === "en" ? "Application steps" : "Hatua za maombi"}</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              {HESLB_STEPS.map((s, i) => <li key={i}>{s[lang]}</li>)}
            </ol>
            <a href="https://olams.heslb.go.tz" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 h-11 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium">
              Open OLAMS <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold">{lang === "en" ? "Common mistakes" : "Makosa ya kawaida"}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{HESLB_MISTAKES.map((m, i) => <li key={i}>• {m[lang]}</li>)}</ul>
          </div>
        </div>

        {/* Checklist */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">{lang === "en" ? "Document & readiness checklist" : "Orodha ya nyaraka na utayari"}</h2>
          <div className="grid gap-2">
            {HESLB_CHECKLIST.map((item) => {
              const value = heslb[item.id] ?? "verify";
              const meta = statusMeta[value];
              const Icon = meta.icon;
              return (
                <div key={item.id} className="rounded-lg border bg-card p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 text-sm">{item.label[lang]}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(["ready", "missing", "verify", "na"] as const).map((s) => {
                      const m = statusMeta[s];
                      const SIcon = m.icon;
                      return (
                        <button
                          key={s}
                          onClick={() => setHeslb(item.id, s)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2.5 h-8 rounded-md border text-xs",
                            value === s ? m.cls : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <SIcon className="h-3.5 w-3.5" />
                          {m.label[lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">{lang === "en" ? "Frequently asked questions" : "Maswali yanayoulizwa mara nyingi"}</h2>
          <div className="grid gap-3">
            {HESLB_FAQ.map((f, i) => (
              <details key={i} className="rounded-lg border bg-card p-4">
                <summary className="font-medium cursor-pointer">{f.q[lang]}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a[lang]}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border bg-accent p-4 flex items-start gap-3 text-sm">
          <ShieldCheck className="h-5 w-5 text-brand shrink-0 mt-0.5" />
          <p className="text-muted-foreground">{t("disclaimer.heslb")}</p>
        </div>
      </section>
    </AppShell>
  );
}
