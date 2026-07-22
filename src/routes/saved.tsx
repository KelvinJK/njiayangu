import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/site/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";
import { evaluate as evaluateEligibility } from "@/lib/eligibility";
import { SourceDialog } from "@/components/site/SourceDialog";
import {
  Bookmark,
  BookmarkX,
  GitCompareArrows,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  X,
  Check,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved programmes — NjiaYangu" },
      { name: "description", content: "Review, remove and compare the university programmes you bookmarked on NjiaYangu." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Saved programmes — NjiaYangu" },
      { property: "og:description", content: "Manage your bookmarked programmes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { t, lang } = useI18n();
  const { user, loading } = useAuth();
  const { saved, toggleSaved, compare, toggleCompare, clearCompare, profile } = useStore();

  if (loading) return <AppShell><div className="container-page py-16"/></AppShell>;

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

  const savedProgrammes = saved
    .map((id) => PROGRAMMES.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const compareProgrammes = compare
    .map((id) => PROGRAMMES.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <AppShell>
      {/* Colorful gradient header */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-brand/10 via-surface to-gold/10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="container-page relative py-10 md:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            <Bookmark className="h-3.5 w-3.5"/> {t("saved.title")}
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            {t("saved.title")}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">{t("saved.subtitle")}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface border px-3 py-1.5 text-sm font-medium">
              <span className="text-brand font-semibold">{savedProgrammes.length}</span> {t("saved.count")}
            </span>
            {compareProgrammes.length >= 2 && (
              <Button
                type="button"
                className="rounded-full"
                onClick={() => {
                  const el = document.getElementById("saved-compare");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <GitCompareArrows className="h-4 w-4 mr-1.5"/>
                {t("saved.compareAll")} ({compareProgrammes.length})
              </Button>
            )}
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/programmes">
                {t("saved.browse")} <ArrowRight className="h-4 w-4 ml-1.5"/>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-page py-8 md:py-12 space-y-10">
        {savedProgrammes.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-surface p-10 md:p-16 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-brand/10 text-brand grid place-items-center">
              <Bookmark className="h-6 w-6"/>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{t("saved.empty")}</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">{t("saved.emptySub")}</p>
            <div className="mt-6 flex gap-2 justify-center flex-wrap">
              <Button asChild><Link to="/programmes">{t("saved.browse")}</Link></Button>
              <Button asChild variant="outline"><Link to="/find-my-courses">{t("nav.find")}</Link></Button>
            </div>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedProgrammes.map((programme, idx) => {
              const institution = INSTITUTIONS.find((i) => i.id === programme.institutionId);
              const campus = institution?.campuses.find((c) => c.id === programme.campusId);
              const inCompare = compare.includes(programme.id);
              const eligibility = profile.academics ? evaluateEligibility(programme, profile.academics) : undefined;
              const accents = [
                { ring: "ring-brand/20", chip: "bg-brand/10 text-brand", grad: "from-brand/8 to-transparent" },
                { ring: "ring-success/20", chip: "bg-success/10 text-success", grad: "from-success/8 to-transparent" },
                { ring: "ring-gold/25", chip: "bg-gold/15 text-gold-foreground", grad: "from-gold/10 to-transparent" },
                { ring: "ring-info/20", chip: "bg-info/10 text-info", grad: "from-info/8 to-transparent" },
              ];
              const a = accents[idx % accents.length];

              return (
                <li
                  key={programme.id}
                  className={cn(
                    "group relative rounded-2xl border bg-surface p-5 shadow-sm ring-1 ring-transparent hover:shadow-md transition-all",
                    a.ring,
                  )}
                >
                  <div className={cn("absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r", a.grad, "opacity-70")}/>

                  <div className="flex items-start justify-between gap-2">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide", a.chip)}>
                      {programme.category}
                    </span>
                    <button
                      onClick={() => toggleSaved(programme.id)}
                      className="text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1 -m-1"
                      aria-label={`${t("saved.remove")} ${programme.name[lang]}`}
                    >
                      <BookmarkX className="h-4 w-4"/>
                    </button>
                  </div>

                  <Link
                    to="/programmes/$slug"
                    params={{ slug: programme.slug }}
                    className="mt-3 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                  >
                    <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                      {programme.name[lang]}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {institution?.name}
                    </p>
                  </Link>

                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5"/> {programme.durationYears}y</div>
                    <div className="flex items-center gap-1.5 truncate"><MapPin className="h-3.5 w-3.5"/> {campus?.region}</div>
                    <div className="flex items-center gap-1.5 col-span-2"><Calendar className="h-3.5 w-3.5"/>
                      {new Date(programme.applicationDeadline).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </dl>

                  {eligibility && (
                    <div className="mt-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        eligibility.status === "ELIGIBLE" && "badge-eligible",
                        eligibility.status === "POTENTIALLY_ELIGIBLE" && "badge-potential",
                        eligibility.status === "NOT_ELIGIBLE" && "badge-not",
                        eligibility.status === "INCOMPLETE_INFORMATION" && "badge-incomplete",
                      )}>
                        {t(`eligibility.${eligibility.status}`)}
                      </span>
                    </div>
                  )}

                  {/* Source dialog trigger — always visible above CTAs so students verify before relying on eligibility */}
                  <div className="mt-3">
                    <SourceDialog
                      source={programme.source}
                      lastVerified={programme.lastVerified}
                      programmeName={programme.name[lang]}
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      to="/programmes/$slug"
                      params={{ slug: programme.slug }}
                      className="flex-1 inline-flex items-center justify-center gap-1 h-9 rounded-full bg-brand text-brand-foreground text-xs font-medium hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t("card.details")} <ArrowRight className="h-3.5 w-3.5"/>
                    </Link>
                    <button
                      onClick={() => toggleCompare(programme.id)}
                      disabled={!inCompare && compare.length >= 5}
                      aria-pressed={inCompare}
                      className={cn(
                        "inline-flex items-center gap-1 h-9 px-3 rounded-full border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        inCompare ? "border-brand text-brand bg-brand/10" : "hover:bg-muted",
                        !inCompare && compare.length >= 5 && "opacity-40 cursor-not-allowed",
                      )}
                    >
                      <GitCompareArrows className="h-3.5 w-3.5"/>
                      {inCompare ? t("saved.inCompare") : t("card.compare")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* ─────────── Inline side-by-side comparison ─────────── */}
        {savedProgrammes.length > 0 && (
          <section
            id="saved-compare"
            aria-labelledby="saved-compare-title"
            className="rounded-2xl border bg-gradient-to-br from-brand/5 via-surface to-info/5 p-5 md:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 id="saved-compare-title" className="text-lg md:text-xl font-semibold tracking-tight inline-flex items-center gap-2">
                  <GitCompareArrows className="h-5 w-5 text-brand" aria-hidden />
                  {t("compare.inline.title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {compareProgrammes.length < 2 ? t("compare.inline.hint") : t("saved.subtitle")}
                </p>
              </div>
              {compareProgrammes.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={clearCompare}
                >
                  <X className="h-3.5 w-3.5 mr-1" aria-hidden />
                  {t("compare.clear")}
                </Button>
              )}
            </div>

            {compareProgrammes.length < 2 ? (
              <div className="mt-6 rounded-xl border border-dashed bg-surface/60 p-6 text-sm text-muted-foreground text-center">
                {t("compare.inline.hint")}
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto -mx-5 md:-mx-6 px-5 md:px-6">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <caption className="sr-only">{t("compare.inline.title")}</caption>
                  <thead>
                    <tr className="text-left">
                      <th scope="col" className="sticky left-0 z-10 bg-surface/95 backdrop-blur px-3 py-3 text-[11px] uppercase tracking-wide text-muted-foreground font-medium border-b">
                        {t("compare.field.programme")}
                      </th>
                      {compareProgrammes.map((p) => (
                        <th key={p.id} scope="col" className="px-3 py-3 align-top border-b min-w-[180px]">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                to="/programmes/$slug"
                                params={{ slug: p.slug }}
                                className="block font-semibold text-foreground hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                              >
                                {p.name[lang]}
                              </Link>
                              <div className="mt-0.5 text-xs text-muted-foreground truncate">
                                {INSTITUTIONS.find((i) => i.id === p.institutionId)?.name}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleCompare(p.id)}
                              aria-label={`${t("saved.remove")} ${p.name[lang]}`}
                              className="shrink-0 text-muted-foreground hover:text-destructive rounded-md p-1 -m-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <X className="h-3.5 w-3.5" aria-hidden />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <CompareRow
                      label={t("compare.field.eligibility")}
                      cells={compareProgrammes.map((p) => {
                        const ev = profile.academics ? evaluateEligibility(p, profile.academics) : undefined;
                        if (!ev) return <span className="text-xs text-muted-foreground">{t("compare.unknown")}</span>;
                        return (
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                            ev.status === "ELIGIBLE" && "badge-eligible",
                            ev.status === "POTENTIALLY_ELIGIBLE" && "badge-potential",
                            ev.status === "NOT_ELIGIBLE" && "badge-not",
                            ev.status === "INCOMPLETE_INFORMATION" && "badge-incomplete",
                          )}>
                            {t(`eligibility.${ev.status}`)}
                          </span>
                        );
                      })}
                    />
                    <CompareRow
                      label={t("compare.field.duration")}
                      cells={compareProgrammes.map((p) => (
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />{p.durationYears}</span>
                      ))}
                    />
                    <CompareRow
                      label={t("compare.field.location")}
                      cells={compareProgrammes.map((p) => {
                        const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
                        const camp = inst?.campuses.find((c) => c.id === p.campusId);
                        return (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                            <span className="truncate">{camp?.region ?? "—"}</span>
                          </span>
                        );
                      })}
                    />
                    <CompareRow
                      label={t("compare.field.points")}
                      cells={compareProgrammes.map((p) => <span className="font-mono">{p.rule.minPoints}</span>)}
                    />
                    <CompareRow
                      label={t("compare.field.subjects")}
                      cells={compareProgrammes.map((p) => (
                        <div className="flex flex-wrap gap-1">
                          {p.rule.requiredSubjects.map((s) => (
                            <span key={s} className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono font-medium">{s}</span>
                          ))}
                        </div>
                      ))}
                    />
                    <CompareRow
                      label={t("compare.field.heslb")}
                      cells={compareProgrammes.map((p) => (
                        p.heslbEligible
                          ? <span className="inline-flex items-center gap-1 text-success text-xs font-medium"><Check className="h-3.5 w-3.5" aria-hidden />{t("compare.yes")}</span>
                          : <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><Minus className="h-3.5 w-3.5" aria-hidden />{t("compare.no")}</span>
                      ))}
                    />
                    <CompareRow
                      label={t("compare.field.deadline")}
                      cells={compareProgrammes.map((p) => (
                        <span className="text-xs">
                          {new Date(p.applicationDeadline).toLocaleDateString(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      ))}
                    />
                    <CompareRow
                      label={t("source.title")}
                      cells={compareProgrammes.map((p) => (
                        <SourceDialog
                          source={p.source}
                          lastVerified={p.lastVerified}
                          programmeName={p.name[lang]}
                        />
                      ))}
                    />
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </AppShell>
  );
}

function CompareRow({ label, cells }: { label: string; cells: React.ReactNode[] }) {
  return (
    <tr className="border-b last:border-b-0">
      <th scope="row" className="sticky left-0 z-10 bg-surface/95 backdrop-blur px-3 py-3 text-left align-top text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
        {label}
      </th>
      {cells.map((c, i) => (
        <td key={i} className="px-3 py-3 align-top">{c}</td>
      ))}
    </tr>
  );
}
